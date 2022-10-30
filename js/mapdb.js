const DEBUG_MODE = true;
const PAGE_TITLE = "SIFAS Note Map Database";
const PAGE_TITLE_SEP = " • ";

M.Collapsible.prototype.instantOpen = function (i) {
    let tmp = this.options.inDuration;
    this.options.inDuration = 0;
    this.open(i);
    this.options.inDuration = tmp;
}

let tooltip = $(".tooltip");
let tooltipInner = $(".tooltip-inner");
let body = $("body");

function scrollToAndFocusCollapsible(e, behavior="auto") {
    // add padding at bottom to successfully scroll to divs at the end of the page
    body.css({"padding-bottom": "100vh", "transition": ""});
    setTimeout(function () {
        body.css({"padding-bottom": 0, "transition": "padding-bottom .5s"})
    }, 300);
    window.scrollTo({top: e.position().top - 10, behavior});
    $("> li > .collapsible-header", e)[0].focus();
}

function scrollActiveTabLabelIntoView(tabs) {
    let container = $(tabs.el);
    let element = tabs.$activeTabLink;
    let leftSidePos = element.offset().left - container.offset().left;
    let rightSidePos = leftSidePos + element.outerWidth();
    if (rightSidePos > container.width()) {
        container.scrollLeft(container.scrollLeft() + rightSidePos - container.width() + 50);
    }
    if (leftSidePos < 0) {
        container.scrollLeft(container.scrollLeft() + leftSidePos - 50);
    }
}

/*
 *  ----------
 *  PAGE LOADING
 *  ----------
 */

let currentPage = "start";
let afterSwitchCallback = undefined;

function loadPageThen(page, callback) {
    page = $(page);
    if (page.data("loaded") === undefined || page.data("loaded") === 0) {
        page.data("loaded", 1);
        let type = page.data("type");
        if (type === "fixed") {
            // Tab already has content - don't do anything
            page.removeClass("unloaded");
            if (callback !== undefined) callback(page);
        } else {
            // Load tab content, delay initialization until loaded
            page.load((DEBUG_MODE ? "build/" : "") + page.attr("id").substring(4) + ".html", loadPageFinished.bind(this, type, page, callback));
        }
    } else {
        if (callback !== undefined) requestAnimationFrame(() => callback(page));
    }
}

function loadPageFinished(type, page, callback, responseText, textStatus) {
    if (textStatus === "error") {
        page.data("loaded", 0);
        page.html("Failed to load. <a onClick='M.Tabs.getInstance($(\"nav .tabs\")[0]).select(\"" + page.attr("id") + "\")'>Retry?</a>");
    } else {
        page.removeClass("unloaded");
        if (type === "free") {
            initPageFreeLive(page);
        } else if (type === "dlp") {
            initPageDlp(page);
        } else if (type === "top") {
            initPageTop(page);
        }
        if (showRomaji) {
            $(".translatable", page).each(swapTitles);
        }
        $(".collapsible:has(.expiry-time)", page).each(setExpiryDates);
        if (callback !== undefined) callback(page);
    }
}

let unloadedGroupPages = 0;

function loadAllGroupPagesThen(callback) {
    let groupPages = $(".group-tab");
    let unloaded = groupPages.filter(filterUnloadedPages);
    if (unloaded.length === 0) {
        callback(groupPages);
    } else {
        unloadedGroupPages = unloaded.length;
        let cb = checkAllPagesLoaded.bind(this, callback.bind(this, groupPages));
        for (let i = 0; i < unloaded.length; i++) {
            loadPageThen(unloaded[i], cb);
        }
    }
}

function filterUnloadedPages() {
    return $(this).hasClass("unloaded");
}

function checkAllPagesLoaded(callback) {
    unloadedGroupPages--;
    if (unloadedGroupPages === 0) {
        callback();
    }
}

/*
 *  ----------
 *  SITE INIT
 *  ----------
 */

let initialized = false;
let pageTabs;
let groupTabs;
$(function () {
    M.AutoInit();

    pageTabs = M.Tabs.getInstance($("nav .tabs")[0]);
    groupTabs = $(".group-tab");

    pageTabs.options.onShow = pageTabShow;
    body.removeClass("loading");

    if (window.location.hash) {
        history.replaceState(undefined, undefined, "?" + window.location.hash.substring(1));
    }
    handleLocation();
    window.addEventListener("popstate", handleLocation);

    if (cookieGet("mapdb-titles")) {
        // Move saved preferences from cookies to localStorage - to be removed in a month or so
        localStorage.setItem("mapdb-titles", cookieGet("mapdb-titles"));
        localStorage.setItem("mapdb-unavailable", cookieGet("mapdb-unavailable"));
        localStorage.setItem("dark-mode", cookieGet("dark-mode"));
        document.cookie = "mapdb-titles=; Max-Age=-99999999; path=/sifas";
        document.cookie = "mapdb-unavailable=; Max-Age=-99999999; path=/sifas";
        document.cookie = "dark-mode=; Max-Age=-99999999; path=/sifas";
    }

    let preferenceTitle = localStorage.getItem("mapdb-titles");
    let preferenceUnavailable = localStorage.getItem("mapdb-unavailable");
    if (preferenceTitle === "roma") {
        toggleRomaji(false);
    }
    if (preferenceUnavailable === "show") {
        toggleUnavailable(false);
    }

    registerHeaderButtons();
    registerSearch();
    initPopUps(preferenceTitle, preferenceUnavailable);

    initialized = true;
});

let onSearchTab = false;

function pageTabShow(e) {
    scrollActiveTabLabelIntoView(pageTabs);

    let pagename = undefined;
    switch ($(e).attr("id")) {
        case "tab_search":
            pagename = "Search";
            break;
        case "tab_muse":
            pagename = "µ's";
            break;
        case "tab_aqours":
            pagename = "Aqours";
            break;
        case "tab_niji":
            pagename = "Nijigaku";
            break;
        case "tab_liella":
            pagename = "Liella!";
            break;
        case "tab_dlp":
            pagename = "DLP";
            break;
        case "tab_rankings":
            pagename = "Rankings";
            break;
    }
    addHistoryItem(currentPage = $(e).attr("id").substring(4), pagename);

    loadPageThen(e, afterSwitchCallback);
    afterSwitchCallback = undefined;

    if (currentSearchTimeout !== undefined) {
        clearTimeout(currentSearchTimeout);
        currentSearchTimeout = undefined;
    }

    if ($(e).attr("id") === "tab_search") {
        onSearchTab = true;
        loadAllGroupPagesThen(showSearch);
        searchInput.trigger("focus");

        // Dumb workaround for Materialize force-hiding the previous tab
        requestAnimationFrame($.prototype.show.bind(groupTabs, 0));
    } else if (onSearchTab) {
        for (let i = 0; i < groupTabs.length; i++) {
            if (groupTabs[i] !== e) {
                $(groupTabs[i]).hide();
            }
        }
        doSearch("");
        onSearchTab = false;
        $(".no-available-songs").css("display", "");
    }
}

/*
 *  ----------
 *  SEARCH
 *  ----------
 */

let currentSearchTimeout = undefined;
let searchInput = $("#search_input");

function registerSearch() {
    searchInput.on("keyup", searchInputKeyUp);
}

function showSearch(groupPages) {
    if (onSearchTab) {
        $("#search_loading").hide();
        groupPages.show();
        if (currentSearchTimeout === undefined) {
            // If user finished typing something into input before all the pages finished loading, filter
            doSearch(searchInput.val());
        }
        $(".no-available-songs").css("display", "none");
    }
}

function searchInputKeyUp(e) {
    if (currentSearchTimeout !== undefined) {
        clearTimeout(currentSearchTimeout);
    }
    if (e.key === 'Enter') {
        currentSearchTimeout = undefined;
        doSearch(e.target.value);
    } else {
        currentSearchTimeout = setTimeout(doSearch.bind(this, e.target.value), 1000);
    }
}

function doSearch(search_input) {
    currentSearchTimeout = undefined;
    let collapsibles = $(".group-tab .collapsible");
    if (search_input === undefined || search_input.trim() === "") {
        collapsibles.each(resetCollapsibleFiltering);
        return;
    }
    // Fullwidth to Halfwidth -- https://stackoverflow.com/a/47961748
    search_input = search_input.replace(/[！-～]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0)).replace("　", " ");
    let pluses = 0;
    while (search_input.charAt(search_input.length - 1) === "+") {
        search_input = search_input.substr(0, search_input.length - 1);
        pluses++;
    }

    let res = fuzzysort.go(search_input, searchindex, {
        "keys": ["romaji", "romaji_clean", "hiragana", "katakana", "kanji", "kanji_clean", "abbr_kn", "abbr_ro", "romanized"],
        threshold: -500,
        scoreFn: a => Math.max(...a.map(x => x ? x.score : -10000))
    }).map(a => a.obj);
    if (pluses > 0) {
        let potentialFilteredRes = res.filter(a => (pluses === 1) ? a.ldid_advp !== undefined : a.ldid_chal !== undefined);
        if (potentialFilteredRes.length > 0) {
            res = potentialFilteredRes;
        } else {
            potentialFilteredRes = res.filter(a => (pluses === 1) ? a.ldid_chal !== undefined : a.ldid_advp !== undefined);
            if (potentialFilteredRes.length > 0) {
                res = potentialFilteredRes;
            }
        }
    }
    let filtered = collapsibles.toArray().filter(filterCollapsibles.bind(this, new Set(res.map(a => a.lid)))).map(M.Collapsible.getInstance);

    if (filtered.length === 1) {
        filtered[0].open();
        if (pluses > 0) {
            replaceHistory = true;
            let toOpen;
            if (pluses == 1) {
                // Open Adv+ right away if it exists, otherwise Challenge
                toOpen = res[0].ldid_advp || res[0].ldid_chal;
            } else {
                // Open Challenge right away if it exists, otherwise Adv+
                toOpen = res[0].ldid_chal || res[0].ldid_advp;
            }
            if (toOpen != undefined) {
                let liveDiffTabs = M.Tabs.getInstance($(".tabs", filtered[0].el)[0]);
                liveDiffTabs.select(toOpen);
            }
            replaceHistory = false;
        }
    } else {
        $(filtered).each(M.Collapsible.prototype.close);
    }
}

function filterCollapsibles(res, e) {
    if (res.has(("" + $(e).data("live-id")).substring(1))) {
        // Set to "block" to force unavailable songs to be visible as well
        $(e).css("display", "block");
        return true;
    } else {
        $(e).css("display", "none");
        M.Collapsible.getInstance(e).close();
        return false;
    }
}

function resetCollapsibleFiltering() {
    $(this).css("display", "");
    let collapsible = M.Collapsible.getInstance(this);
    collapsible.close();
}

/*
 *  ----------
 *  DIRECT LINKING
 *  ----------
 */

let disableHistory = false;
let replaceHistory = false;

function addHistoryItem(s, page) {
    if (!disableHistory && s !== "search") {
        if (replaceHistory) history.replaceState(undefined, undefined, "?" + s);
        else history.pushState(undefined, undefined, "?" + s);
    }
    if (page === undefined) document.title = PAGE_TITLE;
    else document.title = page + PAGE_TITLE_SEP + PAGE_TITLE;
}

function handleLocation() {
    disableHistory = true;
    let location = window.location.search.substring(1);

    if (location.startsWith("live")) {
        // Direct link to a live difficulty
        if (location.charAt(4) === "1" || location.charAt(4) === "2") {
            // Free Live or Event Live (has group ID in next position)
            afterSwitchCallback = showLinkedFreeLive.bind(this, location);
            switch (location.charAt(5)) {
                case "0":
                    pageTabs.select("tab_muse");
                    break;
                case "1":
                    pageTabs.select("tab_aqours");
                    break;
                case "2":
                    pageTabs.select("tab_niji");
                    break;
                case "3":
                    pageTabs.select("tab_liella");
                    break;
                default:
                    afterSwitchCallback = undefined;
                    disableHistory = false;
                    break;
            }
        } else {
            // Story Stage: Can't read group ID on newer stages, must load all group tabs
            // and search for the correct stage by going through them all
            loadAllGroupPagesThen(showLinkedStoryStage.bind(this, location, pageTabs));
        }
    } else if (location.startsWith("tower") || location.startsWith("floor")) {
        // Direct link to a DLP tower or floor
        afterSwitchCallback = showLinkedDlp.bind(this, location);
        pageTabs.select("tab_dlp");
    } else {
        // Direct link to a page
        if (location === "") location = "start";
        if (location.startsWith("tab")) pageTabs.select(location);
        else pageTabs.select("tab_" + location);
        disableHistory = false;
    }
}

function showLinkedFreeLive(location, page) {
    let liveDiffId = location.substring(4);
    let collapsibleBody = $("#" + liveDiffId, page);
    if (collapsibleBody.length) {
        collapsibleBody = collapsibleBody.parent();
        let collapsibleEl = collapsibleBody.parent().parent();
        if (!showUnavailable && collapsibleEl.hasClass("unavail")) {
            toggleUnavailable();
        }
        let collapsible = M.Collapsible.getInstance(collapsibleEl[0]);
        collapsible.instantOpen(0);
        let liveDiffTabs = M.Tabs.getInstance($(".tabs", collapsibleBody)[0]);
        liveDiffTabs.select(liveDiffId);
        if (!showUnavailable && liveDiffTabs.$activeTabLink.parent().hasClass("unavail")) {
            toggleUnavailable();
        }
        scrollToAndFocusCollapsible(collapsible.$el);
        scrollActiveTabLabelIntoView(liveDiffTabs);
    }
    disableHistory = false;
}

function showLinkedStoryStage(location, tabs, groupPages) {
    let targetLiveDiff = $("#" + location.substring(4), groupPages);
    if (targetLiveDiff.length) {
        let targetLiveStoryTab = targetLiveDiff.parent();
        let targetLive = targetLiveStoryTab.parent().parent().parent();
        let targetPage = targetLive.parent();

        let liveCollapsible = M.Collapsible.getInstance(targetLive[0]);
        liveCollapsible.instantOpen(0);
        let liveDiffTabs = M.Tabs.getInstance($(".tabs", targetLive)[0]);
        liveDiffTabs.select(targetLiveStoryTab.attr("id"));
        let storyTabs = M.Tabs.getInstance($(".tabs", targetLiveStoryTab)[0]);

        tabs.select(targetPage.attr("id"));
        storyTabs.select(targetLiveDiff.attr("id"));
        scrollToAndFocusCollapsible(liveCollapsible.$el);
        scrollActiveTabLabelIntoView.bind(storyTabs);
    }
    disableHistory = false;
}

function showLinkedDlp(location, page) {
    let towerId = location.substring(5, 10);
    let targetElement = $("#" + towerId, page);
    if (targetElement.length) {
        let towerCollapsible = M.Collapsible.getInstance(targetElement[0]);
        if (location.startsWith("floor")) {
            let floorList = $("#tower-floorlist" + towerId);
            loadTower(floorList, towerId, showLinkedDlpFloor1.bind(floorList, location, towerCollapsible));
        } else {
            scrollToAndFocusCollapsible(targetElement);
            towerCollapsible.instantOpen(0);
            disableHistory = false;
        }
    }
}

function showLinkedDlpFloor1(location, towerCollapsible, responseText, textStatus) {
    loadTowerFinish.bind(this, responseText, textStatus)();
    towerCollapsible.instantOpen(0);
    requestAnimationFrame(showLinkedDlpFloor2.bind(this, location, responseText, textStatus));
}

function showLinkedDlpFloor2(location, responseText, textStatus) {
    if (textStatus !== "error") {
        let targetElement = $("#" + location.substring(5), this);
        if (targetElement.length) {
            let floorCollapsible = M.Collapsible.getInstance(targetElement[0]);
            floorCollapsible.instantOpen(0);
            scrollToAndFocusCollapsible(targetElement);
        } else {
            scrollToAndFocusCollapsible($(this));
        }
    } else {
        scrollToAndFocusCollapsible($(this));
    }
    disableHistory = false;
}

/*
 *  ----------
 *  HEADER BUTTONS
 *  ----------
 */
let btnPreferences = $("#show_preferences");
let showRomaji = false;
let btnRomaji = $("#toggle_romaji");
let showUnavailable = false;
let btnUnavailable = $("#toggle_unavailable");

function registerHeaderButtons() {
    btnPreferences.on("click", showPreferences);
    btnRomaji.on("click", toggleRomaji.bind(this, true));
    btnUnavailable.on("click", toggleUnavailable.bind(this, true));
}

function toggleRomaji(showToast) {
    showRomaji = !showRomaji;
    $(".translatable").each(swapTitles);
    if (showRomaji) {
        btnRomaji.addClass("on");
        if (showToast) M.toast({html: "Showing titles in Romaji"});
    } else {
        btnRomaji.removeClass("on");
        if (showToast) M.toast({html: "Showing titles in Kana/Kanji"});
    }
}

function swapTitles() {
    let new_title = $(this).data("rom");
    $(this).data("rom", $(this).text());
    $(this).text(new_title);
}

function toggleUnavailable(showToast) {
    showUnavailable = !showUnavailable;
    if (showUnavailable) {
        btnUnavailable.addClass("on");
        body.addClass("show-unavail");
        if (showToast) M.toast({html: "Showing unavailable songs"});
    } else {
        btnUnavailable.removeClass("on");
        body.removeClass("show-unavail");
        if (showToast) M.toast({html: "Hiding unavailable songs"});
    }
}

/*
 *  ----------
 *  FREE LIVE PAGE
 *  ----------
 */

function initPageFreeLive(page) {
    let collapsibles = $(".collapsible", page);
    collapsibles.collapsible().each(freeLiveCollapsibleInit);
}

function freeLiveCollapsibleInit() {
    let collapsible = M.Collapsible.getInstance(this);
    collapsible.options.onOpenStart = freeLiveCollapsibleOpen;
    collapsible.options.onCloseStart = outerCollapsibleClose;
}

function freeLiveCollapsibleOpen() {
    scrollToAndFocusCollapsible(this.$el, "smooth");
    let tabElements = $(".tabs", this.el);
    let tabs;
    if (this.$el.data("initialized") === undefined) {
        this.$el.data("initialized", 1);
        tabElements.tabs();
        let story_tabs = (tabElements.length > 1) ? M.Tabs.getInstance(tabElements[1]) : undefined;
        tabs = M.Tabs.getInstance(tabElements[0]);

        tabs.options.onShow = freeLiveTabShow.bind(this, tabs);

        if (story_tabs !== undefined) {
            story_tabs.options.onShow = freeLiveStoryTabShow.bind(this, story_tabs);
        }
    } else {
        tabs = M.Tabs.getInstance(tabElements[0]);
    }

    let location, pagename;
    if (tabs.$activeTabLink.attr("href").endsWith("story")) {
        location = "live" + $(".active", "#" + tabs.$activeTabLink.attr("href").substring(1)).attr("href").substring(1);
        pagename = $(".song-name.translatable", this.el).text() + " (Story " + $(".active", "#" + tabs.$activeTabLink.attr("href").substring(1)).text().split(" (")[0].trim() + ")";
    } else {
        location = "live" + tabs.$activeTabLink.attr("href").substring(1);
        pagename = $(".song-name.translatable", this.el).text() + " (" + tabs.$activeTabLink.text() + ")";
    }
    addHistoryItem(location, pagename);

    let activetab = $(tabs.$activeTabLink.attr("href"), this.el);
    if (activetab.hasClass("live-difficulty") && activetab.data("initialized") === undefined) {
        activetab.data("initialized", 1);
        loadNoteMap(activetab);
    }
}

function outerCollapsibleClose() {
    let pagename = undefined;
    switch (currentPage) {
        case "search":
            pagename = "Search";
            break;
        case "muse":
            pagename = "µ's";
            break;
        case "aqours":
            pagename = "Aqours";
            break;
        case "niji":
            pagename = "Nijigaku";
            break;
        case "liella":
            pagename = "Liella!";
            break;
        case "dlp":
            pagename = "DLP";
            break;
        case "rankings":
            pagename = "Rankings";
            break;
    }
    addHistoryItem(currentPage, pagename);
}

function freeLiveTabShow(tabs, e) {
    if ($(e).hasClass("live-difficulty")) {
        if ($(e).data("initialized") === undefined) {
            $(e).data("initialized", 1);
            loadNoteMap($(e));
        }
        addHistoryItem("live" + $(e).attr("id"), $(".song-name.translatable", $(e).parent().parent()).text() + " (" + tabs.$activeTabLink[0].childNodes[0].data.trim() + ")");
    } else {
        // Story Stages tab
        let tabElement = $(".tabs", e)[0];
        let tabs = M.Tabs.getInstance(tabElement);
        addHistoryItem("live" + tabs.$activeTabLink.attr("href").substring(1), $(".song-name.translatable", $(e).parent().parent()).text() + " (Story " + tabs.$activeTabLink[0].childNodes[0].data.split(" (")[0].trim() + ")");

        let activetab = $(tabs.$activeTabLink.attr("href"), e);
        if (activetab.hasClass("live-difficulty") && activetab.data("initialized") === undefined) {
            activetab.data("initialized", 1);
            loadNoteMap(activetab);
        }
    }
    scrollActiveTabLabelIntoView(tabs);
}

function freeLiveStoryTabShow(tabs, e) {
    if ($(e).data("initialized") === undefined) {
        $(e).data("initialized", 1);
        loadNoteMap($(e));
    }
    scrollActiveTabLabelIntoView(tabs);
    addHistoryItem("live" + $(e).attr("id"), $(".song-name.translatable", $(e).parent().parent().parent()).text() + " (Story " + tabs.$activeTabLink[0].childNodes[0].data.split(" (")[0].trim() + ")");
}

const relDateFormatObj = new Intl.RelativeTimeFormat("en");
const absDateFormatObj = new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
    timeZone: "Asia/Tokyo"
});
const h = 1000 * 60 * 60, d = h * 24, w = d * 7, m = d * 30, y = d * 365;

function relDateFormat(date) {
    let diff = date - new Date();
    if (diff > y) return "expires " + relDateFormatObj.format(Math.floor(diff / y), "year");
    if (diff > m) return "expires " + relDateFormatObj.format(Math.floor(diff / m), "month");
    if (diff > w) return "expires " + relDateFormatObj.format(Math.floor(diff / w), "week");
    if (diff > d) return "expires " + relDateFormatObj.format(Math.floor(diff / d), "day");
    if (diff > h) return "expires " + relDateFormatObj.format(Math.floor(diff / h), "hour");
    if (diff > 0) return "expires in less than an hour";
    return undefined;
}

function absDateFormat(date) {
    return absDateFormatObj.format(date) + " JST";
}

function setExpiryDates(page, e) {
    let time = $(".expiry-time", e);
    let n = time.data("end");
    let d = new Date(parseInt(n));
    let r = relDateFormat(d);
    if (r === undefined) {
        // song expired
        time.parent().text("(unavailable)");
        $(e).addClass("unavail");
    } else {
        time.text(r);
        time.attr("title", absDateFormat(d));
    }
}

/*
 *  ----------
 *  DLP PAGE
 *  ----------
 */

function loadTower(e, id, callback) {
    if (e.data("initialized") === undefined) {
        e.load((DEBUG_MODE ? "build/" : "") + "towers/" + id + ".html", callback);
    }
}

function loadTowerFinish(responseText, textStatus) {
    if (textStatus === "error") {
        $(this).html("Failed to load. <a onClick='loadTower($(\"#" + $(this).attr("id") + "\")," + $(this).attr("id").split("tower-floorlist")[1] + ",loadTowerFinish)'>Retry?</a>");
    } else {
        $(this).data("initialized", 1);
        $(".collapsible.floor", this).collapsible().each(dlpFloorCollapsibleInit);
        $(this).removeClass("unloaded");
        if (showRomaji) {
            $(".translatable", this).each(swapTitles);
        }
    }
}

function initPageDlp(page) {
    $(".collapsible.tower", page).collapsible().each(dlpTowerCollapsibleInit);
}

function dlpTowerCollapsibleInit() {
    let collapsible = M.Collapsible.getInstance(this);
    collapsible.options.onOpenStart = dlpTowerCollapsibleOpen;
    collapsible.options.onCloseStart = outerCollapsibleClose;
}

function dlpTowerCollapsibleOpen() {
    loadTower($("#tower-floorlist" + this.$el.attr("id")), this.$el.attr("id"), loadTowerFinish);
    let towerLink = "tower" + this.$el.attr("id");
    addHistoryItem(towerLink, $($(".song-name.translatable", this.$el)[0]).text().replaceAll("Dream Live Parade", "DLP").replaceAll("ドリームライブパレード", "DLP"));
}

function dlpFloorCollapsibleInit() {
    let towerLink = "tower" + $(this).parent().parent().parent().attr("id");
    let towerPageName = $($(".song-name.translatable", $(this).parent().parent().parent())[0]).text().replaceAll("Dream Live Parade", "DLP").replaceAll("ドリームライブパレード", "DLP");
    let collapsible = M.Collapsible.getInstance(this);
    collapsible.options.onOpenStart = dlpFloorCollapsibleOpen.bind(this, towerPageName);
    collapsible.options.onCloseStart = dlpFloorCollapsibleClose.bind(this, towerLink, towerPageName);
}

function dlpFloorCollapsibleOpen(towerPageName) {
    scrollToAndFocusCollapsible($(this), "smooth");
    addHistoryItem("floor" + $(this).attr("id"), towerPageName + " ➔ " + $(".song-name.translatable", $(this)).text());
    if ($(this).data("initialized") === undefined) {
        $(this).data("initialized", 1);
        loadNoteMap($(".live-difficulty", this));
    }
}

function dlpFloorCollapsibleClose(towerLink, towerPageName) {
    addHistoryItem(towerLink, towerPageName);
}

/*
 *  ----------
 *  RANKING PAGE
 *  ----------
 */

function initPageTop(page) {
    $(".rankingtable", page).each(rankingTableInit);
}

function rankingTableInit() {
    let table = $(this);
    $(".btn", this).on("click", rankingTableOpen.bind(this));
    $("small.right", table.parent()).on("click", rankingTableShowAll.bind(this));
}

function rankingTableOpen() {
    $(this).addClass("open");
}

function rankingTableShowAll() {
    $(this).addClass("show-all");
    $("small.right", $(this).parent()).remove();
}

/*
 *  ----------
 *  NOTE MAPS
 *  ----------
 */

function loadNoteMap(e) {
    e.load((DEBUG_MODE ? "build/" : "") + "lives/" + e.attr("id") + ".html", loadNoteMapFinish);
}

function loadNoteMapFinish(responseText, textStatus) {
    if (textStatus === "error") {
        $(this).html("Failed to load. <a onClick='loadNoteMap($(\"#" + $(this).attr("id") + "\"))'>Retry?</a>");
    } else {
        $(this).removeClass("unloaded");
        initNoteMapInteractions(this);
    }
}

let selecting = false;

function initNoteMapInteractions(e) {
    let extraInfoToggles = $(".live-extra-toggle", e);
    for (let i = 0; i < extraInfoToggles.length; i++) {
        $(extraInfoToggles[i]).on("click", toggleLiveExtraInfo.bind(extraInfoToggles[i]));
    }

    let notebar = $(".notebar", e);
    notebar.on("mousedown", notebarSelectionStart.bind(notebar));

    let gimmickmarkers = $(".notebar .gimmick", e);
    let gimmickinfos = $(".detailinfo .gimmick", e);
    let gimmickmarkermap = Array(gimmickinfos.length);
    for (let i = 0; i < gimmickmarkers.length; i++) {
        let gi = $(gimmickmarkers[i]).data("gimmick");
        $(gimmickmarkers[i]).on("mouseover touchstart",
            gimmickMarkerMouseover.bind(gimmickmarkers[i], gimmickinfos[gi]));
        if (gimmickmarkermap[gi]) gimmickmarkermap[gi].push(gimmickmarkers[i])
        else gimmickmarkermap[gi] = [gimmickmarkers[i]];
    }
    gimmickmarkers.on("mouseout", closeTooltip);
    for (let i = 0; i < gimmickinfos.length; i++) {
        $(gimmickinfos[i]).on("click",
            gimmickFilterToggle.bind(gimmickinfos[i], gimmickinfos, gimmickmarkers, gimmickmarkermap, undefined));
        $(".slot", gimmickinfos[i]).toArray().forEach(b => {
            $(b).on("click",
                gimmickFilterToggle.bind(gimmickinfos[i], gimmickinfos, gimmickmarkers, gimmickmarkermap, $(b).data("slot")));
        });
    }

    let acmarkers = $(".notebar .appealchance", e);
    let acinfos = $(".detailinfo .appealchance", e);
    for (let i = 0; i < acmarkers.length; i++) {
        $(acmarkers[i]).on("mouseover touchstart",
            acMarkerMouseover.bind(acmarkers[i], acinfos[$(acmarkers[i]).data("ac")]));
    }
    acmarkers.on("mouseout", closeTooltip);

    let scale = $(".scale", e);
    let scaleTime = $(".scale .time", e);
    scaleTime.on("click", setScale.bind(scale, false));
    let scaleTurns = $(".scale .turns", e);
    scaleTurns.on("click", setScale.bind(scale, true));
}

function toggleLiveExtraInfo() {
    $(this).toggleClass("open");
}

function closeTooltip() {
    tooltip.css({"left": 0, "top": 0});
}

// Note Bar Time Selection / Note Counter
// TODO: add support for touch events on mobile... how?

function notebarSelectionStart(e) {
    selecting = true;
    let selector = $("<div></div>").addClass("selection");
    this.append(selector);
    let fixedStartpos = e.pageX;
    let notebarPos = this.offset();
    let notebarWidth = this.width();
    let totalTime = Number(this.data("totaltime"));
    body.on("mousemove", notebarSelectionMove.bind(this, selector, fixedStartpos, notebarPos, notebarWidth, totalTime));
    body.on("mouseup", notebarSelectionEnd.bind(this, selector));
}

function notebarSelectionMove(selector, fixedStartpos, notebarPos, notebarWidth, totalTime, e) {
    let startpos = fixedStartpos;
    let endpos = e.pageX;
    if (endpos < startpos) {
        let temp = startpos;
        startpos = endpos;
        endpos = temp;
    }
    if (startpos < notebarPos.left) {
        startpos = notebarPos.left;
    }
    if (endpos > notebarPos.left + notebarWidth) {
        endpos = notebarPos.left + notebarWidth;
    }

    let firstSelectedNote = undefined;
    let count = undefined;
    let notes = $(".note", this);
    if (endpos < $(notes[0]).offset().left || startpos > $(notes[notes.length - 1]).offset().left) {
        count = 0;
    } else {
        if (startpos < $(notes[0]).offset().left) {
            for (let i = 0; i < notes.length; i++) {
                let notepos = $(notes[i]).offset().left;
                if (notepos > endpos) {
                    count = i;
                    break;
                }
            }
            if (count === undefined) {
                count = notes.length;
            }
        } else {
            for (let i = 0; i < notes.length; i++) {
                let notepos = $(notes[i]).offset().left;
                if (notepos > endpos) {
                    count = (firstSelectedNote ? i - firstSelectedNote : 0);
                    break;
                } else if (notepos >= startpos && firstSelectedNote === undefined) {
                    firstSelectedNote = i;
                }
            }
            if (count === undefined) {
                count = notes.length - firstSelectedNote;
            }
        }
    }

    let selectedTime = ((endpos - startpos) / notebarWidth * totalTime / 1000).toFixed(2);

    tooltipInner.html(count + " note" + (count !== 1 ? "s" : "") + "<br>" + selectedTime + " seconds");
    tooltip.css({"left": (startpos + endpos) / 2, "top": notebarPos.top});
    selector.css({"left": startpos - notebarPos.left, "width": endpos - startpos});
}

function notebarSelectionEnd(selector) {
    body.off("mousemove").off("mouseup");
    selecting = false;
    selector.remove();
    tooltip.css({"left": 0, "top": 0});
}

// Gimmick Info Tooltip

function gimmickMarkerMouseover(gimmickinfo) {
    if (selecting || $(this).hasClass("hidden")) return;
    let text = $("div", gimmickinfo)[1].innerHTML + "<br><b>Note Position: </b>" + $(this).data("npos");
    if ($(this).data("slot")) text += " (Unit " + $(this).data("slot") + ")";
    tooltipInner.html(text);
    let thismarker = $(".gimmickmarker", this);
    let position = thismarker.offset();
    position.left += thismarker.width() / 2;
    tooltip.css(position);
}

// AC Info Tooltip

function acMarkerMouseover(acinfo) {
    if (selecting) return;
    let details = $("div", acinfo);
    tooltipInner.html("<b>" + details[0].innerHTML.split(": ")[1] + "</b><br>" + details[1].innerHTML);
    let position = $(this).offset();
    position.left += $(this).width() / 2;
    tooltip.css(position);
}

// Gimmick Filter

function gimmickFilterToggle(gimmickinfos, gimmickmarkers, gimmickmarkermap, filterslot, e) {
    if ($(this).hasClass("filtered") && (filterslot === undefined
        || $($(".slot[data-slot='" + filterslot + "']", this)).hasClass("filtered"))) {
        $(this).removeClass("filtered");
        gimmickmarkers.removeClass("hidden filtered");
        $(".slot", this).removeClass("filtered");
    } else {
        gimmickinfos.removeClass("filtered");
        $(".slot", gimmickinfos).removeClass("filtered");
        $(this).addClass("filtered");
        let gi = $(this).data("gimmick");
        for (let i = 0; i < gimmickmarkermap.length; i++) {
            if (i === gi) {
                if (filterslot !== undefined) {
                    $($(".slot[data-slot='" + filterslot + "']", this)).addClass("filtered");
                    for (const marker of gimmickmarkermap[i]) {
                        if ($(marker).data("slot") === filterslot + 1) {
                            $(marker).removeClass("hidden").addClass("filtered");
                        } else {
                            $(marker).removeClass("filtered").addClass("hidden");
                        }
                    }
                } else {
                    $(gimmickmarkermap[i]).removeClass("hidden").addClass("filtered");
                }
            } else {
                $(gimmickmarkermap[i]).removeClass("filtered").addClass("hidden");
            }
        }
    }
    e.stopPropagation();
}

// Scale Setter

function setScale(isTurnScale) {
    this.toggleClass("turnscale", isTurnScale);
}

/*
 * -------------------
 * KEYBOARD NAVIGATION
 * -------------------
 */

function setFocusToFirstFocusable(page) {
    page.find('a[href], input, [tabindex]').first().focus();
}

function onKeyDown(e) {
    if (!e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey && e.key === "Enter" && $(document.activeElement).hasClass("has-on-click") && initialized) {
        // Call onClick handler for non-native buttons
        $(document.activeElement).trigger("click");
        e.preventDefault();
    } else if (!e.ctrlKey && !e.metaKey && !e.altKey && e.shiftKey && (e.key === "ArrowLeft" || e.key === "ArrowRight") && initialized) {
        // Switch page tabs
        body.addClass("keyboard-focused");
        let d = e.key === "ArrowLeft" ? -1 : 1;
        let newTabIndex = pageTabs.index, newTab = undefined;
        while (newTab === undefined) {
            newTabIndex += d;
            if (newTabIndex < 0 || newTabIndex >= pageTabs.$tabLinks.length) return;
            newTab = pageTabs.$tabLinks[newTabIndex];
            if ($(newTab).parent().hasClass("hidden-tab")) newTab = undefined;
        }

        let tabName = $(newTab).attr("href");
        if (tabName !== "#tab_rankings") {
            afterSwitchCallback = setFocusToFirstFocusable;
        } else {
            newTab.focus();
        }
        pageTabs.select(tabName.substring(1));
        e.preventDefault();
    } else if (!e.ctrlKey && !e.metaKey && !e.altKey && (!onSearchTab || document.activeElement !== searchInput[0]) &&
        ((e.keyCode > 47 && e.keyCode < 58) || (e.keyCode > 64 && e.keyCode < 91) || (e.keyCode > 95 && e.keyCode < 112))) {
        // Start search
        if (initialized) {
            pageTabs.select("tab_search");
            searchInput.val("");
        } else {
            searchInput[0].focus();
        }
    } else {
        let collapsibleParent = $(document.activeElement).parents('.collapsible')[0];
        if (collapsibleParent && initialized) {
            // Live difficulty hotkeys
            let liveBody = $("> li.active > .collapsible-body", collapsibleParent);
            if (liveBody.length > 0 && liveBody.hasClass("unloaded")) return;
            let liveTabsEl = $("> .tabs", liveBody);
            let liveTabs, storyTabs, liveDifficulty;
            if (liveTabsEl.length > 0) {
                liveTabs = M.Tabs.getInstance(liveTabsEl);
                let activeLiveTab = liveTabs.$activeTabLink;
                if (activeLiveTab.attr("href").endsWith("-story")) {
                    // Story Stage
                    storyTabs = M.Tabs.getInstance($(".tabs", liveTabs.$content));
                    liveDifficulty = storyTabs.$content;
                } else {
                    // Free Live
                    liveDifficulty = liveTabs.$content;
                }
            } else {
                // DLP Floor
                liveDifficulty = liveBody;
            }

            if (!e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
                // Scroll note bar
                let noteBar = $(".notebarcontainer", liveDifficulty);
                noteBar.scrollLeft(noteBar.scrollLeft() + (e.key === "ArrowLeft" ? -100 : 100));
                e.preventDefault();
            } else if (liveTabs && (e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
                // Switch difficulty tabs
                let d = e.key === "ArrowLeft" ? -1 : 1;
                let switchingTabs = storyTabs || liveTabs;
                let newTabIndex = switchingTabs.index + d;
                if (newTabIndex < 0 && switchingTabs === liveTabs || newTabIndex >= switchingTabs.$tabLinks.length) return;
                if (newTabIndex < 0 && switchingTabs === storyTabs) {
                    switchingTabs = liveTabs;
                    newTabIndex = switchingTabs.index - 1;
                }
                switchingTabs.select($(switchingTabs.$tabLinks[newTabIndex]).attr("href").substring(1));
                e.preventDefault();
            } else if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && ((e.keyCode > 47 && e.keyCode < 58) || (e.keyCode > 95 && e.keyCode < 112))) {
                // Toggle gimmick
                let gimmickIndex = e.keyCode > 95 ? e.keyCode - 97 : e.keyCode - 49;
                if (gimmickIndex === -1) {
                    gimmickIndex = 9;
                }
                let gimmick = $(".detailinfo .gimmick", liveDifficulty)[gimmickIndex];
                if (gimmick) {
                    $(gimmick).trigger("click");
                }
                e.preventDefault();
            } else if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && e.key == "a") {
                // Toggle dropdowns
                $(".live-extra-toggle", liveDifficulty).toggleClass("open");
                e.preventDefault();
            } else if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && e.key == "s") {
                // Toggle scale
                $(".scale", liveDifficulty).toggleClass("turnscale");
                e.preventDefault();
            }
        }
    }
}

window.addEventListener("keydown", onKeyDown, {passive: false});

/*
 * ------------------
 * POPUPS AND DIALOGS
 * ------------------
 */

let popUpPreferences = $('#popUpPreferences');

function initPopUps(initialPreferenceTitle, initialPreferenceUnavailable) {
    if (initialPreferenceTitle === "roma") {
        $('#preferencesTitlesRoma').prop("checked", true);
    }
    if (initialPreferenceUnavailable === "show") {
        $('#preferencesUnavailableShow').prop("checked", true);
    }
    if (localStorage.getItem("dark-mode") === "yes") {
        $('#preferencesDarkModeOn').prop("checked", true);
    }

    $('#preferencesSaveButton').on("click", savePreferences);
    $('#preferencesCancelButton').on("click", closePopUp.bind(this, popUpPreferences));
}

function openPopUp(popUp) {
    popUp.fadeTo(400, 1);
    popUp.css("pointer-events", "auto");
}

function closePopUp(popUp) {
    if (popUp.css("pointer-events") === "auto") {
        popUp.fadeTo(400, 0);
        popUp.css("pointer-events", "none");
    }
}

/*
 * -----------
 * PREFERENCES
 * -----------
 */

function showPreferences() {
    openPopUp(popUpPreferences);
    $('#preferencesSaveButton')[0].focus();
}

function savePreferences() {
    closePopUp(popUpPreferences);

    let titlesSet = $("input:radio[name=preferencesTitles]:checked").val();
    if ((titlesSet === "roma") !== showRomaji) {
        toggleRomaji(false);
    }
    localStorage.setItem("mapdb-titles", titlesSet);

    let unavailableSet = $("input:radio[name=preferencesUnavailable]:checked").val();
    if ((unavailableSet === "show") !== showUnavailable) {
        toggleUnavailable(false);
    }
    localStorage.setItem("mapdb-unavailable", unavailableSet);

    let darkModeSet = $("input:radio[name=preferencesDarkMode]:checked").val();
    if (darkModeSet === "yes") {
        body.addClass("dark-mode");
    } else {
        body.removeClass("dark-mode");
    }
    localStorage.setItem("dark-mode", darkModeSet);
}

/*
 * ---------------
 * COOKIE HANDLING (to be removed in a month or so)
 * ---------------
 */

function cookieGet(key) {
    let cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        let eqPos = cookie.indexOf("=");
        if (eqPos != -1 && cookie.substr(0, eqPos).trim() == key) {
            return cookie.substr(eqPos + 1, cookie.length).trim();
        }
    }
    return undefined;
}
const DEBUG_MODE = true;
const PAGE_TITLE = "SIFAS Note Map Database";
const PAGE_TITLE_SEP = " • ";

M.Collapsible.prototype.instantOpen = function (i) {
    let tmp = this.options.inDuration;
    this.options.inDuration = 0;
    this.open(i);
    this.options.inDuration = tmp;
}
M.Tabs.prototype.instantSelect = function (id) {
    let tmp = this._animateIndicator;
    this._animateIndicator = function () {
    };
    this.select(id);
    this.fakeIndicator();
    setTimeout(this.unfakeIndicator.bind(this), 1000);
    this._animateIndicator = tmp;
}
M.Tabs.prototype.fakeIndicator = function () {
    this.$el.addClass("fakeindicator");
    $(this._indicator).addClass("hide");
}
M.Tabs.prototype.unfakeIndicator = function () {
    this.forceTabIndicator();
    this.$el.removeClass("fakeindicator");
    $(this._indicator).removeClass("hide");
}
M.Tabs.prototype.forceTabIndicator = function () {
    this._setTabsAndTabWidth();
    $(".indicator", this.el).css({
        "left": this._calcLeftPos(this.$activeTabLink) + "px",
        "right": this._calcRightPos(this.$activeTabLink) + "px"
    });
}

let tooltip = $(".tooltip");
let tooltipInner = $(".tooltip-inner");
let body = $("body");

function scrollToAndFocusCollapsible(e) {
    // add padding at bottom to successfully scroll to divs at the end of the page
    body.css({"padding-bottom": "100vh"});
    setTimeout(function () {
        body.css({"padding-bottom": 0, "transition": "padding-bottom .5s"})
    }, 300);
    window.scrollTo(0, e.position().top);
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
        if (callback !== undefined) callback(page);
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
        $(".collapsible.temp", page).each(setExpiryDates);
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

    // Small hack to handle redirect from old DLP URL if there's no hash specified, so it still goes directly to DLP
    // This cookie is set in a rewrite rule in the top-level .htaccess
    if (cookieGet("tower-redirect") === "yes") {
        document.cookie = "tower-redirect=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.suyo.be; path=/sifas;"
        if (window.location.hash === "") window.location.hash = "#dlp";
    }

    handleLocationHash();
    window.addEventListener("hashchange", handleLocationHash, {passive: true});

    let preferenceTitle = cookieGet("mapdb-titles");
    let preferenceUnavailable = cookieGet("mapdb-unavailable");
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
        setTimeout($.prototype.show.bind(groupTabs), 1);
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

    let search_terms = search_input.trim().split(/\s+/);
    let filtered = collapsibles.toArray().filter(filterCollapsibles.bind(this, search_terms)).map(M.Collapsible.getInstance);

    if (filtered.length === 1) {
        filtered[0].open();
    } else {
        $(filtered).each(M.Collapsible.prototype.close);
    }
}

function filterCollapsibles(search_terms, e) {
    let song_name_element = $(".collapsible-header > .translatable", e);
    let song_name_jp = song_name_element.text().toLowerCase();
    let song_name_ro = song_name_element.data("rom").toLowerCase();

    let result = true;
    for (let i = 0; i < search_terms.length; i++) {
        let term = search_terms[i].toLowerCase();
        if (result && !song_name_jp.includes(term) && !song_name_ro.includes(term)) {
            result = false;
        }
    }

    if (result) {
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

function addHistoryItem(s, page) {
    if (!disableHistory) history.pushState(undefined, undefined, "#" + s);
    if (page === undefined) document.title = PAGE_TITLE;
    else document.title = page + PAGE_TITLE_SEP + PAGE_TITLE;
}

function handleLocationHash() {
    disableHistory = true;
    let hash = window.location.hash;
    if (hash.startsWith("#live")) {
        // Direct link to a live difficulty
        if (hash.charAt(5) === "1" || hash.charAt(5) === "2") {
            // Free Live or Event Live (has group ID in next position)
            afterSwitchCallback = showLinkedFreeLive.bind(this, hash);
            switch (hash.charAt(6)) {
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
            loadAllGroupPagesThen(showLinkedStoryStage.bind(this, hash, pageTabs));
        }
    } else if (hash.startsWith("#tower") || hash.startsWith("#floor")) {
        // Direct link to a DLP tower or floor
        afterSwitchCallback = showLinkedDlp.bind(this, hash);
        pageTabs.select("tab_dlp");
    } else {
        // Direct link to a page
        if (hash === "") hash = "#start";
        pageTabs.select("tab_" + hash.substring(1));
        disableHistory = false;
    }
}

function showLinkedFreeLive(hash, page) {
    let liveDiffId = hash.substring(5);
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
        liveDiffTabs.instantSelect(liveDiffId);
        scrollToAndFocusCollapsible(collapsible.$el);
        scrollActiveTabLabelIntoView(liveDiffTabs);
    }
    disableHistory = false;
}

function showLinkedStoryStage(hash, tabs, groupPages) {
    let targetLiveDiff = $("#" + hash.substring(5), groupPages);
    if (targetLiveDiff.length) {
        let targetLiveStoryTab = targetLiveDiff.parent();
        let targetLive = targetLiveStoryTab.parent().parent().parent();
        let targetPage = targetLive.parent();

        let liveCollapsible = M.Collapsible.getInstance(targetLive[0]);
        liveCollapsible.instantOpen(0);
        let liveDiffTabs = M.Tabs.getInstance($(".tabs", targetLive)[0]);
        liveDiffTabs.instantSelect(targetLiveStoryTab.attr("id"));
        let storyTabs = M.Tabs.getInstance($(".tabs", targetLiveStoryTab)[0]);

        tabs.instantSelect(targetPage.attr("id"));
        storyTabs.instantSelect(targetLiveDiff.attr("id"));
        scrollToAndFocusCollapsible(liveCollapsible.$el);
        scrollActiveTabLabelIntoView.bind(storyTabs);
    }
    disableHistory = false;
}

function showLinkedDlp(hash, page) {
    let towerId = hash.substr(6, 5);
    let targetElement = $("#" + towerId, page);
    if (targetElement.length) {
        let towerCollapsible = M.Collapsible.getInstance(targetElement[0]);
        if (hash.startsWith("#floor")) {
            let floorList = $("#tower-floorlist" + towerId);
            loadTower(floorList, towerId, showLinkedDlpFloor1.bind(floorList, hash, towerCollapsible));
        } else {
            scrollToAndFocusCollapsible(targetElement);
            towerCollapsible.instantOpen(0);
            disableHistory = false;
        }
    }
}

function showLinkedDlpFloor1(hash, towerCollapsible, responseText, textStatus) {
    loadTowerFinish.bind(this, responseText, textStatus)();
    towerCollapsible.instantOpen(0);
    setTimeout(showLinkedDlpFloor2.bind(this, hash, responseText, textStatus), 1);
}

function showLinkedDlpFloor2(hash, responseText, textStatus) {
    if (textStatus !== "error") {
        let targetElement = $("#" + hash.substring(6), this);
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
    let tabElements = $(".tabs", this.el);
    let tabs;
    if (this.$el.data("initialized") === undefined) {
        this.$el.data("initialized", 1);
        tabElements.tabs();
        let story_tabs = (tabElements.length > 1) ? M.Tabs.getInstance(tabElements[1]) : undefined;
        tabs = M.Tabs.getInstance(tabElements[0]);

        tabs.options.onShow = freeLiveTabShow.bind(this, tabs);

        // Materialize messes up the indicator position, so we'll fix it ourselves on first open
        // Must wait the minimum possible time, since the library will set it's own (broken) indicator animation
        setTimeout(tabs.forceTabIndicator.bind(tabs), 1);

        if (story_tabs !== undefined) {
            story_tabs.options.onShow = freeLiveStoryTabShow.bind(this, story_tabs);
        }
    } else {
        tabs = M.Tabs.getInstance(tabElements[0]);
    }

    let location, pagename;
    if (tabs.$activeTabLink.attr("href").endsWith("story")) {
        location = "live" + $(".active", "#" + tabs.$activeTabLink.attr("href").substring(1)).attr("href").substring(1);
        pagename = $("b.translatable", this.el).text() + " (Story " + $(".active", "#" + tabs.$activeTabLink.attr("href").substring(1)).text().split(" (")[0].trim() + ")";
    } else {
        location = "live" + tabs.$activeTabLink.attr("href").substring(1);
        pagename = $("b.translatable", this.el).text() + " (" + tabs.$activeTabLink.text() + ")";
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
        addHistoryItem("live" + $(e).attr("id"), $("b.translatable", $(e).parent().parent()).text() + " (" + tabs.$activeTabLink.text().trim() + ")");
    } else {
        // Story Stages tab
        let tabElement = $(".tabs", e)[0];
        let tabs = M.Tabs.getInstance(tabElement);
        tabs.forceTabIndicator();
        addHistoryItem("live" + tabs.$activeTabLink.attr("href").substring(1), $("b.translatable", $(e).parent().parent()).text() + " (Story " + tabs.$activeTabLink.text().split(" (")[0].trim() + ")");

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
    addHistoryItem("live" + $(e).attr("id"), $("b.translatable", $(e).parent().parent().parent()).text() + " (Story " + tabs.$activeTabLink.text().split(" (")[0].trim() + ")");
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
    let name = $(".collapsible-header > .translatable", e);
    let d = new Date(Number(name.data("end")));
    let r = relDateFormat(d);
    if (r === undefined) {
        $(e).removeClass("temp").addClass("unavail");
    } else {
        name.attr("data-end-formatted", r);
        name.attr("title", absDateFormat(d));
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
    } else {
        dlpTowerCollapsibleOpen(e);
    }
}

function loadTowerFinish(responseText, textStatus) {
    if (textStatus === "error") {
        $(this).html("Failed to load. <a onClick='loadTower($(\"#" + $(this).attr("id") + "\")," + $(this).attr("id").split("tower-floorlist")[1] + ",loadTowerFinish)'>Retry?</a>");
    } else {
        $(this).data("initialized", 1);
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
    collapsible.options.onOpenStart = loadTower.bind(this, $("#tower-floorlist" + $(this).attr("id")), $(this).attr("id"), loadTowerFinish);
    collapsible.options.onCloseStart = outerCollapsibleClose;
}

function dlpTowerCollapsibleOpen(e) {
    let towerLink = "tower" + $(e).attr("id").substring(15);
    $(".collapsible.floor", e).collapsible().each(dlpFloorCollapsibleInit);
    addHistoryItem(towerLink, $($("b.translatable", $(e).parent().parent())[0]).text().replaceAll("Dream Live Parade", "DLP").replaceAll("ドリームライブパレード", "DLP"));
}

function dlpFloorCollapsibleInit() {
    let towerLink = "tower" + $(this).parent().parent().parent().attr("id");
    let towerPageName = $($("b.translatable", $(this).parent().parent().parent())[0]).text().replaceAll("Dream Live Parade", "DLP").replaceAll("ドリームライブパレード", "DLP");
    let collapsible = M.Collapsible.getInstance(this);
    collapsible.options.onOpenStart = dlpFloorCollapsibleOpen.bind(this, towerPageName);
    collapsible.options.onCloseStart = dlpFloorCollapsibleClose.bind(this, towerLink, towerPageName);
}

function dlpFloorCollapsibleOpen(towerPageName) {
    addHistoryItem("floor" + $(this).attr("id"), towerPageName + " ➔ " + $("b.translatable", $(this)).text());
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
    let notebar = $(".notebar", e);
    notebar.on("mousedown", notebarSelectionStart.bind(notebar));

    let gimmickmarkers = $(".notebar .gimmick", e);
    let gimmickinfos = $(".detailinfo .gimmick", e);
    let gimmickmarkermap = Array(gimmickinfos.length);
    for (let i = 0; i < gimmickmarkers.length; i++) {
        let gi = $(gimmickmarkers[i]).data("gimmick");
        $(gimmickmarkers[i]).on("mouseover touchstart",
            gimmickMarkerMouseover.bind(gimmickmarkers[i], gimmickinfos[gi]));
        gimmickmarkermap[gi]
            ? gimmickmarkermap[gi].push(gimmickmarkers[i])
            : gimmickmarkermap[gi] = [gimmickmarkers[i]];
    }
    gimmickmarkers.on("mouseout", closeTooltip);
    for (let i = 0; i < gimmickinfos.length; i++) {
        $(gimmickinfos[i]).on("click",
            gimmickFilterToggle.bind(gimmickinfos[i], gimmickinfos, gimmickmarkers, gimmickmarkermap));
    }

    let acmarkers = $(".notebar .appealchance", e);
    let acinfos = $(".detailinfo .appealchance", e);
    for (let i = 0; i < acmarkers.length; i++) {
        $(acmarkers[i]).on("mouseover touchstart",
            acMarkerMouseover.bind(acmarkers[i], acinfos[$(acmarkers[i]).data("ac")]));
    }
    acmarkers.on("mouseout", closeTooltip);
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
    tooltipInner.html($("div", gimmickinfo)[1].innerHTML + "<br><b>Note Position: </b>" + $(this).data("npos"));
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

function gimmickFilterToggle(gimmickinfos, gimmickmarkers, gimmickmarkermap) {
    if ($(this).hasClass("filtered")) {
        $(this).removeClass("filtered");
        gimmickmarkers.removeClass("hidden filtered");
    } else {
        gimmickinfos.removeClass("filtered");
        $(this).addClass("filtered");
        let gi = $(this).data("gimmick");
        for (let i = 0; i < gimmickmarkermap.length; i++) {
            if (i === gi) {
                $(gimmickmarkermap[i]).removeClass("hidden").addClass("filtered");
            } else {
                $(gimmickmarkermap[i]).removeClass("filtered").addClass("hidden");
            }
        }
    }
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
    if (!e.ctrlKey && !e.altKey && !e.shiftKey && e.key === "Enter" && $(document.activeElement).hasClass("has-on-click") && initialized) {
        // Call onClick handler for non-native buttons
        $(document.activeElement).trigger("click");
    } else if (!e.ctrlKey && !e.altKey && e.shiftKey && (e.key === "ArrowLeft" || e.key === "ArrowRight") && initialized) {
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
    } else if (!e.ctrlKey && !e.altKey && (!onSearchTab || document.activeElement !== searchInput[0]) &&
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

            if (!e.ctrlKey && !e.altKey && !e.shiftKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
                // Scroll note bar
                let noteBar = $(".notebarcontainer", liveDifficulty);
                noteBar.scrollLeft(noteBar.scrollLeft() + (e.key === "ArrowLeft" ? -100 : 100));
            } else if (liveTabs && e.ctrlKey && !e.altKey && !e.shiftKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
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
            } else if (e.ctrlKey && !e.altKey && !e.shiftKey && ((e.keyCode > 47 && e.keyCode < 58) || (e.keyCode > 95 && e.keyCode < 112))) {
                // Toggle gimmick
                let gimmickIndex = e.keyCode > 95 ? e.keyCode - 97 : e.keyCode - 49;
                if (gimmickIndex === -1) {
                    gimmickIndex = 9;
                }
                let gimmick = $(".detailinfo .gimmick", liveDifficulty)[gimmickIndex];
                if (gimmick) {
                    $(gimmick).trigger("click");
                }
            }
        }
    }
}

window.addEventListener("keydown", onKeyDown, {passive: true});

/*
 * ------------------
 * POPUPS AND DIALOGS
 * ------------------
 */

let popUpPreferences = $('#popUpPreferences');
let popUpCookieConsent = $('#popUpCookieConsent');

function initPopUps(initialPreferenceTitle, initialPreferenceUnavailable) {
    if (initialPreferenceTitle === "roma") {
        $('#preferencesTitlesRoma').prop("checked", true);
    }
    if (initialPreferenceUnavailable === "show") {
        $('#preferencesUnavailableShow').prop("checked", true);
    }
    if (cookieGet("dark-mode") === "yes") {
        $('#preferencesDarkModeOn').prop("checked", true);
    }

    $('#preferencesSaveButton').on("click", savePreferences);
    $('#preferencesCancelButton').on("click", closePopUp.bind(this, popUpPreferences));

    $('#consentNoButton').on("click", closePopUp.bind(this, popUpCookieConsent));
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

    let unavailableSet = $("input:radio[name=preferencesUnavailable]:checked").val();
    if ((unavailableSet === "show") !== showUnavailable) {
        toggleUnavailable(false);
    }

    let darkModeSet = $("input:radio[name=preferencesDarkMode]:checked").val();
    if (darkModeSet === "yes") {
        body.addClass("dark-mode");
    } else {
        body.removeClass("dark-mode");
    }

    cookieSet(["mapdb-titles", "mapdb-unavailable", "dark-mode"],
        [titlesSet, unavailableSet, darkModeSet], 365);
}

/*
 * ---------------
 * COOKIE HANDLING
 * ---------------
 */

function cookieSet(keys, values, days, createConsentCookie) {
    if (document.cookie === "" && (createConsentCookie === undefined || createConsentCookie === false)) {
        openPopUp(popUpCookieConsent);
        $('#consentYesButton').off("click")
            .on("click", cookieSet.bind(this, keys, values, days, true))[0].focus();
        return false;
    } else {
        if (createConsentCookie === true) {
            closePopUp(popUpCookieConsent);
            let expiryDate = new Date();
            expiryDate.setTime(expiryDate.getTime() + (5 * 60 * 1000));
            document.cookie = "cookieConsent=1; expires=" + expiryDate.toUTCString() + "; path=/sifas; SameSite=Lax";
            if (cookieGet("cookieConsent") === undefined) {
                alert("Unable to store cookies. Your browser might be blocking cookie " +
                    "storage. Please check your browser's privacy and storage settings, then try again.");
                return false;
            }
        }
        let expiryDate = new Date();
        expiryDate.setTime(expiryDate.getTime() + (days * 24 * 60 * 60 * 1000));
        if (Array.isArray(keys)) {
            for (let i = 0; i < keys.length; i++) {
                document.cookie = keys[i] + "=" + values[i] + "; expires=" + expiryDate.toUTCString() + "; path=/sifas; SameSite=Lax";
                if (DEBUG_MODE) {
                    console.log("Set cookie " + keys[i] + " to " + values[i]);
                }
            }
        } else {
            document.cookie = keys + "=" + values + "; expires=" + expiryDate.toUTCString() + "; path=/sifas; SameSite=Lax";
            if (DEBUG_MODE) {
                console.log("Set cookie " + keys + " to " + values);
            }
        }
        return true;
    }
}

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
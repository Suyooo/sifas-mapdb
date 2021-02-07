const DEBUG_MODE = true;
//let current_filter_timeout = undefined;

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

function scrollToElement(e) {
    // add padding at bottom to successfully scroll to divs at the end of the page
    body.css({"padding-bottom": "100vh"});
    setTimeout(function () {
        body.css({"padding-bottom": 0, "transition": "padding-bottom .5s"})
    }, 300);
    window.scrollTo(0, e.position().top);
}

/*
 *  ----------
 *  PAGE LOADING
 *  ----------
 */

let currentPage = "start";
let afterSwitchCallback = undefined;

function callAfterSwitchCallback(page) {
    if (afterSwitchCallback !== undefined) {
        let f = afterSwitchCallback;
        afterSwitchCallback = undefined;
        f(page);
    }
}

function loadPage() {
    let page = $(this);
    if (page.data("loaded") === undefined) {
        page.data("loaded", 1);
        let type = page.data("type");
        if (type === "fixed") {
            // Tab already has content - don't do anything
            page.removeClass("unloaded");
            callAfterSwitchCallback(page);
        } else {
            // Load tab content, delay initialization until loaded
            page.load((DEBUG_MODE ? "build/" : "") + page.attr("id").substring(4) + ".html", loadPageFinished.bind(this, type, page));
        }
    } else {
        callAfterSwitchCallback(page);
    }
}

function loadPageFinished(type, page) {
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
    callAfterSwitchCallback(page);
}

/*
 *  ----------
 *  SITE INIT
 *  ----------
 */

$(function () {
    M.AutoInit();

    // page tabs
    let tabs = M.Tabs.getInstance($("nav .tabs")[0]);
    tabs.options.onShow = pageTabShow;

    handleLocationHash(tabs);
    registerHeaderButtons();
});

function pageTabShow(e) {
    window.location.hash = currentPage = $(e).attr("id").substring(4);
    loadPage.bind(e)();
}

/*
 *  ----------
 *  DIRECT LINKING
 *  ----------
 */

function handleLocationHash(tabs) {
    if (window.location.hash !== "") {
        let hash = window.location.hash;
        if (hash.startsWith("#live")) {
            // Direct link to a live difficulty
            if (hash.charAt(5) === "1") {
                // Free Live or Event Live (has group ID in next position)
                afterSwitchCallback = showLinkedFreeLive.bind(this, hash);
                switch (hash.charAt(6)) {
                    case "0":
                        tabs.select("tab_muse");
                        break;
                    case "1":
                        tabs.select("tab_aqours");
                        break;
                    case "2":
                        tabs.select("tab_niji");
                        break;
                    case "3":
                        tabs.select("tab_liella");
                        break;
                }
            } else {
                // Story Stage: Can't read group ID on newer stages, must load all group tabs
                // and search for the correct stage by going through them all
                let groupTabs = $(".group-tab");
                afterSwitchCallback = showLinkedStoryStage.bind(this, groupTabs.length, hash, groupTabs, tabs);
                groupTabs.each(loadPage);
            }
        } else if (hash.startsWith("#tower") || hash.startsWith("#floor")) {
            // Direct link to a DLP tower or floor
            afterSwitchCallback = showLinkedDlp.bind(this, hash);
            tabs.select("tab_dlp");
        } else {
            // Direct link to a page
            tabs.select("tab_" + hash.substring(1));
        }
    }
}

function showLinkedFreeLive(hash, page) {
    let liveDiffId = hash.substring(5);
    let collapsibleBody = $("#" + liveDiffId, page).parent();
    let collapsible = M.Collapsible.getInstance(collapsibleBody.parent().parent()[0]);
    collapsible.instantOpen(0);
    let liveDiffTabs = M.Tabs.getInstance($(".tabs", collapsibleBody)[0]);
    liveDiffTabs.instantSelect(liveDiffId);
    scrollToElement(collapsible.$el);
}

function showLinkedStoryStage(counter, hash, groupTabs, tabs) {
    if (counter > 1) {
        afterSwitchCallback = showLinkedStoryStage.bind(this, counter - 1, hash, groupTabs, tabs);
        return;
    }

    let targetLiveDiff = $("#" + hash.substring(5), groupTabs);
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
    scrollToElement(liveCollapsible.$el);
}

function showLinkedDlp(hash, page) {
    let towerId = hash.substr(6, 5);
    let targetElement = $("#" + towerId, page);
    let towerCollapsible = M.Collapsible.getInstance(targetElement[0]);
    towerCollapsible.instantOpen(0);
    if (hash.startsWith("#floor")) {
        targetElement = $("#" + hash.substring(6), targetElement);
        let floorCollapsible = M.Collapsible.getInstance(targetElement[0]);
        floorCollapsible.instantOpen(0);
    }
    scrollToElement(targetElement);
}

/*
 *  ----------
 *  HEADER BUTTONS
 *  ----------
 */
let showRomaji = false;
let btnRomaji = $("#toggle_romaji");
let showUnavailable = false;
let btnUnavailable = $("#toggle_unavailable");

function registerHeaderButtons() {
    btnRomaji.on("click", toggleRomaji);
    btnUnavailable.on("click", toggleUnavailable);
}

function toggleRomaji() {
    showRomaji = !showRomaji;
    $(".translatable").each(swapTitles);
    if (showRomaji) {
        btnRomaji.addClass("on");
        M.toast({html: "Showing titles in Romaji"});
    } else {
        btnRomaji.removeClass("on");
        M.toast({html: "Showing titles in Kana/Kanji"});
    }
}

function swapTitles() {
    let new_title = $(this).data("rom");
    $(this).data("rom", $(this).text());
    $(this).text(new_title);
}

function toggleUnavailable() {
    showUnavailable = !showUnavailable;
    if (showUnavailable) {
        btnUnavailable.addClass("on");
        body.addClass("show-unavail");
        M.toast({html: "Showing unavailable songs"});
    } else {
        btnUnavailable.removeClass("on");
        body.removeClass("show-unavail");
        M.toast({html: "Hiding unavailable songs"});
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

        tabs.options.onShow = freeLiveTabShow;

        // Materialize messes up the indicator position, so we'll fix it ourselves on first open
        // Must wait the minimum possible time, since the library will set it's own (broken) indicator animation
        setTimeout(tabs.forceTabIndicator.bind(tabs), 1);

        if (story_tabs !== undefined) {
            story_tabs.options.onShow = freeLiveStoryTabShow;
        }
    } else {
        tabs = M.Tabs.getInstance(tabElements[0]);
    }

    if (tabs.$activeTabLink.attr("href").endsWith("story")) {
        window.location.hash = "live" + $(".active", "#" + tabs.$activeTabLink.attr("href").substring(1)).attr("href").substring(1);
    } else {
        window.location.hash = "live" + tabs.$activeTabLink.attr("href").substring(1);
    }

    let activetab = $(tabs.$activeTabLink.attr("href"), this.el);
    if (activetab.hasClass("live-difficulty") && activetab.data("initialized") === undefined) {
        activetab.data("initialized", 1);
        loadNoteMap(activetab);
    }
}

function outerCollapsibleClose() {
    window.location.hash = currentPage;
}

function freeLiveTabShow(e) {
    if ($(e).hasClass("live-difficulty")) {
        if ($(e).data("initialized") === undefined) {
            $(e).data("initialized", 1);
            loadNoteMap($(e));
        }
        window.location.hash = "live" + $(e).attr("id");
    } else {
        // Story Stages tab
        let tabElement = $(".tabs", e)[0];
        let tabs = M.Tabs.getInstance(tabElement);
        tabs.forceTabIndicator();
        window.location.hash = "live" + tabs.$activeTabLink.attr("href").substring(1);

        let activetab = $(tabs.$activeTabLink.attr("href"), e);
        if (activetab.hasClass("live-difficulty") && activetab.data("initialized") === undefined) {
            activetab.data("initialized", 1);
            loadNoteMap(activetab);
        }
    }
}

function freeLiveStoryTabShow(e) {
    if ($(e).data("initialized") === undefined) {
        $(e).data("initialized", 1);
        loadNoteMap($(e));
    }
    window.location.hash = "live" + $(e).attr("id");
}

/*
 *  ----------
 *  DLP PAGE
 *  ----------
 */

function initPageDlp(page) {
    $(".collapsible.tower", page).collapsible().each(dlpTowerCollapsibleInit);
}

function dlpTowerCollapsibleInit() {
    let collapsible = M.Collapsible.getInstance(this);
    collapsible.options.onOpenStart = dlpTowerCollapsibleOpen;
    collapsible.options.onCloseStart = outerCollapsibleClose;
}

function dlpTowerCollapsibleOpen() {
    let towerLink = "tower" + this.$el.attr("id");
    if (this.$el.data("initialized") === undefined) {
        this.$el.data("initialized", 1);
        $(".collapsible.floor", this.el).collapsible().each(dlpFloorCollapsibleInit, towerLink);
    }
    window.location.hash = towerLink;
}

function dlpFloorCollapsibleInit(towerLink) {
    let collapsible = M.Collapsible.getInstance(this);
    collapsible.options.onOpenStart = dlpFloorCollapsibleOpen;
    collapsible.options.onCloseStart = dlpFloorCollapsibleClose.bind(towerLink);
}

function dlpFloorCollapsibleOpen() {
    window.location.hash = "floor" + this.$el.attr("id");
    if (this.$el.data("initialized") === undefined) {
        this.$el.data("initialized", 1);
        loadNoteMap($(".live-difficulty", this.el));
    }
}

function dlpFloorCollapsibleClose(towerLink) {
    window.location.hash = towerLink;
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

function loadNoteMapFinish() {
    $(this).removeClass("unloaded");
    initNoteMapInteractions(this);
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
    tooltipInner.html($("div", gimmickinfo)[1].innerHTML);
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
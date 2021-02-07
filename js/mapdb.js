const DEBUG_MODE = true;
//let current_filter_timeout = undefined;

function fixTabIndicator(tabelement) {
    let activetablink = $(".active", tabelement);
    let activetab = activetablink.parent();
    let alltabs = activetab.parent().children();
    let tabindex = alltabs.index(activetab);
    let tabwidth = 100 / (alltabs.length - 1);
    $(".indicator", tabelement).css("left", (tabwidth * tabindex) + "%")
        .css("right", (tabwidth * (-tabindex + alltabs.length - 2)) + "%");
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
        afterSwitchCallback(page);
        afterSwitchCallback = undefined;
    }
}

function loadPage(page) {
    if (page.data("loaded") === undefined) {
        page.data("loaded", 1);
        let type = page.data("type");
        if (type === "fixed") {
            // Tab already has content - don't do anything
            page.removeClass("unloaded");
            callAfterSwitchCallback(page);
        } else {
            // Load tab content, delay initialization until loaded
            page.load((DEBUG_MODE ? "build/" : "") + page.attr("id").substring(4) + ".html", function () {
                page.removeClass("unloaded");

                if (type === "free") {
                    initPageFreeLive(page);
                } else if (type === "dlp") {
                    initPageDlp(page);
                } else if (type === "top") {
                    initPageTop(page);
                }
                callAfterSwitchCallback(page);
            });
        }
    } else {
        callAfterSwitchCallback(page);
    }
}

/*
 *  ----------
 *  SITE INIT AND DIRECT LINKING
 *  ----------
 */

$(function () {
    M.AutoInit();

    // page tabs
    let tabs = M.Tabs.getInstance($("nav .tabs")[0]);
    tabs.options.onShow = function (e) {
        let page = $(e);
        window.location.hash = currentPage = page.attr("id").substring(4);
        loadPage(page);
    }

    // Handle location hash
    if (window.location.hash !== "") {
        let hash = window.location.hash;
        if (hash.startsWith("#live")) {
            // Direct link to a live difficulty
            if (hash.charAt(5) === "1") {
                // Free Live or Event Live (has group ID in next position)
                afterSwitchCallback = function(page) {
                    let liveDiffId = hash.substring(5);
                    let collapsibleBody = $("#" + liveDiffId, page).parent();
                    let collapsible = M.Collapsible.getInstance(collapsibleBody.parent().parent()[0]);
                    collapsible.open(0);
                    let liveDiffTabs = M.Tabs.getInstance($(".tabs", collapsibleBody)[0]);
                    liveDiffTabs.select(liveDiffId);
                    scrollToElement($(collapsible.el));
                };

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
                // Story Stage (TODO: uh oh, no group ID)
            }
        } else if (hash.startsWith("#tower") || hash.startsWith("#floor")) {
            // Direct link to a DLP tower or floor
        } else {
            // Direct link to a page
            tabs.select("tab_" + hash.substring(1));
        }
    }
});

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
    if ($(this.el).data("initialized") === undefined) {
        $(this.el).data("initialized", 1);
        tabElements.tabs();
        let story_tabs = (tabElements.length > 1) ? M.Tabs.getInstance(tabElements[1]) : undefined;
        let tabs = M.Tabs.getInstance(tabElements[0]);

        tabs.options.onShow = freeLiveTabShow;

        // Materialize messes up the indicator position, so we'll fix it ourselves on first open
        // Must wait the minimum possible time, since the library will set it's own (broken) indicator animation
        setTimeout(fixTabIndicator.bind(this, tabElements[0]), 1);

        if (story_tabs !== undefined) {
            story_tabs.options.onShow = freeLiveStoryTabShow;
        }
    }

    let activetablink = $(".active", tabElements[0]);
    if (activetablink.attr("href").endsWith("story")) {
        window.location.hash = "live" + $(".active", "#" + activetablink.attr("href").substring(1)).attr("href").substring(1);
    } else {
        window.location.hash = "live" + activetablink.attr("href").substring(1);
    }

    let activetab = $(activetablink.attr("href"), this.el);
    if (activetab.hasClass("live-difficulty") && activetab.data("initialized") === undefined) {
        activetab.data("initialized", 1);
        initNoteMapInteractions(activetab);
    }
}
function outerCollapsibleClose() {
    window.location.hash = currentPage;
}
function freeLiveTabShow(e) {
    if ($(e).hasClass("live-difficulty")) {
        if ($(e).data("initialized") === undefined) {
            $(e).data("initialized", 1);
            initNoteMapInteractions($(e));
        }
        window.location.hash = "live" + $(e).attr("id");
    } else {
        let tabElement = $(".tabs", e)[0];
        M.Tabs.getInstance(tabElement).updateTabIndicator();
        let activetablink = $(".active", tabElement);
        window.location.hash = "live" + activetablink.attr("href").substring(1);

        let activetab = $(activetablink.attr("href"), e);
        if (activetab.hasClass("live-difficulty") && activetab.data("initialized") === undefined) {
            activetab.data("initialized", 1);
            initNoteMapInteractions(activetab);
        }
    }
}
function freeLiveStoryTabShow(e) {
    if ($(e).data("initialized") === undefined) {
        $(e).data("initialized", 1);
        initNoteMapInteractions($(e));
    }
    window.location.hash = "live" + $(e).attr("id");
}

/*
 *  ----------
 *  DLP PAGE
 *  ----------
 */

function initPageDlp(page) {
    let e = $(".collapsible.tower", page).collapsible().each(dlpTowerCollapsibleInit);
}
function dlpTowerCollapsibleInit() {
    let collapsible = M.Collapsible.getInstance(this);
    collapsible.options.onOpenStart = dlpTowerCollapsibleOpen;
    collapsible.options.onCloseStart = outerCollapsibleClose;
}
function dlpTowerCollapsibleOpen() {
    let towerLink = "tower" + $(this.el).data("tower");
    if ($(this.el).data("initialized") === undefined) {
        $(this.el).data("initialized", 1);
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
    window.location.hash = "floor" + $(this.el).data("floor");
    if ($(this.el).data("initialized") === undefined) {
        $(this.el).data("initialized", 1);
        initNoteMapInteractions($(".live-difficulty", this.el));
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
    $(".btn", this).on("click", rankingTableOpen.bind(this, table));
    $("small.right", table.parent()).on("click", rankingTableShowAll.bind(this, table));
}
function rankingTableOpen(table) {
    table.addClass("open");
}
function rankingTableShowAll(table) {
    table.addClass("show-all");
    $(this).remove();
}

/*
 *  ----------
 *  NOTE MAP INTERACTIONS
 *  ----------
 */

let selecting = false;
function initNoteMapInteractions(noteMap) {
    let notebar = $(".notebar", noteMap);
    notebar.on("mousedown", notebarSelectionStart.bind(notebar));

    let gimmickmarkers = $(".notebar .gimmick", noteMap);
    let gimmickinfos = $(".detailinfo .gimmick", noteMap);
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

    let acmarkers = $(".notebar .appealchance", noteMap);
    let acinfos = $(".detailinfo .appealchance", noteMap);
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
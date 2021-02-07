var current_filter_timeout = undefined;

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
            page.load(page.attr("id").substring(4) + ".html", function () {
                page.removeClass("unloaded");

                if (type === "free") {
                    doFreeLiveInit(page);
                } else if (type === "dlp") {
                    doDLPInit(page);
                } else if (type === "top") {
                    $(".rankingtable", page).each(function () {
                        let table = $(this);
                        $(".btn", this).click(function () {
                            table.addClass("open");
                        });
                        $("small.right", table.parent()).click(function () {
                            table.addClass("show-all");
                            $(this).remove();
                        });
                    });
                }
                callAfterSwitchCallback(page);
            });
        }
    } else {
        callAfterSwitchCallback(page);
    }
}

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
                    collapsible.open();
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

function doFreeLiveInit(page) {
    $(".collapsible", page).collapsible().each(function () {
        let collapsible = M.Collapsible.getInstance(this);

        collapsible.options.onOpenStart = function () {
            let tabElements = $(".tabs", this.el);
            if ($(this.el).data("initialized") === undefined) {
                $(this.el).data("initialized", 1);
                tabElements.tabs();
                let story_tabs = (tabElements.length > 1) ? M.Tabs.getInstance(tabElements[1]) : undefined;
                let tabs = M.Tabs.getInstance(tabElements[0]);

                tabs.options.onShow = function (e) {
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
                };

                // Materialize messes up the indicator position, so we'll fix it ourselves on first open
                // Must wait the minimum possible time, since the library will set it's own (broken) indicator animation
                setTimeout(function () {
                    fixTabIndicator(tabElements[0]);
                }, 1);

                if (story_tabs !== undefined) {
                    story_tabs.options.onShow = function (e) {
                        if ($(e).data("initialized") === undefined) {
                            $(e).data("initialized", 1);
                            initNoteMapInteractions($(e));
                        }
                        window.location.hash = "live" + $(e).attr("id");
                    };
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
        };

        collapsible.options.onCloseStart = function () {
            window.location.hash = currentPage;
        };
    });
}

function doDLPInit(page) {
    $(".collapsible.tower", page).collapsible().each(function () {
        let collapsible = M.Collapsible.getInstance(this);

        collapsible.options.onOpenStart = function () {
            let towerLink = "tower" + $(this.el).data("tower");

            let collapElements = $(".collapsible.floor", this.el);
            collapElements.collapsible().each(function () {
                let collapsible = M.Collapsible.getInstance(this);

                collapsible.options.onOpenStart = function () {
                    window.location.hash = "floor" + $(this.el).data("floor");
                    initNoteMapInteractions($(".live-difficulty", this.el));
                };

                collapsible.options.onCloseStart = function () {
                    window.location.hash = towerLink;
                };
            });

            window.location.hash = towerLink;
        };

        collapsible.options.onCloseStart = function () {
            window.location.hash = currentPage;
        };
    });
}

function initNoteMapInteractions(noteMap) {
    let selecting = false;
    // note measure
    // TODO: add support for touch events on mobile... how?
    let notebar = $(".notebar", noteMap);
    notebar.mousedown(function (e) {
        selecting = true;
        let selector = $("<div></div>").addClass("selection");
        notebar.append(selector);
        let fixedStartpos = e.pageX;
        let notebarPos = notebar.offset();
        let notebarWidth = notebar.width();
        let totalTime = Number(notebar.data("totaltime"));
        body.mousemove(function (e) {
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

            let count = 0;
            $(".note", notebar).each(function () {
                let notepos = $(this).offset().left;
                if (notepos >= startpos && notepos <= endpos) count++;
            });

            let selectedTime = ((endpos - startpos) / notebarWidth * totalTime / 1000).toFixed(2);

            tooltipInner.html(count + " note" + (count !== 1 ? "s" : "") + "<br>" + selectedTime + " seconds");
            tooltip.css({"left": (startpos + endpos) / 2, "top": notebarPos.top});
            selector.css({"left": startpos - notebarPos.left, "width": endpos - startpos});
        });
        body.mouseup(function () {
            body.off("mousemove").off("mouseup");
            selecting = false;
            selector.remove();
            tooltip.css({"left": 0, "top": 0});
        });
    });

    // gimmick mouseover
    let gimmickmarkers = $(".notebar .gimmick", noteMap);
    let gimmickinfos = $(".detailinfo .gimmick", noteMap);
    gimmickmarkers.on("mouseover touchstart", function () {
        if (selecting || $(this).hasClass("hidden")) return;
        let gi = $(this).data("gimmick");
        gimmickinfos.each(function () {
            if ($(this).data("gimmick") === gi) {
                let details = $("div", this);
                tooltipInner.html(details[1].innerHTML);
                return false;
            }
        });
        let thismarker = $(".gimmickmarker", this);
        let position = thismarker.offset();
        position.left += thismarker.width() / 2;
        tooltip.css(position);
    });
    gimmickmarkers.mouseout(function () {
        tooltip.css({"left": 0, "top": 0});
    });

    // appeal chance mouseover
    let acmarkers = $(".notebar .appealchance", noteMap);
    let acinfos = $(".detailinfo .appealchance", noteMap);
    acmarkers.on("mouseover touchstart", function () {
        if (selecting) return;
        let ai = $(this).data("ac");
        acinfos.each(function () {
            if ($(this).data("ac") === ai) {
                let details = $("div", this);
                tooltipInner.html("<b>" + details[0].innerHTML.split(":")[1] + "</b><br>" + details[1].innerHTML);
                return false;
            }
        });
        let position = $(this).offset();
        position.left += $(this).width() / 2;
        tooltip.css(position);
    });
    acmarkers.mouseout(function () {
        tooltip.css({"left": 0, "top": 0});
    });

    // gimmick filtering
    gimmickinfos.click(function () {
        if ($(this).hasClass("filtered")) {
            $(this).removeClass("filtered");
            gimmickmarkers.removeClass("hidden filtered");
        } else {
            gimmickinfos.removeClass("filtered");
            $(this).addClass("filtered");
            let gi = $(this).data("gimmick");
            gimmickmarkers.each(function () {
                if ($(this).data("gimmick") === gi) {
                    $(this).removeClass("hidden");
                    $(this).addClass("filtered");
                } else {
                    $(this).removeClass("filtered");
                    $(this).addClass("hidden");
                }
            });
        }
    });
}
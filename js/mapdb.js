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

$(function () {
    M.AutoInit();
    let tabs = M.Tabs.getInstance($("nav .tabs")[0]);
    tabs.options.onShow = function(e) {
        let tab = $(e);
        if (tab.data("loaded") === undefined) {
            tab.data("loaded", 1);
            let type = tab.data("type");
            if (type === "fixed") {
                // tab already has content - don't do anything
                tab.removeClass("unloaded");
                return;
            }

            // Load tab content, delay initialization until loaded
            tab.load(tab.attr("id") + ".html", function(response) {
                tab.removeClass("unloaded");
                tab.html(response);

                if (type === "free") {
                    // do initialization for a Free Live collection (map collapsibles on first level)
                } else if (type === "dlp") {
                    // do initialization for a DLP floor collection (map collapsibles on second level)
                } else if (type === "top") {
                    // do initialization for the Rankings page (logic on links/buttons)
                }
            });
        }
    }
});

function doTabInit() {
    let tooltip = $(".tooltip");
    let tooltipInner = $(".tooltip-inner");
    let body = $("body");

    $(".collapsible").each(function () {
        let collapsible = M.Collapsible.getInstance(this);
        if (IS_MAP_DB) {
            // notemap database
            let tab_elements = $(".tabs", this);
            let story_tabs = undefined;
            if (tab_elements.length === 0) return true; // page help collapsible
            if (tab_elements.length > 1) story_tabs = M.Tabs.getInstance(tab_elements[1]);
            let tabs = M.Tabs.getInstance(tab_elements[0]);

            if (window.location.hash.startsWith("#live")) {
                let tabId = window.location.hash.substring(5);
                let wantedTab = $("#" + tabId, this);
                if (wantedTab.length > 0) {
                    if ($(this).hasClass("unavail")) {
                        $(".container").addClass("show-unavail");
                        $("#show_unavail").text("click to hide unavailable songs");
                    }

                    // add padding at bottom to successfully scroll to divs at the end of the page
                    body.css({"padding-bottom": "500%"});
                    setTimeout(function () {
                        body.css({"padding-bottom": 0, "transition": "padding-bottom .5s"})
                    }, 300);
                    collapsible.open();

                    if (tabId.startsWith("3")) {
                        // this is a Story Stage - open up the parent tab
                        tabs.select($(this).data("live-id") + "-story");
                        story_tabs.select(tabId);
                        $(".tab > a", tab_elements[1]).each(function () {
                            if ($(this).attr("href").substring(1) === tabId) {
                                $(tab_elements[1]).scrollLeft($(this).parent().position().left);
                            }
                        });
                    } else {
                        tabs.select(tabId);
                    }
                    window.scrollTo(0, $(this).position().top);
                }
            }

            // materialize doesn't set indicator positions inside hidden elements, so we'll do it ourselves on open
            // we can also use it to set the location anchor to link to that live difficulty
            collapsible.options.onOpenStart = function () {
                let tabelement = $(".tabs", this.el)[0];
                fixTabIndicator(tabelement);
                let activetablink = $(".active", tabelement);

                if (activetablink.attr("href").endsWith("story")) {
                    window.location.hash = "live" + $(".active", "#" + activetablink.attr("href").substring(1)).attr("href").substring(1);
                } else {
                    window.location.hash = "live" + activetablink.attr("href").substring(1);
                }
            };

            tabs.options.onShow = function (e) {
                if ($(e).attr("id").endsWith("story")) {
                    M.Tabs.getInstance($(".tabs", e)[0]).updateTabIndicator();
                    window.location.hash = "live" + $(".active", e).attr("href").substring(1);
                } else {
                    window.location.hash = "live" + $(e).attr("id");
                }
            };

            if (story_tabs !== undefined) {
                story_tabs.options.onShow = function (e) {
                    window.location.hash = "live" + $(e).attr("id");
                };
            }
        } else {
            // DLP Stage List

            if (window.location.hash.startsWith("#floor")) {
                if ($(this).data("floor") !== undefined) {
                    if ($(this).data("floor") == window.location.hash.substring(6)) {
                        // add padding at bottom to successfully scroll to divs at the end of the page
                        body.css({"padding-bottom": "500%"});
                        setTimeout(function () {
                            body.css({"padding-bottom": 0, "transition": "padding-bottom .5s"});
                        }, 300);
                        collapsible.open();
                        window.scrollTo(0, $(this).position().top);
                    }
                } else if ($(this).data("tower") == window.location.hash.substring(6, 11)) {
                    collapsible.open();
                }
            } else if (window.location.hash.startsWith("#tower")) {
                if ($(this).data("tower") == window.location.hash.substring(6)) {
                    // add padding at bottom to successfully scroll to divs at the end of the page
                    body.css({"padding-bottom": "500%"});
                    setTimeout(function () {
                        body.css({"padding-bottom": 0, "transition": "padding-bottom .5s"});
                    }, 300);
                    collapsible.open();
                    window.scrollTo(0, $(this).position().top);
                }
            }

            collapsible.options.onOpenStart = function () {
                if ($(this).data("floor") !== undefined) {
                    window.location.hash = "floor" + $(this).data("floor");
                } else {
                    window.location.hash = "tower" + $(this).data("tower");
                }
            }.bind(this);
        }

        collapsible.options.onCloseStart = function () {
            window.location.hash = "_";
        };

        if ($(this).data("tower") === undefined) {
            $(".live-difficulty", this).each(function () {
                let selecting = false;
                // note measure
                // TODO: add support for touch events on mobile... how?
                let notebar = $(".notebar", this);
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
                        $(this).off("mousemove").off("mouseup");
                        selecting = false;
                        selector.remove();
                        tooltip.css({"left": 0, "top": 0});
                    });
                });

                // gimmick mouseover
                let gimmickmarkers = $(".notebar .gimmick", this);
                let gimmickinfos = $(".detailinfo .gimmick", this);
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
                let acmarkers = $(".notebar .appealchance", this);
                let acinfos = $(".detailinfo .appealchance", this);
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
            });
        }
    });

    $(".rankingtable").each(function () {
        let table = $(this);
        $(".btn", this).click(function () {
            table.addClass("open");
        });
        $("small.right", table.parent()).click(function () {
            table.addClass("show-all");
            $(this).remove();
        });
    });

    if (IS_MAP_DB) {
        // filter field for map db
        $("input#filter").keyup(function(e) {
            if (current_filter_timeout !== undefined) {
                clearTimeout(current_filter_timeout);
            }
            current_filter_timeout = setTimeout(function() {
                filterCollapsibles(e.target.value);
            }, 500);
        });
    }
}
/*
This file generates the map database page from all the files in the mapdb folder.
Copyright (C) 2020-2021 Suyooo

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

const fs = require('fs');
const settings = require('./settings.js');
const notemap = require('./notemap-reader.js');
const minify = require('html-minifier').minify;
const hash = require('object-hash');

const WEEKDAYS = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function guess_story_stage_difficulty(stage) {
    let minimum_difference = stage.notes.length;
    let minimum_difficulty = 10;
    for (let difficulty = 0; difficulty <= 2; difficulty++) {
        let live = songdata[live_difficulty_ids[stage.live_id][difficulty]];
        if (live === undefined || live.notes === null) continue;
        let difference = Math.abs(stage.notes.length - live.notes.length);
        if (difference < minimum_difference) {
            minimum_difference = difference;
            minimum_difficulty = live.song_difficulty;
        }
    }
    return notemap.difficulty_short(minimum_difficulty);
}

function dump(group, s, has) {
    if (!has) {
        s += "<div class='no-available-songs'>This group currently has no available songs. Click the button in the " +
            "header to show data from unavailable songs.</div>"
    }
    fs.writeFile('build/' + group + '.html', minify(s, {
            collapseWhitespace: true
        }),
        function (err) {
            if (err) {
                return console.log(err);
            }
        }
    );
}

let hashes = {};
if (fs.existsSync("build/lives/hash.json")) {
    hashes = JSON.parse(fs.readFileSync("build/lives/hash.json"));
}

let lives_dict = {};
let live_difficulty_ids = {};
let songdata = {};

fs.readdirSync("mapdb/.").forEach(function (f) {
    if (f.endsWith(".json")) {
        let ldid = Number(f.substring(0, f.length - 5));
        let isEventLive = -1 !== settings.current_event_live_ids.indexOf(Math.floor(ldid / 1000));

        if (!isEventLive &&                             // Not an Event Variant
            (ldid < 30000000 || ldid >= 40000000) &&    // Not a Story Stage
            ldid >= 20000000) {                         // Not a Free Live
            // ignore
            return;
        }

        // Exceptions: Ignore the temporary daily versions from Bonus Costume campaigns
        // TODO: Probably just replace this with a "prefer permanent versions over dailies" check
        if (ldid == 10003102 || ldid == 10003202 || ldid == 10003302 ||
            ldid == 11014102 || ldid == 11014202 || ldid == 11014302 ||
            ldid == 12034102 || ldid == 12034202 || ldid == 12034302 ||
            ldid == 12074102 || ldid == 12074202 || ldid == 12074302 ||
            ldid == 10011102 || ldid == 10011202 || ldid == 10011302) {
            return;
        }

        songdata[ldid] = JSON.parse(fs.readFileSync('mapdb/' + f));
        let lid = songdata[ldid].live_id;
        if (!live_difficulty_ids.hasOwnProperty(lid)) {
            live_difficulty_ids[lid] = [];
            lives_dict[lid] = {
                "id": lid,
                "order": songdata[ldid].display_order,
                "name": songdata[ldid].song_name,
                "attribute": isEventLive ? 9 : null,
                "is_all_unavailable": isEventLive ? false : true,
                "is_any_permanent": isEventLive ? true : false,
                "daily_weekday": null,
                "default_diff": null
            };
        }

        if (lives_dict[lid].attribute === null || (ldid < 20000000 && songdata[ldid].song_difficulty !== 35 && songdata[ldid].song_difficulty !== 37)) {
            // prefer info from Free Live, non-Adv+ data
            lives_dict[lid].attribute = songdata[ldid].song_attribute;
            lives_dict[lid].daily_weekday = songdata[ldid].extra_info.daily_weekday;
            // default diff should be Advanced if available
            if (songdata[ldid].song_difficulty === 30 && songdata[ldid].extra_info.is_available) lives_dict[lid].default_diff = ldid;
        }
        if (ldid < 20000000) {
            lives_dict[lid].is_all_unavailable = (!songdata[ldid].extra_info.is_available) && lives_dict[lid].is_all_unavailable;
            lives_dict[lid].is_any_permanent = songdata[ldid].extra_info.is_permanent || lives_dict[lid].is_any_permanent;
            if (songdata[ldid].extra_info.is_available) lives_dict[lid].default_diff = lives_dict[lid].default_diff || ldid;
        }

        if (ldid < 30000000) {
            // On Free Live and Event songs, the last digit in the LDID is the version. If it is higher than one, that
            // means there has been an update to it - so we can filter out older versions to make sure to only show
            // the newest versions on the map DB
            let ldidWithoutVer = Math.floor(ldid / 10);

            // Check whether any newer versions already exist
            if (live_difficulty_ids[lid].filter(function (e) {
                return Math.floor(e / 10) === ldidWithoutVer && e > ldid;
            }).length === 0) {
                // If not, make sure to filter out any older versions if there are
                if (ldid % 10 > 1) {
                    live_difficulty_ids[lid] = live_difficulty_ids[lid].filter(function (e) {
                        return Math.floor(e / 10) !== ldidWithoutVer;
                    });
                }
                live_difficulty_ids[lid].push(ldid);
            }
        } else {
            // Story/SBL/DLP/... songs don't use the last digit as version, always add them
            live_difficulty_ids[lid].push(ldid);
        }
    }
});

let s = ''
let current_group = 'muse';
let last_live_id = 0;
let live_pages_built = 0;
let list_update = false;
let has_available_songs = false;

Object.keys(lives_dict).sort(function (a, b) {
    return lives_dict[a].order - lives_dict[b].order;
}).map(function (e) {
    return lives_dict[e];
}).forEach(function (live) {
    //console.log(live);
    live_difficulty_ids[live.id] = live_difficulty_ids[live.id].sort(function (a, b) {
        if (a < 30000000 || b < 30000000) {
        } else {
            // Sort Story Stages by chapter and mode, not LDI (LDIs are only in the same order from Chapter 8 onwards)
            return (songdata[a].extra_info.story_chapter * 1000 + songdata[a].extra_info.story_stage * 10 +
                    (songdata[a].extra_info.story_is_hard_mode ? 1 : 0)) -
                (songdata[b].extra_info.story_chapter * 1000 + songdata[b].extra_info.story_stage * 10 +
                    (songdata[b].extra_info.story_is_hard_mode ? 1 : 0));
        }
    });

    // start new section if the next group is up
    if (Math.floor(live.id / 1000) !== Math.floor(last_live_id / 1000)) {
        if (list_update) {
            dump(current_group, s, has_available_songs);
        }
        list_update = has_available_songs = false;
        s = '';
        if (live.id >= 11000 && last_live_id < 11000) current_group = 'aqours';
        if (live.id >= 12000 && last_live_id < 12000) current_group = 'niji';
        if (live.id >= 13000 && last_live_id < 13000) current_group = 'liella';
    }
    last_live_id = live.id;

    if (!live.is_all_unavailable) {
        has_available_songs = true;
    }

    let limitedEnd = undefined;
    if (!live.is_any_permanent && !live.is_all_unavailable) {
        if (settings.limited_song_deadlines.hasOwnProperty(live.id)) {
            limitedEnd = settings.limited_song_deadlines[live.id] * 1000;
        }
    }

    s += '<ul class="collapsible' + (live.is_all_unavailable ? " note unavail" : (!live.is_any_permanent ? " note temp" + (limitedEnd ? " has-date" : "") : (live.daily_weekday !== undefined && live.daily_weekday !== null ? " note daily" : ""))) +
        '" data-collapsible="expandable" data-live-id="' + live.id + '"><li>' +
        '<div class="collapsible-header"><img src="image/icon_' + notemap.attribute(live.attribute) + '.png" ' +
        'alt="' + notemap.attribute(live.attribute) + '">' +
        '<b class="translatable" data-rom="' + notemap.song_name_romaji(live.id) + '"' +
        (live.daily_weekday !== undefined && live.daily_weekday !== null ? " data-weekday=\"" + live.daily_weekday.map(x => WEEKDAYS[x]).join(", ") + "\"" : "") +
        (limitedEnd ? ' data-end="' + limitedEnd + '"' : "") + '>' + live.name + '</b></div><div class="collapsible-body">';

    s += '<ul class="tabs tabs-transparent tabs-fixed-width">';

    let live_tabbar = "";
    let live_tabs = "";
    let story_tabbar = "";
    let story_tabs = "";

    live_difficulty_ids[live.id].forEach(function (live_difficulty_id) {
        //console.log(live_difficulty_id);
        let live_diff = songdata[live_difficulty_id];
        let live_diff_hash = hash(live_diff);

        if (process.argv[2] === "full" || !hashes.hasOwnProperty(live_difficulty_id) || hashes[live_difficulty_id] !== live_diff_hash) {
            list_update = true;

            let tab_content = '<div class="row nomargin">' +

                // Top information
                '<div class="col l6"><b>S Rank: </b>' + notemap.format(live_diff.ranks.S) + '</div>' +
                '<div class="col l6"><b>A Rank: </b>' + notemap.format(live_diff.ranks.A) + '</div>' +
                '<div class="col l6"><b>B Rank: </b>' + notemap.format(live_diff.ranks.B) + '</div>' +
                '<div class="col l6"><b>C Rank: </b>' + notemap.format(live_diff.ranks.C) + '</div>' +
                '<div class="col l6"><b>Recommended Stamina: </b>' + notemap.format(live_diff.recommended_stamina) + '</div>' +
                '<div class="col l6"><b>Base Note Damage: </b>' + notemap.format(live_diff.note_damage) + '</div></div>' +

                // Create the note map
                notemap.make(live_diff);

            fs.writeFile('build/lives/' + live_difficulty_id + '.html', minify(tab_content, {
                    collapseWhitespace: true
                }),
                function (err) {
                    if (err) {
                        return console.log(err);
                    }
                }
            );

            hashes[live_difficulty_id] = live_diff_hash;
            live_pages_built++;
        }

        // If no default diff was set, use Advanced
        let this_tabbar = '<li class="tab"><a href="#' + live_difficulty_id + '"' +
            ((live.default_diff == live_difficulty_id || (live.default_diff === null && live_diff.song_difficulty === 30 && live_difficulty_id < 30000000)) ?
                ' class="active"' : '') + ' tabindex="-1">';

        if (live_difficulty_id < 30000000) {
            // Full difficulty name for free lives, attribute only if it differs (for example, SnowHala Adv+)
            this_tabbar += notemap.difficulty(live_diff.song_difficulty) + (live_diff.song_attribute != live.attribute ?
                    ' <img src="image/icon_' + notemap.attribute(live_diff.song_attribute) + '.png" alt="' +
                    notemap.attribute(live_diff.song_attribute) + '">' : '') +
                (live_difficulty_id < 20000000 && !live_diff.extra_info.is_available && !live.is_all_unavailable ?
                    '<i class="material-icons" title="Unavailable">event_busy</i>' : '');
        } else {
            // Shortened difficulty plus location for story stages, always show attribute
            this_tabbar += (live_diff.extra_info.story_chapter < 20 ? "" :
                    (live_diff.extra_info.story_is_hard_mode ? "Hard" : "Normal") + " ") + live_diff.extra_info.story_chapter +
                '-' + live_diff.extra_info.story_stage + ' (' + guess_story_stage_difficulty(live_diff) +
                ' <img src="image/icon_' + notemap.attribute(live_diff.song_attribute) + '.png" alt="' +
                notemap.attribute(live_diff.song_attribute) + '">)'
        }
        this_tabbar += '</a></li>';

        let this_tab = '<div class="live-difficulty unloaded" id="' + live_difficulty_id + '">Loading...</div>';

        if (live_difficulty_id >= 30000000 && live_difficulty_id < 40000000) {
            story_tabbar += this_tabbar;
            story_tabs += this_tab;
        } else {
            live_tabbar += this_tabbar;
            live_tabs += this_tab;
        }
    });

    if (story_tabs.length > 0) {
        s += live_tabbar + '<li class="tab"><a href="#' + live.id + '-story" tabindex="-1">Story Stages</a></li></ul>' +
            live_tabs + '<div id="' + live.id + '-story"><ul class="tabs tabs-transparent tabs-fixed-width" tabindex="-1">' +
            story_tabbar + '</ul>' + story_tabs + '</div></div></li></ul>';
    } else {
        s += live_tabbar + '</ul>' + live_tabs + '</div></li></ul>';
    }
});

if (list_update) {
    dump(current_group, s, has_available_songs);
}
fs.writeFile('build/lives/hash.json', JSON.stringify(hashes),
    function (err) {
        if (err) {
            return console.log(err);
        }
    });
console.log("    Built " + live_pages_built + " Live page(s).");
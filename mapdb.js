/*
This file generates the map database page from all the files in the mapdb folder.
Copyright (C) 2020 Suyooo

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
        let diff_id = Math.floor(ldid / 10) % 100;

        songdata[ldid] = JSON.parse(fs.readFileSync('mapdb/' + f));
        let lid = songdata[ldid].live_id;
        if (!live_difficulty_ids.hasOwnProperty(lid)) {
            live_difficulty_ids[lid] = [];
            lives_dict[lid] = {
                "id": lid,
                "order": songdata[ldid].display_order,
                "name": songdata[ldid].song_name,
                "attribute": isEventLive ? 9 : null,
                "is_available": isEventLive ? true : null,
                "is_permanent": isEventLive ? true : null
            };
        }
        if (lives_dict[lid].attribute === null || (ldid < 20000000 && diff_id !== 40)) {
            // prefer info from Free Live, non-Adv+ data
            lives_dict[lid].attribute = songdata[ldid].song_attribute;
            lives_dict[lid].is_available = songdata[ldid].extra_info.is_available;
            lives_dict[lid].is_permanent = songdata[ldid].extra_info.is_permanent;
        }
        if (ldid < 30000000) {
            // On Free Live and Event songs, the last digit in the LDID is the version. If it is higher than one, that
            // means there has been an update to it - so we can filter out older versions to make sure to only show
            // the newest versions on the map DB
            let ldidWithoutVer = Math.floor(ldid / 10);

            // Check whether any newer versions already exist
            if (live_difficulty_ids[lid].filter(function(e) {
                return Math.floor(e / 10) === ldidWithoutVer && e > ldid;
            }).length === 0) {
                // If not, make sure to filter out any older versions if there are
                if (ldid % 10 > 1) {
                    live_difficulty_ids[lid] = live_difficulty_ids[lid].filter(function(e) {
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

let s = '<h5 id="muse">µ\'s</h5>'

let last_live_id = 0;

Object.keys(lives_dict).sort(function (a, b) {
    return lives_dict[a].order - lives_dict[b].order;
}).map(function (e) {
    return lives_dict[e];
}).forEach(function (live) {
    //console.log(live);
    live_difficulty_ids[live.id] = live_difficulty_ids[live.id].sort(function (a, b) {
        if (a < 30000000 || b < 30000000) {
            return a - b;
        } else {
            // Sort Story Stages by chapter and mode, not LDI (LDIs are only in the same order from Chapter 8 onwards)
            return (songdata[a].extra_info.story_chapter * 1000 + songdata[a].extra_info.story_stage * 10 +
                (songdata[a].extra_info.story_is_hard_mode ? 1 : 0)) -
                (songdata[b].extra_info.story_chapter * 1000 + songdata[b].extra_info.story_stage * 10 +
                    (songdata[b].extra_info.story_is_hard_mode ? 1 : 0));
        }
    });

    // start new section if the next group is up
    if (live.id >= 11000 && last_live_id < 11000) s += '<h5 id="aqours">Aqours</h5>';
    if (live.id >= 12000 && last_live_id < 12000) s += '<h5 id="niji">Nijigaku</h5>';
    if (live.id >= 13000 && last_live_id < 13000) s += '<h5 id="liella">Liella!</h5>';
    last_live_id = live.id;

    s += '<ul class="collapsible' + (!live.is_available ? " unavail" : (!live.is_permanent ? " temp" : "")) +
        '" data-collapsible="expandable" data-live-id="' + live.id + '"><li>' +
        '<div class="collapsible-header"><img src="image/icon_' + notemap.attribute(live.attribute) + '.png" ' +
        'alt="' + notemap.attribute(live.attribute) + '">' +
        '<b class="translatable" data-rom="' + notemap.song_name_romaji(live.id) + '">' + live.name +
        '</b>' + (!live.is_available ? "&nbsp;(unavailable)" : (!live.is_permanent ? "&nbsp;(time-limited)" : "")) +
        '</div><div class="collapsible-body">';

    let warning = undefined;
    if (live.id === 12040) warning = "If you are playing on the JP server, you're probably looking for <a onClick='showLive(12057,false)'>the 3D MV version of <span class='translatable' data-rom='Nijiiro Passions!'>虹色Passions！</span></a> instead of this song.";
    else if (live.id === 12057) warning = "If you are playing on the WW server, you're probably looking for <a onClick='showLive(12040,false)'>the 2D MV version of <span class='translatable' data-rom='Nijiiro Passions!'>虹色Passions！</span></a> instead of this song.";
    if (warning) {
        s += '<div class="live-warning"><b>HEADS UP:</b> ' + warning + '</div>';
    }

    s += '<ul class="tabs tabs-transparent tabs-fixed-width">';

    let live_tabbar = "";
    let live_tabs = "";
    let story_tabbar = "";
    let story_tabs = "";

    live_difficulty_ids[live.id].forEach(function (live_difficulty_id) {
        //console.log(live_difficulty_id);
        let live_diff = songdata[live_difficulty_id];
        let diff_id = Math.floor(live_difficulty_id % 1000 / 10);

        // Mark the Advanced difficulty as the initially open tab
        let this_tabbar = '<li class="tab"><a href="#' + live_difficulty_id + '"' +
            (diff_id === 30 && live_difficulty_id < 30000000 ? ' class="active"' : '') + '>';

        if (live_difficulty_id < 30000000) {
            // Full difficulty name for free lives, attribute only if it differs (for example, SnowHala Adv+)
            this_tabbar += notemap.difficulty(diff_id) + (live_diff.song_attribute != live.attribute ?
                ' <img src="image/icon_' + notemap.attribute(live_diff.song_attribute) + '.png" alt="' +
                notemap.attribute(live_diff.song_attribute) + '">' : '');
        } else {
            // Shortened difficulty plus location for story stages, always show attribute
            this_tabbar += (live_diff.extra_info.story_chapter < 20 ? "" :
                (live_diff.extra_info.story_is_hard_mode ? "HARD" : "NORMAL") + " ") + live_diff.extra_info.story_chapter +
            '-' + live_diff.extra_info.story_stage + ' (' + guess_story_stage_difficulty(live_diff) +
            ' <img src="image/icon_' + notemap.attribute(live_diff.song_attribute) + '.png" alt="' +
            notemap.attribute(live_diff.song_attribute) + '">)'
        }
        this_tabbar += '</a></li>';

        let this_tab = '<div class="live-difficulty" id="' + live_difficulty_id + '"><div class="row nomargin">' +

            // Top information
            '<div class="col l6"><b>S Rank: </b>' + notemap.format(live_diff.ranks.S) + '</div>' +
            '<div class="col l6"><b>A Rank: </b>' + notemap.format(live_diff.ranks.A) + '</div>' +
            '<div class="col l6"><b>B Rank: </b>' + notemap.format(live_diff.ranks.B) + '</div>' +
            '<div class="col l6"><b>C Rank: </b>' + notemap.format(live_diff.ranks.C) + '</div>' +
            '<div class="col l6"><b>Recommended Stamina: </b>' + notemap.format(live_diff.recommended_stamina) + '</div>' +
            '<div class="col l6"><b>Base Note Damage: </b>' + notemap.format(live_diff.note_damage) + '</div></div>' +

            // Create the note map
            notemap.make(live_diff) + '</div>';

        if (live_difficulty_id >= 30000000 && live_difficulty_id < 40000000) {
            story_tabbar += this_tabbar;
            story_tabs += this_tab;
        } else {
            live_tabbar += this_tabbar;
            live_tabs += this_tab;
        }
    });

    if (story_tabs.length > 0) {
        s += live_tabbar + '<li class="tab"><a href="#' + live.id + '-story">STORY STAGES</a></li></ul>' +
            live_tabs + '<div id="' + live.id + '-story"><ul class="tabs tabs-transparent tabs-fixed-width">' +
            story_tabbar + '</ul>' + story_tabs + '</div></div></li></ul>';
    } else {
        s += live_tabbar + '</ul>' + live_tabs + '</div></li></ul>';
    }
});

let layout = fs.readFileSync('index.html').toString();
fs.writeFile('build/index.html', minify(layout.replace("$SONGDB", s), {
        collapseWhitespace: true
    }),
    function (err) {
        if (err) {
            return console.log(err);
        }
    }
);
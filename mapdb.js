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

const CURRENT_EVENT_LIVE_ID = 20060;

const fs = require('fs');
const notemap = require('./notemap-reader.js');
const minify = require('html-minifier').minify;

let lives = [];
let live_difficulty_ids = {};
let songdata = {};

fs.readdirSync("mapdb/.").forEach(function (f) {
    if (f.endsWith(".json")) {
        let ldid = Number(f.substring(0, f.length - 5));
        if ((Math.floor(ldid / 1000) !== CURRENT_EVENT_LIVE_ID) && // Not an Event Variant
            (ldid < 30000000 || ldid >= 40000000) &&                  // Not a Story Stage
            ldid >= 20000000) {                                       // Not a Free Live
            // ignore
            return;
        }

        songdata[ldid] = JSON.parse(fs.readFileSync('mapdb/' + f));
        let lid = songdata[ldid].live_id;
        if (!live_difficulty_ids.hasOwnProperty(lid)) {
            live_difficulty_ids[lid] = [];
            lives.push({
                "id": lid,
                "order": songdata[ldid].display_order,
                "name": songdata[ldid].song_name,
                "attribute": songdata[ldid].song_attribute
            });
        }
        live_difficulty_ids[lid].push(ldid);
    }
});

lives = lives.sort(function (a, b) {
    return a.order - b.order;
});
lives.forEach(function (e) {
    live_difficulty_ids[e.id] = live_difficulty_ids[e.id].sort();
});

let layout = fs.readFileSync('index.html').toString();
let s = '<h5 id="muse">µ\'s</h5>'

let last_live_id = 0;
lives.forEach(function (live) {
    // start new section if the next group is up
    if (live.id >= 11000 && last_live_id < 11000) s += '<h5 id="aqours">Aqours</h5>';
    if (live.id >= 12000 && last_live_id < 12000) s += '<h5 id="niji">Nijigaku</h5>';
    last_live_id = live.id;

    s += '<ul class="collapsible" data-collapsible="expandable"><li>' +
        '<div class="collapsible-header">' +
        '<img src="image/icon_' + notemap.attribute(live.attribute) + '.png" ' +
        'alt="' + notemap.attribute(live.attribute) + '">' +
        '<b class="song_name" data-en="' + notemap.song_name_romaji(live.id) + '">' + live.name +
        '</b></div><div class="collapsible-body"><ul class="tabs tabs-transparent tabs-fixed-width">';

    let live_tabs = "";

    live_difficulty_ids[live.id].forEach(function (live_difficulty_id) {
        let live = songdata[live_difficulty_id];
        let diff_id = Math.floor(live_difficulty_id % 1000 / 10);

        s += '<li class="tab"><a href="#' + live_difficulty_id + '"' +
            // Mark the Advanced difficulty as the initially open tab
            (diff_id === 30 && live_difficulty_id < 30000000 ? ' class="active"' : '') + '>' +

            // Full difficulty name for free lives, shortened difficulty plus location and attribute for story stages
            (live_difficulty_id < 30000000 ? notemap.difficulty(diff_id) : "STORY " + live.extra_info.story_chapter +
                '-' + live.extra_info.story_stage + ' (' + notemap.difficulty_short(live.song_difficulty) +
                ' <img src="image/icon_' + notemap.attribute(live.song_attribute) + '.png" alt="' +
                notemap.attribute(live.song_attribute) + '">)') + '</a></li>';

        let this_tab = '<div class="live-difficulty" id="' + live_difficulty_id + '">' + '<div class="row nomargin">' +

            // Top information
            '<div class="col l6"><b>S Rank: </b>' + notemap.format(live.ranks.S) + '</div>' +
            '<div class="col l6"><b>A Rank: </b>' + notemap.format(live.ranks.A) + '</div>' +
            '<div class="col l6"><b>B Rank: </b>' + notemap.format(live.ranks.B) + '</div>' +
            '<div class="col l6"><b>C Rank: </b>' + notemap.format(live.ranks.C) + '</div>' +
            '<div class="col l6"><b>Recommended Stamina: </b>' + notemap.format(live.recommended_stamina) + '</div>' +
            '<div class="col l6"><b>Base Note Damage: </b>' + notemap.format(live.note_damage) + '</div></div>' +

            // Create the note map
            notemap.make(live) + '</div>';

        live_tabs += this_tab;
    });

    s += '</ul>' + live_tabs + '</div></li></ul>';
});

fs.writeFile('build/index.html', minify(layout.replace("$SONGDB", s), {
        collapseWhitespace: true
    }),
    function (err) {
        if (err) {
            return console.log(err);
        }
    }
);
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

const CURRENT_EVENT_ID = 20060;

const fs = require('fs');
const notemap = require('./notemap-reader.js');
const minify = require('html-minifier').minify;

let live_ids = [];
let story_ids = {};
let songdata = {};

fs.readdirSync("mapdb/.").forEach(function (f) {
    if (f.endsWith(".json")) {
        let lid = Number(f.substring(0, f.length - 5));
        if (lid < 20000000 || Math.floor(lid / 1000) === CURRENT_EVENT_ID) {
            songdata[lid] = JSON.parse(fs.readFileSync('mapdb/' + lid + '.json'));
            live_ids.push(lid);
        } else if (lid >= 30000000 && lid < 40000000) {
            songdata[lid] = JSON.parse(fs.readFileSync('mapdb/' + lid + '.json'));
            if (!story_ids.hasOwnProperty(songdata[lid].song_name)) {
                story_ids[songdata[lid].song_name] = [];
            }
            story_ids[songdata[lid].song_name].push(lid);
        }
    }
});

live_ids = live_ids.sort(function (a, b) {
    let do_comp = songdata[a].display_order - songdata[b].display_order;

    // same live id => sort by difficulty id, which results in a sort by difficulty
    if (do_comp !== 0) return do_comp;
    else return a - b;
});

for (let li = live_ids.length - 1; li >= 0; li--) {
    let song_name = songdata[live_ids[li]].song_name;
    // add story songs into list at the right index (after Free Live)
    if (story_ids.hasOwnProperty(song_name)) {
        for (let si = 0; si < story_ids[song_name].length; si++) {
            live_ids.splice(li + 1, 0, story_ids[song_name][si]);
            li++;
        }
        delete story_ids[song_name];
    }
}

let layout = fs.readFileSync('index.html').toString();
let s = '<h5 id="muse">µ\'s</h5>'

let last_live_id = 0;
let current_tabs = "";
for (let li = 0; li < live_ids.length; li++) {
    let live_difficulty_id = live_ids[li];
    let live = songdata[live_difficulty_id];
    let diff_id = Math.floor(live_difficulty_id % 1000 / 10);

    // new song begins
    if (live_difficulty_id < 30000000) {
        if (Math.floor(live_difficulty_id / 1000) != Math.floor(last_live_id / 1000)) {
            if (li > 0) {
                // end the previous dropdown if we're not at the first song
                s += '</ul>' + current_tabs + '</div></li></ul>';
            }
            current_tabs = "";

            if (Math.floor(live_difficulty_id / 1000) !== CURRENT_EVENT_ID) {
                if (live_difficulty_id >= 11000000 && last_live_id < 11000000) s += '<h5 id="aqours">Aqours</h5>';
                if (live_difficulty_id >= 12000000 && last_live_id < 12000000) s += '<h5 id="niji">Nijigaku</h5>';
            }

            s += '<ul class="collapsible" data-collapsible="expandable"><li>' +
                '<div class="collapsible-header">' +
                '<img src="image/icon_' + notemap.attribute(live.song_attribute) + '.png" ' +
                'alt="' + notemap.attribute(live.song_attribute) + '">' +
                '<b>' + live.song_name + '</b></div>' +
                '<div class="collapsible-body"><ul class="tabs tabs-transparent tabs-fixed-width">';
        }
        last_live_id = live_difficulty_id;
    }

    s += '<li class="tab"><a href="#' + live_difficulty_id + '"' +
        (diff_id === 30 && live_difficulty_id < 30000000 ? ' class="active"' : '') + '>' +
        (live_difficulty_id < 30000000 ? notemap.difficulty(diff_id) : "STORY " +
            notemap.difficulty_short(live.song_difficulty) + ' <img src="image/icon_' +
            notemap.attribute(live.song_attribute) + '.png" alt="' +
            notemap.attribute(live.song_attribute) + '">') + '</a></li>';

    current_tabs += '<div class="live-difficulty" id="' + live_difficulty_id + '">' +
        '<div class="row nomargin"><div class="col l6"><b>S Rank: </b>' + notemap.format(live.ranks.S) + '</div>' +
        '<div class="col l6"><b>A Rank: </b>' + notemap.format(live.ranks.A) + '</div></div>' +
        '<div class="row nomargin"><div class="col l6"><b>B Rank: </b>' + notemap.format(live.ranks.B) + '</div>' +
        '<div class="col l6"><b>C Rank: </b>' + notemap.format(live.ranks.C) + '</div></div>' +
        '<div class="row nomargin"><div class="col l6"><b>Recommended Stamina: </b>' + notemap.format(live.recommended_stamina) + '</div>' +
        '<div class="col l6"><b>Base Note Damage: </b>' + notemap.format(live.note_damage) + '</div></div>';

    current_tabs += notemap.make(live) + '</div>';
}
s += '</ul>' + current_tabs + '</div></li></ul>';

fs.writeFile('build/index.html', minify(layout.replace("$SONGDB", s), {
        collapseWhitespace: true
    }),
    function (err) {
        if (err) {
            return console.log(err);
        }
    }
);
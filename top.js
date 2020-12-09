/*
This file generates the top rankings page from all the files in the mapdb folder.
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

let songs_dict = {};

fs.readdirSync("mapdb/.").forEach(function (f) {
    if (f.endsWith(".json")) {
        let ldid = Number(f.substring(0, f.length - 5));
        let isEventLive = Math.floor(ldid / 1000) === settings.current_event_live_id;
        if (ldid >= 20000000 && !isEventLive) {
            return;
        }

        let json = JSON.parse(fs.readFileSync('mapdb/' + f));
        let lid = (json.live_id % 10000 + "").padStart(4, "0");
        let diff_id = Math.floor(ldid / 10) % 100;
        if (diff_id === 40) {
            return;
        }

        if (!songs_dict.hasOwnProperty(lid)) {
            songs_dict[lid] = {
                "name": '<span class="translatable" data-rom="' + notemap.song_name_romaji(json.live_id) + '">' + json.song_name + '</span>',
                "attribute": json.song_attribute,
                "length": json.song_length,
                "notes": json.notes.length,
                "is_available": isEventLive ? true : json.extra_info.is_available,
                "can_show_on_profile": isEventLive ? false : json.extra_info.can_show_on_profile
            };
        } else {
            if (json.notes.length > songs_dict[lid].notes) {
                songs_dict[lid].notes = json.notes.length;
            }
        }
    }

    /* Manual additions: songs that I was unable to dump before they disappeared - but I still know stuff! */
    songs_dict["0118"] = {
        "name": '<span class="translatable" data-rom="A song for You! You? You!!">A song for You! You? You!!</span>',
        "attribute": 4,
        "length": 121867,
        "notes": 188,
        "is_available": false,
        "can_show_on_profile": false
    };
    songs_dict["1080"] = {
        "name": '<span class="translatable" data-rom="New Romantic Sailors">New Romantic Sailors</span>',
        "attribute": 1,
        "length": 120838,
        "notes": 179,
        "is_available": false,
        "can_show_on_profile": false
    };
    songs_dict["1081"] = {
        "name": '<span class="translatable" data-rom="Braveheart Coaster">Braveheart Coaster</span>',
        "attribute": 4,
        "length": 120215,
        "notes": 182,
        "is_available": false,
        "can_show_on_profile": false
    };
    songs_dict["1082"] = {
        "name": '<span class="translatable" data-rom="Amazing Travel DNA">Amazing Travel DNA</span>',
        "attribute": 6,
        "length": 109635,
        "notes": 163,
        "is_available": false,
        "can_show_on_profile": false
    };
    songs_dict["2020"] = {
        "name": '<span class="translatable" data-rom="Love U my friends(2D)">Love U my friends(2D)</span>',
        "attribute": 4,
        "length": 0,
        "notes": 176,
        "is_available": false,
        "can_show_on_profile": false
    };
});

let songs = Object.keys(songs_dict).map(function (e) {
    return songs_dict[e];
});

let short = "";
let most = "";

let r = 1;
songs.filter(function (e) {
    return e.length > 0;
}).sort(function (a, b) {
    return a.length - b.length;
}).forEach(function (e) {
    let min = Math.floor(e.length / 60000);
    let sec = e.length % 60000 / 1000;

    let classStr = !e.is_available ? "hidden" : (r++ % 2 === 0) ? "odd" : "";
    if (r > 11) classStr += " hide-if-narrow";
    if (classStr !== "") classStr = " class='" + classStr.trim() + "'";

    short += "<tr" + classStr + "><td></td><td style=\"background-image: url('image/icon_" + notemap.attribute(e.attribute) +
        ".png')\">&nbsp;</td><td>" + e.name + "</td><td>" + min + ":" + (sec.toFixed(3) + "").padStart(6, "0") + "</td></tr>";
});

r = 1;
songs.filter(function (e) {
    return e.notes > 0;
}).sort(function (a, b) {
    return b.notes - a.notes;
}).forEach(function (e) {
    let classStr = !e.can_show_on_profile ? "hidden" : (r++ % 2 === 0) ? "odd" : "";
    if (r > 11) classStr += " hide-if-narrow";
    if (classStr !== "") classStr = " class='" + classStr.trim() + "'";

    most += "<tr" + classStr + "><td></td><td style=\"background-image: url('image/icon_" + notemap.attribute(e.attribute) +
        ".png')\">&nbsp;</td><td>" + e.name + "</td><td>" + e.notes + "</td></tr>";
});

let layout = fs.readFileSync('top.html').toString();
fs.writeFile('build/top.html', minify(layout.replace("$SHORT", short).replace("$MOST", most), {
        collapseWhitespace: true
    }),
    function (err) {
        if (err) {
            return console.log(err);
        }
    }
);
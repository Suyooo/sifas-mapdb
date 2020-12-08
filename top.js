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
const notemap = require('./notemap-reader.js');
const minify = require('html-minifier').minify;

let songs_dict = {};

fs.readdirSync("mapdb/.").forEach(function (f) {
    if (f.endsWith(".json")) {
        let ldid = Number(f.substring(0, f.length - 5));
        if (ldid >= 20000000) {
            return;
        }

        let json = JSON.parse(fs.readFileSync('mapdb/' + f));
        if (!json.extra_info.is_available) {
            return;
        }

        let lid = (json.live_id % 10000 + "").padStart(4, "0");

        if (!songs_dict.hasOwnProperty(lid)) {
            songs_dict[lid] = {
                "name": json.song_name,
                "attribute": json.song_attribute,
                "length": json.song_length,
                "notes": json.extra_info.can_show_on_profile ? json.notes.length : 0
            };
        } else if (json.extra_info.can_show_on_profile) {
            if (json.notes.length > songs_dict[lid].notes) {
                songs_dict[lid].notes = json.notes.length;
            }
        }
    }
});

let songs = Object.keys(songs_dict).map(function(e) { return songs_dict[e]; });

let short = "";
let most = "";

for (let i = 1; i <= 6; i++) {
    short += "<div class=\"col l6\"><table class=\"striped\" style=\"display: table;\"><thead><tr><th style=\"background-image: url('image/icon_" +
        notemap.attribute(i) + ".png')\">&nbsp;</th><th>Song</th><th>Length</th></tr></thead><tbody>";
    most += "<div class=\"col l6\"><table class=\"striped\" style=\"display: table;\"><thead><tr><th style=\"background-image: url('image/icon_" +
        notemap.attribute(i) + ".png')\">&nbsp;</th><th>Song</th><th>Note Count</th></tr></thead><tbody>";

    let attr_songs = songs.filter(function (e) {
        return e.attribute == i;
    })

    let r = 1;
    attr_songs.sort(function (a, b) {
        return a.length - b.length;
    }).slice(0, 3).forEach(function (e) {
        let min = Math.floor(e.length / 60000);
        let sec = e.length % 60000 / 1000;
        short += "<tr><td>" + (r++) + "</td><td>" + e.name + "</td><td>" + min + ":" + sec.toFixed(3) + "</td></tr>";
    });

    r = 1;
    attr_songs.sort(function (a, b) {
        return b.notes - a.notes;
    }).slice(0, 3).forEach(function (e) {
        most += "<tr><td>" + (r++) + "</td><td>" + e.name + "</td><td>" + e.notes + "</td></tr>";
    });

    short += "</tbody></table></div>";
    most += "</tbody></table></div>";
}

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
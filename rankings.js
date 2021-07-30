/*
This file generates the top rankings page from all the files in the mapdb folder.
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

let songs_dict = {};

fs.readdirSync("mapdb/.").forEach(function (f) {
    if (f.endsWith(".json")) {
        let ldid = Number(f.substring(0, f.length - 5));
        let isEventLive = Math.floor(ldid / 1000) === settings.current_event_live_ids[0];
        if (ldid >= 20000000 && !isEventLive) {
            return;
        }

        // Exceptions: Ignore the temporary daily versions from the JP Summer Adventure 2021 campaign
        // TODO: Probably just replace this with a "prefer permanent versions over dailies" check
        if (ldid == 10003102 || ldid == 10003202 || ldid == 10003302 ||
            ldid == 11014102 || ldid == 11014202 || ldid == 11014302 ||
            ldid == 12034102 || ldid == 12034202 || ldid == 12034302) {
            return;
        }

        let json = JSON.parse(fs.readFileSync('mapdb/' + f));
        if (json.notes === null) {
            // ignore preliminary live data without note map info
            return;
        }
        let lid = (json.live_id % 10000 + "").padStart(4, "0");

        if (json.song_difficulty === 30) {
            songs_dict[lid] = {
                "name": '<span class="translatable" data-rom="' + notemap.song_name_romaji(json.live_id) + '">' + json.song_name + '</span>',
                "is_advplus": false,
                "live_id": lid,
                "attribute": json.song_attribute,
                "length": json.song_length,
                "notes": json.notes.length,
                "is_available": isEventLive ? true : json.extra_info.is_available,
                "can_show_on_profile": isEventLive ? false : json.extra_info.can_show_on_profile,
                "linked_live_id": ldid
            };
        } else if (json.song_difficulty === 35) {
            songs_dict[lid+"plus"] = {
                "name": '<span class="translatable" data-rom="' + notemap.song_name_romaji(json.live_id) + '">' + json.song_name + '</span> (Adv+)',
                "is_advplus": true,
                "live_id": lid,
                "attribute": json.song_attribute,
                "length": json.song_length,
                "notes": json.notes.length,
                "is_available": isEventLive ? true : json.extra_info.is_available,
                "can_show_on_profile": isEventLive ? false : json.extra_info.can_show_on_profile,
                "linked_live_id": ldid
            };
        } else if (json.song_difficulty === 37) {
            songs_dict[lid+"ch"] = {
                "name": '<span class="translatable" data-rom="' + notemap.song_name_romaji(json.live_id) + '">' + json.song_name + '</span> (Ch)',
                "is_advplus": true,
                "live_id": lid,
                "attribute": json.song_attribute,
                "length": json.song_length,
                "notes": json.notes.length,
                "is_available": isEventLive ? true : json.extra_info.is_available,
                "can_show_on_profile": isEventLive ? false : json.extra_info.can_show_on_profile,
                "linked_live_id": ldid
            };
        }
    }
});

/*
Manual additions: songs that I was unable to dump before they disappeared - but I still know stuff!
Only Adv note counts though - back then, Adv+ map was the same as Adv, no point is showing them twice in Rankings
*/
songs_dict["1080"] = {
    "name": '<span class="translatable" data-rom="New Romantic Sailors">New Romantic Sailors</span>',
    "is_advplus": false,
    "live_id": "1080",
    "attribute": 1,
    "length": 120838,
    "notes": 179,
    "is_available": false,
    "can_show_on_profile": false,
    "linked_live_id": null
};
songs_dict["1081"] = {
    "name": '<span class="translatable" data-rom="Braveheart Coaster">Braveheart Coaster</span>',
    "is_advplus": false,
    "live_id": "1081",
    "attribute": 4,
    "length": 120215,
    "notes": 182,
    "is_available": false,
    "can_show_on_profile": false,
    "linked_live_id": null
};
songs_dict["1082"] = {
    "name": '<span class="translatable" data-rom="Amazing Travel DNA">Amazing Travel DNA</span>',
    "is_advplus": false,
    "live_id": "1082",
    "attribute": 6,
    "length": 109635,
    "notes": 163,
    "is_available": false,
    "can_show_on_profile": false,
    "linked_live_id": null
};
songs_dict["2020"] = {
    "name": '<span class="translatable" data-rom="Love U my friends(2D)">Love U my friends(2D)</span>',
    "is_advplus": false,
    "live_id": "2020",
    "attribute": 4,
    "length": 105592,
    "notes": 176,
    "is_available": false,
    "can_show_on_profile": false,
    "linked_live_id": null
};
songs_dict["2061"] = {
    "name": '<span class="translatable" data-rom="Mirai Harmony">未来ハーモニー</span>',
    "is_advplus": false,
    "live_id": "2061",
    "attribute": 3,
    "length": 110058,
    "notes": 175,
    "is_available": false,
    "can_show_on_profile": false,
    "linked_live_id": null
};

/* Ignore songs for length ranking: Remove old versions of songs that became permanent later */
songs_dict["2020"].length = 0;      // Love U my friends(2D)
songs_dict["2040"].length = 0;      // 虹色Passions！
songs_dict["2041"].length = 0;      // NEO SKY, NEO MAP!
songs_dict["2051"].length = 0;      // 夢がここからはじまるよ
songs_dict["2053"].length = 0;      // Just Believe!!!

/* Avoid mixups */
songs_dict["2040"].name += " (2D)"; // 虹色Passions！
songs_dict["2041"].name += " (2D)"; // NEO SKY, NEO MAP!
songs_dict["2051"].name += " (2D)"; // 夢がここからはじまるよ
songs_dict["2053"].name += " (2D)"; // Just Believe!!!

let songs = Object.keys(songs_dict).map(function (e) {
    return songs_dict[e];
});

let short = "";
let most = "";

let rank = 1;
let fullrank = 1;
let rank_display = 1;
let fullrank_display = 1;
let last = -1;
songs.filter(function (e) {
    if (e.length === 0) return false;
    if (!e.is_advplus) return true;
    if (songs_dict.hasOwnProperty(e.live_id)) return false; // only show Adv+ in timing if there is no Adv version
    return true;
}).sort(function (a, b) {
    return a.length - b.length;
}).forEach(function (e) {
    let min = Math.floor(e.length / 60000);
    let sec = e.length % 60000 / 1000;

    if (e.length != last) {
        rank_display = rank;
        fullrank_display = fullrank;
    }
    fullrank++;
    let classStr = !e.is_available ? "hidden" : (rank++ % 2 === 0) ? "odd" : "";
    if (rank_display >= 11) classStr += " hide-if-narrow";
    if (classStr !== "") classStr = " class='" + classStr.trim() + "'";

    let la = "";
    let lb = "";
    if (e.linked_live_id !== null) {
        la = "<a onClick='window.location.hash=\"live" + e.linked_live_id + "\";'>";
        lb = "</a>";
    }

    short += "<tr" + classStr + "><td><span class='notopen'>" + rank_display + "</span><span class='open'>" + fullrank_display +
        "</span></td><td style=\"background-image: url('image/icon_" + notemap.attribute(e.attribute) +
        ".png')\">&nbsp;</td><td>" + la + e.name + lb + "</td><td>" + min + ":" + (sec.toFixed(3) + "").padStart(6, "0") + "</td></tr>";
    last = e.length;
});

rank = 1;
fullrank = 1;
rank_display = 1;
fullrank_display = 1;
last = -1;
songs.filter(function (e) {
    return e.notes > 0;
}).sort(function (a, b) {
    return b.notes - a.notes;
}).forEach(function (e) {
    if (e.notes != last) {
        rank_display = rank;
        fullrank_display = fullrank;
    }
    fullrank++;
    let classStr = !e.can_show_on_profile ? "hidden" : (rank++ % 2 === 0) ? "odd" : "";
    if (rank_display >= 11) classStr += " hide-if-narrow";
    if (classStr !== "") classStr = " class='" + classStr.trim() + "'";

    let la = "";
    let lb = "";
    if (e.linked_live_id !== null) {
        la = "<a onClick='window.location.hash=\"live" + e.linked_live_id + "\";'>";
        lb = "</a>";
    }

    most += "<tr" + classStr + "><td><span class='notopen'>" + rank_display + "</span><span class='open'>" + fullrank_display +
        "</span></td><td style=\"background-image: url('image/icon_" + notemap.attribute(e.attribute) +
        ".png')\">&nbsp;</td><td>" + la + e.name + lb + "</td><td>" + e.notes + "</td></tr>";
    last = e.notes;
});

let layout = fs.readFileSync('rankings.html').toString();
fs.writeFile('build/rankings.html', minify(layout.replace("$SHORT", short).replace("$MOST", most), {
        collapseWhitespace: true
    }),
    function (err) {
        if (err) {
            return console.log(err);
        }
    }
);
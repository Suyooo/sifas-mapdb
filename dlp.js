/*
This file generates the DLP info page from the tower information in the tower folder.
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
const notemap = require('./notemap-reader.js');
const minify = require('html-minifier').minify;
const hash = require('object-hash');

function tower_name_romaji(tower_id) {
    if (tower_id === 33001) return "Dream Live Parade";
    if (tower_id === 33002) return "Dream Live Parade ~Aqours~";
    if (tower_id === 33003) return "Dream Live Parade ~Nijigaku~";
    if (tower_id === 33004) return "Dream Live Parade ~μ's~";
    if (tower_id === 33005) return "2020 Countdown Live";
    if (tower_id === 33006) return "Dream Live Parade - R On Stage -";
    if (tower_id === 33007) return "Dream Live Parade - Pure / Smile On Stage -";
    if (tower_id === 33008) return "Dream Live Parade - Nijigaku On Stage -";
    if (tower_id === 33009) return "Dream Live Parade - Cool / Active On Stage -";
    if (tower_id === 33010) return "Dream Live Parade Love Live! Nijigasaki High School Idol Club 3rd Live! School Idol Festival ~ Beginning of The Dream ~";
    if (tower_id === 33011) return "Dream Live Parade - Natural / Elegant On Stage -";
    if (tower_id === 33012) return "Dream Live Parade - 3rd Years On Stage -";
    if (tower_id === 33013) return "Dream Live Parade ~Summer Adventure 2021~";
    if (tower_id === 33014) return "Dream Live Parade ~2nd Anniversary~";
    if (tower_id === 33015) return "Dream Live Parade ~We Are Challengers~";
    if (tower_id === 33016) return "Dream Live Parade ~Sp Types On Stage~";
    if (tower_id === 33017) return "Dream Live Parade ~Gd Types On Stage~";
    if (tower_id === 33018) return "Dream Live Parade ~Vo Types On Stage~";
    if (tower_id === 33019) return "All Stars Special Dream Live Parade 2021";
    if (tower_id === 33020) return "Dream Live Parade ~Sk Types On Stage~";
    if (tower_id === 33021) return "Dream Live Parade - Pure / Smile On Stage -";
    if (tower_id === 33022) return "Dream Live Parade - Cool / Active On Stage -";
    if (tower_id === 33023) return "Dream Live Parade - Natural / Elegant On Stage -";
    if (tower_id === 33024) return "Dream Live Parade - 1st Years On Stage -";
    if (tower_id === 33025) return "Dream Live Parade - 2nd Years On Stage -";
    if (tower_id === 33026) return "Dream Live Parade - 3rd Years On Stage -";

    throw new Error('Unknown Romaji Tower Name for ' + tower_id);
}

function tower_name_year(tower_id) {
    if (tower_id === 33007) return "2021";
    if (tower_id === 33009) return "2021";
    if (tower_id === 33011) return "2021";
    if (tower_id === 33012) return "2021";
    if (tower_id === 33021) return "2022";
    if (tower_id === 33022) return "2022";
    if (tower_id === 33023) return "2022";
    if (tower_id === 33026) return "2022";

    return undefined;
}

function make_reward_string(rewards) {
    let rewardstrings = [];
    Object.keys(rewards).sort(function (a, b) {
        // Medals first, stars second
        return Number(b) - Number(a);
    }).forEach(function (k) {
        let itemname;
        if (k === "0") itemname = "star";
        else if (k === "19001") itemname = "medal";
        else if (k === "21041") itemname = "map piece";
        else if (k === "21044") itemname = "memory fragment";
        else if (k === "21059") itemname = "star fragment";
        else throw new Error('Unknown Item ID ' + k);
        rewardstrings.push(notemap.format(rewards[k]) + " " + itemname + (rewards[k] === 1 ? "" : "s"));
    })
    return rewardstrings.join(", ");
}

let hashes_live = {};
let hashes_tower = {};
if (fs.existsSync("build/lives/hash.json")) {
    hashes_live = JSON.parse(fs.readFileSync("build/lives/hash.json"));
}
if (fs.existsSync("build/towers/hash.json")) {
    hashes_tower = JSON.parse(fs.readFileSync("build/towers/hash.json"));
}

let tower_ids = [];
let towerdata = {};

fs.readdirSync("tower/.").forEach(function (f) {
    if (f.endsWith(".json")) {
        let tid = Number(f.substring(0, f.length - 5));
        tower_ids.push(tid);
        towerdata[tid] = JSON.parse(fs.readFileSync('tower/' + tid + '.json'));
    }
});

tower_ids = tower_ids.sort();

let s = "";
let list_update = false;
let live_pages_built = 0;

tower_ids.forEach(function (tower_id) {
    let tower = towerdata[tower_id];
    let tower_content = '<b>Performance Points:</b> ' + tower.pp_at_start +
        ' (+ ' + tower.pp_recovery_limit + ' recoverable)<br><b>PP Recovery Cost:</b> ' + tower.pp_recovery_cost +
        ' loveca stars<br><br>';

    let year = tower_name_year(tower_id);
    if (year === undefined) year = "";
    else year = " (" + year + ")";

    s += '<ul id="' + tower_id + '" class="collapsible tower" data-collapsible="expandable"><li>' +
        '<div class="collapsible-header"><b class="translatable" data-rom="' + tower_name_romaji(tower_id) + year + '">' +
        tower.name + year + '</b></div><div id="tower-floorlist' + tower_id + '" class="collapsible-body tower-floor-list unloaded">' +
        'Loading...</div></li></ul>';

    let tower_hash = hash(tower);
    let tower_update = process.argv[2] === "full" || !hashes_tower.hasOwnProperty(tower_id) || hashes_tower[tower_id] !== tower_hash;

    let floor_no = 1;
    tower["floors"].forEach(function (floor) {
        if (floor.floor_type == 1) {
            tower_content += '<div class="fake-collapsible-header"><div class="spacer">&nbsp;</div>' +
                '<b>Story Node: ' + floor.story_title + '</b></div>';
            tower_content += '<div class="progress">&nbsp;</div>';
            return;
        }

        // Load referenced note map if available
        let linked_live = undefined;
        if (floor["notemap_live_difficulty_id"] !== null) {
            linked_live = JSON.parse(fs.readFileSync('mapdb/' + floor["notemap_live_difficulty_id"] + '.json'));
            linked_live.note_damage = floor.note_damage;
        }

        let floor_hash = hash(floor);
        if (process.argv[2] === "full" || !hashes_live.hasOwnProperty(floor.live_difficulty_id) || hashes_live[floor.live_difficulty_id] !== floor_hash) {
            // Update tower page as well since the header information might have changed
            tower_update = true;

            let floor_content = '<div class="row nomargin">' +
                // Top information
                '<div class="col l6"><b>Voltage Target: </b>' + notemap.format(floor.voltage_target) + '</div>' +
                '<div class="col l6"><b>Difficulty: </b>' + notemap.difficulty(floor.song_difficulty) + '</div>' +
                '<div class="col l6"><b>Clear Reward: </b>' + make_reward_string(floor.reward_clear) + '</div>' +
                '<div class="col l6"><b>Floor Type: </b>' + (floor.floor_type === 5 ? 'Super Stage' : 'Regular') + '</div>' +
                '<div class="col l6"><b>Recommended Stamina: </b>' + notemap.format(floor.recommended_stamina) + '</div>' +
                '<div class="col l6"><b>Base Note Damage: </b>' + notemap.format(floor.note_damage) +
                (floor.note_damage_rate ? ' (' + notemap.format(Math.round(floor.note_damage_rate * 100)) + '% of Free Live)' : '') +
                '</div></div>';

            if (linked_live !== undefined) {
                floor_content += notemap.make(linked_live);
            } else {
                floor_content += notemap.make(floor);
            }

            fs.writeFile('build/lives/' + floor.live_difficulty_id + '.html', minify(floor_content, {
                    collapseWhitespace: true
                }),
                function (err) {
                    if (err) {
                        return console.log(err);
                    }
                }
            );

            hashes_live[floor.live_difficulty_id] = floor_hash;
            live_pages_built++;
        }

        tower_content += '<ul class="collapsible floor" id="' + tower_id + '-' + floor.floor_number + '" data-collapsible="expandable"><li>' +
            '<div class="collapsible-header' + (floor.floor_type === 5 ? ' light-blue lighten-5' : '') + '">' +
            '<img src="image/icon_' + notemap.attribute(floor.song_attribute) + '.png" ' +
            'alt="' + notemap.attribute(floor.song_attribute) + '">' +
            '<b class="floorno">' + (floor_no++) + (floor.notemap_live_difficulty_id === null ? "*" : "") + ')</b>' +
            '<div class="row">' +

            // Header information
            '<div class="col l3"><b class="translatable" data-rom="' + notemap.song_name_romaji(floor.live_id) +
            '"> ' + floor.song_name + ' </b></div>' +
            '<div class="col l3"><b>Target:</b> ' + notemap.format(floor.voltage_target) + '</div>' +
            '<div class="col l3"><b>Cleansable:</b> ' +
            notemap.is_cleansable(linked_live === undefined ? (floor.gimmick === null ? null : floor.gimmick[0]) : (linked_live.gimmick === null ? null : linked_live.gimmick[0])) + '</div>' +
            '<div class="col l3"><b>Note Damage:</b> ' + notemap.format(floor.note_damage) + '</div>' +
            '</div></div><div class="collapsible-body live-difficulty unloaded" id="' + floor.live_difficulty_id + '">Loading...</div></li></ul>';

        if (floor.reward_progress !== null) {
            tower_content += '<div class="progress reward"><b>Progress Reward:</b> ' + make_reward_string(floor.reward_progress) + '</div>';
        } else {
            tower_content += '<div class="progress">&nbsp;</div>';
        }
    });

    if (tower_update) {
        list_update = true;
        fs.writeFile('build/towers/' + tower_id + '.html', minify(tower_content, {
                collapseWhitespace: true
            }),
            function (err) {
                if (err) {
                    return console.log(err);
                }
            }
        );
        hashes_tower[tower_id] = tower_hash;
    }
});

if (list_update) {
    fs.writeFile('build/dlp.html', minify(s, {
            collapseWhitespace: true
        }),
        function (err) {
            if (err) {
                return console.log(err);
            }
        }
    );
}
fs.writeFile('build/lives/hash.json', JSON.stringify(hashes_live),
    function (err) {
        if (err) {
            return console.log(err);
        }
    });
fs.writeFile('build/towers/hash.json', JSON.stringify(hashes_tower),
    function (err) {
        if (err) {
            return console.log(err);
        }
    });
console.log("    Built " + live_pages_built + " Live page(s).");
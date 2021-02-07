/*
This file generates the DLP info page from the tower information in the tower folder.
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

function tower_name_romaji(tower_id) {
    if (tower_id === 33001) return "Dream Live Parade";
    if (tower_id === 33002) return "Dream Live Parade ~Aqours~";
    if (tower_id === 33003) return "Dream Live Parade ~Nijigaku~";
    if (tower_id === 33004) return "Dream Live Parade ~μ's~";
    if (tower_id === 33005) return "2020 Countdown Live";
    if (tower_id === 33006) return "Dream Live Parade - R On Stage -";

    throw new Error('Unknown Romaji Tower Name for ' + tower_id);
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
        else throw new Error('Unknown Item ID ' + k);
        rewardstrings.push(notemap.format(rewards[k]) + " " + itemname + (rewards[k] === 1 ? "" : "s"));
    })
    return rewardstrings.join(", ");
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

tower_ids.forEach(function (tower_id) {
    let tower = towerdata[tower_id];

    s += '<ul id="' + tower_id + '" class="collapsible tower" data-collapsible="expandable"><li>' +
        '<div class="collapsible-header"><b class="translatable" data-rom="' + tower_name_romaji(tower_id) + '">' +
        tower.name + '</b></div><div class="collapsible-body"><b>Performance Points:</b> ' + tower.pp_at_start +
        ' (+ ' + tower.pp_recovery_limit + ' recoverable)<br><b>PP Recovery Cost:</b> ' + tower.pp_recovery_cost +
        ' loveca stars<br><br>';

    let floor_no = 1;
    tower["floors"].forEach(function (floor) {
        if (floor.floor_type == 1) {
            s += '<div class="fake-collapsible-header"><div class="spacer">&nbsp;</div>' +
                '<b>Story Node: ' + floor.story_title + '</b></div>';
            s += '<div class="progress">&nbsp;</div>';
            return;
        }

        // Load referenced note map if available
        let linked_live = undefined;
        if (floor["notemap_live_difficulty_id"] !== null) {
            linked_live = JSON.parse(fs.readFileSync('mapdb/' + floor["notemap_live_difficulty_id"] + '.json'));
            linked_live.note_damage = floor.note_damage;
        }

        s += '<ul class="collapsible floor" id="' + tower_id + '-' + floor.floor_number + '" data-collapsible="expandable"><li>' +
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
            notemap.is_cleansable(linked_live === undefined ? floor.gimmick : linked_live.gimmick) + '</div>' +
            '<div class="col l3"><b>Note Damage:</b> ' + notemap.format(floor.note_damage) + '</div>' +
            '</div></div><div class="collapsible-body live-difficulty unloaded" id="' + floor.live_difficulty_id + '">Loading...</div></li></ul>';

        let floor_content = '<div class="row nomargin">' +
            // Top information
            '<div class="col l6"><b>Voltage Target: </b>' + notemap.format(floor.voltage_target) + '</div>' +
            '<div class="col l6"><b>Difficulty: </b>' + notemap.difficulty(floor.song_difficulty) + '</div>' +
            '<div class="col l6"><b>Clear Reward: </b>' + make_reward_string(floor.reward_clear) + '</div>' +
            '<div class="col l6"><b>Floor Type: </b>' + (floor.floor_type === 5 ? 'Super Stage' : 'Regular') + '</div>' +
            '<div class="col l6"><b>Recommended Stamina: </b>' + notemap.format(floor.recommended_stamina) + '</div>' +
            '<div class="col l6"><b>Base Note Damage: </b>' + notemap.format(floor.note_damage) +
            ' (' + notemap.format(Math.round(floor.note_damage_rate * 100)) + '% of Free Live)</div></div>';

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

        if (floor.reward_progress !== null) {
            s += '<div class="progress reward"><b>Progress Reward:</b> ' + make_reward_string(floor.reward_progress) + '</div>';
        } else {
            s += '<div class="progress">&nbsp;</div>';
        }
    });

    s += '</div></li></ul>';
});

fs.writeFile('build/dlp.html', minify(s, {
        collapseWhitespace: true
    }),
    function (err) {
        if (err) {
            return console.log(err);
        }
    }
);
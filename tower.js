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

let tower_ids = [];
let towerdata = {};

fs.readdirSync("tower/.").forEach(function (f) {
    if (f.endsWith(".json")) {
        let tid = Number(f.substring(0, f.length - 5));
        tower_ids.push(tid);
        towerdata[tid] = JSON.parse(fs.readFileSync('tower/' + tid + '.json'));
    }
});

tower_ids = tower_ids.sort().reverse();

let layout = fs.readFileSync('tower.html').toString();
let s = "";

for (let ti = 0; ti < tower_ids.length; ti++) {
    let tower_id = tower_ids[ti];
    let tower = towerdata[tower_id];

    s += '<h5 id="tower' + tower_id + '">' + tower.name + '</h5>';
    s += '<b>Performance Points:</b> ' + tower.pp_at_start + ' (+ ' + tower.pp_recovery_limit + ' recoverable)<br>'
    s += '<b>PP Recovery Cost:</b> ' + tower.pp_recovery_cost + ' loveca stars<br><br>';

    for (let fi = 0; fi < tower["floors"].length; fi++) {
        let floor = tower["floors"][fi];
        if (floor["notemap_live_difficulty_id"] !== null) {
            let freelive = JSON.parse(fs.readFileSync('mapdb/' + floor["notemap_live_difficulty_id"] + '.json'));
            floor["notes"] = freelive["notes"];
            floor["gimmick"] = freelive["gimmick"];
            floor["note_gimmicks"] = freelive["note_gimmicks"];
            floor["appeal_chances"] = freelive["appeal_chances"];
        }

        s += '<ul class="collapsible" data-floor="' + tower_id + '-' + (fi + 1) + '" data-collapsible="expandable"><li>' +
            '<div class="collapsible-header' + (floor.floor_type === 5 ? ' light-blue lighten-5' : '') + '">' +
            '<img src="image/icon_' + notemap.attribute(floor.song_attribute) + '.png" ' +
            'alt="' + notemap.attribute(floor.song_attribute) + '">' +
            '<b class="floorno">' + floor.floor_number + (floor.notes === null ? "*" : "") + ')</b>' +
            '<div class="row">' +
            '<div class="col l3"><b class="song_name" data-en="' + notemap.song_name_romaji(floor.live_difficulty_id) +
            '"> ' +floor.song_name + ' </b></div>' +
            '<div class="col l3"><b>Target:</b> ' + notemap.format(floor.voltage_target) + '</div>' +
            '<div class="col l3"><b>Cleansable:</b> ' +
            (floor.gimmick === null ? "-" :
                notemap.skill_effect(floor.gimmick.effect_type, 0).indexOf("Base") === -1 ? "Yes" : "No") + '</div>' +
            '<div class="col l3"><b>Note Damage:</b> ' + notemap.format(floor.note_damage) + '</div>' +
            '</div></div>';
        s += '<div class="collapsible-body live-difficulty">' +
            '<div class="row nomargin"><div class="col l6"><b>Voltage Target: </b>' + notemap.format(floor.voltage_target) + '</div>' +
            '<div class="col l6"><b>Recommended Stamina: </b>' + notemap.format(floor.recommended_stamina) + '</div></div>' +
            '<div class="row nomargin"><div class="col l6"><b>Base Note Damage: </b>' + notemap.format(floor.note_damage) +
            ' (' + notemap.format(Math.round(floor.note_damage_rate * 100)) + '% of Free Live)</div>' +
            '<div class="col l6"><b>Clear Reward: </b>' +
            notemap.format(floor.reward_clear["19001"]) + ' medals, ' + notemap.format(floor.reward_clear["0"]) + ' stars</div></div>' +
            '<div class="row nomargin"><div class="col l6"><b>Difficulty: </b>' + notemap.difficulty(floor.song_difficulty) + '</div>' +
            '<div class="col l6"><b>Floor Type: </b>' + (floor.floor_type === 5 ? 'Super Stage' : 'Regular') + '</div></div>';

        s += notemap.make(floor);

        s += '</div></li></ul>';

        if (floor.reward_progress !== null) {
            s += '<div class="progress reward"><b>Progress Reward:</b> ' + notemap.format(floor.reward_progress["19001"]) +
                ' medals, ' + notemap.format(floor.reward_progress["0"]) + ' stars</div>';
        } else {
            s += '<div class="progress">&nbsp;</div>';
        }
    }
}

fs.writeFile('build/tower.html', minify(layout.replace("$TOWER", s), {
        collapseWhitespace: true
    }),
    function (err) {
        if (err) {
            return console.log(err);
        }
    }
);
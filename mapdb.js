/*
This file generates the map database page from all the files in the mapdb folder.
Copyright (C) 2020-2022 Suyooo

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

const {promisify} = require('util')
const render = promisify(require("ejs").renderFile);
const fs = require("fs");
const settings = require('./settings.js');
const notemap = require('./notemap.js');
const minify = require('html-minifier').minify;
const hash = require('object-hash');

const WEEKDAYS = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

async function finishGroupPage(group) {
    if (!group.hasUpdatedLives) return;
    await Promise.all(group.savePromises);

    render("templates/groupPage.ejs", group).then(res => {
        fs.writeFileSync('build/' + group.name + '.html', minify(res, {
            collapseWhitespace: true,
            minifyCSS: true
        }));
    });
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

        // Filter temporary daily versions from Bonus Costume campaigns
        if (ldid == 10003102 || ldid == 10003202 || ldid == 10003302 ||
            ldid == 11014102 || ldid == 11014202 || ldid == 11014302 ||
            ldid == 12034102 || ldid == 12034202 || ldid == 12034302 ||
            ldid == 12074102 || ldid == 12074202 || ldid == 12074302 ||
            ldid == 10011102 || ldid == 10011202 || ldid == 10011302) {
            return;
        }
        // Filter first version of Hop Step Nonstop
        if (ldid == 11072101 || ldid == 11072201 || ldid == 11072301) {
            return;
        }
        // Filter Free Live versions of songs that became Dailies
        if (ldid == 12088101 || ldid == 12088201 || ldid == 12088301 ||
            ldid == 12090101 || ldid == 12090201 || ldid == 12090301 ||
            ldid == 12092101 || ldid == 12092201 || ldid == 12092301) {
            return;
        }

        songdata[ldid] = JSON.parse(fs.readFileSync('mapdb/' + f));
        let lid = songdata[ldid].live_id;
        if (!live_difficulty_ids.hasOwnProperty(lid)) {
            live_difficulty_ids[lid] = [];
            lives_dict[lid] = {
                id: lid,
                order: songdata[ldid].display_order,
                name: songdata[ldid].song_name,
                attribute: isEventLive ? 9 : null,
                isAllUnavailable: !isEventLive,
                isAnyPermanent: isEventLive,
                dailyWeekdays: null
            };
        }

        if (lives_dict[lid].attribute === null || (ldid < 20000000 && songdata[ldid].song_difficulty !== 35 && songdata[ldid].song_difficulty !== 37)) {
            // prefer info from Free Live, non-Adv+ data
            lives_dict[lid].attribute = songdata[ldid].song_attribute;
            lives_dict[lid].dailyWeekdays = songdata[ldid].extra_info.daily_weekday;
            // default diff should be Advanced if available
            if (songdata[ldid].song_difficulty === 30 && songdata[ldid].extra_info.is_available) lives_dict[lid].defaultDifficulty = ldid;
        }
        if (ldid < 20000000) {
            lives_dict[lid].isAllUnavailable = (!songdata[ldid].extra_info.is_available) && lives_dict[lid].isAllUnavailable;
            lives_dict[lid].isAnyPermanent = songdata[ldid].extra_info.is_permanent || lives_dict[lid].isAnyPermanent;
            if (songdata[ldid].extra_info.is_available) lives_dict[lid].defaultDifficulty = Math.max(lives_dict[lid].defaultDifficulty, ldid);
        }

        live_difficulty_ids[lid].push(ldid);
    }
});

let currentGroup = {
    name: "muse",
    lives: [],
    savePromises: [],
    hasUpdatedLives: false,
    hasAvailableLives: false
};
const groupSavePromises = [];
let lastLiveId = 10000;
let livePagesBuilt = 0;

Object.keys(lives_dict).sort(function (a, b) {
    return lives_dict[a].order - lives_dict[b].order;
}).map(function (e) {
    return lives_dict[e];
}).forEach(function (live) {
    live_difficulty_ids[live.id] = live_difficulty_ids[live.id].sort(function (a, b) {
        if (a < 30000000 && b < 30000000) {
            return songdata[a].song_difficulty - songdata[b].song_difficulty;
        } else if (a < 30000000 && b >= 30000000) {
            return -1;
        } else if (b < 30000000 && a >= 30000000) {
            return 1;
        } else {
            // Sort Story Stages by chapter and mode, not LDI (LDIs are only in the same order from Chapter 8 onwards)
            return (songdata[a].extra_info.story_chapter * 1000 + songdata[a].extra_info.story_stage * 10 +
                    (songdata[a].extra_info.story_is_hard_mode ? 1 : 0)) -
                (songdata[b].extra_info.story_chapter * 1000 + songdata[b].extra_info.story_stage * 10 +
                    (songdata[b].extra_info.story_is_hard_mode ? 1 : 0));
        }
    });

    // start new section if the next group is up
    if (Math.floor(live.id / 1000) !== Math.floor(lastLiveId / 1000)) {
        groupSavePromises.push(finishGroupPage(currentGroup));
        currentGroup = {
            lives: [],
            savePromises: [],
            hasUpdatedLives: false,
            hasAvailableLives: false
        }
        if (live.id >= 11000 && lastLiveId < 11000) currentGroup.name = 'aqours';
        if (live.id >= 12000 && lastLiveId < 12000) currentGroup.name = 'niji';
        if (live.id >= 13000 && lastLiveId < 13000) currentGroup.name = 'liella';
    }
    lastLiveId = live.id;

    const liveData = {
        id: live.id,
        nameKana: notemap.song_name_romaji(live.id),
        nameRomaji: live.name,
        attribute: notemap.attribute(live.attribute),
        isAllUnavailable: live.isAllUnavailable,
        isAnyPermanent: live.isAnyPermanent,
        isDaily: live.dailyWeekdays !== null,
        freeLiveTabs: [],
        storyStageTabs: []
    }

    if (!live.isAllUnavailable) {
        currentGroup.hasAvailableLives = true;
    }

    if (!live.isAnyPermanent && !live.isAllUnavailable) {
        if (settings.limited_song_deadlines.hasOwnProperty(live.id)) {
            liveData.limitedEnd = settings.limited_song_deadlines[live.id];
        }
    }

    if (liveData.isDaily) {
        liveData.dailyWeekdays = live.dailyWeekdays.map(x => WEEKDAYS[x]).join(", ");
    }

    for (const live_difficulty_id of live_difficulty_ids[live.id]) {
        const liveDiff = songdata[live_difficulty_id];
        const live_diff_hash = hash(liveDiff);

        if (process.argv[2] === "full" || !hashes.hasOwnProperty(live_difficulty_id) || hashes[live_difficulty_id] !== live_diff_hash) {
            currentGroup.hasUpdatedLives = true;

            const liveData = {
                rankS: notemap.format(liveDiff.ranks.S),
                rankA: notemap.format(liveDiff.ranks.A),
                rankB: notemap.format(liveDiff.ranks.B),
                rankC: notemap.format(liveDiff.ranks.C),
                capTap: notemap.format(liveDiff.voltage_caps.tap),
                capSp: notemap.format(liveDiff.voltage_caps.sp),
                capSkill: notemap.format(liveDiff.voltage_caps.skill),
                capSwap: notemap.format(liveDiff.voltage_caps.swap),
                noteDamage: liveDiff.note_damage,
                spGaugeSize: notemap.format(liveDiff.sp_gauge_max),
                noteMap: notemap.make(liveDiff)
            }

            currentGroup.savePromises.push(render("templates/liveDifficulty.ejs", liveData).then(res => {
                fs.writeFileSync("build/lives/" + live_difficulty_id + ".html", minify(res, {
                    collapseWhitespace: true,
                    minifyCSS: true
                }));
            }));

            hashes[live_difficulty_id] = live_diff_hash;
            livePagesBuilt++;
        }

        if (live_difficulty_id < 30000000 || live_difficulty_id >= 40000000) {
            // Full difficulty name for free lives, attribute only if it differs (for example, SnowHala Adv+)
            const liveTabData = {
                id: live_difficulty_id,
                label: notemap.difficulty(liveDiff.song_difficulty),
                hasAltAttribute: liveDiff.song_attribute != live.attribute,
                isUnavailable: live_difficulty_id < 20000000 && !liveDiff.extra_info.is_available && !live.isAllUnavailable,
                isDefaultDiff: live.defaultDifficulty == live_difficulty_id
            }
            if (liveTabData.hasAltAttribute) liveTabData.altAttribute = notemap.attribute(liveDiff.song_attribute);
            liveData.freeLiveTabs.push(liveTabData);
        } else {
            // Shortened difficulty plus location for story stages, always show attribute
            const storyTabData = {
                id: live_difficulty_id,
                storyChapter: liveDiff.extra_info.story_chapter,
                storyStage: liveDiff.extra_info.story_stage,
                hasCourse: liveDiff.extra_info.story_chapter >= 20,
                hasChartDifficulty: liveDiff.notes !== null,
                attribute: notemap.attribute(liveDiff.song_attribute)
            }
            if (storyTabData.hasCourse) storyTabData.course = liveDiff.extra_info.story_is_hard_mode ? "Hard" : "Normal";

            // Try to guess chart difficulty by comparing the note count with the free live versions
            if (storyTabData.hasChartDifficulty) {
                let minimumDifference = liveDiff.notes.length;
                let minimumDifficulty = 10;
                for (const comparisonDiffId of live_difficulty_ids[liveDiff.live_id]) {
                    const comparisonDiff = songdata[comparisonDiffId];
                    if (comparisonDiff === undefined || comparisonDiff.notes === null) continue;
                    const difference = Math.abs(liveDiff.notes.length - comparisonDiff.notes.length);
                    if (difference < minimumDifference) {
                        minimumDifference = difference;
                        minimumDifficulty = comparisonDiff.song_difficulty;
                    }
                }
                storyTabData.chartDifficulty = notemap.difficulty_short(minimumDifficulty);
            }

            liveData.storyStageTabs.push(storyTabData);
        }
    }
    currentGroup.lives.push(liveData);
});

if (currentGroup.hasUpdatedLives) {
    groupSavePromises.push(finishGroupPage(currentGroup));
}

Promise.all(groupSavePromises).then(() => {
    fs.writeFile('build/lives/hash.json', JSON.stringify(hashes),
        function (err) {
            if (err) {
                return console.log(err);
            }
        });
    console.log("    Built " + livePagesBuilt + " Live page(s).");
});
if (groupSavePromises.length > 0) {
    console.log("    Building " + livePagesBuilt + " Live page(s)...");
}
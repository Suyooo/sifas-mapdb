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

const render = require('util').promisify(require("ejs").renderFile);
const fs = require("fs");
const settings = require('./settings.js');
const notemap = require('./notemap.js');
const minify = require('html-minifier').minify;
const hash = require('object-hash');
const Difficulty = require("./enums/difficulty");

const WEEKDAYS = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const isFreeLive = (liveDiffId) => liveDiffId < 20000000;
const isStoryStage = (liveDiffId) => liveDiffId >= 30000000 && liveDiffId < 40000000;

let hashes = {};
if (fs.existsSync("build/lives/hash.json")) {
    hashes = JSON.parse(fs.readFileSync("build/lives/hash.json"));
}

let livesDict = {};
let liveIdsForGroup = {
    0: [],
    1: [],
    2: [],
    3: []
};
let liveDiffIdsForLive = {};
let songData = {};

for (const f of fs.readdirSync("mapdb")) {
    if (f.endsWith(".json")) {
        const liveDiffId = parseInt(f.substring(0, f.length - 5));
        const isEventLive = -1 !== settings.current_event_live_ids.indexOf(Math.floor(liveDiffId / 1000));

        // These pages only contain Free Lives, active Event lives and Story Stages
        if (!isEventLive && !isFreeLive(liveDiffId) && !isStoryStage(liveDiffId)) {
            continue;
        }

        // Filter temporary daily versions from Bonus Costume campaigns
        if (liveDiffId == 10003102 || liveDiffId == 10003202 || liveDiffId == 10003302 ||
            liveDiffId == 11014102 || liveDiffId == 11014202 || liveDiffId == 11014302 ||
            liveDiffId == 12034102 || liveDiffId == 12034202 || liveDiffId == 12034302 ||
            liveDiffId == 12074102 || liveDiffId == 12074202 || liveDiffId == 12074302 ||
            liveDiffId == 10011102 || liveDiffId == 10011202 || liveDiffId == 10011302) {
            continue;
        }
        // Filter first version of Hop Step Nonstop
        if (liveDiffId == 11072101 || liveDiffId == 11072201 || liveDiffId == 11072301) {
            continue;
        }
        // Filter Free Live versions of songs that became Dailies
        if (liveDiffId == 12088101 || liveDiffId == 12088201 || liveDiffId == 12088301 ||
            liveDiffId == 12090101 || liveDiffId == 12090201 || liveDiffId == 12090301 ||
            liveDiffId == 12092101 || liveDiffId == 12092201 || liveDiffId == 12092301) {
            continue;
        }

        songData[liveDiffId] = JSON.parse(fs.readFileSync('mapdb/' + f));
        const liveId = songData[liveDiffId].live_id;
        if (!liveDiffIdsForLive.hasOwnProperty(liveId)) {
            liveDiffIdsForLive[liveId] = [];
            // Second digit of the Live ID is the Group ID
            liveIdsForGroup[Math.floor(liveId % 10000 / 1000)].push(liveId);
            livesDict[liveId] = {
                id: liveId,
                order: songData[liveDiffId].display_order,
                name: songData[liveDiffId].song_name,
                attribute: isEventLive ? 9 : songData[liveDiffId].song_attribute,
                isAllUnavailable: !isEventLive,
                isAnyPermanent: isEventLive,
                dailyWeekdays: isFreeLive(liveDiffId) ? songData[liveDiffId].extra_info.daily_weekday : null
            };
        } else if (isFreeLive(liveDiffId) && songData[liveDiffId].song_difficulty === Difficulty.ADV) {
            // If we are parsing a song's Adv difficulty after the live data was already read, override that data
            // (In case there's difficulties with different attributes, like SnowHala Adv/Adv+, or a Story Stage was read before)
            livesDict[liveId].attribute = songData[liveDiffId].song_attribute;
            livesDict[liveId].dailyWeekdays = songData[liveDiffId].extra_info.daily_weekday;

            // Default difficulty should be Advanced if available
            if (songData[liveDiffId].song_difficulty === Difficulty.ADV && songData[liveDiffId].extra_info.is_available) {
                livesDict[liveId].defaultDifficulty = liveDiffId;
                livesDict[liveId].defaultDifficultyId = Difficulty.ADV;
            }
        }

        if (isFreeLive(liveDiffId)) {
            livesDict[liveId].isAllUnavailable = (!songData[liveDiffId].extra_info.is_available) && livesDict[liveId].isAllUnavailable;
            livesDict[liveId].isAnyPermanent = songData[liveDiffId].extra_info.is_permanent || livesDict[liveId].isAnyPermanent;

            // If no available Adv difficulty has been read (yet), just set the highest available difficulty as default
            if (songData[liveDiffId].extra_info.is_available && livesDict[liveId].defaultDifficultyId !== Difficulty.ADV
                && songData[liveDiffId].song_difficulty > livesDict[liveId].defaultDifficultyId) {
                livesDict[liveId].defaultDifficulty = liveDiffId;
                livesDict[liveId].defaultDifficultyId = songData[liveDiffId].song_difficulty;
            }
        }

        liveDiffIdsForLive[liveId].push(liveDiffId);
    }
}

const groupSavePromises = [];
let livePageCount = 0;

for (const groupId in liveIdsForGroup) {
    const currentGroup = {
        lives: [],
        savePromises: [],
        hasUpdatedLives: false,
        hasAvailableLives: false
    }
    switch (groupId) {
        case "0":
            currentGroup.name = "muse";
            break;
        case "1":
            currentGroup.name = "aqours";
            break;
        case "2":
            currentGroup.name = "niji";
            break;
        case "3":
            currentGroup.name = "liella";
            break;
        default:
            throw new Error(groupId + " doesn't have a page name set");
    }

    for (const liveId of liveIdsForGroup[groupId]) {
        const live = livesDict[liveId];

        const liveData = {
            id: live.id,
            order: live.order,
            nameKana: notemap.songNameRomaji(live.id),
            nameRomaji: live.name,
            attribute: notemap.attributeName(live.attribute),
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

        for (const liveDiffId of liveDiffIdsForLive[live.id]) {
            const liveDiff = songData[liveDiffId];
            const liveDiffHash = hash(liveDiff);

            if (process.argv[2] === "full" || !hashes.hasOwnProperty(liveDiffId) || hashes[liveDiffId] !== liveDiffHash) {
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
                    fs.writeFileSync("build/lives/" + liveDiffId + ".html", minify(res, {
                        collapseWhitespace: true,
                        minifyCSS: true
                    }));
                    console.log("    Built page for Live Diff ID " + liveDiffId);
                }));

                hashes[liveDiffId] = liveDiffHash;
                livePageCount++;
            }

            if (!isStoryStage(liveDiffId)) {
                // Full difficulty name for free lives, attribute only if it differs (for example, SnowHala Adv+)
                const liveTabData = {
                    id: liveDiffId,
                    difficultyId: liveDiff.song_difficulty,
                    label: notemap.difficultyName(liveDiff.song_difficulty),
                    hasAltAttribute: liveDiff.song_attribute != live.attribute,
                    isUnavailable: isFreeLive(liveDiffId) && !liveDiff.extra_info.is_available && !live.isAllUnavailable,
                    // If the song is unavailable, defaultDifficulty will not be set - pick Adv as default diff
                    isDefaultDiff: live.isAllUnavailable ? liveDiff.song_difficulty === Difficulty.ADV : live.defaultDifficulty == liveDiffId
                }
                if (liveTabData.hasAltAttribute) liveTabData.altAttribute = notemap.attributeName(liveDiff.song_attribute);
                liveData.freeLiveTabs.push(liveTabData);
            } else {
                // Shortened difficulty plus location for story stages, always show attribute
                const storyTabData = {
                    id: liveDiffId,
                    storyChapter: liveDiff.extra_info.story_chapter,
                    storyStageNo: liveDiff.extra_info.story_stage,
                    hasCourse: liveDiff.extra_info.story_chapter >= 20,
                    hasBaseDifficulty: liveDiff.notes !== null,
                    attribute: notemap.attributeName(liveDiff.song_attribute)
                }
                if (storyTabData.hasCourse) storyTabData.course = liveDiff.extra_info.story_is_hard_mode ? "Hard" : "Normal";

                // Try to guess base difficulty by comparing the note count with the free live versions
                if (storyTabData.hasBaseDifficulty) {
                    let minimumDifference = liveDiff.notes.length;
                    let minimumDifficulty;
                    for (const comparisonDiffId of liveDiffIdsForLive[liveDiff.live_id]) {
                        const comparisonDiff = songData[comparisonDiffId];
                        if (comparisonDiff === undefined || comparisonDiff.notes === null) continue;
                        const difference = Math.abs(liveDiff.notes.length - comparisonDiff.notes.length);
                        if (difference < minimumDifference) {
                            minimumDifference = difference;
                            minimumDifficulty = comparisonDiff.song_difficulty;
                        }
                    }
                    storyTabData.baseDifficulty = notemap.difficultyNameShort(minimumDifficulty);
                }

                liveData.storyStageTabs.push(storyTabData);
            }
        }

        liveData.freeLiveTabs.sort((a, b) => a.difficultyId - b.difficultyId);
        liveData.storyStageTabs.sort((a, b) => {
            if (a.storyChapter !== b.storyChapter) {
                return a.storyChapter - b.storyChapter;
            } else if (a.storyStageNo !== b.storyStageNo) {
                return a.storyStageNo - b.storyStageNo;
            } else if (a.course === "Hard") {
                return 1;
            } else {
                return -1;
            }
        });
        currentGroup.lives.push(liveData);
    }

    currentGroup.lives.sort((a, b) => a.order - b.order);
    if (currentGroup.hasUpdatedLives) {
        groupSavePromises.push(
            Promise.all(currentGroup.savePromises)
                .then(() => render("templates/groupPage.ejs", currentGroup))
                .then(res => {
                    fs.writeFileSync('build/' + currentGroup.name + '.html', minify(res, {
                        collapseWhitespace: true,
                        minifyCSS: true
                    }));
                    console.log("    Built page for Group " + currentGroup.name);
                })
        );
    }
}

if (groupSavePromises.length > 0) {
    console.log("    Building " + livePageCount + " Live page(s)...");
}

Promise.all(groupSavePromises).then(() => {
    fs.writeFileSync('build/lives/hash.json', JSON.stringify(hashes));
    console.log("    Built " + livePageCount + " Live page(s).");
});
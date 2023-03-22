/*
This file generates the DLP info page from the tower information in the tower folder.
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
const fs = require('fs');
const notemap = require('./notemap.js');
const minify = require('html-minifier').minify;
const hash = require('object-hash');
const Attribute = require("./enums/attribute");
const Difficulty = require("./enums/difficulty");
const DLPFloorType = require("./enums/dlpFloorType");
const Utils = require("./utils");

function towerNameRomaji(towerId) {
    if (towerId === 33001) return "Dream Live Parade";
    if (towerId === 33002) return "Dream Live Parade ~Aqours~";
    if (towerId === 33003) return "Dream Live Parade ~Nijigaku~";
    if (towerId === 33004) return "Dream Live Parade ~μ's~";
    if (towerId === 33005) return "2020 Countdown Live";
    if (towerId === 33006) return "Dream Live Parade - R On Stage -";
    if (towerId === 33007) return "Dream Live Parade - Pure / Smile On Stage -";
    if (towerId === 33008) return "Dream Live Parade - Nijigaku On Stage -";
    if (towerId === 33009) return "Dream Live Parade - Cool / Active On Stage -";
    if (towerId === 33010) return "Dream Live Parade Love Live! Nijigasaki High School Idol Club 3rd Live! School Idol Festival ~ Beginning of The Dream ~";
    if (towerId === 33011) return "Dream Live Parade - Natural / Elegant On Stage -";
    if (towerId === 33012) return "Dream Live Parade - 3rd Years On Stage -";
    if (towerId === 33013) return "Dream Live Parade ~Summer Adventure 2021~";
    if (towerId === 33014) return "Dream Live Parade ~2nd Anniversary~";
    if (towerId === 33015) return "Dream Live Parade ~We Are Challengers~";
    if (towerId === 33016) return "Dream Live Parade ~Sp Types On Stage~";
    if (towerId === 33017) return "Dream Live Parade ~Gd Types On Stage~";
    if (towerId === 33018) return "Dream Live Parade ~Vo Types On Stage~";
    if (towerId === 33019) return "All Stars Special Dream Live Parade 2021";
    if (towerId === 33020) return "Dream Live Parade ~Sk Types On Stage~";
    if (towerId === 33021) return "Dream Live Parade - Pure / Smile On Stage -";
    if (towerId === 33022) return "Dream Live Parade - Cool / Active On Stage -";
    if (towerId === 33023) return "Dream Live Parade - Natural / Elegant On Stage -";
    if (towerId === 33024) return "Dream Live Parade - 1st Years On Stage -";
    if (towerId === 33025) return "Dream Live Parade - 2nd Years On Stage -";
    if (towerId === 33026) return "Dream Live Parade - 3rd Years On Stage -";
    if (towerId === 33027) return "Dream Live Parade - 3rd Anniversary (Part 1) -";
    if (towerId === 33028) return "Dream Live Parade - 3rd Anniversary (Part 2) -";
    if (towerId === 33029) return "Dream Live Parade - 3rd Anniversary (Part 3) -";
    if (towerId === 33030) return "Dream Live Parade ~ 3rd Anniversary Next TOKIMEKI! ~";
    if (towerId === 33031) return "Dream Live Parade ~µ's On Stage~";
    if (towerId === 33032) return "Dream Live Parade ~Aqours On Stage~";
    if (towerId === 33033) return "Dream Live Parade ~Nijigaku On Stage~";
    if (towerId === 33034) return "Dream Live Parade ~Sp Types On Stage~";
    if (towerId === 33035) return "Dream Live Parade ~Gd Types On Stage~";
    if (towerId === 33036) return "Dream Live Parade ~ALL STAR~";
    if (towerId === 33037) return "Dream Live Parade ~ 3.5th Anniversary 1st diary ~";
    if (towerId === 33038) return "Dream Live Parade ~ 3.5th Anniversary 2nd diary ~";
    if (towerId === 33039) return "Dream Live Parade ~ 3.5th Anniversary 3rd diary ~";

    throw new Error("Unknown Romaji Tower Name for " + towerId);
}

function towerNameApril(towerId) {
    if (towerId === 33001) return "dream machine view";
    if (towerId === 33002) return "Dream Live Parade Aqours";
    if (towerId === 33003) return "Nijiga Kaku live Dreaming Parade ～";
    if (towerId === 33004) return "Dream Parade live";
    if (towerId === 33005) return "Counting live days in 2020";
    if (towerId === 33006) return "Dream Live Parade-R Stage -";
    if (towerId === 33007) return "Dream live parade - pure / smiling on stage -";
    if (towerId === 33008) return "Dream Live Parade - Nijigatake on stage -";
    if (towerId === 33009) return "Dream Live Parade - cool / active on stage -";
    if (towerId === 33010) return "Dream Love Parade! 3. Jump up Nijigasaki High School Idol Club! School Idol Festival ～ Start a Dream ～";
    if (towerId === 33011) return "Dream Parade - Natural Level / Stylish";
    if (towerId === 33012) return "Dream Live Parade - Year 3 Level -";
    if (towerId === 33013) return "2021 S Summer Adventure Dream Parade ～";
    if (towerId === 33014) return "Dream Life Parade ～ 2nd birthday ～";
    if (towerId === 33015) return "Dream Live Parade We are adversaries";
    if (towerId === 33016) return "Dream Live Parade ~ SP on stage ~";
    if (towerId === 33017) return "Dream Live Parade Gd on stage ～";
    if (towerId === 33018) return "Dream Live Parade ~ Vo Bois on stage ~";
    if (towerId === 33019) return "All-Star 2021 exclusive live dream";
    if (towerId === 33020) return "Dream Live Parade ~ SK boys on stage ~";
    if (towerId === 33021) return "Dream live parade - pure / smiling on stage - ";

    throw new Error("Unknown Funny Tower Name for " + towerId);
}

function towerNameYear(towerId) {
    if (towerId === 33007) return "2021";
    if (towerId === 33008) return "2021";
    if (towerId === 33009) return "2021";
    if (towerId === 33011) return "2021";
    if (towerId === 33012) return "2021";
    if (towerId === 33016) return "2021";
    if (towerId === 33017) return "2021";
    if (towerId === 33021) return "2022";
    if (towerId === 33022) return "2022";
    if (towerId === 33023) return "2022";
    if (towerId === 33026) return "2022";
    if (towerId === 33033) return "2022";
    if (towerId === 33034) return "2023";
    if (towerId === 33035) return "2023";

    return undefined;
}

function makeRewardString(rewards) {
    return Object.keys(rewards)
        .sort((a, b) => parseInt(b) - parseInt(a)) // Medals first, stars second
        .map(k => {
            let itemname;
            if (k === "0") itemname = "Star";
            else if (k === "19001") itemname = "Medal";
            else if (k === "21041") itemname = "Map Piece";
            else if (k === "21044") itemname = "Memory Fragment";
            else if (k === "21059") itemname = "Star Fragment";
            else throw new Error("Unknown Item ID " + k);
            return notemap.format(rewards[k]) + " " + itemname + (rewards[k] === 1 ? "" : "s");
        })
        .join(", ");
}

let hashesLive = {};
let hashesTower = {};
if (fs.existsSync("build/lives/hash.json")) {
    hashesLive = JSON.parse(fs.readFileSync("build/lives/hash.json"));
}
if (fs.existsSync("build/towers/hash.json")) {
    hashesTower = JSON.parse(fs.readFileSync("build/towers/hash.json"));
}

let towerIds = [];
let jsonData = {};

for (const f of fs.readdirSync("tower")) {
    if (f.endsWith(".json")) {
        let tid = parseInt(f.substring(0, f.length - 5));
        towerIds.push(tid);
        jsonData[tid] = JSON.parse(fs.readFileSync("tower/" + tid + ".json"));
    }
}

const towerDataList = [];
const towerSavePromises = [];
let hasUpdatedTowers = false;
let livePageCount = 0;

for (const towerId of towerIds) {
    const tower = jsonData[towerId];

    let year = towerNameYear(towerId);
    if (year === undefined) year = "";
    else year = " (" + year + ")";

    towerDataList.push({
        id: towerId,
        nameApril: towerNameApril(towerId),
        name: tower.name,
        nameRomaji: towerNameRomaji(towerId),
        year: year
    });

    const towerHash = hash(tower);
    let hasUpdatedFloors = process.argv[2] === "full" || !hashesTower.hasOwnProperty(towerId) || hashesTower[towerId] !== towerHash;

    const towerData = {
        id: towerId,
        ppAtStart: tower.pp_at_start,
        ppRecoveryLimit: tower.pp_recovery_limit,
        ppRecoveryCost: tower.pp_recovery_cost,
        floors: []
    }

    const floorSavePromises = [];
    for (const floor of tower.floors) {
        if (floor.floor_type === DLPFloorType.STORY) {
            towerData.floors.push({
                floorNo: floor.floor_number,
                isStory: true,
                storyTitle: floor.story_title,
                hasProgressReward: false
            })
            continue;
        }

        // Load referenced note map if available
        let linked_live = undefined;
        if (floor["notemap_live_difficulty_id"] !== null) {
            linked_live = JSON.parse(fs.readFileSync('mapdb/' + floor["notemap_live_difficulty_id"] + '.json'));
            linked_live.note_damage = floor.note_damage;
        }

        const floorData = {
            floorNo: floor.floor_number,
            isStory: false,
            isSuperStage: floor.floor_type === DLPFloorType.SUPER_STAGE,
            liveDifficultyId: floor.live_difficulty_id,
            nameApril: Utils.songNameApril(floor.live_id),
            nameKana: floor.song_name,
            nameRomaji: Utils.songNameRomaji(floor.live_id),
            namePostfix: Utils.songNamePostfix(floor.live_id),
            attribute: Attribute.name(floor.song_attribute),
            targetVoltage: notemap.format(floor.voltage_target),
            clearReward: makeRewardString(floor.reward_clear),
            hasProgressReward: floor.reward_progress !== null,
            noteDamage: notemap.format(floor.note_damage),
            hasNoteDamageRate: floor.note_damage_rate != undefined,
            baseDifficulty: Difficulty.name(floor.song_difficulty),
            capTap: notemap.format(floor.voltage_caps.tap),
            capSp: notemap.format(floor.voltage_caps.sp),
            capSkill: notemap.format(floor.voltage_caps.skill),
            capSwap: notemap.format(floor.voltage_caps.swap),
            spGaugeSize: notemap.format(floor.sp_gauge_max),
            noteMap: notemap.make(linked_live === undefined ? floor : linked_live)
        }
        if (floorData.hasNoteDamageRate) {
            floorData.noteDamageRate = notemap.format(Math.round(floor.note_damage_rate * 100));
        }
        if (floorData.hasProgressReward) {
            floorData.progressReward = makeRewardString(floor.reward_progress);
        }
        towerData.floors.push(floorData);

        let floorHash = hash(floor);
        if (process.argv[2] === "full"
            || !hashesLive.hasOwnProperty(floorData.liveDifficultyId)
            || hashesLive[floorData.liveDifficultyId] !== floorHash) {
            // Update tower page as well since the header information might have changed
            hasUpdatedFloors = true;

            floorSavePromises.push(render("templates/dlpStage.ejs", floorData).then(res => {
                fs.writeFileSync("build/lives/" + floorData.liveDifficultyId + ".html", minify(res, {
                    collapseWhitespace: true,
                    minifyCSS: true
                }));
                console.log("    Built page for Live Diff ID " + floorData.liveDifficultyId);
            }));

            hashesLive[floorData.liveDifficultyId] = floorHash;
            livePageCount++;
        }
    }

    if (hasUpdatedFloors) {
        hasUpdatedTowers = true;

        towerSavePromises.push(Promise.all(floorSavePromises)
            .then(() => render("templates/dlpParade.ejs", towerData))
            .then(res => {
                    fs.writeFileSync("build/towers/" + towerId + ".html", minify(res, {
                        collapseWhitespace: true,
                        minifyCSS: true
                    }));
                    console.log("    Built page for Tower ID " + towerId);
                }));

        hashesTower[towerId] = towerHash;
    }
}

towerDataList.sort((a, b) => a.id - b.id);
(async () => {
    if (hasUpdatedTowers) {
        await Promise.all(towerSavePromises)
            .then(() => render("templates/dlpPage.ejs", {towers: towerDataList}))
            .then(res => {
                fs.writeFileSync('build/dlp.html', minify(res, {
                    collapseWhitespace: true,
                    minifyCSS: true
                }));
                console.log("    Built DLP Page");
            });
    }
})().then(() => {
    fs.writeFileSync('build/lives/hash.json', JSON.stringify(hashesLive));
    fs.writeFileSync('build/towers/hash.json', JSON.stringify(hashesTower));
    console.log("    Built " + livePageCount + " Live page(s).");
});

if (hasUpdatedTowers) {
    console.log("    Building " + livePageCount + " Live page(s)...");
}
/*
This file generates the top rankings page from all the files in the mapdb folder.
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
const settings = require('./settings.js');
const notemap = require('./notemap.js');
const minify = require('html-minifier').minify;
const hash = require('object-hash');
const Difficulty = require("./enums/difficulty");
const Attribute = require("./enums/attribute");

const isFreeLive = (liveDiffId) => liveDiffId < 20000000;

const lengthRankingMap = {};
const noteRanking = [];

for (const f of fs.readdirSync("mapdb")) {
    if (f.endsWith(".json")) {
        const liveDiffId = parseInt(f.substring(0, f.length - 5));
        const isEventLive = -1 !== settings.current_event_live_ids.indexOf(Math.floor(liveDiffId / 1000));
        if (!isFreeLive(liveDiffId) && !isEventLive) {
            continue;
        }

        // Filter temporary daily versions from Bonus Costume campaigns (to avoid linking them)
        if (liveDiffId == 10003102 || liveDiffId == 10003202 || liveDiffId == 10003302 ||
            liveDiffId == 11014102 || liveDiffId == 11014202 || liveDiffId == 11014302 ||
            liveDiffId == 12034102 || liveDiffId == 12034202 || liveDiffId == 12034302 ||
            liveDiffId == 12074102 || liveDiffId == 12074202 || liveDiffId == 12074302 ||
            liveDiffId == 10011102 || liveDiffId == 10011202 || liveDiffId == 10011302) {
            continue;
        }

        const jsonData = JSON.parse(fs.readFileSync('mapdb/' + f));
        if (jsonData.song_length !== null) {
            if (!lengthRankingMap.hasOwnProperty(jsonData.live_id)) {
                lengthRankingMap[jsonData.live_id] = {
                    songName: jsonData.song_name,
                    songNameRomaji: notemap.songNameRomaji(jsonData.live_id),
                    liveId: jsonData.live_id,
                    linkTo: liveDiffId,
                    linkDiffId: jsonData.song_difficulty,
                    attribute: notemap.attributeName(jsonData.song_attribute),
                    length: jsonData.song_length,
                    showByDefault: isEventLive || jsonData.extra_info.is_available
                };
            } else {
                // Prefer to link Adv if available, otherwise the highest available difficulty
                if (lengthRankingMap[jsonData.live_id].linkDiffId !== Difficulty.ADV && (isEventLive || jsonData.extra_info.is_available)) {
                    if (jsonData.song_difficulty === Difficulty.ADV || jsonData.song_difficulty > lengthRankingMap[jsonData.live_id].linkDiffId) {
                        lengthRankingMap[jsonData.live_id].linkTo = liveDiffId;
                        lengthRankingMap[jsonData.live_id].linkDiffId = jsonData.song_difficulty;
                    }
                }
                // Prefer attribute of Adv map
                if (jsonData.song_difficulty === Difficulty.ADV && jsonData.song_attribute !== Attribute.NONE) {
                    jsonData.attribute = notemap.attributeName(jsonData.song_attribute);
                }
                lengthRankingMap[jsonData.live_id].showByDefault = isEventLive || jsonData.extra_info.is_available || lengthRankingMap[jsonData.live_id].showByDefault;
            }
        }

        if (jsonData.notes !== null && jsonData.song_difficulty >= Difficulty.ADV) {
            const rankData = {
                songName: jsonData.song_name,
                songNameRomaji: notemap.songNameRomaji(jsonData.live_id),
                liveId: jsonData.live_id,
                linkTo: liveDiffId,
                attribute: notemap.attributeName(jsonData.song_attribute),
                hasNonAdvDifficulty: jsonData.song_difficulty > Difficulty.ADV,
                noteCount: jsonData.notes.length,
                showByDefault: isEventLive ? false : jsonData.extra_info.can_show_on_profile
            };
            if (rankData.hasNonAdvDifficulty) {
                rankData.difficulty = notemap.difficultyNameShort(jsonData.song_difficulty);
            }
            noteRanking.push(rankData);
        }
    }
}

// Ignore songs for length ranking: Remove old versions of songs that became permanent later
delete lengthRankingMap["2020"];      // Love U my friends(2D)
delete lengthRankingMap["2031"];      // SUPER NOVA
delete lengthRankingMap["2032"];      // Dream Land, Dream World!
delete lengthRankingMap["2033"];      // Sing & Smile!!
delete lengthRankingMap["2040"];      // 虹色Passions！
delete lengthRankingMap["2041"];      // NEO SKY, NEO MAP!
delete lengthRankingMap["2051"];      // 夢がここからはじまるよ
delete lengthRankingMap["2053"];      // Just Believe!!!

// Avoid mixups
/*songs_dict["2031"].name += " (2D)"; // SUPER NOVA
songs_dict["2032"].name += " (2D)"; // Dream Land, Dream World!
songs_dict["2033"].name += " (2D)"; // Sing & Smile!!
songs_dict["2040"].name += " (2D)"; // 虹色Passions！
songs_dict["2041"].name += " (2D)"; // NEO SKY, NEO MAP!
songs_dict["2051"].name += " (2D)"; // 夢がここからはじまるよ
songs_dict["2053"].name += " (2D)"; // Just Believe!!!*/

let rankingsHash = hash([lengthRankingMap, noteRanking]);
let hashes = {};
if (fs.existsSync("build/lives/hash.json")) {
    hashes = JSON.parse(fs.readFileSync("build/lives/hash.json"));
}
if (process.argv[2] !== "full" && hashes.hasOwnProperty("rankings") && hashes["rankings"] === rankingsHash) {
    console.log("    No update needed.")
    return;
}

const lengthRanking = Object.values(lengthRankingMap).sort((a, b) => {
    if (a.length !== b.length) return a.length - b.length;
    else if (a.showByDefault && !b.showByDefault) return -1;
    else if (!a.showByDefault && b.showByDefault) return 1;
    else return a.liveId - b.liveId;
});
noteRanking.sort((a, b) => {
    if (a.noteCount !== b.noteCount) return b.noteCount - a.noteCount;
    else if (a.showByDefault && !b.showByDefault) return -1;
    else if (!a.showByDefault && b.showByDefault) return 1;
    else return a.liveId - b.liveId;
});

render("templates/rankings.ejs", {length: lengthRanking, note: noteRanking})
    .then(res => {
        fs.writeFileSync("build/rankings.html", minify(res, {
            collapseWhitespace: true,
            minifyCSS: true
        }));
        console.log("    Built page.");
        fs.writeFileSync("build/lives/hash.json", JSON.stringify(hashes));
    });
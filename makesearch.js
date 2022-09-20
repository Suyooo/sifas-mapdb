/*
This file generates the search index for the fuzzy search feature.
Copyright (C) 2022 Suyooo

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

const fs = require("fs");
const notemap = require("./notemap");
const settings = require("./settings");
const wanakana = require("wanakana");
const fuzzysort = require("./node_modules/fuzzysort/fuzzysort.min");
const Difficulty = require("./enums/difficulty");
const Utils = require("./utils");

const customAbbreviationsKn = {
    "10013": "Mスタ",
    "10025": "すいほり",
    "12024": "焼き鳥,焼鳥,やきとり,ヤキトリ",
    "12040": "虹パー",
    "12057": "虹パー"
}
const customAbbreviationsRo = {
    "10008": "borarara",
    "11003": "021",
    "11012": "t1w",
    "11072": "hsns",
    "11102": "aao",
    "12001": "tkmk",
    "12024": "yakitori",
    "12026": "marchen star",
    "12034": "tkmk"
}

const index = [];

function clean(s) {
    return s.toLowerCase().replaceAll(/[^ 　一-龠ぁ-ゔァ-ヴーa-zA-Z0-9ａ-ｚＡ-Ｚ０-９々〆〤ヶ]/gu, "");
}

const lives = {};
for (const f of fs.readdirSync("mapdb")) {
    if (f.endsWith(".json")) {
        const liveDiffId = parseInt(f.substring(0, f.length - 5));
        const json = JSON.parse(fs.readFileSync("mapdb/" + f));
        const isEventLive = Utils.isActiveEventLive(liveDiffId);
        if (!Utils.isFreeLive(liveDiffId) && !isEventLive) {
            continue;
        }

        if (!lives.hasOwnProperty(json.live_id)) {
            lives[json.live_id] = {
                name: json.song_name,
                pronunciation: json.song_pronunciation,
                free: undefined,
                freediff: 0,
                advplus: undefined,
                challenge: undefined
            };
        }

        if (json.song_difficulty == Difficulty.CHA) {
            lives[json.live_id].challenge = liveDiffId;
        } else if (json.song_difficulty == Difficulty.ADVPLUS) {
            lives[json.live_id].advplus = liveDiffId;
        } else if (json.song_difficulty > lives[json.live_id].freediff) {
            lives[json.live_id].free = liveDiffId;
            lives[json.live_id].freediff = json.song_difficulty;
        }
    }
}

for (const liveId in lives) {
    const live = lives[liveId];
    index.push({
        "lid": liveId.substring(1),
        "ldid": live.free || live.advplus || live.challenge,
        "ldid_advp": live.advplus,
        "ldid_chal": live.challenge,
        "kanji": fuzzysort.prepare(live.name),
        "kanji_clean": fuzzysort.prepare(clean(live.name)),
        "hiragana": fuzzysort.prepare(live.pronunciation),
        "katakana": fuzzysort.prepare(wanakana.toKatakana(live.pronunciation)),
        "romaji": fuzzysort.prepare(Utils.songNameRomaji(liveId)),
        "romaji_clean": fuzzysort.prepare(clean(Utils.songNameRomaji(liveId))),
        "abbr_kn": fuzzysort.prepare(customAbbreviationsKn[liveId]),
        "abbr_ro": fuzzysort.prepare(customAbbreviationsRo[liveId])
    });
}

fs.writeFileSync("build/js/searchindex.js", "const searchindex=" + JSON.stringify(index));

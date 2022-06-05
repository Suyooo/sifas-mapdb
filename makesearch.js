const fs = require("fs");
const notemap = require("./notemap-reader.js");
const fuzzysort = require("./node_modules/fuzzysort/fuzzysort.min");

const custom_abbreviations_kn = {
    "2040": "虹パー",
    "2057": "虹パー"
}
const custom_abbreviations_ro = {

}

const index = [];
const finishedLiveIds = new Set();

function clean(s) {
    return s.toLowerCase().replaceAll(/[^ 　一-龠ぁ-ゔァ-ヴーa-zA-Z0-9ａ-ｚＡ-Ｚ０-９々〆〤ヶ]/gu, "");
}

let files = fs.readdirSync("mapdb/.");
for (const f of files) {
    if (f.endsWith(".json")) {
        let json = JSON.parse(fs.readFileSync('mapdb/' + f));
        let lid = ("" + json.live_id).substring(1);
        if (finishedLiveIds.has(lid)) continue;
        finishedLiveIds.add(lid);

        index.push({
            "lid": lid,
            "kanji": fuzzysort.prepare(json.song_name),
            "kanji_clean": fuzzysort.prepare(clean(json.song_name)),
            "hiragana": fuzzysort.prepare(json.song_pronunciation),
            "romaji": fuzzysort.prepare(notemap.song_name_romaji(lid)),
            "romaji_clean": fuzzysort.prepare(clean(notemap.song_name_romaji(lid))),
            "abbr_kn": fuzzysort.prepare(custom_abbreviations_kn[lid]),
            "abbr_ro": fuzzysort.prepare(custom_abbreviations_ro[lid])
        });
    }
}

fs.writeFileSync("build/js/searchindex.js", "const searchindex=" + JSON.stringify(index));
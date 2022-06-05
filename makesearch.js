const fs = require("fs");
const notemap = require("./notemap-reader");
const settings = require("./settings");
const wanakana = require("wanakana");
const fuzzysort = require("./node_modules/fuzzysort/fuzzysort.min");

const custom_abbreviations_kn = {
    "0013": "Mスタ",
    "2040": "虹パー",
    "2057": "虹パー"
}
const custom_abbreviations_ro = {
    "0008": "borarara",
    "1003": "021",
    "1012": "t1w",
    "2001": "tkmk",
    "2034": "tkmk"
}

const index = [];
const finishedLiveIds = new Set();

function clean(s) {
    return s.toLowerCase().replaceAll(/[^ 　一-龠ぁ-ゔァ-ヴーa-zA-Z0-9ａ-ｚＡ-Ｚ０-９々〆〤ヶ]/gu, "");
}

let files = fs.readdirSync("mapdb/.");
files.sort((a,b) => {
    if (a < 20000000 && b >= 20000000) return -1;
    else if (b < 20000000 && a >= 20000000) return -1;

    let aDiff = Number(a.substring(5, a.length - 6));
    let bDiff = Number(b.substring(5, b.length - 6));
    if (aDiff === 30 && bDiff !== 30) return -1;
    else if (bDiff === 30 && aDiff !== 30) return 1;
    else if (aDiff === 35 && bDiff !== 35) return -1;
    else if (bDiff === 35 && aDiff !== 35) return 1;
    else if (aDiff === 37 && bDiff !== 37) return -1;
    else if (bDiff === 37 && aDiff !== 37) return 1;
    return 0;
});
for (const f of files) {
    if (f.endsWith(".json")) {
        let json = JSON.parse(fs.readFileSync('mapdb/' + f));
        if (f.charAt(0) != "1" && settings.current_event_live_ids.indexOf(json.live_id) === -1) continue;
        let lid = ("" + json.live_id).substring(1);
        if (finishedLiveIds.has(lid)) continue;
        finishedLiveIds.add(lid);
        let ldid = Number(f.substring(0, f.length - 5));

        index.push({
            "lid": lid,
            "ldid": ldid,
            "kanji": fuzzysort.prepare(json.song_name),
            "kanji_clean": fuzzysort.prepare(clean(json.song_name)),
            "hiragana": fuzzysort.prepare(json.song_pronunciation),
            "katakana": fuzzysort.prepare(wanakana.toKatakana(json.song_pronunciation)),
            "romaji": fuzzysort.prepare(notemap.song_name_romaji(lid)),
            "romaji_clean": fuzzysort.prepare(clean(notemap.song_name_romaji(lid))),
            "abbr_kn": fuzzysort.prepare(custom_abbreviations_kn[lid]),
            "abbr_ro": fuzzysort.prepare(custom_abbreviations_ro[lid])
        });
    }
}

fs.writeFileSync("build/js/searchindex.js", "const searchindex=" + JSON.stringify(index));
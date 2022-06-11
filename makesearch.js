const fs = require("fs");
const notemap = require("./notemap-reader");
const settings = require("./settings");
const wanakana = require("wanakana");
const fuzzysort = require("./node_modules/fuzzysort/fuzzysort.min");

const custom_abbreviations_kn = {
    "0013": "Mスタ",
    "0025": "すいほり",
    "2024": "焼き鳥,焼鳥,やきとり,ヤキトリ",
    "2040": "虹パー",
    "2057": "虹パー"
}
const custom_abbreviations_ro = {
    "0008": "borarara",
    "1003": "021",
    "1012": "t1w",
    "2001": "tkmk",
    "2024": "yakitori",
    "2034": "tkmk"
}

const index = [];

function clean(s) {
    return s.toLowerCase().replaceAll(/[^ 　一-龠ぁ-ゔァ-ヴーa-zA-Z0-9ａ-ｚＡ-Ｚ０-９々〆〤ヶ]/gu, "");
}

let files = fs.readdirSync("mapdb/.");
files.sort((a, b) => {
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

const lives = {};
for (const f of files) {
    if (f.endsWith(".json")) {
        let ldid = f.substring(0, f.length - 5);
        let json = JSON.parse(fs.readFileSync('mapdb/' + f));
        if (f.charAt(0) != "1" && settings.current_event_live_ids.indexOf(Math.floor(ldid / 1000)) === -1) continue;
        if (!lives.hasOwnProperty(json.live_id)) {
            lives[json.live_id] = {
                "name": json.song_name, "pronunciation": json.song_pronunciation,
                "free": undefined, "freediff": 0, "advplus": undefined, "challenge": undefined
            };
        }

        let diff = Number(ldid.substr(5, 2));
        if (diff == 50) {
            lives[json.live_id].challenge = Number(ldid);
        } else if (diff == 40) {
            lives[json.live_id].advplus = Number(ldid);
        } else if (diff > lives[json.live_id].freediff) {
            lives[json.live_id].free = Number(ldid);
            lives[json.live_id].freediff = diff;
        }
    }
}

for (const l in lives) {
    let live = lives[l];
    let lid = ("" + l).substring(1);

    index.push({
        "lid": lid,
        "ldid": live.free,
        "ldid_advp": live.advplus,
        "ldid_chal": live.challenge,
        "kanji": fuzzysort.prepare(live.name),
        "kanji_clean": fuzzysort.prepare(clean(live.name)),
        "hiragana": fuzzysort.prepare(live.pronunciation),
        "katakana": fuzzysort.prepare(wanakana.toKatakana(live.pronunciation)),
        "romaji": fuzzysort.prepare(notemap.song_name_romaji(l)),
        "romaji_clean": fuzzysort.prepare(clean(notemap.song_name_romaji(l))),
        "abbr_kn": fuzzysort.prepare(custom_abbreviations_kn[l]),
        "abbr_ro": fuzzysort.prepare(custom_abbreviations_ro[l])
    });
}

fs.writeFileSync("build/js/searchindex.js", "const searchindex=" + JSON.stringify(index));

const fs = require("fs");
const Attribute = require("../enums/attribute");
const Difficulty = require("../enums/difficulty");
const DLPFloorType = require("../enums/dlpFloorType");
const ACMissionType = require("../enums/acMissionType");
const {songNameRomaji} = require("../utils");
const {isCleansable} = require("../notemap");

function format(x) {
    // https://stackoverflow.com/a/2901298
    let parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "\\_");
    return parts.join(".");
}

if (process.argv.length < 3) {
    process.stdout.write("node make_dlp_parade_base_for_wiki.js [tower ID]");
    process.exit(1);
}
const tower = JSON.parse(fs.readFileSync("../tower/" + process.argv[2] + ".json"));

process.stdout.write("====== Parade: ... ======\n\n")
process.stdout.write("<DLP_PARADE>\n\n")
process.stdout.write("  * General hints\n")

for (const floor of tower.floors) {
    if (floor.floor_type === DLPFloorType.STORY) continue;

    process.stdout.write("\n==== " + floor.floor_number + ": " + songNameRomaji(floor.live_id));
    if (floor.song_difficulty !== Difficulty.ADV) {
        process.stdout.write(" (" + Difficulty.nameShort(floor.song_difficulty) + ")");
    }
    process.stdout.write(" ====\n\n");

    // Load referenced note map if available
    let linked_live = undefined;
    if (floor["notemap_live_difficulty_id"] !== null) {
        linked_live = JSON.parse(fs.readFileSync("../mapdb/" + floor.notemap_live_difficulty_id + ".json"));
    }

    const vo = floor.voltage_target;
    const ac = (linked_live || floor).appeal_chances
        .map(a => a.reward_voltage
            + (a.mission_type === ACMissionType.VOLTAGE_TOTAL
            || a.mission_type === ACMissionType.VOLTAGE_SINGLE
            || a.mission_type === ACMissionType.VOLTAGE_SP
                ? a.mission_value : 0))
        .reduce((acc, n) => acc + n, 0);
    const no = (linked_live || floor).notes.length;
    const dm = Math.floor(floor.note_damage / 100) * 100;

    const votap1 = Math.floor((vo - ac) / no);
    const votap2 = Math.floor((vo - 2 * ac) / (2 * no));
    const votap3 = Math.floor((vo - 3 * ac) / (3 * no));

    process.stdout.write("^  {{attr:" + (Attribute.name(floor.song_attribute).charAt(0)) + "}}  ");
    process.stdout.write("^  Target | " + format(vo) + " ");
    process.stdout.write("^  AC Rewards | " + format(ac) + " ");
    process.stdout.write("^  Note Map Link | [[https://suyo.be/sifas/mapdb/#floor" + process.argv[2] + "-" + floor.floor_number + "|Map DB]] |\n");
    process.stdout.write("^ ::: ");
    process.stdout.write("^  Vo/Tap 1-shot | " + (votap1 > 0 ? format(votap1) : "--") + " ");
    process.stdout.write("^  Vo/Tap 2-shot | " + (votap2 > 0 ? format(votap2) : "--") + " ");
    process.stdout.write("^  Vo/Tap 3-shot | " + (votap3 > 0 ? format(votap3) : "--") + " |\n");
    process.stdout.write("^  Notes  |||||||\n");

    if (floor.song_difficulty === Difficulty.INT) {
        process.stdout.write("^ {{dlp:scoring:-2}} | Intermediate difficulty |\n");
    } else if (floor.song_difficulty > Difficulty.INT) {
        if ((linked_live || floor).gimmick !== null && isCleansable((linked_live || floor).gimmick[0])) {
            process.stdout.write("^ {{dlp:other:cleanse}} | (cleansable) |\n");
        }
    }
    if ((linked_live || floor).appeal_chances.some(ac => ac.mission_type === ACMissionType.UNIQUE)) {
        const max = (linked_live || floor).appeal_chances.filter(ac => ac.mission_type === ACMissionType.UNIQUE)
            .reduce((max, ac) => Math.max(max, ac.mission_value), 0);
        if (max > 3) {
            process.stdout.write("^ {{dlp:other:swap}} | " + max + "-Member ACs |\n");
        }
    }
    if (dm >= 800) {
        const neededDemerit = Math.floor(1000000 / floor.note_damage - 1000) / 10;
        if (neededDemerit <= 0) {
            process.stdout.write("^ {{dlp:healing:+2}} | " + dm + "+ note damage (can use CGd You with up to +" + (-neededDemerit) + "% Gd Strategy bonus) |\n");
        } else if (neededDemerit <= 15) {
            process.stdout.write("^ {{dlp:healing:+2}} | " + dm + "+ note damage (needs -" + neededDemerit + "% Gd Strategy demerit to enable CGd You) |\n");
        } else {
            process.stdout.write("^ {{dlp:healing:+2}} | " + dm + "+ note damage (cannot use CGd You) |\n");
        }
    } else if (dm >= 500) {
        process.stdout.write("^ {{dlp:healing:+1}} | " + dm + "+ note damage |\n");
    }

    process.stdout.write("^  Recommendations  |||||||\n");
}

process.stdout.write("</DLP_PARADE>\n");
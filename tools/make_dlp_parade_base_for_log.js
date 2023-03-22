const fs = require("fs");
const Attribute = require("../enums/attribute");
const {songNameRomaji} = require("../utils");
const DLPFloorType = require("../enums/dlpFloorType");
const Difficulty = require("../enums/difficulty");

if (process.argv.length < 3) {
    process.stdout.write("node make_dlp_parade_base_for_log.js [tower ID]");
    process.exit(1);
}
const tower = JSON.parse(fs.readFileSync("../tower/" + process.argv[2] + ".json"));

for (const floor of tower.floors) {
    if (floor.floor_type === DLPFloorType.STORY) continue;

    process.stdout.write((Attribute.name(floor.song_attribute).charAt(0).toUpperCase()) + ",");
    process.stdout.write(songNameRomaji(floor.live_id));
    if (floor.song_difficulty !== Difficulty.ADV) {
        process.stdout.write(" (" + Difficulty.nameShort(floor.song_difficulty) + ")");
    }
    process.stdout.write("," + floor.voltage_target + "\n");
}
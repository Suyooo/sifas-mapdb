import * as fs from "fs";

export const load = async ({ params }) => {
    return JSON.parse(fs.readFileSync("mapdb/"+params.id+".json").toString());
}
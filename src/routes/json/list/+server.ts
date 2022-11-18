import {Attribute} from "$enums";
import * as Settings from "$lib/settings";
import * as SongNames from "$lib/songNames";
import type {LiveData, LiveDataExtraFree, LiveDataExtraStory, LiveListItem} from "$types";
import {json} from "@sveltejs/kit";
import * as fs from "fs";
import type {RequestHandler} from "./$types";

const isFreeLiveDiff = (liveDiffId: number) => liveDiffId < 20000000;
const isActiveEventLiveDiff = (liveDiffId: number) =>
        Settings.active_event_live_ids.has(Math.floor(liveDiffId / 1000));
const isStoryStageLiveDiff = (liveDiffId: number) => liveDiffId >= 30000000 && liveDiffId < 40000000;

const filteredLiveDiffsSet: Set<number> = new Set([
    // Temporary "super dailies" from Bonus Costume campaigns
    10003102, 10003202, 10003302, 11014102, 11014202, 11014302, 12034102, 12034202, 12034302,
    12074102, 12074202, 12074302, 10011102, 10011202, 10011302,
    // Version 1 of Hop Step Nonstop (accidentally released too early)
    11072101, 11072201, 11072301,
    // Lives that were Free Lives originally (version 1) but became dailies later (version 2)
    12088101, 12088201, 12088301, 12090101, 12090201, 12090301, 12092101, 12092201, 12092301
]);
const isFilteredLiveDiff = (liveDiffId: number) => filteredLiveDiffsSet.has(liveDiffId);

const groupIdFromLiveId = (liveId: number) => Math.floor(liveId / 1000) % 10;
const difficultyIdFromLiveDiffId = (liveDiffId: number) => Math.floor(liveDiffId / 10) % 100;
const versionIdFromLiveDiffId = (liveDiffId: number) => liveDiffId % 10;

export const GET: RequestHandler = async () => {
    const livesDict: { [liveId: number]: LiveListItem } = {};
    const liveIdsByGroupId: { [groupId: number]: number[] } = {
        0: [],
        1: [],
        2: [],
        3: []
    };
    const storyOrder: { [liveDiffId: number]: number } = {};

    for (const f of fs.readdirSync("static/json/live")) {
        if (f.endsWith(".json")) {
            const liveDiffId = parseInt(f.substring(0, f.length - 5));

            // These pages only contain Free Lives, active Event lives and Story Stages
            const isEventLiveDiff = isActiveEventLiveDiff(liveDiffId);
            if ((!isEventLiveDiff && !isFreeLiveDiff(liveDiffId) && !isStoryStageLiveDiff(liveDiffId))
                    || isFilteredLiveDiff(liveDiffId)) {
                continue;
            }

            const liveData: LiveData = JSON.parse(fs.readFileSync("static/json/live/" + f).toString());
            const liveId = liveData.live_id;
            if (!livesDict.hasOwnProperty(liveId)) {
                liveIdsByGroupId[groupIdFromLiveId(liveId)].push(liveId);
                livesDict[liveId] = {
                    display_order: liveData.display_order,
                    name: {kn: liveData.song_name, ro: SongNames.getNameRo(liveId)},
                    name_suffix: SongNames.getSuffix(liveId),
                    attribute: Attribute.NONE,
                    unavailable: !isEventLiveDiff,
                    permanent: isEventLiveDiff,
                    daily_weekday: null,
                    time_limit: Settings.limited_song_deadlines[liveId] ?? null,
                    live_difficulty_ids: {free: [], story: []},
                    default_live_difficulty_id: 0
                };
            }

            if (isStoryStageLiveDiff(liveDiffId)) {
                const storyExtraInfo = <LiveDataExtraStory>liveData.extra_info;
                livesDict[liveId].live_difficulty_ids.story.push({liveDiffId, extraInfo: storyExtraInfo});
                storyOrder[liveDiffId] = storyExtraInfo.story_chapter * 1000 + storyExtraInfo.story_stage * 10
                        + (storyExtraInfo.story_is_hard_mode ? 1 : 0);
            } else {
                // Priority for song info/default difficulty: Adv > Adv+ > Cha > Int > Beg
                const currentDefaultDiff = difficultyIdFromLiveDiffId(livesDict[liveId].default_live_difficulty_id);
                const currentDefaultPrio = (currentDefaultDiff >= 30) ? currentDefaultDiff : (200 - currentDefaultDiff)
                        + versionIdFromLiveDiffId(livesDict[liveId].default_live_difficulty_id) / 10;
                const thisDiff = difficultyIdFromLiveDiffId(liveDiffId);
                const thisPrio = (thisDiff >= 30) ? thisDiff : (200 - thisDiff)
                        + versionIdFromLiveDiffId(liveDiffId) / 10;

                if (livesDict[liveId].default_live_difficulty_id === 0 || thisPrio < currentDefaultPrio) {
                    livesDict[liveId].default_live_difficulty_id = liveDiffId;
                    livesDict[liveId].attribute = liveData.song_attribute;
                    if (!isEventLiveDiff) {
                        livesDict[liveId].daily_weekday = (<LiveDataExtraFree>liveData.extra_info).daily_weekday;
                    }
                }

                livesDict[liveId].live_difficulty_ids.free.push(liveDiffId);
                if (!isEventLiveDiff) {
                    livesDict[liveId].unavailable =
                            (!(<LiveDataExtraFree>liveData.extra_info).is_available) && livesDict[liveId].unavailable;
                    livesDict[liveId].permanent =
                            (<LiveDataExtraFree>liveData.extra_info).is_permanent || livesDict[liveId].permanent;
                }
            }
        }
    }

    Object.keys(livesDict).forEach(liveId => {
        livesDict[parseInt(liveId)].live_difficulty_ids.free.sort((a, b) => {
            return ((10 - versionIdFromLiveDiffId(a)) * 100 + difficultyIdFromLiveDiffId(a))
                    - ((10 - versionIdFromLiveDiffId(b)) * 100 + difficultyIdFromLiveDiffId(b));
        });
        livesDict[parseInt(liveId)].live_difficulty_ids.story.sort((a, b) => {
            return storyOrder[a.liveDiffId] - storyOrder[b.liveDiffId];
        });
    });
    Object.keys(liveIdsByGroupId).forEach(groupId => {
        liveIdsByGroupId[parseInt(groupId)].sort((a, b) => {
            return livesDict[a].display_order - livesDict[b].display_order;
        });
    });

    return json({lives: livesDict, by_group: liveIdsByGroupId});
}
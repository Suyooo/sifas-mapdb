/*
This module creates the HTML code for the note map timeline and panels for gimmick/AC info, used for the Map DB pages.
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

const NoteType = require("./enums/noteType");
const SkillFinishType = require("./enums/skillFinishType");
const NoteGimmickTrigger = require("./enums/noteGimmickTrigger");
const ACMissionType = require("./enums/acMissionType");
const {Skyline, GIMMICK_MARKER_PADDING} = require("./utils");

function isCleansable(skill) {
    return null;
}

function acColor(acType) {
    if (acType === ACMissionType.VOLTAGE_TOTAL) return `vo`;
    if (acType === ACMissionType.TIMING_NICE) return `sk`;
    if (acType === ACMissionType.TIMING_GREAT) return `sk`;
    if (acType === ACMissionType.TIMING_WONDERFUL) return `sk`;
    if (acType === ACMissionType.VOLTAGE_SINGLE) return `vo`;
    if (acType === ACMissionType.VOLTAGE_SP) return `sp`;
    if (acType === ACMissionType.UNIQUE) return `vo`;
    if (acType === ACMissionType.CRITICALS) return `sk`;
    if (acType === ACMissionType.SKILLS) return `sk`;
    if (acType === ACMissionType.STAMINA) return `gd`;
    throw new Error(`Unknown AC Mission Type ${acType}`);
}

function makeNotemap(liveData) {
    try {
        const liveInfo = {
            hasNoteMap: liveData.notes !== null,
            hasSongGimmicks: liveData.gimmick !== null,
            noteGimmicks: [],
            appealChances: []
        };
        const gimmickCounts = {};
        const gimmickSlotCounts = {};

        if (liveInfo.hasNoteMap) {
            liveInfo.notes = [];

            const firstNoteTime = liveData.notes[0].time;
            const lastNoteTime = liveData.notes[liveData.notes.length - 1].time;
            // notes are placed in the center 98% of the timeline, but we need the total time covered for timing
            const mapLength = (lastNoteTime - firstNoteTime);

            const gimmickMarkersStacksToDo = liveData.note_gimmicks.map(_ => []);

            for (let ni = 0; ni < liveData.notes.length; ni++) {
                const note = liveData.notes[ni];
                const noteData = {
                    index: ni,
                    timePosition: (note.time - firstNoteTime) / mapLength,
                    turnPosition: ni / (liveData.notes.length - 1),
                    cssClass: (note.rail == 1 ? 'top' : 'bottom'),
                    hasGimmick: note.gimmick !== null,
                    isHold: note.type === NoteType.HOLD_START
                };

                if (noteData.isHold) {
                    let endNi = ni + 1;
                    while (liveData.notes[endNi].rail !== note.rail || liveData.notes[endNi].type !== NoteType.HOLD_END) {
                        endNi++;
                    }
                    noteData.timeLength = (liveData.notes[endNi].time - note.time) / mapLength;
                    noteData.turnLength = (endNi - ni) / (liveData.notes.length - 1);
                }

                if (noteData.hasGimmick) {
                    if (gimmickCounts[note.gimmick] === undefined) {
                        gimmickCounts[note.gimmick] = 0;
                    }
                    gimmickCounts[note.gimmick]++;

                    const shouldCountSlots = liveData.note_gimmicks[note.gimmick].trigger >= NoteGimmickTrigger.ON_VO_HIT;
                    if (shouldCountSlots) {
                        if (gimmickSlotCounts[note.gimmick] === undefined) {
                            gimmickSlotCounts[note.gimmick] = [0, 0, 0];
                        }
                        gimmickSlotCounts[note.gimmick][ni % 3]++;
                    }

                    const positionRelative = (note.time - firstNoteTime) / mapLength;

                    const gimmickMarkerData = {
                        gimmickIndex: note.gimmick,
                        noteIndex: ni,
                        hasSlotNo: shouldCountSlots,
                        hasLength: liveData.note_gimmicks[note.gimmick].finish_type === SkillFinishType.NOTE_COUNT,
                        timePosition: positionRelative,
                        turnPosition: ni / (liveData.notes.length - 1)
                    };

                    if (shouldCountSlots) {
                        gimmickMarkerData.slotNo = ni % 3;
                    }

                    if (gimmickMarkerData.hasLength) {
                        let endNi = ni + liveData.note_gimmicks[note.gimmick].finish_amount;
                        if (endNi >= liveData.notes.length) endNi = liveData.notes.length - 1;
                        gimmickMarkerData.timeLength = (liveData.notes[endNi].time - note.time) / mapLength;
                        gimmickMarkerData.turnLength = (endNi - ni) / (liveData.notes.length - 1);
                    }

                    noteData.gimmickMarker = gimmickMarkerData;
                    gimmickMarkersStacksToDo[note.gimmick].push(gimmickMarkerData);
                }

                liveInfo.notes.push(noteData);
            }

            // Skyline to assign the gimmick markers to layers to avoid overlapping
            // A skyline is used so gimmicks can't stack below lower-numbered ones - that means generally, gimmick
            // markers should be grouped around the other markers of the same gimmick
            const skylineGlobal = new Skyline();

            // Note gimmicks with length markers should be farther down in the stack
            const gimmickMarkersStackOrder = Object.keys(gimmickMarkersStacksToDo).map(i => parseInt(i))
                .sort((a, b) => {
                    const aExample = gimmickMarkersStacksToDo[a][0];
                    const bExample = gimmickMarkersStacksToDo[b][0];
                    if (aExample && !bExample) return -1; // avoid erroring on unused note gimmicks
                    if (bExample && !aExample) return 1;
                    if (aExample.hasLength && !bExample.hasLength) return -1;
                    if (bExample.hasLength && !aExample.hasLength) return 1;
                    return a - b;
                });

            for (const gimmickId of gimmickMarkersStackOrder) {
                // Within the same gimmick, markers can shuffle below - so instead keep track of how long every layer
                // is blocked, and just place the marker on the first available one
                const layersBlockedUntilGlobal = {};
                const layersBlockedUntilGimmick = {};
                const skylineGimmick = new Skyline();

                for (const gimmickMarker of gimmickMarkersStacksToDo[gimmickId]) {
                    let layerGimmick = 0;
                    while ((layersBlockedUntilGimmick[layerGimmick] || -1) > gimmickMarker.timePosition - GIMMICK_MARKER_PADDING) {
                        layerGimmick++;
                    }
                    let layerGlobal = skylineGlobal.get(gimmickMarker.timePosition, gimmickMarker.timeLength) + 1 + layerGimmick;
                    while ((layersBlockedUntilGlobal[layerGlobal] || -1) > gimmickMarker.timePosition - GIMMICK_MARKER_PADDING) {
                        layerGlobal++;
                    }

                    layersBlockedUntilGlobal[layerGlobal] = layersBlockedUntilGimmick[layerGimmick] =
                        gimmickMarker.timePosition + (gimmickMarker.timeLength || GIMMICK_MARKER_PADDING);
                    gimmickMarker.globalLayer = layerGlobal;
                    gimmickMarker.thisGimmickLayer = layerGimmick;
                    skylineGimmick.add(gimmickMarker.timePosition, gimmickMarker.globalLayer, gimmickMarker.timeLength);
                }

                for (const gimmickMarker of gimmickMarkersStacksToDo[gimmickId]) {
                    skylineGlobal.merge(skylineGimmick);
                }
            }

            liveInfo.mapInfo = {
                noteCount: liveData.notes.length,
                markerLayerCount: skylineGlobal.get(0, 1) + 1,
                mapLength: mapLength,
                hasActualSongLength: liveData.song_length !== undefined
            };
            if (liveInfo.mapInfo.hasActualSongLength) {
                const min = Math.floor(liveData.song_length / 60000);
                const sec = Math.floor(liveData.song_length % 60000 / 1000);
                liveInfo.mapInfo.songLength = min + ':' + (sec < 10 ? '0' : '') + sec;
            }
        }

        if (liveInfo.hasSongGimmicks) {
            liveInfo.songGimmicks = liveData.gimmick.map((gimmick, index) => {
                return {
                    index,
                    gimmick: gimmick,
                    isCleansable: isCleansable(gimmick)
                }
            });
        }

        for (let gi = 0; gi < liveData.note_gimmicks.length; gi++) {
            const noteGimmickData = {
                index: gi,
                gimmick: liveData.note_gimmicks[gi]
            };

            if (liveInfo.hasNoteMap) {
                noteGimmickData.count = gimmickCounts[gi];
                noteGimmickData.hasSlotCounts = gimmickSlotCounts[gi] !== undefined;
                if (noteGimmickData.hasSlotCounts) noteGimmickData.slotCounts = gimmickSlotCounts[gi];
            }

            liveInfo.noteGimmicks.push(noteGimmickData);
        }

        let totalACNotes = 0;
        let totalACReward = 0;
        for (let ai = 0; ai < liveData.appeal_chances.length; ai++) {
            const ac = liveData.appeal_chances[ai];
            const acData = {
                index: ai,
                cssClass: acColor(ac.mission_type),
                missionType: ac.mission_type,
                missionValue: ac.mission_value,
                hasGimmick: ac.gimmick !== null,
                hasPerNoteInfo: false
            };

            let skillstr;
            if (acData.hasGimmick) {
                acData.gimmick = ac.gimmick;
            }

            if (liveInfo.hasNoteMap) {
                const mapLength = (liveData.notes[liveData.notes.length - 1].time - liveData.notes[0].time);
                acData.timePosition = (liveData.notes[ac.range_note_ids[0]].time - liveData.notes[0].time) / mapLength;
                acData.timeLength
                    = (liveData.notes[ac.range_note_ids[1]].time - liveData.notes[ac.range_note_ids[0]].time) / mapLength;
                acData.turnPosition = ac.range_note_ids[0] / (liveData.notes.length - 1);
                acData.turnLength = (ac.range_note_ids[1] - ac.range_note_ids[0]) / (liveData.notes.length - 1);

                acData.noteCount = ac.range_note_ids[1] - ac.range_note_ids[0] + 1;
                totalACNotes += acData.noteCount;
                totalACReward += ac.reward_voltage;

                if (ac.mission_type === ACMissionType.VOLTAGE_TOTAL) {
                    acData.hasPerNoteInfo = true;
                    acData.perNoteInfo = "(avg. "
                        + Math.ceil(ac.mission_value / acData.noteCount)
                        + " Voltage per note)";
                } else if (ac.mission_type === ACMissionType.CRITICALS) {
                    acData.hasPerNoteInfo = true;
                    acData.perNoteInfo = "("
                        + Math.ceil(ac.mission_value / acData.noteCount * 100)
                        + "% of notes must crit)";
                } else if (ac.mission_type === ACMissionType.SKILLS) {
                    acData.hasPerNoteInfo = true;
                    acData.perNoteInfo = "("
                        + Math.ceil(ac.mission_value / acData.noteCount * 100)
                        + "% of taps must proc)";
                }
                acData.rewardVoltage = ac.reward_voltage;
                acData.penaltyDamage = ac.penalty_damage;
            }
            liveInfo.appealChances.push(acData);
        }
        if (liveInfo.hasNoteMap) {
            liveInfo.mapInfo.totalACNotes = totalACNotes;
            liveInfo.mapInfo.totalACNotesPercentage = Math.round((totalACNotes / liveData.notes.length) * 100) + "%";
            liveInfo.mapInfo.totalACReward = totalACReward;
            liveInfo.mapInfo.totalNoteDamage
                = liveData.notes.length * liveData.note_damage + totalACNotes * Math.floor(liveData.note_damage / 10);
        }

        return liveInfo;
    } catch (e) {
        console.log("In Live " + liveData.live_id + " (Diff " + liveData.song_difficulty + "): " + e.stack);
        throw e;
    }
}

module.exports = {
    make: makeNotemap,
    isCleansable
};

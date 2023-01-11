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
const ACGimmickTrigger = require("./enums/acGimmickTrigger");
const ACMissionType = require("./enums/acMissionType");
const {Skyline, GIMMICK_MARKER_PADDING} = require("./utils");

function capitalizeFirstLetter(s) {
    if (s.charAt(0) == "µ") return s; // don't uppercase µ
    return s.substring(0, 1).toUpperCase() + s.substring(1);
}

function format(x) {
    // https://stackoverflow.com/a/2901298
    let parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "&#8239;");
    return parts.join(".");
}

function skill(skill) {
    let eff = skillEffect(skill.effect_type, skill.effect_amount);
    return (removeTargetSet.has(skill.effect_type) ? "" : skillTarget(skill.target)) + eff +
        skillFinish(skill.finish_type, skill.finish_amount, eff.indexOf("SP Voltage Gain") !== -1);
    // TODO: The parameter for isSPVoltageGainBuff is based on the skill effect strings above right now...
    //  so it's prone to typos and will break if translated
}

// Skill Effect Types that have no target - never print a target for these, even if one is defined in the live info
const removeTargetSet = new Set([3, 4, 5, 68, 69, 70, 91, 93, 96, 101, 105, 112, 128, 130, 132, 134, 263]);

function skillTarget(targetId) {
    if (targetId === 1) return 'all units ';
    if (targetId === 15) return 'You units ';
    if (targetId === 16) return 'Yoshiko units ';
    if (targetId === 17) return 'Hanamaru units ';
    if (targetId === 18) return 'Mari units ';
    if (targetId === 19) return 'Ruby units ';
    if (targetId === 20) return 'Ayumu units ';
    if (targetId === 21) return 'Kasumi units ';
    if (targetId === 22) return 'Shizuku units ';
    if (targetId === 23) return 'Ai units ';
    if (targetId === 24) return 'Karin units ';
    if (targetId === 25) return 'Kanata units ';
    if (targetId === 26) return 'Setsuna units ';
    if (targetId === 27) return 'Emma units ';
    if (targetId === 28) return 'Rina units ';
    if (targetId === 29) return 'µ\'s units ';
    if (targetId === 30) return 'Aqours units ';
    if (targetId === 31) return 'Nijigaku units ';
    if (targetId === 32) return 'Printemps units ';
    if (targetId === 35) return 'CYaRon units ';
    if (targetId === 36) return 'AZALEA units ';
    if (targetId === 37) return 'Guilty Kiss units ';
    if (targetId === 38) return '<span class="t vo">Vo</span> units ';
    if (targetId === 39) return '<span class="t sp">Sp</span> units ';
    if (targetId === 40) return '<span class="t gd">Gd</span> units ';
    if (targetId === 41) return '<span class="t sk">Sk</span> units ';
    if (targetId === 58) return ''; // no target (affecting SP charge or stamina)
    if (targetId === 61) return '<span class="a smile">Smile</span> units ';
    if (targetId === 62) return '<span class="a pure">Pure</span> units ';
    if (targetId === 63) return '<span class="a cool">Cool</span> units ';
    if (targetId === 64) return '<span class="a active">Active</span> units ';
    if (targetId === 65) return '<span class="a natural">Natural</span> units ';
    if (targetId === 66) return '<span class="a elegant">Elegant</span> units ';
    if (targetId === 67) return 'non-<span class="a smile">Smile</span> units ';
    if (targetId === 68) return 'non-<span class="t vo">Vo</span> units ';
    if (targetId === 69) return '1st Year units ';
    if (targetId === 70) return '2nd Year units ';
    if (targetId === 71) return '3rd Year units ';
    if (targetId === 72) return 'non-<span class="a pure">Pure</span> units ';
    if (targetId === 73) return 'non-<span class="a cool">Cool</span> units ';
    if (targetId === 74) return 'non-<span class="a active">Active</span> units ';
    if (targetId === 75) return 'non-<span class="a natural">Natural</span> units ';
    if (targetId === 76) return 'non-<span class="a elegant">Elegant</span> units ';
    if (targetId === 77) return 'non-<span class="t sp">Sp</span> units ';
    if (targetId === 78) return 'non-<span class="t gd">Gd</span> units ';
    if (targetId === 79) return 'non-<span class="t sk">Sk</span> units ';
    if (targetId === 83) return 'units in the current strategy ';
    if (targetId === 86) return 'non-µ\'s units ';
    if (targetId === 87) return 'non-<span class="t vo">Vo</span> or <span class="t gd">Gd</span> units ';
    if (targetId === 88) return 'non-<span class="t vo">Vo</span> or <span class="t sp">Sp</span> units ';
    if (targetId === 89) return 'non-<span class="t vo">Vo</span> or <span class="t sk">Sk</span> units ';
    if (targetId === 90) return 'non-<span class="t gd">Gd</span> or <span class="t sp">Sp</span> units ';
    if (targetId === 91) return 'non-<span class="t gd">Gd</span> or <span class="t sk">Sk</span> units ';
    if (targetId === 92) return 'non-<span class="t sp">Sp</span> or <span class="t sk">Sk</span> units ';
    if (targetId === 93) return '<span class="t sp">Sp</span> and <span class="t sk">Sk</span> units ';
    if (targetId === 94) return '<span class="t gd">Gd</span> and <span class="t sk">Sk</span> units ';
    if (targetId === 96) return '<span class="t vo">Vo</span> and <span class="t sk">Sk</span> units ';
    if (targetId === 97) return '<span class="t vo">Vo</span> and <span class="t sp">Sp</span> units ';
    if (targetId === 98) return '<span class="t vo">Vo</span> and <span class="t gd">Gd</span> units ';
    if (targetId === 99) return 'non-Aqours units ';
    if (targetId === 100) return 'non-Niji units ';
    if (targetId === 101) return 'non-1st Year units ';
    if (targetId === 102) return 'non-2nd Year units ';
    if (targetId === 103) return 'non-3rd Year units ';
    if (targetId === 104) return 'DiverDiva units ';
    if (targetId === 105) return 'A•ZU•NA units ';
    if (targetId === 106) return 'QU4RTZ units ';
    if (targetId === 107) return 'non-DiverDiva units ';
    if (targetId === 108) return 'non-A•ZU•NA units ';
    if (targetId === 109) return 'non-QU4RTZ units ';
    if (targetId === 110) return 'R3BIRTH units ';
    if (targetId === 112) return 'Shioriko units ';
    if (targetId === 113) return 'Lanzhu units ';
    if (targetId === 114) return 'Mia units ';
    if (targetId === 115) return '<span class="a cool">Cool</span> Aqours units ';
    throw new Error('Unknown Skill Target ' + targetId);
}

function skillEffect(typeId, amount) {
    if (typeId === 3) return 'charge SP Gauge by ' + format(amount) + ' points';
    if (typeId === 4) return 'gain ' + format(amount) + ' points of shield';
    if (typeId === 5) return 'restore ' + format(amount) + ' points of stamina';
    if (typeId === 17) return 'gain ' + format(amount / 100) + '% Appeal';
    if (typeId === 18) return 'increase Voltage Gain by ' + format(amount / 100) + '%';
    if (typeId === 19) return 'gain ' + format(amount / 100) + '% SP Gauge Fill Rate';
    if (typeId === 20) return 'gain ' + format(amount / 100) + '% Critical Chance';
    if (typeId === 21) return 'gain ' + format(amount / 100) + '% Critical Power';
    if (typeId === 22) return 'gain ' + format(amount / 100) + '% Skill Activation Chance';
    if (typeId === 23) return 'increase SP Voltage Gain by ' + format(amount / 100) + '%';
    if (typeId === 26) return 'gain ' + format(amount / 100) + '% Base Appeal';
    if (typeId === 33) return 'gain ' + format(amount / 100) + '% Base Skill Activation Chance';
    if (typeId === 36) return 'gain ' + format(amount / 100) + '% Base Critical Chance';
    if (typeId === 45) return 'gain ' + format(amount / 100) + '% Base SP Gauge Fill Rate';
    if (typeId === 46) return 'gain ' + format(amount / 100) + '% Base Critical Chance';
    if (typeId === 47) return 'gain ' + format(amount / 100) + '% Base Critical Power';
    if (typeId === 48) return 'gain ' + format(amount / 100) + '% Base Skill Activation Chance';
    if (typeId === 49) return 'gain ' + format(amount / 100) + '% Base Appeal';
    if (typeId === 50) return 'increase Base SP Voltage Gain by ' + format(amount / 100) + '%';
    if (typeId === 51) return 'increase Base Voltage Gain by ' + format(amount / 100) + '%';
    if (typeId === 52) return 'lose all buffs (excluding those affecting Base values)';
    if (typeId === 68) return 'take ' + format(amount) + ' points of stamina damage';
    if (typeId === 69) return 'discharge SP Gauge by ' + format(amount / 100) + '%';
    if (typeId === 70) return 'lose ' + format(amount) + ' points of shield';
    if (typeId === 71) return 'lose ' + format(amount / 100) + '% Appeal';
    if (typeId === 72) return 'lose ' + format(amount / 100) + '% Tap Voltage';
    if (typeId === 73) return 'lose ' + format(amount / 100) + '% SP Gauge Fill Rate';
    if (typeId === 74) return 'lose ' + format(amount / 100) + '% Critical Chance';
    if (typeId === 75) return 'lose ' + format(amount / 100) + '% Critical Power';
    if (typeId === 76) return 'lose ' + format(amount / 100) + '% Skill Activation Chance';
    if (typeId === 77) return 'reduce SP Voltage Gain by ' + format(amount / 100) + '%';
    if (typeId === 78) return 'lose ' + format(amount / 100) + '% Base Skill Activation Chance';
    if (typeId === 79) return 'lose ' + format(amount / 100) + '% Base Tap Voltage';
    if (typeId === 81) return 'lose ' + format(amount / 100) + '% Base Appeal';
    if (typeId === 82) return 'lose ' + format(amount / 100) + '% Base Critical Chance';
    if (typeId === 83) return 'lose ' + format(amount / 100) + '% Base SP Gauge Fill Rate';
    if (typeId === 84) return 'lose ' + format(amount / 100) + '% Base Appeal';
    if (typeId === 85) return 'lose ' + format(amount / 100) + '% Base SP Gauge Fill Rate';
    if (typeId === 86) return 'lose ' + format(amount / 100) + '% Base Skill Activation Chance';
    if (typeId === 87) return 'lose ' + format(amount / 100) + '% Base Critical Chance';
    if (typeId === 91) return 'charge SP Gauge by ' + format(amount / 100) + '%';
    if (typeId === 93) return 'gain ' + format(amount / 100) + '% of max Stamina as shield';
    if (typeId === 96) return 'restore ' + format(amount / 100) + '% of max Stamina';
    if (typeId === 101) return 'increase Stamina Damage by ' + format(amount / 100) + '%';
    if (typeId === 105) return 'increase Stamina Damage by ' + format(amount / 100) + '%';
    if (typeId === 112) return 'charge SP Gauge by ' + format(amount / 100) + '% of the tapping card\'s Technique';
    if (typeId === 118) return 'increase the Stamina Recovery from their Strategy Switch bonus by ' + format(amount / 100) + '%';
    if (typeId === 119) return 'gain ' + format(amount / 100) + '% Appeal for each <span class="t vo">Vo</span> unit in the formation';
    if (typeId === 120) return 'lose ' + format(amount / 100) + '% Appeal for each <span class="t vo">Vo</span> unit in the formation';
    if (typeId === 123) return 'gain ' + format(amount / 100) + '% Appeal for each <span class="t sk">Sk</span> unit in the formation';
    if (typeId === 128) return 'restore ' + format(amount) + ' points of stamina for each <span class="t vo">Vo</span> unit in the formation';
    if (typeId === 130) return 'restore ' + format(amount) + ' points of stamina for each <span class="t sp">Sp</span> unit in the formation';
    if (typeId === 132) return 'restore ' + format(amount) + ' points of stamina for each <span class="t sk">Sk</span> unit in the formation';
    if (typeId === 134) return 'restore ' + format(amount) + ' points of stamina for each <span class="t gd">Gd</span> unit in the formation';
    if (typeId === 137) return 'gain ' + format(amount / 100) + '% Base Appeal for each <span class="t vo">Vo</span> unit in the formation';
    if (typeId === 139) return 'gain ' + format(amount / 100) + '% Base Appeal for each <span class="t sp">Sp</span> unit in the formation';
    if (typeId === 141) return 'gain ' + format(amount / 100) + '% Base Appeal for each <span class="t sk">Sk</span> unit in the formation';
    if (typeId === 143) return 'gain ' + format(amount / 100) + '% Base Appeal for each <span class="t gd">Gd</span> unit in the formation';
    if (typeId === 161) return 'gain ' + format(amount / 100) + '% Skill Activation Chance for each <span class="t vo">Vo</span> unit in the formation';
    if (typeId === 163) return 'gain ' + format(amount / 100) + '% Skill Activation Chance for each <span class="t sk">Sk</span> unit in the formation';
    if (typeId === 164) return 'gain ' + format(amount / 100) + '% Skill Activation Chance for each <span class="t gd">Gd</span> unit in the formation';
    if (typeId === 169) return 'gain ' + format(amount / 100) + '% Base Skill Activation Chance for each <span class="t vo">Vo</span> unit in the formation';
    if (typeId === 170) return 'gain ' + format(amount / 100) + '% Base Skill Activation Chance for each <span class="t sp">Sp</span> unit in the formation';
    if (typeId === 171) return 'gain ' + format(amount / 100) + '% Base Skill Activation Chance for each <span class="t sk">Sk</span> unit in the formation';
    if (typeId === 172) return 'gain ' + format(amount / 100) + '% Base Skill Activation Chance for each <span class="t gd">Gd</span> unit in the formation';
    if (typeId === 177) return 'gain ' + format(amount / 100) + '% Critical Chance for each <span class="t vo">Vo</span> unit in the formation';
    if (typeId === 179) return 'gain ' + format(amount / 100) + '% Critical Chance for each <span class="t sk">Sk</span> unit in the formation';
    if (typeId === 185) return 'gain ' + format(amount / 100) + '% Base Critical Chance for each <span class="t vo">Vo</span> unit in the formation';
    if (typeId === 187) return 'gain ' + format(amount / 100) + '% Base Critical Chance for each <span class="t sk">Sk</span> unit in the formation';
    if (typeId === 193) return 'gain ' + format(amount / 100) + '% Critical Power for each <span class="t vo">Vo</span> unit in the formation';
    if (typeId === 210) return 'increase SP Voltage Gain by ' + format(amount / 100) + '% for each <span class="t sp">Sp</span> unit in the formation';
    if (typeId === 217) return 'increase Base SP Voltage Gain by ' + format(amount / 100) + '% for each <span class="t vo">Vo</span> unit in the formation';
    if (typeId === 218) return 'increase Base SP Voltage Gain by ' + format(amount / 100) + '% for each <span class="t sp">Sp</span> unit in the formation';
    if (typeId === 219) return 'increase Base SP Voltage Gain by ' + format(amount / 100) + '% for each <span class="t sk">Sk</span> unit in the formation';
    if (typeId === 226) return 'increase the Cooldown Reduction from their Strategy Switch bonus by ' + format(amount) + ' turns';
    if (typeId === 228) return 'increase the Base Voltage Gain from their Strategy Switch bonus by ' + format(amount);
    if (typeId === 229) return 'increase the Base Cooldown Reduction from their Strategy Switch bonus by ' + format(amount) + ' turns';
    if (typeId === 230) return 'increase Base SP Gain from their Strategy Switch bonus by ' + format(amount) + ' points';
    if (typeId === 263) return 'take ' + format(amount / 100) + '% of max Stamina as damage, bypassing Shield';
    if (typeId === 265) return 'block Healing';
    throw new Error('Unknown Skill Effect Type ' + typeId);
}

function skillFinish(conditionId, amount, isSPVoltageGainBuff) {
    if (conditionId === SkillFinishType.UNTIL_SONG_END) return ' until the song ends'
    if (conditionId === SkillFinishType.NOTE_COUNT) return ' for ' + format(amount) + ' notes'
    if (conditionId === SkillFinishType.INSTANT) return ""
    if (conditionId === SkillFinishType.UNTIL_AC_END) return "" // (this is handled in the trigger switch below)
    if (conditionId === SkillFinishType.SP_COUNT) {
        if (isSPVoltageGainBuff) {
            if (amount == 1) return ' for the next SP Skill'
            else return ' for the next ' + amount + ' SP Skills'
        } else {
            if (amount == 1) return ' until a SP Skill is used'
            else return ' until ' + amount + ' SP Skills are used'
        }
    }
    if (conditionId === SkillFinishType.UNTIL_SWITCH) {
        if (amount <= 1) return ' until the next Strategy switch'
        else return ' until Strategies are switched ' + amount + ' times'
    }
    throw new Error('Unknown Skill Finish Condition ' + conditionId);
}

function isCleansable(skill) {
    // TODO: This is based on the skill effect strings above right now... so it's prone to typos and will break if translated
    if (skill === null) return "-";
    return skillEffect(skill.effect_type, 0).indexOf("Base") === -1;
}

function acMission(typeId, goal) {
    if (typeId === ACMissionType.VOLTAGE_TOTAL) return 'Get ' + format(goal) + ' Voltage';
    if (typeId === ACMissionType.TIMING_NICE) return 'Hit ' + format(goal) + ' NICEs';
    if (typeId === ACMissionType.TIMING_GREAT) return 'Hit ' + format(goal) + ' GREATs';
    if (typeId === ACMissionType.TIMING_WONDERFUL) return 'Hit ' + format(goal) + ' WONDERFULs';
    if (typeId === ACMissionType.VOLTAGE_SINGLE) return 'Get ' + format(goal) + ' Voltage in one Appeal';
    if (typeId === ACMissionType.VOLTAGE_SP) return 'Get ' + format(goal) + ' Voltage from SP';
    if (typeId === ACMissionType.UNIQUE) return 'Appeal with ' + format(goal) + ' unique Units';
    if (typeId === ACMissionType.CRITICALS) return 'Get ' + format(goal) + ' Criticals';
    if (typeId === ACMissionType.SKILLS) return 'Activate ' + format(goal) + ' Tap Skills';
    if (typeId === ACMissionType.STAMINA) {
        if (goal === 10000) return 'Finish the AC with ' + format(goal / 100) + '% of max Stamina';
        else return 'Finish the AC with ' + format(goal / 100) + '% of max Stamina or more';
    }
    throw new Error('Unknown AC Mission Type ' + typeId);
}

function acColor(typeId) {
    if (typeId === ACMissionType.VOLTAGE_TOTAL) return 'vo';
    if (typeId === ACMissionType.TIMING_NICE) return 'sk';
    if (typeId === ACMissionType.TIMING_GREAT) return 'sk';
    if (typeId === ACMissionType.TIMING_WONDERFUL) return 'sk';
    if (typeId === ACMissionType.VOLTAGE_SINGLE) return 'vo';
    if (typeId === ACMissionType.VOLTAGE_SP) return 'sp';
    if (typeId === ACMissionType.UNIQUE) return 'vo';
    if (typeId === ACMissionType.CRITICALS) return 'sk';
    if (typeId === ACMissionType.SKILLS) return 'sk';
    if (typeId === ACMissionType.STAMINA) return 'gd';
    throw new Error('Unknown AC Mission Type ' + typeId);
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
                noteCount: format(liveData.notes.length),
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
                let skillstr = capitalizeFirstLetter(skill(gimmick));
                if (gimmick.finish_type === SkillFinishType.UNTIL_SONG_END) {
                    // remove " until the song ends" if that is the condition - pretty much implied through being the song gimmick
                    skillstr = skillstr.substring(0, skillstr.length - 20);
                }

                return {
                    index,
                    skill: skillstr,
                    isCleansable: isCleansable(gimmick)
                }
            });
        }

        for (let gi = 0; gi < liveData.note_gimmicks.length; gi++) {
            let skillstr;
            switch (liveData.note_gimmicks[gi].trigger) {
                case NoteGimmickTrigger.ON_HIT:
                    skillstr = "If hit, ";
                    break;
                case NoteGimmickTrigger.ON_MISS:
                    skillstr = "If missed, ";
                    break;
                case NoteGimmickTrigger.ALWAYS:
                    skillstr = ""; // always
                    break;
                case NoteGimmickTrigger.ON_VO_HIT:
                    skillstr = 'If hit with a <span class="t vo">Vo</span> unit, ';
                    break;
                case NoteGimmickTrigger.ON_SP_HIT:
                    skillstr = 'If hit with an <span class="t sp">Sp</span> unit, ';
                    break;
                case NoteGimmickTrigger.ON_SK_HIT:
                    skillstr = 'If hit with an <span class="t sk">Sk</span> unit, ';
                    break;
                default:
                    throw new Error('Unknown Note Gimmick Trigger ' + liveData.note_gimmicks[gi].trigger);
            }

            skillstr += skill(liveData.note_gimmicks[gi]);
            if (liveData.note_gimmicks[gi].trigger === NoteGimmickTrigger.ALWAYS) {
                skillstr = capitalizeFirstLetter(skillstr);
            }

            const noteGimmickData = {
                index: gi,
                skill: skillstr
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
                mission: acMission(ac.mission_type, ac.mission_value),
                hasGimmick: ac.gimmick !== null,
                hasPerNoteInfo: false
            };

            let skillstr;
            if (acData.hasGimmick) {
                switch (ac.gimmick.trigger) {
                    case ACGimmickTrigger.ON_START:
                        skillstr = (ac.gimmick.finish_type === SkillFinishType.UNTIL_AC_END)
                            ? "During this AC, "
                            : "When the AC starts, ";
                        break;
                    case ACGimmickTrigger.ON_SUCCESS:
                        skillstr = "On AC Success, ";
                        break;
                    case ACGimmickTrigger.ON_FAIL:
                        skillstr = "On AC Failure, ";
                        break;
                    case ACGimmickTrigger.ON_END:
                        skillstr = "At the end of the AC, ";
                        break;
                    default:
                        throw new Error('Unknown AC Gimmick Trigger ' + ac.gimmick.trigger);
                }
                skillstr += skill(ac.gimmick);
                acData.gimmick = skillstr;
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
                        + format(Math.ceil(ac.mission_value / acData.noteCount))
                        + " Voltage per note)";
                } else if (ac.mission_type === ACMissionType.CRITICALS) {
                    acData.hasPerNoteInfo = true;
                    acData.perNoteInfo = "("
                        + format(Math.ceil(ac.mission_value / acData.noteCount * 100))
                        + "% of notes must crit)";
                } else if (ac.mission_type === ACMissionType.SKILLS) {
                    acData.hasPerNoteInfo = true;
                    acData.perNoteInfo = "("
                        + format(Math.ceil(ac.mission_value / acData.noteCount * 100))
                        + "% of taps must proc)";
                }
                acData.rewardVoltage = format(ac.reward_voltage);
                acData.penaltyDamage = format(ac.penalty_damage);
            }
            liveInfo.appealChances.push(acData);
        }
        if (liveInfo.hasNoteMap) {
            liveInfo.mapInfo.totalACNotes
                = format(totalACNotes) + " (" + format(Math.round((totalACNotes / liveData.notes.length) * 100)) + "%)";
            liveInfo.mapInfo.totalACReward = format(totalACReward);
            liveInfo.mapInfo.totalNoteDamage
                = format(liveData.notes.length * liveData.note_damage + totalACNotes * Math.floor(liveData.note_damage / 10));
        }

        return liveInfo;
    } catch (e) {
        console.log("In Live " + liveData.live_id + " (Diff " + liveData.song_difficulty + "): " + e.stack);
        throw e;
    }
}

module.exports = {
    make: makeNotemap,
    isCleansable,
    format
};

/*
This module generates the note map timeline and panels for gimmick/AC info, used for the Map DB pages.
Copyright (C) 2020-2023 Suyooo

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
    let eff = " " + skillEffect(skill.effect_type, skill.effect_amount);
    return (removeTargetSet.has(skill.effect_type) ? "" : skillTarget(skill.target)) + eff +
        skillFinish(skill.finish_type, skill.finish_amount, eff.indexOf("SP Voltage Gain") !== -1);
    // TODO: The parameter for isSPVoltageGainBuff is based on the skill effect strings above right now...
    //  so it's prone to typos and will break if translated
}

// Skill Effect Types that have no target - never print a target for these, even if one is defined in the live info
const removeTargetSet = new Set([3, 4, 5, 68, 69, 70, 91, 93, 96, 101, 105, 112, 128, 130, 132, 134, 263]);

function skillTarget(targetId) {
    if (targetId == 1) return 'All units';
    if (targetId == 13) return 'pieces of Canaan';
    if (targetId == 14) return 'diameter unit';
    if (targetId == 15) return 'units';
    if (targetId == 16) return 'Yoshikodai';
    if (targetId == 17) return 'years old';
    if (targetId == 18) return 'Financial Unit';
    if (targetId == 19) return 'ruby units';
    if (targetId == 20) return 'level unit';
    if (targetId == 21) return 'Kasumi Unit';
    if (targetId == 22) return 'drop units';
    if (targetId == 23) return 'AI units';
    if (targetId == 24) return 'Karin Unit';
    if (targetId == 25) return 'Kanata';
    if (targetId == 26) return 'Setsuna units';
    if (targetId == 27) return 'Unit Emma';
    if (targetId == 28) return 'line unit';
    if (targetId == 29) return 'µ unit';
    if (targetId == 30) return 'Aquars of';
    if (targetId == 31) return 'real unit';
    if (targetId == 32) return 'Prints';
    if (targetId == 33) return 'BB unit';
    if (targetId == 34) return 'White Lily units';
    if (targetId == 35) return 'CYaRon units';
    if (targetId == 36) return 'Azaleas';
    if (targetId == 37) return 'Guilty Kissing Unit';
    if (targetId == 38) return 'sound units';
    if (targetId == 39) return 'Unit SP';
    if (targetId == 40) return 'GD unit';
    if (targetId == 41) return 'sk units';
    if (targetId == 58) return '';
    if (targetId == 61) return 'smile unit';
    if (targetId == 62) return 'net units';
    if (targetId == 63) return 'legal entities';
    if (targetId == 64) return 'active units';
    if (targetId == 65) return 'natural units';
    if (targetId == 66) return 'elegant units';
    if (targetId == 67) return 'units without a smile';
    if (targetId == 68) return 'non-vo units';
    if (targetId == 69) return 'First year units';
    if (targetId == 70) return 'Second year units';
    if (targetId == 71) return 'Class III';
    if (targetId == 72) return 'incorrect units';
    if (targetId == 73) return 'units are not cool';
    if (targetId == 74) return 'passive units';
    if (targetId == 75) return 'unnatural entities';
    if (targetId == 76) return 'non-fashionable units';
    if (targetId == 77) return 'units outside SP';
    if (targetId == 78) return 'non-GD units';
    if (targetId == 79) return 'Non-Sk unit';
    if (targetId == 83) return 'units in the current strategy';
    if (targetId == 86) return 'non-µ units';
    if (targetId == 87) return 'Non-Wo or GD units';
    if (targetId == 88) return 'Non-Wo or SP units';
    if (targetId == 89) return 'units are neither vo nor sc';
    if (targetId == 90) return 'Non-GD or SP units';
    if (targetId == 91) return 'Non-GD or SK units';
    if (targetId == 92) return 'Non-SP or SK units';
    if (targetId == 93) return 'Sp and Sk units';
    if (targetId == 94) return 'GD and SK units';
    if (targetId == 96) return 'Wo aa sk units';
    if (targetId == 97) return 'Vo and Sp units';
    if (targetId == 98) return 'Wo and Gd units';
    if (targetId == 99) return 'units plus aquers';
    if (targetId == 100) return 'over the rainbow';
    if (targetId == 101) return 'with first-year credit';
    if (targetId == 102) return 'non-biennial units';
    if (targetId == 103) return 'units in the third year';
    if (targetId == 104) return 'Diverdiva units';
    if (targetId == 105) return 'units A/ZU/NA';
    if (targetId == 106) return 'QU4RTZ units';
    if (targetId == 107) return 'units with divers diva';
    if (targetId == 108) return 'A, Xu, NA with';
    if (targetId == 109) return 'units are not QU4RTZ';
    if (targetId == 110) return 'R3BIRTH units';
    if (targetId == 112) return 'Shioriko units';
    if (targetId == 113) return 'Ranchi';
    if (targetId == 114) return 'miles drive';
    if (targetId == 115) return 'Cool Aquares units';

    throw new Error('Unknown Skill Target ' + targetId);
}

function skillEffect(typeId, amount) {
    if (typeId == 3) return '' + format(amount) + ' loads the SP meter.';
    if (typeId == 4) return '' + format(amount) + ' Gain Shield Points';
    if (typeId == 5) return 'Answers ' + format(amount) + ' Stamina Points';
    if (typeId == 17) return 'Buff ' + format(amount / 100) + ' % Draw';
    if (typeId == 18) return 'Increase voltage gain by ' + format(amount / 100) + '%.';
    if (typeId == 19) return '' + format(amount / 100) + '% SP gauge recharge speed added';
    if (typeId == 20) return '' + format(amount / 100) + '% more critical chance';
    if (typeId == 21) return 'Critical damage increased by ' + format(amount / 100) + '%';
    if (typeId == 22) return 'Earn ' + format(amount / 100) + '% Knowledge Implementation Opportunities';
    if (typeId == 23) return 'SP Increases voltage gain by ' + format(amount / 100) + '%.';
    if (typeId == 26) return 'Profit ' + format(amount / 100) + ' % Claim basis';
    if (typeId == 33) return 'wins ' + format(amount / 100) + '% base skill chance';
    if (typeId == 36) return 'Adds ' + format(amount / 100) + '% to critical base chance';
    if (typeId == 45) return 'Added ' + format(amount / 100) + '% to the base SP slot fill percentage';
    if (typeId == 46) return 'Adds ' + format(amount / 100) + '% to critical base chance';
    if (typeId == 47) return 'Critical Strength increased by ' + format(amount / 100) + '%';
    if (typeId == 48) return 'Basic skill activation probability increase ' + format(amount / 100) + '%.';
    if (typeId == 49) return 'Profit ' + format(amount / 100) + ' % Claim basis';
    if (typeId == 50) return 'Base SP voltage gain increased by ' + format(amount / 100) + ' %.';
    if (typeId == 51) return 'Increase base voltage gain by ' + format(amount / 100) + '%.';
    if (typeId == 52) return 'removes all buffs (except those that affect base values).';
    if (typeId == 68) return 'Hold ' + format(amount) + ' Stamina Damage';
    if (typeId == 69) return 'Meter SP release ' + format(amount / 100) + ' %.';
    if (typeId == 70) return '' + format(amount) + ' Shield Point lost';
    if (typeId == 71) return 'unsuccessful bids ' + format(amount / 100) + '%';
    if (typeId == 72) return 'Loss ' + format(amount / 100) + '% Tap voltage';
    if (typeId == 73) return 'loss ' + format(amount / 100) + '% SP compensation';
    if (typeId == 74) return 'Lose ' + format(amount / 100) + '% critical chance';
    if (typeId == 75) return 'lose ' + format(amount / 100) + '% strength';
    if (typeId == 76) return '' + format(amount / 100) + ' % Loss probability of learning activity';
    if (typeId == 77) return 'SP voltage boost reduced by ' + format(amount / 100) + '%.';
    if (typeId == 78) return 'Lose ' + format(amount / 100) + '% base skill activation chance';
    if (typeId == 79) return '' + format(amount / 100) + '% loss of basic tap voltage';
    if (typeId == 81) return '' + format(amount / 100) + '% of the main application lost';
    if (typeId == 82) return 'Lose ' + format(amount / 100) + '% chance of basic critical strike';
    if (typeId == 83) return 'loss ' + format(amount / 100) + '% Filling of default SP Meter';
    if (typeId == 84) return '' + format(amount / 100) + '% of the main application lost';
    if (typeId == 85) return 'loss ' + format(amount / 100) + '% Base SP slot fill rate';
    if (typeId == 86) return 'Lose ' + format(amount / 100) + '% base skill activation chance';
    if (typeId == 87) return 'Lose ' + format(amount / 100) + '% chance of basic critical strike';
    if (typeId == 91) return 'Load SP Meter ' + format(amount / 100) + ' %.';
    if (typeId == 93) return 'buff ' + format(amount / 100) + '% of maximum resistance as a shield';
    if (typeId == 96) return '' + format(amount / 100) + '% of maximum resistance response';
    if (typeId == 101) return 'Increases strength damage by ' + format(amount / 100) + '%.';
    if (typeId == 105) return 'Increases strength damage by ' + format(amount / 100) + '%.';
    if (typeId == 112) return 'Charged SP Slot ' + format(amount / 100) + '% tap a tech card';
    if (typeId == 118) return 'increasing regeneration The regeneration strategy has been changed from ' + format(amount / 100) + '% reward.';
    if (typeId == 119) return 'Get ' + format(amount / 100) + '% charm for each unit Vo';
    if (typeId == 120) return 'loss ' + format(amount / 100) + '% Draw per unit Vo';
    if (typeId == 123) return 'Buff ' + format(amount / 100) + '% Draw per Sk unit';
    if (typeId == 128) return 'Answers ' + format(amount) + ' Counterpoints for each Vo unit formation';
    if (typeId == 130) return 'replays per unit Sp ' + format(amount) + ' stamina points';
    if (typeId == 132) return 'Answers ' + format(amount) + ' Points against each unit Formation Sk';
    if (typeId == 134) return 'Answers ' + format(amount) + ' Counterpoint generated according to Gd unit';
    if (typeId == 137) return 'Profit ' + format(amount / 100) + '% Appeal basis per unit Vo';
    if (typeId == 139) return 'Gain ' + format(amount / 100) + ' % Base Draw per Intelligence Unit Sp';
    if (typeId == 141) return '' + format(amount / 100) + '% base draw per SK unit creation';
    if (typeId == 143) return 'Benefit ' + format(amount / 100) + '% Gd Application base per information unit';
    if (typeId == 161) return 'Each Vo unit in formation gains ' + format(amount / 100) + '% skill chance.';
    if (typeId == 163) return 'Each Sk unit in formation gets ' + format(amount / 100) + '% Skill Chance';
    if (typeId == 164) return 'Gd units in each formation gain ' + format(amount / 100) + '% skill activation chance';
    if (typeId == 169) return '' + format(amount / 100) + '% probability of basic ability activation for each Vo unit creation';
    if (typeId == 170) return 'Basic skill activation rate increased by  ' + format(amount / 100) + '% per unit creation Sp';
    if (typeId == 171) return 'Added ' + format(amount / 100) + '% Chance Basic Skills for each Sk unit in creation';
    if (typeId == 172) return '' + format(amount / 100) + '% base skill action level increase per unit of Gd in creation';
    if (typeId == 177) return 'Each Vo unit in the formation gains ' + format(amount / 100) + '% critical chance.';
    if (typeId == 179) return '' + format(amount / 100) + '% more critical strike chance per unit of Sk Formation';
    if (typeId == 185) return 'Each Vo unit in formation gains a ' + format(amount / 100) + '% base critical strike chance';
    if (typeId == 187) return '' + format(amount / 100) + '% increased base critical chance for Sk units in all formations';
    if (typeId == 193) return 'Add ' + format(amount / 100) + '% critical power per unit Vo when organized';
    if (typeId == 210) return 'Increases SP voltage gain by ' + format(amount / 100) + ' % per Sp-die cell';
    if (typeId == 217) return 'Each Vo unit in formation increases the SP base voltage gain by ' + format(amount / 100) + '%.';
    if (typeId == 218) return 'Increase SP base voltage gain by ' + format(amount / 100) + ' % per resulting Sp cells';
    if (typeId == 219) return 'Add voltage gain base SP ' + format(amount / 100) + ' % per formation unit Sk';
    if (typeId == 226) return '' + format(amount) + ' conversion adds resolution reduction from strategy conversion bonus';
    if (typeId == 228) return 'Add basic voltage gain to the reward switching strategy \'+ form(sum);';
    if (typeId == 229) return 'Increase the base cooldown reduction of the Tactic Changer bonus by ' + format(amount) + '';
    if (typeId == 230) return 'Addition ' + format(amount) + ' Builds base SP from Strategy Change Bonus';
    if (typeId == 263) return '' + format(amount / 100) + '% of maximum resistance counts as damage when passing shields';
    if (typeId == 265) return 'Block healing';

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
    if (typeId === ACMissionType.VOLTAGE_TOTAL) return 'Get voltage ' + format(goal);
    if (typeId === ACMissionType.TIMING_NICE) return 'Click ' + format(goal) + ' OK';
    if (typeId === ACMissionType.TIMING_GREAT) return 'Faith is great ' + format(goal);
    if (typeId === ACMissionType.TIMING_WONDERFUL) return 'Click ' + format(goal) + ' Awesome!';
    if (typeId === ACMissionType.VOLTAGE_SINGLE) return 'Gain a ' + format(goal) + ' boost while talking';
    if (typeId === ACMissionType.VOLTAGE_SP) return 'Receive ' + format(goal) + ' voltage from SP';
    if (typeId === ACMissionType.UNIQUE) return 'Call ' + format(goal) + ' with special units';
    if (typeId === ACMissionType.CRITICALS) return 'You get a ' + format(goal) + ' rating';
    if (typeId === ACMissionType.SKILLS) return 'Active ' + format(goal) + ' Click Skill';
    if (typeId === ACMissionType.STAMINA) {
        if (goal === 10000) return 'AC ends at ' + format(goal / 100) + '% of max stamina';
        else return 'AC ends at ' + format(goal / 100) + '% of max stamina or more';
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
                case NoteGimmickTrigger.ON_GD_HIT:
                    skillstr = 'If hit with an <span class="t gd">Gd</span> unit, ';
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

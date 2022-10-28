const ACGimmickTrigger = require("../enums/acGimmickTrigger");
const SkillFinishType = require("../enums/skillFinishType");
const NoteGimmickTrigger = require("../enums/noteGimmickTrigger");
const ACMissionType = require("../enums/acMissionType");

function capitalize(s) {
    if (s.charAt(0) == "µ") return s; // don't uppercase µ
    return s.substring(0, 1).toUpperCase() + s.substring(1);
}

function numberFormat(n) {
    // https://stackoverflow.com/a/2901298
    let parts = n.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "&#8239;"); // non-break space
    return parts.join(".");
}

function songGimmick(effectType, effectAmount, targetType, finishType, finishAmount) {
    if (finishType === SkillFinishType.UNTIL_SONG_END) {
        // replace type to remove "until the song ends" condition - pretty much implied through being the song gimmick
        finishType = SkillFinishType.INSTANT;
    }
    return capitalize(skill(effectType, effectAmount, targetType, finishType, finishAmount));
}

function noteGimmick(trigger, effectType, effectAmount, targetType, finishType, finishAmount) {
    const skillString = skill(effectType, effectAmount, targetType, finishType, finishAmount);

    if (trigger === NoteGimmickTrigger.ON_HIT)
        return `If hit, ${skillString}`;
    if (trigger === NoteGimmickTrigger.ON_MISS)
        return `If missed, ${skillString}`;
    if (trigger === NoteGimmickTrigger.ALWAYS)
        return capitalize(skillString);
    if (trigger === NoteGimmickTrigger.ON_VO_HIT)
        return `If hit with a <span class="t vo">Vo</span> unit, ${skillString}`;
    if (trigger === NoteGimmickTrigger.ON_SP_HIT)
        return `If hit with a <span class="t sp">Sp</span> unit, ${skillString}`;
    if (trigger === NoteGimmickTrigger.ON_SK_HIT)
        return `If hit with a <span class="t sk">Sk</span> unit, ${skillString}`;

    throw new Error(`No translation for note gimmick trigger type ${trigger}`);
}

function acGimmick(trigger, effectType, effectAmount, targetType, finishType, finishAmount) {
    const skillString = skill(effectType, effectAmount, targetType, finishType, finishAmount);

    if (trigger === ACGimmickTrigger.ON_START) {
        if (finishType === SkillFinishType.UNTIL_AC_END) {
            return `During this AC, ${skillString}`;
        } else {
            return `When the AC starts, ${skillString}`;
        }
    }
    if (trigger === ACGimmickTrigger.ON_SUCCESS)
        return `On AC Success, ${skillString}`;
    if (trigger === ACGimmickTrigger.ON_FAIL)
        return `On AC Failure, ${skillString}`;
    if (trigger === ACGimmickTrigger.ON_END)
        return `At the end of the AC, ${skillString}`;

    throw new Error(`No translation for AC trigger type ${trigger}`);
}

// Skill Effect Types that have no target - never print a target for these, even if one is defined in the live info
const removeTargetSet = new Set([3, 4, 5, 23, 50, 68, 69, 70, 91, 93, 96, 101, 105, 112, 128, 130, 132, 134, 210, 217, 218, 219, 263]);

function skill(effectType, effectAmount, targetType, finishType, finishAmount) {
    const effect = skillEffect(effectType, effectAmount);
    const target = removeTargetSet.has(skill.effect_type) ? "" : skillTarget(targetType);
    // TODO: The parameter for isSPVoltageGainBuff is based on the skill effect strings above right now...
    //  so it's prone to typos and will break if translated
    const finish = skillFinish(finishType, finishAmount, eff.indexOf("SP Voltage Gain") !== -1);
    return `${target}${effect}${finish}`;
}

function skillEffect(effectType, effectAmount) {
    if (effectType === 3) return `charge SP Gauge by ${numberFormat(effectAmount)} points`;
    if (effectType === 4) return `gain ${numberFormat(effectAmount)} points of shield`;
    if (effectType === 5) return `restore ${numberFormat(effectAmount)} points of stamina`;
    if (effectType === 17) return `gain ${numberFormat(effectAmount / 100)}% Appeal`;
    if (effectType === 18) return `increase Voltage Gain by ${numberFormat(effectAmount / 100)}%`;
    if (effectType === 19) return `gain ${numberFormat(effectAmount / 100)}% SP Gauge Fill Rate`;
    if (effectType === 20) return `gain ${numberFormat(effectAmount / 100)}% Critical Chance`;
    if (effectType === 21) return `gain ${numberFormat(effectAmount / 100)}% Critical Power`;
    if (effectType === 22) return `gain ${numberFormat(effectAmount / 100)}% Skill Activation Chance`;
    if (effectType === 23) return `increase SP Voltage Gain by ${numberFormat(effectAmount / 100)}%`;
    if (effectType === 26) return `gain ${numberFormat(effectAmount / 100)}% Base Appeal`;
    if (effectType === 33) return `gain ${numberFormat(effectAmount / 100)}% Base Skill Activation Chance`;
    if (effectType === 36) return `gain ${numberFormat(effectAmount / 100)}% Base Critical Chance`;
    if (effectType === 45) return `gain ${numberFormat(effectAmount / 100)}% Base SP Gauge Fill Rate`;
    if (effectType === 46) return `gain ${numberFormat(effectAmount / 100)}% Base Critical Chance`;
    if (effectType === 47) return `gain ${numberFormat(effectAmount / 100)}% Base Critical Power`;
    if (effectType === 48) return `gain ${numberFormat(effectAmount / 100)}% Base Skill Activation Chance`;
    if (effectType === 49) return `gain ${numberFormat(effectAmount / 100)}% Base Appeal`;
    if (effectType === 50) return `increase Base SP Voltage Gain by ${numberFormat(effectAmount / 100)}%`;
    if (effectType === 51) return `increase Base Voltage Gain by ${numberFormat(effectAmount / 100)}%`;
    if (effectType === 52) return `lose all buffs (excluding those affecting Base values)`;
    if (effectType === 68) return `take ${numberFormat(effectAmount)} points of stamina damage`;
    if (effectType === 69) return `discharge SP Gauge by ${numberFormat(effectAmount / 100)}%`;
    if (effectType === 70) return `lose ${numberFormat(effectAmount)} points of shield`;
    if (effectType === 71) return `lose ${numberFormat(effectAmount / 100)}% Appeal`;
    if (effectType === 72) return `lose ${numberFormat(effectAmount / 100)}% Tap Voltage`;
    if (effectType === 73) return `lose ${numberFormat(effectAmount / 100)}% SP Gauge Fill Rate`;
    if (effectType === 75) return `lose ${numberFormat(effectAmount / 100)}% Critical Power`;
    if (effectType === 76) return `lose ${numberFormat(effectAmount / 100)}% Skill Activation Chance`;
    if (effectType === 78) return `lose ${numberFormat(effectAmount / 100)}% Base Skill Activation Chance`;
    if (effectType === 79) return `lose ${numberFormat(effectAmount / 100)}% Base Tap Voltage`;
    if (effectType === 81) return `lose ${numberFormat(effectAmount / 100)}% Base Appeal`;
    if (effectType === 82) return `lose ${numberFormat(effectAmount / 100)}% Base Critical Chance`;
    if (effectType === 83) return `lose ${numberFormat(effectAmount / 100)}% Base SP Gauge Fill Rate`;
    if (effectType === 84) return `lose ${numberFormat(effectAmount / 100)}% Base Appeal`;
    if (effectType === 85) return `lose ${numberFormat(effectAmount / 100)}% Base SP Gauge Fill Rate`;
    if (effectType === 86) return `lose ${numberFormat(effectAmount / 100)}% Base Skill Activation Chance`;
    if (effectType === 87) return `lose ${numberFormat(effectAmount / 100)}% Base Critical Chance`;
    if (effectType === 91) return `charge SP Gauge by ${numberFormat(effectAmount / 100)}%`;
    if (effectType === 93) return `gain ${numberFormat(effectAmount / 100)}% of max Stamina as shield`;
    if (effectType === 96) return `restore ${numberFormat(effectAmount / 100)}% of max Stamina`;
    if (effectType === 101) return `increase Stamina Damage by ${numberFormat(effectAmount / 100)}%`;
    if (effectType === 105) return `increase Stamina Damage by ${numberFormat(effectAmount / 100)}%`;
    if (effectType === 112) return `charge SP Gauge by ${numberFormat(effectAmount / 100)}% of the tapping card\`s Technique`;
    if (effectType === 119) return `gain ${numberFormat(effectAmount / 100)}% Appeal for each <span class="t vo">Vo</span> unit in the formation`;
    if (effectType === 120) return `lose ${numberFormat(effectAmount / 100)}% Appeal for each <span class="t vo">Vo</span> unit in the formation`;
    if (effectType === 123) return `gain ${numberFormat(effectAmount / 100)}% Appeal for each <span class="t sk">Sk</span> unit in the formation`;
    if (effectType === 128) return `restore ${numberFormat(effectAmount)} points of stamina for each <span class="t vo">Vo</span> unit in the formation`;
    if (effectType === 130) return `restore ${numberFormat(effectAmount)} points of stamina for each <span class="t sp">Sp</span> unit in the formation`;
    if (effectType === 132) return `restore ${numberFormat(effectAmount)} points of stamina for each <span class="t sk">Sk</span> unit in the formation`;
    if (effectType === 134) return `restore ${numberFormat(effectAmount)} points of stamina for each <span class="t gd">Gd</span> unit in the formation`;
    if (effectType === 137) return `gain ${numberFormat(effectAmount / 100)}% Base Appeal for each <span class="t vo">Vo</span> unit in the formation`;
    if (effectType === 139) return `gain ${numberFormat(effectAmount / 100)}% Base Appeal for each <span class="t sp">Sp</span> unit in the formation`;
    if (effectType === 141) return `gain ${numberFormat(effectAmount / 100)}% Base Appeal for each <span class="t sk">Sk</span> unit in the formation`;
    if (effectType === 143) return `gain ${numberFormat(effectAmount / 100)}% Base Appeal for each <span class="t gd">Gd</span> unit in the formation`;
    if (effectType === 161) return `gain ${numberFormat(effectAmount / 100)}% Skill Activation Chance for each <span class="t vo">Vo</span> unit in the formation`;
    if (effectType === 163) return `gain ${numberFormat(effectAmount / 100)}% Skill Activation Chance for each <span class="t sk">Sk</span> unit in the formation`;
    if (effectType === 164) return `gain ${numberFormat(effectAmount / 100)}% Skill Activation Chance for each <span class="t gd">Gd</span> unit in the formation`;
    if (effectType === 169) return `gain ${numberFormat(effectAmount / 100)}% Base Skill Activation Chance for each <span class="t vo">Vo</span> unit in the formation`;
    if (effectType === 170) return `gain ${numberFormat(effectAmount / 100)}% Base Skill Activation Chance for each <span class="t sp">Sp</span> unit in the formation`;
    if (effectType === 171) return `gain ${numberFormat(effectAmount / 100)}% Base Skill Activation Chance for each <span class="t sk">Sk</span> unit in the formation`;
    if (effectType === 172) return `gain ${numberFormat(effectAmount / 100)}% Base Skill Activation Chance for each <span class="t gd">Gd</span> unit in the formation`;
    if (effectType === 177) return `gain ${numberFormat(effectAmount / 100)}% Critical Chance for each <span class="t vo">Vo</span> unit in the formation`;
    if (effectType === 179) return `gain ${numberFormat(effectAmount / 100)}% Critical Chance for each <span class="t sk">Sk</span> unit in the formation`;
    if (effectType === 185) return `gain ${numberFormat(effectAmount / 100)}% Base Critical Chance for each <span class="t vo">Vo</span> unit in the formation`;
    if (effectType === 187) return `gain ${numberFormat(effectAmount / 100)}% Base Critical Chance for each <span class="t sk">Sk</span> unit in the formation`;
    if (effectType === 193) return `gain ${numberFormat(effectAmount / 100)}% Critical Power for each <span class="t vo">Vo</span> unit in the formation`;
    if (effectType === 210) return `increase SP Voltage Gain by ${numberFormat(effectAmount / 100)}% for each <span class="t sp">Sp</span> unit in the formation`;
    if (effectType === 217) return `increase Base SP Voltage Gain by ${numberFormat(effectAmount / 100)}% for each <span class="t vo">Vo</span> unit in the formation`;
    if (effectType === 218) return `increase Base SP Voltage Gain by ${numberFormat(effectAmount / 100)}% for each <span class="t sp">Sp</span> unit in the formation`;
    if (effectType === 219) return `increase Base SP Voltage Gain by ${numberFormat(effectAmount / 100)}% for each <span class="t sk">Sk</span> unit in the formation`;
    if (effectType === 228) return `increase the Voltage gained from their Strategy Switch bonus by ${numberFormat(effectAmount)}`;
    if (effectType === 229) return `increase the cooldown reduction from their Strategy Switch bonus by ${numberFormat(effectAmount)} turns`;
    if (effectType === 230) return `increase SP gained from their Strategy Switch bonus by ${numberFormat(effectAmount)} points`;
    if (effectType === 263) return `take ${numberFormat(effectAmount / 100)}% of max Stamina as damage, bypassing Shield`;
    if (effectType === 265) return `block Healing`;
    throw new Error(`No translation for skill effect type ${effectType}`);
}

function skillTarget(targetType) {
    if (targetType === 1) return `all units `;
    if (targetType === 18) return `Mari units `;
    if (targetType === 19) return `Ruby units `;
    if (targetType === 20) return `Ayumu units `;
    if (targetType === 21) return `Kasumi units `;
    if (targetType === 22) return `Shizuku units `;
    if (targetType === 23) return `Ai units `;
    if (targetType === 24) return `Karin units `;
    if (targetType === 25) return `Kanata units `;
    if (targetType === 26) return `Setsuna units `;
    if (targetType === 27) return `Emma units `;
    if (targetType === 28) return `Rina units `;
    if (targetType === 29) return `µ's units `;
    if (targetType === 30) return `Aqours units `;
    if (targetType === 31) return `Nijigaku units `;
    if (targetType === 35) return `CYaRon units `;
    if (targetType === 36) return `AZALEA units `;
    if (targetType === 37) return `Guilty Kiss units `;
    if (targetType === 38) return `<span class="t vo">Vo</span> units `;
    if (targetType === 39) return `<span class="t sp">Sp</span> units `;
    if (targetType === 40) return `<span class="t gd">Gd</span> units `;
    if (targetType === 41) return `<span class="t sk">Sk</span> units `;
    if (targetType === 58) return ``; // no target (affecting SP charge or stamina)
    if (targetType === 61) return `<span class="a smile">Smile</span> units `;
    if (targetType === 62) return `<span class="a pure">Pure</span> units `;
    if (targetType === 63) return `<span class="a cool">Cool</span> units `;
    if (targetType === 64) return `<span class="a active">Active</span> units `;
    if (targetType === 65) return `<span class="a natural">Natural</span> units `;
    if (targetType === 66) return `<span class="a elegant">Elegant</span> units `;
    if (targetType === 67) return `non-<span class="a smile">Smile</span> units `;
    if (targetType === 68) return `non-<span class="t vo">Vo</span> units `;
    if (targetType === 69) return `1st Year units `;
    if (targetType === 70) return `2nd Year units `;
    if (targetType === 71) return `3rd Year units `;
    if (targetType === 72) return `non-<span class="a pure">Pure</span> units `;
    if (targetType === 73) return `non-<span class="a cool">Cool</span> units `;
    if (targetType === 74) return `non-<span class="a active">Active</span> units `;
    if (targetType === 75) return `non-<span class="a natural">Natural</span> units `;
    if (targetType === 76) return `non-<span class="a elegant">Elegant</span> units `;
    if (targetType === 77) return `non-<span class="t sp">Sp</span> units `;
    if (targetType === 78) return `non-<span class="t gd">Gd</span> units `;
    if (targetType === 79) return `non-<span class="t sk">Sk</span> units `;
    if (targetType === 83) return `units in the current strategy `;
    if (targetType === 86) return `non-µ's units `;
    if (targetType === 87) return `non-<span class="t vo">Vo</span> or <span class="t gd">Gd</span> units `;
    if (targetType === 88) return `non-<span class="t vo">Vo</span> or <span class="t sp">Sp</span> units `;
    if (targetType === 89) return `non-<span class="t vo">Vo</span> or <span class="t sk">Sk</span> units `;
    if (targetType === 90) return `non-<span class="t gd">Gd</span> or <span class="t sp">Sp</span> units `;
    if (targetType === 92) return `non-<span class="t sp">Sp</span> or <span class="t sk">Sk</span> units `;
    if (targetType === 93) return `<span class="t sp">Sp</span> and <span class="t sk">Sk</span> units `;
    if (targetType === 96) return `<span class="t vo">Vo</span> and <span class="t sk">Sk</span> units `;
    if (targetType === 97) return `<span class="t vo">Vo</span> and <span class="t sp">Sp</span> units `;
    if (targetType === 98) return `<span class="t vo">Vo</span> and <span class="t gd">Gd</span> units `;
    if (targetType === 99) return `non-Aqours units `;
    if (targetType === 100) return `non-Niji units `;
    if (targetType === 101) return `non-1st Year units `;
    if (targetType === 102) return `non-2nd Year units `;
    if (targetType === 103) return `non-3rd Year units `;
    if (targetType === 104) return `DiverDiva units `;
    if (targetType === 105) return `A•ZU•NA units `;
    if (targetType === 106) return `QU4RTZ units `;
    if (targetType === 107) return `non-DiverDiva units `;
    if (targetType === 108) return `non-A•ZU•NA units `;
    if (targetType === 109) return `non-QU4RTZ units `;
    if (targetType === 112) return `Shioriko units `;
    if (targetType === 113) return `Lanzhu units `;
    if (targetType === 114) return `Mia units `;
    throw new Error(`No translation for skill target type ${targetType}`);
}

function skillFinish(finishType, finishAmount, isSPVoltageGainBuff) {
    if (finishType === SkillFinishType.UNTIL_SONG_END)
        return ` until the song ends`;
    if (finishType === SkillFinishType.NOTE_COUNT)
        return ` for ${numberFormat(finishAmount)} notes`;
    if (finishType === SkillFinishType.INSTANT)
        return ``;
    if (finishType === SkillFinishType.UNTIL_AC_END)
        return ``; // (this is handled in the trigger switch in acGimmick)
    if (finishType === SkillFinishType.SP_COUNT) {
        if (isSPVoltageGainBuff) {
            if (finishAmount == 1) return ` for the next SP Skill`;
            else return ` for the next ${numberFormat(finishAmount)} SP Skills`;
        } else {
            if (finishAmount == 1) return ` until an SP Skill is used`;
            else return ` until ${numberFormat(finishAmount)} SP Skills are used`;
        }
    }
    if (finishType === SkillFinishType.UNTIL_SWITCH) {
        if (finishAmount <= 1) return ` until the next Strategy switch`;
        else return ` until Strategies are switched ${finishAmount} times`;
    }

    throw new Error(`No translation for skill finish type ${finishType}`);
}

function acMission(acType, requirement) {
    if (acType === ACMissionType.VOLTAGE_TOTAL)
        return `Get ${numberFormat(requirement)} Voltage`;
    if (acType === ACMissionType.TIMING_NICE)
        return `Hit ${numberFormat(requirement)} NICEs`;
    if (acType === ACMissionType.TIMING_GREAT)
        return `Hit ${numberFormat(requirement)} GREATs`;
    if (acType === ACMissionType.TIMING_WONDERFUL)
        return `Hit ${numberFormat(requirement)} WONDERFULs`;
    if (acType === ACMissionType.VOLTAGE_SINGLE)
        return `Get ${numberFormat(requirement)} Voltage in one Appeal`;
    if (acType === ACMissionType.VOLTAGE_SP)
        return `Get ${numberFormat(requirement)} Voltage from SP`;
    if (acType === ACMissionType.UNIQUE)
        return `Appeal with ${numberFormat(requirement)} unique Units`;
    if (acType === ACMissionType.CRITICALS)
        return `Get ${numberFormat(requirement)} Criticals`;
    if (acType === ACMissionType.SKILLS)
        return `Activate ${numberFormat(requirement)} Tap Skills`;
    if (acType === ACMissionType.STAMINA) {
        if (requirement === 10000) return `Finish the AC with ${numberFormat(requirement / 100)}% of max Stamina`;
        else return `Finish the AC with ${numberFormat(requirement / 100)}% of max Stamina or more`;
    }
    throw new Error(`No translation for AC mission type ${acType}`);
}

modules.exports = {
    strings: {
        meta: {
            title: "SIFAS Note Map Database",
            description: "Song information database for SIFAS, including complete note maps, gimmick note timings and AC rewards."
        },
        header: {
            title: "Note Map DB",
            back: "Back",
        },
        tab: {
            start: "Start",
            muse: "µ's",
            aqours: "Aqours",
            nijigaku: "Nijigaku",
            liella: "Liella!",
            dlp: "DLP",
            rankings: "Rankings"
        },
        preferences: {
            title: "Preferences",
            titles: "Song Title Display",
            titles_toggle: "Toggle Song Title Display",
            titles_kana: "Kana/Kanji",
            titles_kana_toggle: "Showing titles in Kana/Kanji",
            titles_roma: "Romaji",
            titles_roma_toggle: "Showing titles in Romaji",
            unavailable: "Unavailable Songs",
            unavailable_toggle: "Toggle Unavailable Songs",
            unavailable_hide: "Hide",
            unavailable_hide_toggle: "Hiding unavailable songs",
            unavailable_show: "Show",
            unavailable_show_toggle: "Showing unavailable songs",
            dark_mode: "Dark Mode",
            dark_mode_off: "Off",
            dark_mode_on: "On",
            save: "Save",
            cancel: "Cancel"
        },
        search: {
            label: "Filter By Song Name (Full Title or Abbreviations, Kana or Romanized)",
            tooltip: "You can use abbreviations like <span>m start</span>, <span>kimikoko</span> or <span>nsnm</span>.<br>You can also add <span>+</span> or <span>++</span> to the end to instantly open the Adv+ or Challenge tab."
        },
        songinfo: {
            ranks: {
                S: "S Rank",
                A: "A Rank",
                B: "B Rank",
                C: "C Rank",
            },
            note_damage: "Base Note Damage",
            voltage_caps: {
                tap: "Appeal Voltage Cap",
                sp: "SP Voltage Cap",
                skill: "Skill Voltage Cap",
                swap: "Swap Bonus Voltage Cap",
            },
            sp_gauge_max: "SP Gauge Size",
            note_count: "Note Count",
            note_count_ac: "Notes in ACs",
            note_damage_total: "Total Note Damage",
            ac_reward_total: "Total AC Rewards",
            song_length: "Song Length",
            story_stages: "Story Stages"
        },
        dlp: {
            performance_points: "Performance Points",
            performance_points_recoverable: "recoverable",
            performance_points_recovery_cost: "PP Recovery Cost",
            progress_reward: "Progress Reward",
            story_node: "Story Node",
            songinfo: {
                voltage_target: "Target Voltage",
                song_difficulty: "Base Difficulty",
                reward_clear: "Clear Reward",
                voltage_target_short: "Target",
                note_damage_short: "Note Damage"
            }
        },
        scale: {
            label: "Scale",
            option_time: "Time",
            option_turn: "Turns"
        },
        gimmicks: {
            title: "Gimmicks",
            song_gimmick: "Song Gimmick",
            song_gimmick_cleansable: "Cleansable",
            song_gimmick_cleansable_yes: "Yes",
            song_gimmick_cleansable_no: "No",
            song_gimmick_none: "None",
            note_gimmick: "Note Gimmick",
            note_gimmick_amount: "Amount",
            note_gimmick_by_unit: "Unit"
        },
        appeal_chances: {
            title: "Appeal Chances",
            ac: "AC",
            ac_length: "Length",
            ac_reward_voltage_label: "Success",
            ac_reward_voltage: "Voltage",
            ac_penalty_damage_label: "Failure",
            ac_penalty_damage: "Damage"
        },
        rankings: {
            length_title: "Shortest Song Lengths",
            length_column_song: "Song",
            length_column_length: "Length",
            length_show_all_description: "only showing songs currently available on JP - ",
            length_show_all_link: "click to see all songs",
            notes_title: "Highest Note Counts",
            notes_column_song: "Song",
            notes_column_notes: "Notes",
            notes_show_all_description: "only showing songs that can be displayed on your profile - ",
            notes_show_all_link: "click to see all songs"
        },
        difficulty: {
            beginner: "Beginner",
            beginner_short: "Beg",
            intermediate: "Intermediate",
            intermediate_short: "Int",
            advanced: "Advanced",
            advanced_short: "Adv",
            advplus: "Advanced+",
            advplus_short: "Adv+",
            challenge: "Challenge",
            challenge_short: "Ch",
        },
        attribute: {
            smile: "Smile",
            pure: "Pure",
            cool: "Cool",
            active: "Active",
            natural: "Natural",
            elegant: "Elegant",
            none: "None"
        }
    },
    functions: {
        numberFormat, songGimmick, noteGimmick, acGimmick, items, acMission, acAverage
    }
}
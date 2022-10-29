const NoteGimmickTrigger = require("../enums/noteGimmickTrigger");
const ACGimmickTrigger = require("../enums/acGimmickTrigger");
const SkillTargetType = require("../enums/skillTargetType");
const SkillFinishType = require("../enums/skillFinishType");
const ACMissionType = require("../enums/acMissionType");
const SkillEffectType = require("../enums/skillEffectType");

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

function noteCount(n) {
    return `${numberFormat(n)} note` + (n===1 ? `` : `s`);
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
const removeTargetSet = new Set([
    SkillEffectType.SP_FILL, SkillEffectType.SHIELD_GAIN, SkillEffectType.STAMINA_HEAL, SkillEffectType.SPVO_BUFF,
    SkillEffectType.SPVO_BASE2_BUFF, SkillEffectType.STAMINA_DAMAGE, SkillEffectType.SP_LOSE,
    SkillEffectType.SHIELD_LOSE, SkillEffectType.SP_GAIN_PERCENTAGE, SkillEffectType.SHIELD_GAIN_PERCENTAGE,
    SkillEffectType.STAMINA_HEAL_PERCENTAGE, SkillEffectType.DAMAGE_INCREASE, SkillEffectType.DAMAGE_BASE2_INCREASE,
    SkillEffectType.SP_GAIN_BY_TECH, SkillEffectType.STAMINA_HEAL_BY_VO, SkillEffectType.STAMINA_HEAL_BY_SP,
    SkillEffectType.STAMINA_HEAL_BY_SK, SkillEffectType.STAMINA_HEAL_BY_GD, SkillEffectType.SPVO_BUFF_BY_SP,
    SkillEffectType.SPVO_BASE2_BUFF_BY_VO, SkillEffectType.SPVO_BASE2_BUFF_BY_SP, SkillEffectType.SPVO_BASE2_BUFF_BY_SK,
    SkillEffectType.STAMINA_DAMAGE_PIERCE]);

function skill(effectType, effectAmount, targetType, finishType, finishAmount) {
    const effect = skillEffect(effectType, effectAmount);
    const target = removeTargetSet.has(skill.effect_type) ? "" : skillTarget(targetType);
    // TODO: The parameter for isSPVoltageGainBuff is based on the skill effect strings above right now...
    //  so it's prone to typos and will break if translated
    const finish = skillFinish(finishType, finishAmount, eff.indexOf("SP Voltage Gain") !== -1);
    return `${target}${effect}${finish}`;
}

function skillEffect(effectType, effectAmount) {
    if (effectType === SkillEffectType.SP_FILL)
        return `charge SP Gauge by ${numberFormat(effectAmount)} points`;
    if (effectType === SkillEffectType.SHIELD_GAIN)
        return `gain ${numberFormat(effectAmount)} points of shield`;
    if (effectType === SkillEffectType.STAMINA_HEAL)
        return `restore ${numberFormat(effectAmount)} points of stamina`;
    if (effectType === SkillEffectType.APPEAL_BUFF)
        return `gain ${numberFormat(effectAmount / 100)}% Appeal`;
    if (effectType === SkillEffectType.VOGAIN_BUFF)
        return `increase Voltage Gain by ${numberFormat(effectAmount / 100)}%`;
    if (effectType === SkillEffectType.SPGAIN_BUFF)
        return `gain ${numberFormat(effectAmount / 100)}% SP Gauge Fill Rate`;
    if (effectType === SkillEffectType.CRITCHANCE_BUFF)
        return `gain ${numberFormat(effectAmount / 100)}% Critical Chance`;
    if (effectType === SkillEffectType.CRITPOWER_BUFF)
        return `gain ${numberFormat(effectAmount / 100)}% Critical Power`;
    if (effectType === SkillEffectType.SKILLCHANCE_BUFF)
        return `gain ${numberFormat(effectAmount / 100)}% Skill Activation Chance`;
    if (effectType === SkillEffectType.SPVO_BUFF)
        return `increase SP Voltage Gain by ${numberFormat(effectAmount / 100)}%`;
    if (effectType === SkillEffectType.APPEAL_BASE_BUFF)
        return `gain ${numberFormat(effectAmount / 100)}% Base Appeal`;
    if (effectType === SkillEffectType.SKILLCHANCE_BASE_BUFF)
        return `gain ${numberFormat(effectAmount / 100)}% Base Skill Activation Chance`;
    if (effectType === SkillEffectType.CRITCHANCE_BASE_BUFF)
        return `gain ${numberFormat(effectAmount / 100)}% Base Critical Chance`;
    if (effectType === SkillEffectType.SPGAIN_BASE2_BUFF)
        return `gain ${numberFormat(effectAmount / 100)}% Base SP Gauge Fill Rate`;
    if (effectType === SkillEffectType.CRITCHANCE_BASE2_BUFF)
        return `gain ${numberFormat(effectAmount / 100)}% Base Critical Chance`;
    if (effectType === SkillEffectType.CRITPOWER_BASE2_BUFF)
        return `gain ${numberFormat(effectAmount / 100)}% Base Critical Power`;
    if (effectType === SkillEffectType.SKILLCHANCE_BASE2_BUFF)
        return `gain ${numberFormat(effectAmount / 100)}% Base Skill Activation Chance`;
    if (effectType === SkillEffectType.APPEAL_BASE2_BUFF)
        return `gain ${numberFormat(effectAmount / 100)}% Base Appeal`;
    if (effectType === SkillEffectType.SPVO_BASE2_BUFF)
        return `increase Base SP Voltage Gain by ${numberFormat(effectAmount / 100)}%`;
    if (effectType === SkillEffectType.VOGAIN_BASE2_BUFF)
        return `increase Base Voltage Gain by ${numberFormat(effectAmount / 100)}%`;
    if (effectType === SkillEffectType.CLEANSE_BUFFS)
        return `lose all buffs (excluding those affecting Base values)`;
    if (effectType === SkillEffectType.STAMINA_DAMAGE)
        return `take ${numberFormat(effectAmount)} points of stamina damage`;
    if (effectType === SkillEffectType.SP_LOSE)
        return `discharge SP Gauge by ${numberFormat(effectAmount / 100)}%`;
    if (effectType === SkillEffectType.SHIELD_LOSE)
        return `lose ${numberFormat(effectAmount)} points of shield`;
    if (effectType === SkillEffectType.APPEAL_DEBUFF)
        return `lose ${numberFormat(effectAmount / 100)}% Appeal`;
    if (effectType === SkillEffectType.VOGAIN_DEBUFF)
        return `lose ${numberFormat(effectAmount / 100)}% Tap Voltage`;
    if (effectType === SkillEffectType.SPGAIN_DEBUFF)
        return `lose ${numberFormat(effectAmount / 100)}% SP Gauge Fill Rate`;
    if (effectType === SkillEffectType.CRITPOWER_DEBUFF)
        return `lose ${numberFormat(effectAmount / 100)}% Critical Power`;
    if (effectType === SkillEffectType.SKILLCHANCE_DEBUFF)
        return `lose ${numberFormat(effectAmount / 100)}% Skill Activation Chance`;
    if (effectType === SkillEffectType.SKILLCHANCE_BASE2_DEBUFF)
        return `lose ${numberFormat(effectAmount / 100)}% Base Skill Activation Chance`;
    if (effectType === SkillEffectType.VOGAIN_BASE2_DEBUFF)
        return `lose ${numberFormat(effectAmount / 100)}% Base Tap Voltage`;
    if (effectType === SkillEffectType.APPEAL_BASE2_DEBUFF)
        return `lose ${numberFormat(effectAmount / 100)}% Base Appeal`;
    if (effectType === SkillEffectType.CRITCHANCE_BASE2_DEBUFF)
        return `lose ${numberFormat(effectAmount / 100)}% Base Critical Chance`;
    if (effectType === SkillEffectType.SPGAIN_BASE2_DEBUFF)
        return `lose ${numberFormat(effectAmount / 100)}% Base SP Gauge Fill Rate`;
    if (effectType === SkillEffectType.APPEAL_BASE_DEBUFF)
        return `lose ${numberFormat(effectAmount / 100)}% Base Appeal`;
    if (effectType === SkillEffectType.SPGAIN_BASE_DEBUFF)
        return `lose ${numberFormat(effectAmount / 100)}% Base SP Gauge Fill Rate`;
    if (effectType === SkillEffectType.SKILLCHANCE_BASE_DEBUFF)
        return `lose ${numberFormat(effectAmount / 100)}% Base Skill Activation Chance`;
    if (effectType === SkillEffectType.CRITCHANCE_BASE_DEBUFF)
        return `lose ${numberFormat(effectAmount / 100)}% Base Critical Chance`;
    if (effectType === SkillEffectType.SP_GAIN_PERCENTAGE)
        return `charge SP Gauge by ${numberFormat(effectAmount / 100)}%`;
    if (effectType === SkillEffectType.SHIELD_GAIN_PERCENTAGE)
        return `gain ${numberFormat(effectAmount / 100)}% of max Stamina as shield`;
    if (effectType === SkillEffectType.STAMINA_HEAL_PERCENTAGE)
        return `restore ${numberFormat(effectAmount / 100)}% of max Stamina`;
    if (effectType === SkillEffectType.DAMAGE_INCREASE)
        return `increase Stamina Damage by ${numberFormat(effectAmount / 100)}%`;
    if (effectType === SkillEffectType.DAMAGE_BASE2_INCREASE)
        return `increase Stamina Damage by ${numberFormat(effectAmount / 100)}%`;
    if (effectType === SkillEffectType.SP_GAIN_BY_TECH)
        return `charge SP Gauge by ${numberFormat(effectAmount / 100)}% of the appealing card's Technique`;
    if (effectType === SkillEffectType.APPEAL_BUFF_BY_VO)
        return `gain ${numberFormat(effectAmount / 100)}% Appeal for each <span class="t vo">Vo</span> unit in the formation`;
    if (effectType === SkillEffectType.APPEAL_DEBUFF_BY_VO)
        return `lose ${numberFormat(effectAmount / 100)}% Appeal for each <span class="t vo">Vo</span> unit in the formation`;
    if (effectType === SkillEffectType.APPEAL_BUFF_BY_SK)
        return `gain ${numberFormat(effectAmount / 100)}% Appeal for each <span class="t sk">Sk</span> unit in the formation`;
    if (effectType === SkillEffectType.STAMINA_HEAL_BY_VO)
        return `restore ${numberFormat(effectAmount)} points of stamina for each <span class="t vo">Vo</span> unit in the formation`;
    if (effectType === SkillEffectType.STAMINA_HEAL_BY_SP)
        return `restore ${numberFormat(effectAmount)} points of stamina for each <span class="t sp">Sp</span> unit in the formation`;
    if (effectType === SkillEffectType.STAMINA_HEAL_BY_SK)
        return `restore ${numberFormat(effectAmount)} points of stamina for each <span class="t sk">Sk</span> unit in the formation`;
    if (effectType === SkillEffectType.STAMINA_HEAL_BY_GD)
        return `restore ${numberFormat(effectAmount)} points of stamina for each <span class="t gd">Gd</span> unit in the formation`;
    if (effectType === SkillEffectType.APPEAL_BASE2_BUFF_BY_VO)
        return `gain ${numberFormat(effectAmount / 100)}% Base Appeal for each <span class="t vo">Vo</span> unit in the formation`;
    if (effectType === SkillEffectType.APPEAL_BASE2_BUFF_BY_SP)
        return `gain ${numberFormat(effectAmount / 100)}% Base Appeal for each <span class="t sp">Sp</span> unit in the formation`;
    if (effectType === SkillEffectType.APPEAL_BASE2_BUFF_BY_SK)
        return `gain ${numberFormat(effectAmount / 100)}% Base Appeal for each <span class="t sk">Sk</span> unit in the formation`;
    if (effectType === SkillEffectType.APPEAL_BASE2_BUFF_BY_GD)
        return `gain ${numberFormat(effectAmount / 100)}% Base Appeal for each <span class="t gd">Gd</span> unit in the formation`;
    if (effectType === SkillEffectType.SKILLCHANCE_BUFF_BY_VO)
        return `gain ${numberFormat(effectAmount / 100)}% Skill Activation Chance for each <span class="t vo">Vo</span> unit in the formation`;
    if (effectType === SkillEffectType.SKILLCHANCE_BUFF_BY_SK)
        return `gain ${numberFormat(effectAmount / 100)}% Skill Activation Chance for each <span class="t sk">Sk</span> unit in the formation`;
    if (effectType === SkillEffectType.SKILLCHANCE_BUFF_BY_GD)
        return `gain ${numberFormat(effectAmount / 100)}% Skill Activation Chance for each <span class="t gd">Gd</span> unit in the formation`;
    if (effectType === SkillEffectType.SKILLCHANCE_BASE2_BUFF_BY_VO)
        return `gain ${numberFormat(effectAmount / 100)}% Base Skill Activation Chance for each <span class="t vo">Vo</span> unit in the formation`;
    if (effectType === SkillEffectType.SKILLCHANCE_BASE2_BUFF_BY_SP)
        return `gain ${numberFormat(effectAmount / 100)}% Base Skill Activation Chance for each <span class="t sp">Sp</span> unit in the formation`;
    if (effectType === SkillEffectType.SKILLCHANCE_BASE2_BUFF_BY_SK)
        return `gain ${numberFormat(effectAmount / 100)}% Base Skill Activation Chance for each <span class="t sk">Sk</span> unit in the formation`;
    if (effectType === SkillEffectType.SKILLCHANCE_BASE2_BUFF_BY_GD)
        return `gain ${numberFormat(effectAmount / 100)}% Base Skill Activation Chance for each <span class="t gd">Gd</span> unit in the formation`;
    if (effectType === SkillEffectType.CRITCHANCE_BUFF_BY_VO)
        return `gain ${numberFormat(effectAmount / 100)}% Critical Chance for each <span class="t vo">Vo</span> unit in the formation`;
    if (effectType === SkillEffectType.CRITCHANCE_BUFF_BY_SK)
        return `gain ${numberFormat(effectAmount / 100)}% Critical Chance for each <span class="t sk">Sk</span> unit in the formation`;
    if (effectType === SkillEffectType.CRITCHANCE_BASE2_BUFF_BY_VO)
        return `gain ${numberFormat(effectAmount / 100)}% Base Critical Chance for each <span class="t vo">Vo</span> unit in the formation`;
    if (effectType === SkillEffectType.CRITCHANCE_BASE2_BUFF_BY_SK)
        return `gain ${numberFormat(effectAmount / 100)}% Base Critical Chance for each <span class="t sk">Sk</span> unit in the formation`;
    if (effectType === SkillEffectType.CRITPOWER_BUFF_BY_VO)
        return `gain ${numberFormat(effectAmount / 100)}% Critical Power for each <span class="t vo">Vo</span> unit in the formation`;
    if (effectType === SkillEffectType.SPVO_BUFF_BY_SP)
        return `increase SP Voltage Gain by ${numberFormat(effectAmount / 100)}% for each <span class="t sp">Sp</span> unit in the formation`;
    if (effectType === SkillEffectType.SPVO_BASE2_BUFF_BY_VO)
        return `increase Base SP Voltage Gain by ${numberFormat(effectAmount / 100)}% for each <span class="t vo">Vo</span> unit in the formation`;
    if (effectType === SkillEffectType.SPVO_BASE2_BUFF_BY_SP)
        return `increase Base SP Voltage Gain by ${numberFormat(effectAmount / 100)}% for each <span class="t sp">Sp</span> unit in the formation`;
    if (effectType === SkillEffectType.SPVO_BASE2_BUFF_BY_SK)
        return `increase Base SP Voltage Gain by ${numberFormat(effectAmount / 100)}% for each <span class="t sk">Sk</span> unit in the formation`;
    if (effectType === SkillEffectType.SWAP_VO_BUFF)
        return `increase the Voltage gained from their Strategy Swap bonus by ${numberFormat(effectAmount)}`;
    if (effectType === SkillEffectType.SWAP_SK_BUFF)
        return `increase the cooldown reduction from their Strategy Swap bonus by ${numberFormat(effectAmount)} turns`;
    if (effectType === SkillEffectType.SWAP_SP_BUFF)
        return `increase SP gained from their Strategy Swap bonus by ${numberFormat(effectAmount)} points`;
    if (effectType === SkillEffectType.STAMINA_DAMAGE_PIERCE)
        return `take ${numberFormat(effectAmount / 100)}% of max Stamina as damage, bypassing Shield`;
    if (effectType === SkillEffectType.STAMINA_HEAL_BLOCK)
        return `block healing`;

    throw new Error(`No translation for skill effect type ${effectType}`);
}

const skillTargetMap = {
    [SkillTargetType.ALL]: `all units `,
    [SkillTargetType.CHAR_MARI]: `Mari units `,
    [SkillTargetType.CHAR_RUBY]: `Ruby units `,
    [SkillTargetType.CHAR_AYUMU]: `Ayumu units `,
    [SkillTargetType.CHAR_KASUMI]: `Kasumi units `,
    [SkillTargetType.CHAR_SHIZUKU]: `Shizuku units `,
    [SkillTargetType.CHAR_AI]: `Ai units `,
    [SkillTargetType.CHAR_KARIN]: `Karin units `,
    [SkillTargetType.CHAR_KANATA]: `Kanata units `,
    [SkillTargetType.CHAR_SETSUNA]: `Setsuna units `,
    [SkillTargetType.CHAR_EMMA]: `Emma units `,
    [SkillTargetType.CHAR_RINA]: `Rina units `,
    [SkillTargetType.GROUP_MUSE]: `µ's units `,
    [SkillTargetType.GROUP_AQOURS]: `Aqours units `,
    [SkillTargetType.GROUP_NIJI]: `Nijigaku units `,
    [SkillTargetType.SUB_CYARON]: `CYaRon units `,
    [SkillTargetType.SUB_AZALEA]: `AZALEA units `,
    [SkillTargetType.SUB_GUILTYKISS]: `Guilty Kiss units `,
    [SkillTargetType.TYPE_VO]: `<span class="t vo">Vo</span> units `,
    [SkillTargetType.TYPE_SP]: `<span class="t sp">Sp</span> units `,
    [SkillTargetType.TYPE_GD]: `<span class="t gd">Gd</span> units `,
    [SkillTargetType.TYPE_SK]: `<span class="t sk">Sk</span> units `,
    [SkillTargetType.NONE]: ``,
    [SkillTargetType.ATTR_SMILE]: `<span class="a smile">Smile</span> units `,
    [SkillTargetType.ATTR_PURE]: `<span class="a pure">Pure</span> units `,
    [SkillTargetType.ATTR_COOL]: `<span class="a cool">Cool</span> units `,
    [SkillTargetType.ATTR_ACTIVE]: `<span class="a active">Active</span> units `,
    [SkillTargetType.ATTR_NATURAL]: `<span class="a natural">Natural</span> units `,
    [SkillTargetType.ATTR_ELEGANT]: `<span class="a elegant">Elegant</span> units `,
    [SkillTargetType.ATTR_NOT_SMILE]: `non-<span class="a smile">Smile</span> units `,
    [SkillTargetType.TYPE_NOT_VO]: `non-<span class="t vo">Vo</span> units `,
    [SkillTargetType.YEAR_1]: `1st Year units `,
    [SkillTargetType.YEAR_2]: `2nd Year units `,
    [SkillTargetType.YEAR_3]: `3rd Year units `,
    [SkillTargetType.ATTR_NOT_PURE]: `non-<span class="a pure">Pure</span> units `,
    [SkillTargetType.ATTR_NOT_COOL]: `non-<span class="a cool">Cool</span> units `,
    [SkillTargetType.ATTR_NOT_ACTIVE]: `non-<span class="a active">Active</span> units `,
    [SkillTargetType.ATTR_NOT_NATURAL]: `non-<span class="a natural">Natural</span> units `,
    [SkillTargetType.ATTR_NOT_ELEGANT]: `non-<span class="a elegant">Elegant</span> units `,
    [SkillTargetType.TYPE_NOT_SP]: `non-<span class="t sp">Sp</span> units `,
    [SkillTargetType.TYPE_NOT_GD]: `non-<span class="t gd">Gd</span> units `,
    [SkillTargetType.TYPE_NOT_SK]: `non-<span class="t sk">Sk</span> units `,
    [SkillTargetType.STRATEGY]: `units in the current strategy `,
    [SkillTargetType.GROUP_NOT_MUSE]: `non-µ's units `,
    [SkillTargetType.TYPE_NOT_VO_GD]: `non-<span class="t vo">Vo</span> or <span class="t gd">Gd</span> units `,
    [SkillTargetType.TYPE_NOT_VO_SP]: `non-<span class="t vo">Vo</span> or <span class="t sp">Sp</span> units `,
    [SkillTargetType.TYPE_NOT_VO_SK]: `non-<span class="t vo">Vo</span> or <span class="t sk">Sk</span> units `,
    [SkillTargetType.TYPE_NOT_GD_SP]: `non-<span class="t gd">Gd</span> or <span class="t sp">Sp</span> units `,
    [SkillTargetType.TYPE_NOT_SP_SK]: `non-<span class="t sp">Sp</span> or <span class="t sk">Sk</span> units `,
    [SkillTargetType.TYPE_SP_SK]: `<span class="t sp">Sp</span> and <span class="t sk">Sk</span> units `,
    [SkillTargetType.TYPE_VO_SK]: `<span class="t vo">Vo</span> and <span class="t sk">Sk</span> units `,
    [SkillTargetType.TYPE_VO_SP]: `<span class="t vo">Vo</span> and <span class="t sp">Sp</span> units `,
    [SkillTargetType.TYPE_VO_GD]: `<span class="t vo">Vo</span> and <span class="t gd">Gd</span> units `,
    [SkillTargetType.GROUP_NOT_AQOURS]: `non-Aqours units `,
    [SkillTargetType.GROUP_NOT_NIJI]: `non-Nijigaku units `,
    [SkillTargetType.YEAR_NOT_1]: `non-1st Year units `,
    [SkillTargetType.YEAR_NOT_2]: `non-2nd Year units `,
    [SkillTargetType.YEAR_NOT_3]: `non-3rd Year units `,
    [SkillTargetType.SUB_DIVERDIVA]: `DiverDiva units `,
    [SkillTargetType.SUB_AZUNA]: `A•ZU•NA units `,
    [SkillTargetType.SUB_QU4RTZ]: `QU4RTZ units `,
    [SkillTargetType.SUB_NOT_DIVERDIVA]: `non-DiverDiva units `,
    [SkillTargetType.SUB_NOT_AZUNA]: `non-A•ZU•NA units `,
    [SkillTargetType.SUB_NOT_QU4RTZ]: `non-QU4RTZ units `,
    [SkillTargetType.CHAR_SHIORIKO]: `Shioriko units `,
    [SkillTargetType.CHAR_LANZHU]: `Lanzhu units `,
    [SkillTargetType.CHAR_MIA]: `Mia units `
}

function skillTarget(targetType) {
    const t = skillTargetMap[targetType];
    if (t === undefined) throw new Error(`No translation for skill target type ${targetType}`);
    return t;
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
        if (finishAmount <= 1) return ` until the next Strategy Swap`;
        else return ` until Strategies are swapped ${finishAmount} times`;
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

module.exports = {
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
    songlist: {
        unavailable: "unavailable",
        daily: "daily",
        weekdays: {
            1: "Monday",
            2: "Tuesday",
            3: "Wednesday",
            4: "Thursday",
            5: "Friday",
            6: "Saturday",
            7: "Sunday"
        },
        time_limited: "time-limited"
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
        story_stages: "Story Stages",
        no_map: "no note map available"
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
        time: "Time",
        turns: "Turns"
    },
    gimmicks: {
        title: "Gimmicks",
        song_gimmick: "Song Gimmick",
        song_gimmick_multiple: "Song Gimmicks",
        song_gimmick_cleansable: "Cleansable",
        song_gimmick_cleansable_yes: "Yes",
        song_gimmick_cleansable_no: "No",
        note_gimmick: "Note Gimmick",
        note_gimmick_amount: "Amount",
        note_gimmick_position: "Note Position",
        note_gimmick_unit: "Unit",
        no_gimmick: "No Gimmick"
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
    },
    numberFormat, noteCount, songGimmick, noteGimmick, acGimmick, items, acMission, acAverage
}
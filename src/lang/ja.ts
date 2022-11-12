import {
    ACMissionType,
    SkillEffectType,
    skillEffectTypeAffectsSPVoltage,
    skillEffectTypeTargetsFormation,
    SkillFinishType,
    SkillTargetType,
    SkillTriggerAC,
    SkillTriggerNote
} from "../enums";
import type {LiveDataAC, LiveDataGimmick, LiveDataGimmickAC, LiveDataGimmickNote} from "../types";

function numberFormat(n: number) {
    // https://stackoverflow.com/a/2901298
    let parts = n.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `<span class="inline-block">${parts.join(".")}</span>`;
}

function noteCount(n: number) {
    return numberFormat(n);
}

function songGimmick({effect_type, effect_amount, target, finish_type, finish_amount}: LiveDataGimmick) {
    if (finish_type === SkillFinishType.UNTIL_SONG_END) {
        // Replace type to remove "until the song ends" condition - pretty much implied through being the song gimmick
        finish_type = SkillFinishType.INSTANT;
    }
    return skill(effect_type, effect_amount, target, finish_type, finish_amount);
}

function noteGimmick({trigger, effect_type, effect_amount, target, finish_type, finish_amount}: LiveDataGimmickNote) {
    const skillString = skill(effect_type, effect_amount, target, finish_type, finish_amount);

    if (trigger === SkillTriggerNote.HIT)
        return `If hit, ${skillString}`;
    if (trigger === SkillTriggerNote.MISS)
        return `If missed, ${skillString}`;
    if (trigger === SkillTriggerNote.ALWAYS)
        return skillString;
    if (trigger === SkillTriggerNote.HIT_VO)
        return `If hit with a <span class="t vo">Vo</span> unit, ${skillString}`;
    if (trigger === SkillTriggerNote.HIT_SP)
        return `If hit with a <span class="t sp">Sp</span> unit, ${skillString}`;
    if (trigger === SkillTriggerNote.HIT_SK)
        return `If hit with a <span class="t sk">Sk</span> unit, ${skillString}`;

    throw new Error(`No translation for note gimmick trigger type ${trigger}`);
}

function acGimmick({trigger, effect_type, effect_amount, target, finish_type, finish_amount}: LiveDataGimmickAC) {
    const skillString = skill(effect_type, effect_amount, target, finish_type, finish_amount);

    if (trigger === SkillTriggerAC.START) {
        if (finish_type === SkillFinishType.UNTIL_AC_END) {
            return `During this AC, ${skillString}`;
        } else {
            return `When the AC starts, ${skillString}`;
        }
    }
    if (trigger === SkillTriggerAC.SUCCESS)
        return `On AC Success, ${skillString}`;
    if (trigger === SkillTriggerAC.FAILURE)
        return `On AC Failure, ${skillString}`;
    if (trigger === SkillTriggerAC.END)
        return `At the end of the AC, ${skillString}`;

    throw new Error(`No translation for AC trigger type ${trigger}`);
}

function skill(effectType: SkillEffectType, effectAmount: number, targetType: SkillTargetType,
               finishType: SkillFinishType, finishAmount: number) {
    const effect = skillEffect(effectType, effectAmount);
    const target = skillEffectTypeTargetsFormation(effectType) ? "" : skillTarget(targetType);
    const finish = skillFinish(finishType, finishAmount, skillEffectTypeAffectsSPVoltage(effectType));
    return `${target}${effect}${finish}`;
}

function skillEffect(effectType: SkillEffectType, effectAmount: number) {
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

function skillTarget(targetType: SkillTargetType) {
    const t = skillTargetMap[targetType];
    if (t === undefined) throw new Error(`No translation for skill target type ${targetType}`);
    return t;
}

function skillFinish(finishType: SkillFinishType, finishAmount: number, isSPVoltageGainBuff: boolean) {
    if (finishType === SkillFinishType.UNTIL_SONG_END)
        return ` until the song ends`;
    if (finishType === SkillFinishType.NOTE_COUNT)
        return ` for ${numberFormat(finishAmount)} notes`;
    if (finishType === SkillFinishType.INSTANT)
        return ``;
    if (finishType === SkillFinishType.UNTIL_AC_END)
        return ``; // (This is handled in the trigger switch in acGimmick)
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
        if (finishAmount <= 1) return ` until the next Strategy swap`;
        else return ` until Strategies are swapped ${finishAmount} times`;
    }

    throw new Error(`No translation for skill finish type ${finishType}`);
}

function acMission({mission_type, mission_value}: LiveDataAC) {
    if (mission_type === ACMissionType.VOLTAGE_TOTAL)
        return `Get ${numberFormat(mission_value)} Voltage`;
    if (mission_type === ACMissionType.TIMING_NICE)
        return `Hit ${numberFormat(mission_value)} NICEs`;
    if (mission_type === ACMissionType.TIMING_GREAT)
        return `Hit ${numberFormat(mission_value)} GREATs`;
    if (mission_type === ACMissionType.TIMING_WONDERFUL)
        return `Hit ${numberFormat(mission_value)} WONDERFULs`;
    if (mission_type === ACMissionType.VOLTAGE_SINGLE)
        return `Get ${numberFormat(mission_value)} Voltage in one Appeal`;
    if (mission_type === ACMissionType.VOLTAGE_SP)
        return `Get ${numberFormat(mission_value)} Voltage from SP`;
    if (mission_type === ACMissionType.UNIQUE)
        return `Appeal with ${numberFormat(mission_value)} unique Units`;
    if (mission_type === ACMissionType.CRITICALS)
        return `Get ${numberFormat(mission_value)} Criticals`;
    if (mission_type === ACMissionType.SKILLS)
        return `Activate ${numberFormat(mission_value)} Tap Skills`;
    if (mission_type === ACMissionType.STAMINA) {
        if (mission_value === 10000) return `Finish the AC with ${numberFormat(mission_value / 100)}% of max Stamina`;
        else return `Finish the AC with ${numberFormat(mission_value / 100)}% of max Stamina or more`;
    }
    throw new Error(`No translation for mission title of AC mission type ${mission_type}`);
}

function acAverage({mission_type, mission_value}: LiveDataAC, notes: number) {
    if (mission_type === ACMissionType.VOLTAGE_TOTAL) {
        return `(avg. ${Math.ceil(mission_value / notes)} Voltage per note)`;
    } else if (mission_type === ACMissionType.CRITICALS) {
        return `(${Math.ceil(mission_value / notes * 100)}% of notes must crit)`;
    } else if (mission_type === ACMissionType.SKILLS) {
        return `(${Math.ceil(mission_value / notes * 100)}% of taps must proc)`;
    }
    throw new Error(`No translation for requirement average of AC mission type ${mission_type}`);
}

export default {
    meta: {
        title: "スクスタ譜面データベース",
        description: "Song information database for SIFAS, including complete note maps, gimmick note timings and AC rewards."
    },
    header: {
        title: "スクスタ譜面DB",
        back: "Back",
    },
    tab: {
        start: "スタート",
        muse: "µ's",
        aqours: "Aqours",
        nijigaku: "ニジガク",
        liella: "Liella!",
        dlp: "DLP",
        rankings: "ランキング"
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
            S: "Sランク条件",
            A: "Aランク条件",
            B: "Bランク条件",
            C: "Cランク条件",
        },
        note_damage: "ノーツダメージ",
        voltage_caps: {
            tap: "アピールボルテージ天井",
            sp: "SPボルテージ天井",
            skill: "スキルボルテージ天井",
            swap: "作戦切替ボルテージ天井",
        },
        sp_gauge_max: "最大SPゲージ量",
        note_count: "ノーツ数",
        note_count_ac: "ACでノーツ数",
        note_damage_total: "合計ノーツダメージ",
        ac_reward_total: "合計ACクリアボルテージ",
        song_length: "楽曲の長さ",
        story_stages: "ストーリーステージ",
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
        song_gimmick: {
            label: "Song Gimmick",
            label_multiple: "Song Gimmicks",
            gimmick: songGimmick,
            cleansable: "Cleansable",
            cleansable_yes: "Yes",
            cleansable_no: "No"
        },
        note_gimmick: {
            label: "Note Gimmick",
            gimmick: noteGimmick,
            amount: "Amount",
            position: "Note Position",
            slot: "Slot",
            filter: "click to filter",
            filter_remove: "click to remove filter"
        },
        gimmick: "Gimmick",
        no_gimmick: "No Gimmick"
    },
    appeal_chances: {
        title: "Appeal Chances",
        label: "AC",
        gimmick: acGimmick,
        mission: acMission,
        length: "Length",
        average: acAverage,
        reward_voltage_label: "Success",
        reward_voltage: "Voltage",
        penalty_damage_label: "Failure",
        penalty_damage: "Damage"
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
    format: {
        number: numberFormat,
        note_count: noteCount
    },
    items: () => ""
};
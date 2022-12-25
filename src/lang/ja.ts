import {
    ACMissionType,
    SkillEffectType,
    skillEffectTypeAffectsSPVoltage,
    skillEffectTypeTargetsFormation,
    SkillFinishType,
    SkillTargetType,
    SkillTriggerAC,
    SkillTriggerNote
} from "$enums";
import type {LiveDataAC, LiveDataGimmick, LiveDataGimmickAC, LiveDataGimmickNote} from "../types";

function numberFormat(n: number): string {
    // https://stackoverflow.com/a/2901298
    let parts = n.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `<span class="inline-block">${parts.join(".")}</span>`;
}

function noteCount(n: number): string {
    return numberFormat(n);
}

function songTime(ms: number, showMs: boolean) {
    const min = Math.floor(ms / 60000);
    const msec = (ms % 60000);
    return min + "分" + Math.floor(msec / 1000) + "秒" + (showMs ? msec % 1000 : "");
}

function removeLeadingComma(s: string): string {
    if (s.charAt(0) === "、") return s.substring(1);
    return s;
}

function songGimmick({effect_type, effect_amount, target, finish_type, finish_amount}: LiveDataGimmick) {
    if (finish_type === SkillFinishType.UNTIL_SONG_END) {
        // Replace type to remove "until the song ends" condition - pretty much implied through being the song gimmick
        finish_type = SkillFinishType.UNTIL_AC_END;
    }
    return removeLeadingComma(skill(effect_type, effect_amount, target, finish_type, finish_amount));
}

function noteGimmick({trigger, effect_type, effect_amount, target, finish_type, finish_amount}: LiveDataGimmickNote) {
    const skillString = skill(effect_type, effect_amount, target, finish_type, finish_amount);
    const connector = finish_type === SkillFinishType.INSTANT ? "に" : "から";

    if (trigger === SkillTriggerNote.HIT)
        return `成功時${connector}${skillString}`;
    if (trigger === SkillTriggerNote.MISS)
        return `失敗時${connector}${skillString}`;
    if (trigger === SkillTriggerNote.ALWAYS)
        return removeLeadingComma(skillString);
    if (trigger === SkillTriggerNote.HIT_VO)
        return `<span class="t vo">Vo</span>タイプで成功時${connector}${skillString}`;
    if (trigger === SkillTriggerNote.HIT_SP)
        return `<span class="t sp">Sp</span>タイプで成功時${connector}${skillString}`;
    if (trigger === SkillTriggerNote.HIT_SK)
        return `<span class="t sk">Sk</span>タイプで成功時${connector}${skillString}`;

    throw new Error(`No translation for note gimmick trigger type ${trigger}`);
}

function acGimmick({trigger, effect_type, effect_amount, target, finish_type, finish_amount}: LiveDataGimmickAC) {
    const skillString = skill(effect_type, effect_amount, target, finish_type, finish_amount);
    const connector = finish_type === SkillFinishType.INSTANT ? "に" : "から";

    if (trigger === SkillTriggerAC.START) {
        if (finish_type === SkillFinishType.UNTIL_AC_END) {
            return `AC中${skillString}`;
        } else {
            return `開始時${connector}${skillString}`;
        }
    }
    if (trigger === SkillTriggerAC.SUCCESS)
        return `成功時${connector}${skillString}`;
    if (trigger === SkillTriggerAC.FAILURE)
        return `失敗時${connector}${skillString}`;
    if (trigger === SkillTriggerAC.END)
        return `終了時${connector}${skillString}`;

    throw new Error(`No translation for AC trigger type ${trigger}`);
}

function skill(effectType: SkillEffectType, effectAmount: number, targetType: SkillTargetType,
               finishType: SkillFinishType, finishAmount: number) {
    const effect = skillEffect(effectType, effectAmount);
    const target = skillEffectTypeTargetsFormation(effectType) ? "" : skillTarget(targetType);
    const finish = skillFinish(finishType, finishAmount, skillEffectTypeAffectsSPVoltage(effectType));
    return `${finish}、${target}${effect}`;
}

function skillEffect(effectType: SkillEffectType, effectAmount: number) {
    if (effectType === SkillEffectType.SP_FILL)
        return `SPゲージを${numberFormat(effectAmount)}獲得`;
    if (effectType === SkillEffectType.SHIELD_GAIN)
        return `シールドを${numberFormat(effectAmount)}獲得`;
    if (effectType === SkillEffectType.STAMINA_HEAL)
        return `スタミナを${numberFormat(effectAmount)}回復`;
    if (effectType === SkillEffectType.APPEAL_BUFF)
        return `のアピール${numberFormat(effectAmount / 100)}%増加`;
    if (effectType === SkillEffectType.VOGAIN_BUFF)
        return `の獲得ボルテージ${numberFormat(effectAmount / 100)}%増加`;
    if (effectType === SkillEffectType.SPGAIN_BUFF)
        return `のSPゲージ獲得量${numberFormat(effectAmount / 100)}%上昇`;
    if (effectType === SkillEffectType.CRITCHANCE_BUFF)
        return `のクリティカル率が${numberFormat(effectAmount / 100)}%上昇`;
    if (effectType === SkillEffectType.CRITPOWER_BUFF)
        return `のクリティカル値が${numberFormat(effectAmount / 100)}%上昇`;
    if (effectType === SkillEffectType.SKILLCHANCE_BUFF)
        return `の特技発動率${numberFormat(effectAmount / 100)}%上昇`;
    if (effectType === SkillEffectType.SPVO_BUFF)
        return `のSP特技の獲得ボルテージ${numberFormat(effectAmount / 100)}%増加`;
    if (effectType === SkillEffectType.APPEAL_BASE_BUFF)
        return `の基本アピール${numberFormat(effectAmount / 100)}%増加`;
    if (effectType === SkillEffectType.SKILLCHANCE_BASE_BUFF)
        return `の基本特技発動率${numberFormat(effectAmount / 100)}%上昇`;
    if (effectType === SkillEffectType.CRITCHANCE_BASE_BUFF)
        return `の基本クリティカル率が${numberFormat(effectAmount / 100)}%上昇`;
    if (effectType === SkillEffectType.SPGAIN_BASE2_BUFF)
        return `の基本SPゲージ獲得量${numberFormat(effectAmount / 100)}%上昇`;
    if (effectType === SkillEffectType.CRITCHANCE_BASE2_BUFF)
        return `の基本クリティカル率が${numberFormat(effectAmount / 100)}%上昇`;
    if (effectType === SkillEffectType.CRITPOWER_BASE2_BUFF)
        return `の基本クリティカル値が${numberFormat(effectAmount / 100)}%上昇`;
    if (effectType === SkillEffectType.SKILLCHANCE_BASE2_BUFF)
        return `の基本特技発動率${numberFormat(effectAmount / 100)}%上昇`;
    if (effectType === SkillEffectType.APPEAL_BASE2_BUFF)
        return `の基本アピール${numberFormat(effectAmount / 100)}%増加`;
    if (effectType === SkillEffectType.SPVO_BASE2_BUFF)
        return `の基本SP特技の獲得ボルテージ${numberFormat(effectAmount / 100)}%増加`;
    if (effectType === SkillEffectType.VOGAIN_BASE2_BUFF)
        return `の基本獲得ボルテージ${numberFormat(effectAmount / 100)}%増加`;
    if (effectType === SkillEffectType.CLEANSE_BUFFS)
        return `すべての上昇/増加効果を解除（基本上昇/基本増加を除く）`;
    if (effectType === SkillEffectType.STAMINA_DAMAGE)
        return `${numberFormat(effectAmount)}スタミナダメージ`;
    if (effectType === SkillEffectType.SP_LOSE_PERCENTAGE)
        return `最大値の${numberFormat(effectAmount / 100)}%SPゲージ減少`;
    if (effectType === SkillEffectType.SHIELD_LOSE)
        return `シールドが${numberFormat(effectAmount)}減少`;
    if (effectType === SkillEffectType.APPEAL_DEBUFF)
        return `のアピール${numberFormat(effectAmount / 100)}%減少`;
    if (effectType === SkillEffectType.VOGAIN_DEBUFF)
        return `の獲得ボルテージ${numberFormat(effectAmount / 100)}%減少`;
    if (effectType === SkillEffectType.SPGAIN_DEBUFF)
        return `のSPゲージ獲得量${numberFormat(effectAmount / 100)}%低下`;
    if (effectType === SkillEffectType.CRITCHANCE_DEBUFF)
        return `のクリティカル率が${numberFormat(effectAmount / 100)}%低下`;
    if (effectType === SkillEffectType.CRITPOWER_DEBUFF)
        return `のクリティカル値が${numberFormat(effectAmount / 100)}%低下`;
    if (effectType === SkillEffectType.SKILLCHANCE_DEBUFF)
        return `の特技発動率${numberFormat(effectAmount / 100)}%低下`;
    if (effectType === SkillEffectType.SKILLCHANCE_BASE2_DEBUFF)
        return `の基本特技発動率${numberFormat(effectAmount / 100)}%低下`;
    if (effectType === SkillEffectType.VOGAIN_BASE2_DEBUFF)
        return `の基本獲得ボルテージ${numberFormat(effectAmount / 100)}%減少`;
    if (effectType === SkillEffectType.APPEAL_BASE2_DEBUFF)
        return `のアピール${numberFormat(effectAmount / 100)}%減少`;
    if (effectType === SkillEffectType.CRITCHANCE_BASE2_DEBUFF)
        return `の基本クリティカル率が${numberFormat(effectAmount / 100)}%低下`;
    if (effectType === SkillEffectType.SPGAIN_BASE2_DEBUFF)
        return `の基本SPゲージ獲得量${numberFormat(effectAmount / 100)}%低下`;
    if (effectType === SkillEffectType.APPEAL_BASE_DEBUFF)
        return `の基本アピール${numberFormat(effectAmount / 100)}%減少`;
    if (effectType === SkillEffectType.SPGAIN_BASE_DEBUFF)
        return `の基本SPゲージ獲得量${numberFormat(effectAmount / 100)}%低下`;
    if (effectType === SkillEffectType.SKILLCHANCE_BASE_DEBUFF)
        return `の基本特技発動率${numberFormat(effectAmount / 100)}%低下`;
    if (effectType === SkillEffectType.CRITCHANCE_BASE_DEBUFF)
        return `の基本クリティカル率が${numberFormat(effectAmount / 100)}%低下`;
    if (effectType === SkillEffectType.SP_GAIN_PERCENTAGE)
        return `最大値の${numberFormat(effectAmount / 100)}%SPゲージ獲得`;
    if (effectType === SkillEffectType.SHIELD_GAIN_PERCENTAGE)
        return `最大スタミナの${numberFormat(effectAmount / 100)}%シールド獲得`;
    if (effectType === SkillEffectType.STAMINA_HEAL_PERCENTAGE)
        return `最大値の${numberFormat(effectAmount / 100)}%スタミナ回復`;
    if (effectType === SkillEffectType.DAMAGE_INCREASE)
        return `スタミナダメージが${numberFormat(effectAmount / 100)}%増加`;
    if (effectType === SkillEffectType.DAMAGE_BASE2_INCREASE)
        return `基本スタミナダメージが${numberFormat(effectAmount / 100)}%増加`;
    if (effectType === SkillEffectType.SP_GAIN_BY_TECH)
        return `アピールしているカードのテクニックの${numberFormat(effectAmount / 100)}%SPゲージ獲得`;
    if (effectType === SkillEffectType.APPEAL_BUFF_BY_VO)
        return `が<span class="t vo">Vo</span>タイプ×${numberFormat(effectAmount / 100)}%アピール増加`;
    if (effectType === SkillEffectType.APPEAL_DEBUFF_BY_VO)
        return `が<span class="t vo">Vo</span>タイプ×${numberFormat(effectAmount / 100)}%アピール減少`;
    if (effectType === SkillEffectType.APPEAL_BUFF_BY_SK)
        return `が<span class="t sk">Sk</span>タイプ×${numberFormat(effectAmount / 100)}%アピール増加`;
    if (effectType === SkillEffectType.STAMINA_HEAL_BY_VO)
        return `<span class="t vo">Vo</span>タイプ×${numberFormat(effectAmount)}スタミナ回復`;
    if (effectType === SkillEffectType.STAMINA_HEAL_BY_SP)
        return `<span class="t sp">Sp</span>タイプ×${numberFormat(effectAmount)}スタミナ回復`;
    if (effectType === SkillEffectType.STAMINA_HEAL_BY_SK)
        return `<span class="t sk">Sk</span>タイプ×${numberFormat(effectAmount)}スタミナ回復`;
    if (effectType === SkillEffectType.STAMINA_HEAL_BY_GD)
        return `<span class="t gd">Gd</span>タイプ×${numberFormat(effectAmount)}スタミナ回復`;
    if (effectType === SkillEffectType.APPEAL_BASE2_BUFF_BY_VO)
        return `が<span class="t vo">Vo</span>タイプ×${numberFormat(effectAmount / 100)}%基本アピール増加`;
    if (effectType === SkillEffectType.APPEAL_BASE2_BUFF_BY_SP)
        return `が<span class="t sp">Sp</span>タイプ×${numberFormat(effectAmount / 100)}%基本アピール増加`;
    if (effectType === SkillEffectType.APPEAL_BASE2_BUFF_BY_SK)
        return `が<span class="t sk">Sk</span>タイプ×${numberFormat(effectAmount / 100)}%基本アピール増加`;
    if (effectType === SkillEffectType.APPEAL_BASE2_BUFF_BY_GD)
        return `が<span class="t gd">Gd</span>タイプ×${numberFormat(effectAmount / 100)}%基本アピール増加`;
    if (effectType === SkillEffectType.SKILLCHANCE_BUFF_BY_VO)
        return `が<span class="t vo">Vo</span>タイプ×${numberFormat(effectAmount / 100)}%特技発動率上昇`;
    if (effectType === SkillEffectType.SKILLCHANCE_BUFF_BY_SK)
        return `が<span class="t sk">Sk</span>タイプ×${numberFormat(effectAmount / 100)}%特技発動率上昇`;
    if (effectType === SkillEffectType.SKILLCHANCE_BUFF_BY_GD)
        return `が<span class="t gd">Gd</span>タイプ×${numberFormat(effectAmount / 100)}%特技発動率上昇`;
    if (effectType === SkillEffectType.SKILLCHANCE_BASE2_BUFF_BY_VO)
        return `が<span class="t vo">Vo</span>タイプ×${numberFormat(effectAmount / 100)}%基本特技発動率上昇`;
    if (effectType === SkillEffectType.SKILLCHANCE_BASE2_BUFF_BY_SP)
        return `が<span class="t sp">Sp</span>タイプ×${numberFormat(effectAmount / 100)}%基本特技発動率上昇`;
    if (effectType === SkillEffectType.SKILLCHANCE_BASE2_BUFF_BY_SK)
        return `が<span class="t sk">Sk</span>タイプ×${numberFormat(effectAmount / 100)}%基本特技発動率上昇`;
    if (effectType === SkillEffectType.SKILLCHANCE_BASE2_BUFF_BY_GD)
        return `が<span class="t gd">Gd</span>タイプ×${numberFormat(effectAmount / 100)}%基本特技発動率上昇`;
    if (effectType === SkillEffectType.CRITCHANCE_BUFF_BY_VO)
        return `が<span class="t vo">Vo</span>タイプ×${numberFormat(effectAmount / 100)}%クリティカル率上昇`;
    if (effectType === SkillEffectType.CRITCHANCE_BUFF_BY_SK)
        return `が<span class="t sk">Sk</span>タイプ×${numberFormat(effectAmount / 100)}%クリティカル率上昇`;
    if (effectType === SkillEffectType.CRITCHANCE_BASE2_BUFF_BY_VO)
        return `が<span class="t vo">Vo</span>タイプ×${numberFormat(effectAmount / 100)}%基本クリティカル率上昇`;
    if (effectType === SkillEffectType.CRITCHANCE_BASE2_BUFF_BY_SK)
        return `が<span class="t sk">Sk</span>タイプ×${numberFormat(effectAmount / 100)}%基本クリティカル率上昇`;
    if (effectType === SkillEffectType.CRITPOWER_BUFF_BY_VO)
        return `が<span class="t vo">Vo</span>タイプ×${numberFormat(effectAmount / 100)}%クリティカル値上昇`;
    if (effectType === SkillEffectType.SPVO_BUFF_BY_SP)
        return `が<span class="t sp">Sp</span>タイプ×${numberFormat(effectAmount / 100)}%SP特技の獲得ボルテージ増加`;
    if (effectType === SkillEffectType.SPVO_BASE2_BUFF_BY_VO)
        return `が<span class="t vo">Vo</span>タイプ×${numberFormat(effectAmount / 100)}%基本SP特技の獲得ボルテージ増加`;
    if (effectType === SkillEffectType.SPVO_BASE2_BUFF_BY_SP)
        return `が<span class="t sp">Sp</span>タイプ×${numberFormat(effectAmount / 100)}%基本SP特技の獲得ボルテージ増加`;
    if (effectType === SkillEffectType.SPVO_BASE2_BUFF_BY_SK)
        return `が<span class="t sk">Sk</span>タイプ×${numberFormat(effectAmount / 100)}%基本SP特技の獲得ボルテージ増加`;
    if (effectType === SkillEffectType.SWAP_VO_BASE_BUFF)
        return `の基本作戦切替ボーナスに${numberFormat(effectAmount)}ボルテージ加算`;
    if (effectType === SkillEffectType.SWAP_SK_BASE_BUFF)
        return `の基本作戦切替ボーナスに${numberFormat(effectAmount)}加算`;
    if (effectType === SkillEffectType.SWAP_SP_BASE_BUFF)
        return `の基本作戦切替ボーナスに${numberFormat(effectAmount)}加算`;
    if (effectType === SkillEffectType.STAMINA_DAMAGE_PIERCE)
        return `シールド効果を無視して最大スタミナ${numberFormat(effectAmount / 100)}%ダメージ`;
    if (effectType === SkillEffectType.STAMINA_HEAL_BLOCK)
        return `スタミナ回復不可`;

    throw new Error(`No translation for skill effect type ${effectType}`);
}

const skillTargetMap = {
    [SkillTargetType.ALL]: `全員`,
    [SkillTargetType.CHAR_YOSHIKO]: `善子`,
    [SkillTargetType.CHAR_HANAMARU]: `花丸`,
    [SkillTargetType.CHAR_MARI]: `鞠莉`,
    [SkillTargetType.CHAR_RUBY]: `ルビィ`,
    [SkillTargetType.CHAR_AYUMU]: `歩夢`,
    [SkillTargetType.CHAR_KASUMI]: `かすみ`,
    [SkillTargetType.CHAR_SHIZUKU]: `しずく`,
    [SkillTargetType.CHAR_KARIN]: `果林`,
    [SkillTargetType.CHAR_AI]: `愛`,
    [SkillTargetType.CHAR_KANATA]: `彼方`,
    [SkillTargetType.CHAR_SETSUNA]: `せつ菜`,
    [SkillTargetType.CHAR_EMMA]: `エマ`,
    [SkillTargetType.CHAR_RINA]: `璃奈`,
    [SkillTargetType.GROUP_MUSE]: `µ'sのメンバー`,
    [SkillTargetType.GROUP_AQOURS]: `Aqoursのメンバー`,
    [SkillTargetType.GROUP_NIJI]: `ニジガクのメンバー`,
    [SkillTargetType.SUB_CYARON]: `CYaRonのメンバー`,
    [SkillTargetType.SUB_AZALEA]: `AZALEAのメンバー`,
    [SkillTargetType.SUB_GUILTYKISS]: `Guilty Kissのメンバー`,
    [SkillTargetType.TYPE_VO]: `<span class="t vo">Vo</span>タイプ`,
    [SkillTargetType.TYPE_SP]: `<span class="t sp">Sp</span>タイプ`,
    [SkillTargetType.TYPE_GD]: `<span class="t gd">Gd</span>タイプ`,
    [SkillTargetType.TYPE_SK]: `<span class="t sk">Sk</span>タイプ`,
    [SkillTargetType.NONE]: ``,
    [SkillTargetType.ATTR_SMILE]: `<span class="a smile">スマイル</span>属性`,
    [SkillTargetType.ATTR_PURE]: `<span class="a pure">ピュア</span>属性`,
    [SkillTargetType.ATTR_COOL]: `<span class="a cool">クール</span>属性`,
    [SkillTargetType.ATTR_ACTIVE]: `<span class="a active">アクティブ</span>属性`,
    [SkillTargetType.ATTR_NATURAL]: `<span class="a natural">ナチュラル</span>属性`,
    [SkillTargetType.ATTR_ELEGANT]: `<span class="a elegant">エレガント</span>属性`,
    [SkillTargetType.ATTR_NOT_SMILE]: `<span class="a smile">スマイル</span>属性以外`,
    [SkillTargetType.TYPE_NOT_VO]: `<span class="t vo">Vo</span>タイプ以外`,
    [SkillTargetType.YEAR_1]: `1年生`,
    [SkillTargetType.YEAR_2]: `2年生`,
    [SkillTargetType.YEAR_3]: `3年生`,
    [SkillTargetType.ATTR_NOT_PURE]: `<span class="a pure">ピュア</span>属性以外`,
    [SkillTargetType.ATTR_NOT_COOL]: `<span class="a cool">クール</span>属性以外`,
    [SkillTargetType.ATTR_NOT_ACTIVE]: `<span class="a active">アクティブ</span>属性以外`,
    [SkillTargetType.ATTR_NOT_NATURAL]: `<span class="a natural">ナチュラル</span>属性以外`,
    [SkillTargetType.ATTR_NOT_ELEGANT]: `<span class="a elegant">エレガント</span>属性以外`,
    [SkillTargetType.TYPE_NOT_SP]: `<span class="t sp">Sp</span>タイプ以外`,
    [SkillTargetType.TYPE_NOT_GD]: `<span class="t gd">Gd</span>タイプ以外`,
    [SkillTargetType.TYPE_NOT_SK]: `<span class="t sk">Sk</span>タイプ以外`,
    [SkillTargetType.STRATEGY]: `選択中の作戦`,
    [SkillTargetType.GROUP_NOT_MUSE]: `µ'sのメンバー以外`,
    [SkillTargetType.TYPE_NOT_VO_GD]: `<span class="t vo">Vo</span>タイプと<span class="t gd">Gd</span>タイプ以外`,
    [SkillTargetType.TYPE_NOT_VO_SP]: `<span class="t vo">Vo</span>タイプと<span class="t sp">Sp</span>タイプ以外`,
    [SkillTargetType.TYPE_NOT_VO_SK]: `<span class="t vo">Vo</span>タイプと<span class="t sk">Sk</span>タイプ以外`,
    [SkillTargetType.TYPE_NOT_GD_SP]: `<span class="t gd">Gd</span>タイプと<span class="t sp">Sp</span>タイプ以外`,
    [SkillTargetType.TYPE_NOT_SP_SK]: `<span class="t sp">Sp</span>タイプと<span class="t sk">Sk</span>タイプ以外`,
    [SkillTargetType.TYPE_SP_SK]: `<span class="t sp">Sp</span>タイプと<span class="t sk">Sk</span>タイプ`,
    [SkillTargetType.TYPE_VO_SK]: `<span class="t vo">Vo</span>タイプと<span class="t sk">Sk</span>タイプ`,
    [SkillTargetType.TYPE_VO_SP]: `<span class="t vo">Vo</span>タイプと<span class="t sp">Sp</span>タイプ`,
    [SkillTargetType.TYPE_VO_GD]: `<span class="t vo">Vo</span>タイプと<span class="t gd">Gd</span>タイプ`,
    [SkillTargetType.GROUP_NOT_AQOURS]: `Aqoursのメンバー以外`,
    [SkillTargetType.GROUP_NOT_NIJI]: `Nijigakuのメンバー以外`,
    [SkillTargetType.YEAR_NOT_1]: `1年生以外`,
    [SkillTargetType.YEAR_NOT_2]: `2年生以外`,
    [SkillTargetType.YEAR_NOT_3]: `3年生以外`,
    [SkillTargetType.SUB_DIVERDIVA]: `DiverDivaのメンバー`,
    [SkillTargetType.SUB_AZUNA]: `A•ZU•NAのメンバー`,
    [SkillTargetType.SUB_QU4RTZ]: `QU4RTZのメンバー`,
    [SkillTargetType.SUB_NOT_DIVERDIVA]: `DiverDivaのメンバー以外`,
    [SkillTargetType.SUB_NOT_AZUNA]: `A•ZU•NAのメンバー以外`,
    [SkillTargetType.SUB_NOT_QU4RTZ]: `QU4RTZのメンバー以外`,
    [SkillTargetType.CHAR_SHIORIKO]: `栞子`,
    [SkillTargetType.CHAR_LANZHU]: `ランジュ`,
    [SkillTargetType.CHAR_MIA]: `ミア`,
    [SkillTargetType.ATTR_COOL_GROUP_AQOURS]: `<span class="a cool">クール</span>属性のAqours`
}

function skillTarget(targetType: SkillTargetType) {
    const t = skillTargetMap[targetType];
    if (t === undefined) throw new Error(`No translation for skill target type ${targetType}`);
    return t;
}

function skillFinish(finishType: SkillFinishType, finishAmount: number, isSPVoltageGainBuff: boolean) {
    if (finishType === SkillFinishType.UNTIL_SONG_END)
        return `ライブ終了まで`;
    if (finishType === SkillFinishType.NOTE_COUNT)
        return `${numberFormat(finishAmount)}ノーツの間`;
    if (finishType === SkillFinishType.INSTANT)
        return ``;
    if (finishType === SkillFinishType.UNTIL_AC_END)
        return ``; // (This is handled in the trigger switch in acGimmick)
    if (finishType === SkillFinishType.SP_COUNT) {
        if (isSPVoltageGainBuff) {
            if (finishAmount == 1) return `次のSP特技発動は`;
            else return `次の${numberFormat(finishAmount)}回のSP特技発動は`;
        } else {
            if (finishAmount == 1) return `SP特技発動するまで`;
            else return `${numberFormat(finishAmount)}回のSP特技するまで`;
        }
    }
    if (finishType === SkillFinishType.UNTIL_SWAP) {
        if (finishAmount <= 1) return `作戦切替するまで`;
        else return `作戦切替${numberFormat(finishAmount)}回するまで`;
    }

    throw new Error(`No translation for skill finish type ${finishType}`);
}

function acMission({mission_type, mission_value}: LiveDataAC) {
    if (mission_type === ACMissionType.VOLTAGE_TOTAL)
        return `合計${numberFormat(mission_value)}ボルテージを獲得する`;
    if (mission_type === ACMissionType.TIMING_NICE)
        return `NICE以上の判定を${numberFormat(mission_value)}回出す`;
    if (mission_type === ACMissionType.TIMING_GREAT)
        return `GREAT以上の判定を${numberFormat(mission_value)}回出す`;
    if (mission_type === ACMissionType.TIMING_WONDERFUL)
        return `WONDERFULの判定を${numberFormat(mission_value)}回出す`;
    if (mission_type === ACMissionType.VOLTAGE_SINGLE)
        return `1回で${numberFormat(mission_value)}ボルテージを獲得する`;
    if (mission_type === ACMissionType.VOLTAGE_SP)
        return `SP特技で合計${numberFormat(mission_value)}ボルテージを獲得する`;
    if (mission_type === ACMissionType.UNIQUE)
        return `${numberFormat(mission_value)}人のスクールアイドルでアピールする`;
    if (mission_type === ACMissionType.CRITICALS)
        return `クリティカル判定を${numberFormat(mission_value)}回出す`;
    if (mission_type === ACMissionType.SKILLS)
        return `特技を${numberFormat(mission_value)}回発動する`;
    if (mission_type === ACMissionType.STAMINA) {
        if (mission_value === 10000) return `スタミナを${numberFormat(mission_value / 100)}%維持する`;
        else return `スタミナを${numberFormat(mission_value / 100)}%以上維持する`;
    }
    throw new Error(`No translation for mission title of AC mission type ${mission_type}`);
}

function acAverage({mission_type, mission_value}: LiveDataAC, notes: number) {
    if (mission_type === ACMissionType.VOLTAGE_TOTAL) {
        return `1ノーツに平均ボルテージは${numberFormat(Math.ceil(mission_value / notes))}`;
    } else if (mission_type === ACMissionType.CRITICALS) {
        return `アピールの${numberFormat(Math.ceil(mission_value / notes * 100))}%がクリティカル判定出すのは必要`;
    } else if (mission_type === ACMissionType.SKILLS) {
        return `アピールの${numberFormat(Math.ceil(mission_value / notes * 100))}%が特技を発動するのは必要`;
    }
    throw new Error(`No translation for requirement average of AC mission type ${mission_type}`);
}

export default {
    meta: {
        title: "スクスタ譜面データベース"
    },
    header: {
        title: "スクスタ譜面DB"
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
        title: "設定",
        titles: "曲名の表記体系",
        titles_toggle: "曲名の表記体系を切り替える",
        titles_kana: "仮名交じり",
        titles_kana_toggle: "曲名を仮名交じりで表示する",
        titles_roma: "ローマ字",
        titles_roma_toggle: "曲名をローマ字で表示する",
        unavailable: "現在プレイできない楽曲を表示",
        unavailable_toggle: "現在プレイできない楽曲を表示を切り替える",
        unavailable_hide: "なし",
        unavailable_hide_toggle: "現在プレイできない楽曲を表示しない",
        unavailable_show: "ある",
        unavailable_show_toggle: "現在プレイできない楽曲を表示する",
        site_theme: "サイトテーマ",
        site_theme_light: "ライト",
        site_theme_dark: "ダーク",
        save: "変更を保存",
        cancel: "変更を破棄"
    },
    search: {
        label: "曲名で絞り込む",
        tooltip: "<span>ぼららら</span>とか<span>君ここ</span>とか<span>虹パ</span>とか略称もOK<br>" +
                "<span>+</span>/<span>++</span>付けると、上級+/チャレンジの譜面が表示されます。"
    },
    songlist: {
        unavailable: "現在プレイできない",
        daily: "日替わり楽曲",
        weekdays: {
            1: "月曜日",
            2: "火曜日",
            3: "水曜日",
            4: "木曜日",
            5: "金曜日",
            6: "土曜日",
            7: "日曜日"
        },
        time_limited: "期間限定"
    },
    songinfo: {
        ranks: {
            S: "Sランク条件",
            A: "Aランク条件",
            B: "Bランク条件",
            C: "Cランク条件",
        },
        note_damage: "基本ノーツダメージ",
        voltage_caps: {
            tap: "アピールの獲得ボルテージ上限",
            sp: "SP特技の獲得ボルテージ上限",
            skill: "スキルの獲得ボルテージ上限",
            swap: "作戦切替の獲得ボルテージ上限",
        },
        sp_gauge_max: "最大SPゲージ量",
        note_count: "ノーツ数",
        note_count_ac: "AC中ノーツ数",
        note_damage_total: "合計ノーツダメージ",
        ac_reward_total: "合計ACクリアボルテージ",
        song_length: "楽曲の時間",
        story_stages: "ストーリーステージ",
        no_map: "譜面はまだありません"
    },
    dlp: {
        performance_points: "PP available",
        performance_points_recoverable: "recoverable",
        performance_points_recovery_cost: "PP Recovery Cost",
        progress_reward: "Progress Reward",
        story_node: "Story Node",
        songinfo: {
            voltage_target: "Target Voltage",
            song_difficulty: "基本難易度",
            reward_clear: "Clear Reward",
            voltage_target_short: "ターゲット",
            note_damage_short: "ノーツダメージ"
        }
    },
    scale: {
        label: "スケール",
        time: "時間",
        turns: "ターン間"
    },
    gimmicks: {
        title: "ギミック",
        song_gimmick: {
            label: "ライブの特徴",
            label_multiple: "ライブの特徴",
            gimmick: songGimmick,
            cleansable: "効果解除",
            cleansable_yes: "できる",
            cleansable_no: "できない"
        },
        note_gimmick: {
            label: "ノーツギミック",
            gimmick: noteGimmick,
            amount: "ノーツ数",
            position: "ノーツ",
            slot: (i: number) => `${i}枠目`,
            filter: "クリックで絞り込む",
            filter_remove: "クリックでリセット"
        },
        gimmick: "特殊効果",
        no_gimmick: "特殊効果なし"
    },
    appeal_chances: {
        title: "アピールチャンス",
        label: "AC",
        gimmick: acGimmick,
        mission: acMission,
        length: "ノーツ数",
        average: acAverage,
        reward_voltage_label: "成功",
        reward_voltage: "ボルテージ",
        penalty_damage_label: "失敗",
        penalty_damage: "ダメージ"
    },
    rankings: {
        column_song: "楽曲",
        show_all_link: "クリックで全楽曲表示",
        length_title: "楽曲の時間ランキング",
        length_column_length: "時間",
        length_show_all_description: "現在プレイできる楽曲のみ表示。",
        notes_title: "ノーツ数ランキング",
        notes_column_notes: "ノーツ",
        notes_show_all_description: "プロフィールに載せられる楽曲のみ表示。"
    },
    difficulty: {
        beginner: "初級",
        beginner_short: "初級",
        intermediate: "中級",
        intermediate_short: "中級",
        advanced: "上級",
        advanced_short: "上級",
        advplus: "上級+",
        advplus_short: "上級+",
        challenge: "チャレンジ",
        challenge_short: "ﾁｬﾚﾝｼﾞ",
    },
    attribute: {
        smile: "スマイル",
        pure: "ピュア",
        cool: "クール",
        active: "アクティブ",
        natural: "ナチュラル",
        elegant: "エレガント",
        none: "無属性"
    },
    format: {
        number: numberFormat,
        note_count: noteCount,
        song_time: songTime
    },
    items: () => ""
};
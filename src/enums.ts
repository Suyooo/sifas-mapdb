export enum Attribute {
    SMILE = 1, PURE, COOL, ACTIVE, NATURAL, ELEGANT, NONE
}

export type AttributeKey = "smile" | "pure" | "cool" | "active" | "natural" | "elegant" | "none";

export function attributeToKey(a: Attribute): AttributeKey {
    if (a === Attribute.SMILE) return "smile";
    if (a === Attribute.PURE) return "pure";
    if (a === Attribute.COOL) return "cool";
    if (a === Attribute.ACTIVE) return "active";
    if (a === Attribute.NATURAL) return "natural";
    if (a === Attribute.ELEGANT) return "elegant";
    else return "none";
}

export enum Difficulty {
    BEGINNER = 10, INTERMEDIATE = 20, ADVANCED = 30, ADVANCED_PLUS = 35, CHALLENGE = 37
}

export enum Role {
    VO = 1, SP = 2, GD = 3, SK = 4
}

export enum NoteType {
    NORMAL = 1, HOLD_START, HOLD_END, AC_START, AC_END
}

export enum NoteAction {
    TAP = 1, SWIPE_UP = 4, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT
}

export enum ACMissionType {
    VOLTAGE_TOTAL = 1, TIMING_NICE, TIMING_GREAT, TIMING_WONDERFUL, VOLTAGE_SINGLE,
    VOLTAGE_SP, UNIQUE, CRITICALS, SKILLS, STAMINA = 16
}

export function acMissionTypeToRole(t: ACMissionType): Role {
    if (t === ACMissionType.VOLTAGE_TOTAL || t === ACMissionType.VOLTAGE_SINGLE || t === ACMissionType.UNIQUE)
        return Role.VO;
    else if (t === ACMissionType.VOLTAGE_SP)
        return Role.SP;
    else if (t === ACMissionType.STAMINA)
        return Role.GD;
    else
        return Role.SK;
}

// Skill Effect Types that affect SP Voltage, which might need a different phrasing if their finish type is SP count
const acMissionTypeHasAverageSet = new Set([
    ACMissionType.VOLTAGE_TOTAL, ACMissionType.CRITICALS, ACMissionType.SKILLS
]);

export function acMissionTypeHasAverage(t: ACMissionType) {
    return acMissionTypeHasAverageSet.has(t);
}

export enum SkillEffectType {
    SP_FILL = 3,
    SHIELD_GAIN = 4,
    STAMINA_HEAL = 5,
    APPEAL_BUFF = 17,
    VOGAIN_BUFF = 18,
    SPGAIN_BUFF = 19,
    CRITCHANCE_BUFF = 20,
    CRITPOWER_BUFF = 21,
    SKILLCHANCE_BUFF = 22,
    SPVO_BUFF = 23,
    APPEAL_BASE_BUFF = 26,
    SKILLCHANCE_BASE_BUFF = 33,
    CRITCHANCE_BASE_BUFF = 36,
    SPGAIN_BASE2_BUFF = 45,
    CRITCHANCE_BASE2_BUFF = 46,
    CRITPOWER_BASE2_BUFF = 47,
    SKILLCHANCE_BASE2_BUFF = 48,
    APPEAL_BASE2_BUFF = 49,
    SPVO_BASE2_BUFF = 50,
    VOGAIN_BASE2_BUFF = 51,
    CLEANSE_BUFFS = 52,
    STAMINA_DAMAGE = 68,
    SP_LOSE_PERCENTAGE = 69,
    SHIELD_LOSE = 70,
    APPEAL_DEBUFF = 71,
    VOGAIN_DEBUFF = 72,
    SPGAIN_DEBUFF = 73,
    CRITCHANCE_DEBUFF = 74,
    CRITPOWER_DEBUFF = 75,
    SKILLCHANCE_DEBUFF = 76,
    SPVO_DEBUFF = 77,
    SKILLCHANCE_BASE2_DEBUFF = 78,
    VOGAIN_BASE2_DEBUFF = 79,
    APPEAL_BASE2_DEBUFF = 81,
    CRITCHANCE_BASE2_DEBUFF = 82,
    SPGAIN_BASE2_DEBUFF = 83,
    APPEAL_BASE_DEBUFF = 84,
    SPGAIN_BASE_DEBUFF = 85,
    SKILLCHANCE_BASE_DEBUFF = 86,
    CRITCHANCE_BASE_DEBUFF = 87,
    SP_GAIN_PERCENTAGE = 91,
    SHIELD_GAIN_PERCENTAGE = 93,
    STAMINA_HEAL_PERCENTAGE = 96,
    DAMAGE_INCREASE = 101,
    DAMAGE_BASE2_INCREASE = 105,
    SP_GAIN_BY_TECH = 112,
    SWAP_GD_BUFF = 118,
    APPEAL_BUFF_BY_VO = 119,
    APPEAL_DEBUFF_BY_VO = 120,
    APPEAL_BUFF_BY_SK = 123,
    STAMINA_HEAL_BY_VO = 128,
    STAMINA_HEAL_BY_SP = 130,
    STAMINA_HEAL_BY_SK = 132,
    STAMINA_HEAL_BY_GD = 134,
    APPEAL_BASE2_BUFF_BY_VO = 137,
    APPEAL_BASE2_BUFF_BY_SP = 139,
    APPEAL_BASE2_BUFF_BY_SK = 141,
    APPEAL_BASE2_BUFF_BY_GD = 143,
    SKILLCHANCE_BUFF_BY_VO = 161,
    SKILLCHANCE_BUFF_BY_SK = 163,
    SKILLCHANCE_BUFF_BY_GD = 164,
    SKILLCHANCE_BASE2_BUFF_BY_VO = 169,
    SKILLCHANCE_BASE2_BUFF_BY_SP = 170,
    SKILLCHANCE_BASE2_BUFF_BY_SK = 171,
    SKILLCHANCE_BASE2_BUFF_BY_GD = 172,
    CRITCHANCE_BUFF_BY_VO = 177,
    CRITCHANCE_BUFF_BY_SK = 179,
    CRITCHANCE_BASE2_BUFF_BY_VO = 185,
    CRITCHANCE_BASE2_BUFF_BY_SK = 187,
    CRITPOWER_BUFF_BY_VO = 193,
    SPVO_BUFF_BY_SP = 210,
    SPVO_BASE2_BUFF_BY_VO = 217,
    SPVO_BASE2_BUFF_BY_SP = 218,
    SPVO_BASE2_BUFF_BY_SK = 219,
    SWAP_SK_BUFF = 226,
    SWAP_VO_BASE2_BUFF = 228,
    SWAP_SK_BASE2_BUFF = 229,
    SWAP_SP_BASE2_BUFF = 230,
    STAMINA_DAMAGE_PIERCE = 263,
    STAMINA_HEAL_BLOCK = 265
}

// Skill Effect Types that target player status - don't print a target for these, even if one is defined in the info
const skillEffectTypeTargetsFormationSet = new Set([
    SkillEffectType.SP_FILL, SkillEffectType.SHIELD_GAIN, SkillEffectType.STAMINA_HEAL, SkillEffectType.STAMINA_DAMAGE,
    SkillEffectType.SP_LOSE_PERCENTAGE, SkillEffectType.SHIELD_LOSE, SkillEffectType.SP_GAIN_PERCENTAGE,
    SkillEffectType.SHIELD_GAIN_PERCENTAGE, SkillEffectType.STAMINA_HEAL_PERCENTAGE, SkillEffectType.DAMAGE_INCREASE,
    SkillEffectType.DAMAGE_BASE2_INCREASE, SkillEffectType.SP_GAIN_BY_TECH, SkillEffectType.STAMINA_HEAL_BY_VO,
    SkillEffectType.STAMINA_HEAL_BY_SP, SkillEffectType.STAMINA_HEAL_BY_SK, SkillEffectType.STAMINA_HEAL_BY_GD,
    SkillEffectType.STAMINA_DAMAGE_PIERCE
]);

export function skillEffectTypeTargetsFormation(t: SkillEffectType) {
    return skillEffectTypeTargetsFormationSet.has(t);
}

// Skill Effect Types that affect SP Voltage, which might need a different phrasing if their finish type is SP count
const skillEffectTypeAffectsSPVoltageSet = new Set([
    SkillEffectType.SPVO_BUFF, SkillEffectType.SPVO_BASE2_BUFF, SkillEffectType.SPVO_DEBUFF,
    SkillEffectType.SPVO_BUFF_BY_SP, SkillEffectType.SPVO_BASE2_BUFF_BY_VO, SkillEffectType.SPVO_BASE2_BUFF_BY_SP,
    SkillEffectType.SPVO_BASE2_BUFF_BY_SK
]);

export function skillEffectTypeAffectsSPVoltage(t: SkillEffectType) {
    return skillEffectTypeAffectsSPVoltageSet.has(t);
}

export enum SkillTargetType {
    ALL = 1,
    CHAR_YOU = 15,
    CHAR_YOSHIKO = 16,
    CHAR_HANAMARU = 17,
    CHAR_MARI = 18,
    CHAR_RUBY = 19,
    CHAR_AYUMU = 20,
    CHAR_KASUMI = 21,
    CHAR_SHIZUKU = 22,
    CHAR_KARIN = 23,
    CHAR_AI = 24,
    CHAR_KANATA = 25,
    CHAR_SETSUNA = 26,
    CHAR_EMMA = 27,
    CHAR_RINA = 28,
    GROUP_MUSE = 29,
    GROUP_AQOURS = 30,
    GROUP_NIJI = 31,
    SUB_PRINTEMPS = 32,
    SUB_CYARON = 35,
    SUB_AZALEA = 36,
    SUB_GUILTYKISS = 37,
    TYPE_VO = 38,
    TYPE_SP = 39,
    TYPE_GD = 40,
    TYPE_SK = 41,
    NONE = 58, // no target (affects SP Gauge or Stamina)
    ATTR_SMILE = 61,
    ATTR_PURE = 62,
    ATTR_COOL = 63,
    ATTR_ACTIVE = 64,
    ATTR_NATURAL = 65,
    ATTR_ELEGANT = 66,
    ATTR_NOT_SMILE = 67,
    TYPE_NOT_VO = 68,
    YEAR_1 = 69,
    YEAR_2 = 70,
    YEAR_3 = 71,
    ATTR_NOT_PURE = 72,
    ATTR_NOT_COOL = 73,
    ATTR_NOT_ACTIVE = 74,
    ATTR_NOT_NATURAL = 75,
    ATTR_NOT_ELEGANT = 76,
    TYPE_NOT_SP = 77,
    TYPE_NOT_GD = 78,
    TYPE_NOT_SK = 79,
    STRATEGY = 83,
    GROUP_NOT_MUSE = 86,
    TYPE_NOT_VO_GD = 87,
    TYPE_NOT_VO_SP = 88,
    TYPE_NOT_VO_SK = 89,
    TYPE_NOT_GD_SP = 90,
    TYPE_NOT_SP_SK = 92,
    TYPE_SP_SK = 93,
    TYPE_GD_SK = 94,
    TYPE_VO_SK = 96,
    TYPE_VO_SP = 97,
    TYPE_VO_GD = 98,
    GROUP_NOT_AQOURS = 99,
    GROUP_NOT_NIJI = 100,
    YEAR_NOT_1 = 101,
    YEAR_NOT_2 = 102,
    YEAR_NOT_3 = 103,
    SUB_DIVERDIVA = 104,
    SUB_AZUNA = 105,
    SUB_QU4RTZ = 106,
    SUB_NOT_DIVERDIVA = 107,
    SUB_NOT_AZUNA = 108,
    SUB_NOT_QU4RTZ = 109,
    SUB_R3BIRTH = 110,
    CHAR_SHIORIKO = 112,
    CHAR_LANZHU = 113,
    CHAR_MIA = 114,
    ATTR_COOL_GROUP_AQOURS = 115
}

export enum SkillFinishType {
    UNTIL_SONG_END = 1,
    NOTE_COUNT = 2,
    INSTANT = 3,
    UNTIL_AC_END = 4,
    SP_COUNT = 7,
    UNTIL_SWAP = 8
}

export function skillFinishTypeHasFixedLength(t: SkillFinishType) {
    return t === SkillFinishType.NOTE_COUNT;
}

export enum SkillCalcType {
    ADD = 1, SCALE_A, SCALE_B
}

export enum SkillScaleType {
    MAX = 1, CURRENT, SMALLER, BIGGER, SPECIAL
}

export enum SkillTriggerNote {
    HIT = 1, MISS, ALWAYS, HIT_VO, HIT_SP, HIT_GD, HIT_SK
}

export function skillTriggerNoteHasSlotCount(t: SkillTriggerNote) {
    return t >= SkillTriggerNote.HIT_VO && t <= SkillTriggerNote.HIT_SK;
}

export enum SkillTriggerAC {
    START = 1, SUCCESS, FAILURE, END
}

export enum Item {
    LOVECA_STARS = 0,
    DLP_MEDAL = 19001
}
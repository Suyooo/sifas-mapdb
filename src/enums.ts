export const enum Attribute {
    SMILE = 1, PURE, COOL, ACTIVE, NATURAL, ELEGANT, NONE
}

export const enum Difficulty {
    BEGINNER = 10, INTERMEDIATE = 20, ADVANCED = 30, ADVANCED_PLUS = 35, CHALLENGE = 37
}

export const enum NoteType {
    NORMAL = 1, HOLD_START, HOLD_END, AC_START, AC_END
}

export const enum NoteAction {
    TAP = 1, SWIPE_UP = 4, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT
}

export const enum ACMissionType {
    VOLTAGE_TOTAL = 1, TIMING_NICE, TIMING_GREAT, TIMING_WONDERFUL, VOLTAGE_SINGLE,
    VOLTAGE_SP, UNIQUE, CRITICALS, SKILLS, STAMINA = 16
};

export type SkillEffectType = number;
export type SkillTargetType = number;
export type SkillFinishType = number;

export const enum SkillCalcType {
    ADD = 1, SCALE_A, SCALE_B
}

export const enum SkillScaleType {
    MAX = 1, CURRENT, SMALLER, BIGGER, SPECIAL
}

export const enum SkillTriggerNote {
    HIT = 1, MISS, ALWAYS, HIT_VO, HIT_SP, HIT_GD, HIT_SK
}

export const enum SkillTriggerAC {
    START = 1, SUCCESS, FAILURE, END
}
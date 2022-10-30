export enum Attribute {
    SMILE = 1, PURE, COOL, ACTIVE, NATURAL, ELEGANT, NONE
}

export enum Difficulty {
    BEGINNER = 10, INTERMEDIATE = 20, ADVANCED = 30, ADVANCED_PLUS = 35, CHALLENGE = 37
}

export enum NoteType {
    NORMAL = 1, HOLD_START, HOLD_END, AC_START, AC_END
}

export enum NoteAction {
    TAP = 1, SWIPE_UP = 4, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT
}

type ACMissionType = number;
type SkillEffectType = number;
type SkillTargetType = number;
type SkillFinishType = number;

export enum SkillCalcType {
    ADD = 1, SCALE_A, SCALE_B
}

export enum SkillScaleType {
    MAX = 1, CURRENT, SMALLER, BIGGER, SPECIAL
}

export enum SkillTriggerNote {
    HIT = 1, MISS, ALWAYS, HIT_VO, HIT_SP, HIT_GD, HIT_SK
}

export enum SkillTriggerAC {
    START = 1, SUCCESS, FAILURE, END
}
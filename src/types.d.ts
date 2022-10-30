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

export interface LiveData {
    live_id: number,
    display_order: number,
    song_name: string,
    song_pronunciation: string,
    song_length?: number,
    song_attribute: Attribute,
    song_difficulty: Difficulty
    ranks: { S: number, A: number, B: number, C: number },
    recommended_stamina: number,
    note_damage: number,
    voltage_caps: { tap: number, sp: number, skill: number, swap: number },
    sp_gauge_max: number,
    extra_info: LiveDataExtraFree | LiveDataExtraStory | LiveDataExtraSBL | LiveDataExtraDLP,
    notes?: LiveDataNote[],
    gimmick?: LiveDataGimmick[],
    note_gimmicks: LiveDataGimmickNote[],
    appeal_chances: LiveDataAC[]
}

export interface LiveDataNote {
    time: number,
    rail: 1 | 2,
    type: NoteType,
    action: NoteAction,
    gimmick?: number
}

export interface LiveDataAC {
    mission_type: ACMissionType,
    mission_value: number,
    penalty_damage?: number,
    reward_voltage?: number,
    range_note_ids: [number, number],
    gimmick?: LiveDataGimmickAC
}

export interface LiveDataGimmick {
    effect_type: SkillEffectType,
    effect_amount: number,
    target: SkillTargetType,
    finish_type: SkillFinishType,
    finish_amount: number,
    calc_type: SkillCalcType,
    scale_type: SkillScaleType
}

export interface LiveDataGimmickNote extends LiveDataGimmick {
    trigger: SkillTriggerNote
}

export interface LiveDataGimmickNote extends LiveDataAC {
    trigger: SkillTriggerAC
}

export interface LiveDataExtraFree {
    is_available: boolean,
    is_permanent: boolean,
    can_show_on_profile: boolean,
    daily_weekday?: (1 | 2 | 3 | 4 | 5 | 6 | 7)[]
}

export interface LiveDataExtraStory {
    story_chapter: number,
    story_stage: number,
    story_is_hard_mode: boolean,
    story_is_super_stage: boolean
}

export interface LiveDataExtraSBL {
    sbl_event_id: number,
    sbl_slot: number
}

export interface LiveDataExtraDLP {
    dlp_tower_id: number,
    dlp_floor: number
}
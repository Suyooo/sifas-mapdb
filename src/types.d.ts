import {
    ACMissionType,
    Attribute,
    Difficulty,
    Item,
    NoteAction,
    NoteType,
    SkillCalcType,
    SkillEffectType,
    SkillFinishType,
    SkillScaleType,
    SkillTargetType,
    SkillTriggerAC,
    SkillTriggerNote
} from "./enums";

export interface LiveList {
    lives: { [liveId: number]: LiveListItem },
    by_group: { [groupId: number]: number[] }
}

export interface LiveListItem {
    display_order: number,
    name: { kn: string, ro: string },
    name_suffix: { kn: string, ro: string } | null,
    attribute: Attribute,
    unavailable: boolean,
    permanent: boolean,
    daily_weekday: (1 | 2 | 3 | 4 | 5 | 6 | 7)[] | null,
    time_limit: number | null,
    live_difficulty_ids: { free: number[], story: { liveDiffId: number, extraInfo: LiveDataExtraStory }[] }
    default_live_difficulty_id: number
}

export interface LiveData {
    live_id: number,
    display_order: number,
    song_name: string,
    song_pronunciation: string,
    song_length: number | null,
    song_attribute: Attribute,
    song_difficulty: Difficulty
    ranks: { S: number, A: number, B: number, C: number },
    recommended_stamina: number,
    note_damage: number,
    voltage_caps: { tap: number, sp: number, skill: number, swap: number },
    sp_gauge_max: number,
    extra_info: LiveDataExtraFree | LiveDataExtraStory | LiveDataExtraSBL | LiveDataExtraDLP,
    notes: LiveDataNote[] | null,
    gimmick: LiveDataGimmick[] | null,
    note_gimmicks: LiveDataGimmickNote[],
    appeal_chances: LiveDataAC[]
}

export interface LiveDataNote {
    time: number,
    rail: 1 | 2,
    type: NoteType,
    action: NoteAction,
    gimmick: number | null
}

export interface LiveDataAC {
    mission_type: ACMissionType,
    mission_value: number,
    penalty_damage: number | null,
    reward_voltage: number | null,
    range_note_ids: [number, number] | null,
    gimmick: LiveDataGimmickAC | null
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
    trigger: SkillTriggerNote,
    count: number,
    count_slot: [number, number, number]
}

export interface LiveDataGimmickAC extends LiveDataGimmick {
    trigger: SkillTriggerAC
}

export interface LiveDataExtraFree {
    is_available: boolean,
    is_permanent: boolean,
    can_show_on_profile: boolean,
    daily_weekday: (1 | 2 | 3 | 4 | 5 | 6 | 7)[] | null
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

export interface Language {
    meta: {
        title: string
    },
    header: {
        title: string
    },
    tab: {
        start: string,
        muse: string,
        aqours: string,
        niji: string,
        liella: string,
        dlp: string,
        rankings: string
    },
    preferences: {
        title: string,
        titles: string,
        titles_toggle: string,
        titles_kana: string,
        titles_kana_toggle: string,
        titles_roma: string,
        titles_roma_toggle: string,
        unavailable: string,
        unavailable_toggle: string,
        unavailable_hide: string,
        unavailable_hide_toggle: string,
        unavailable_show: string,
        unavailable_show_toggle: string,
        site_theme: string,
        site_theme_light: string,
        site_theme_dark: string,
        save: string,
        cancel: string
    },
    search: {
        label: string,
        tooltip: string
    },
    songlist: {
        unavailable: string,
        daily: string,
        weekdays: {
            1: string,
            2: string,
            3: string,
            4: string,
            5: string,
            6: string,
            7: string
        },
        time_limited: string
    },
    songinfo: {
        ranks: {
            S: string,
            A: string,
            B: string,
            C: string
        },
        note_damage: string,
        voltage_caps: {
            tap: string,
            sp: string,
            skill: string,
            swap: string
        },
        sp_gauge_max: string,
        note_count: string,
        note_count_ac: string,
        note_damage_total: string,
        ac_reward_total: string,
        song_length: string,
        story_stages: string,
        no_map: string
    },
    dlp: {
        performance_points: string,
        performance_points_recoverable: string,
        performance_points_recovery_cost: string,
        progress_reward: string,
        story_node: string,
        songinfo: {
            voltage_target: string,
            song_difficulty: string,
            reward_clear: string,
            voltage_target_short: string,
            note_damage_short: string
        }
    },
    scale: {
        label: string,
        time: string,
        turns: string
    },
    gimmicks: {
        title: string,
        song_gimmick: {
            label: string,
            label_multiple: string,
            gimmick: (p: LiveDataGimmick) => string,
            cleansable: string,
            cleansable_yes: string,
            cleansable_no: string,
        },
        note_gimmick: {
            label: string,
            gimmick: (p: LiveDataGimmickNote) => string,
            amount: string,
            position: string,
            slot: (n: number) => string,
            filter: string,
            filter_remove: string,
        },
        no_gimmick: string
    },
    appeal_chances: {
        title: string,
        label: string,
        gimmick: (p: LiveDataGimmickAC) => string,
        mission: (p: LiveDataAC) => string,
        length: string,
        average: (p: LiveDataAC, notes: number) => string,
        reward_voltage_label: string,
        reward_voltage: string,
        penalty_damage_label: string,
        penalty_damage: string
    },
    rankings: {
        column_song: string,
        show_all_link: string,
        length_title: string,
        length_column_length: string,
        length_show_all_description: string,
        notes_title: string,
        notes_column_notes: string,
        notes_show_all_description: string
    },
    difficulty: {
        beginner: string,
        beginner_short: string,
        intermediate: string,
        intermediate_short: string,
        advanced: string,
        advanced_short: string,
        advplus: string,
        advplus_short: string,
        challenge: string,
        challenge_short: string
    },
    attribute: {
        title: string,
        smile: string,
        pure: string,
        cool: string,
        active: string,
        natural: string,
        elegant: string,
        none: string
    },
    format: {
        number: (n: number) => string,
        note_count: (n: number) => string,
        song_time: (ms: number, showMs: boolean) => string
    },
    items: (itemDict: { (itemId: Item): number }) => string
}
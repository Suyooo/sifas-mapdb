import type {Item} from "$enums";
import type {LiveDataAC, LiveDataGimmick, LiveDataGimmickAC, LiveDataGimmickNote} from "../types";

export default {
    meta: {
        title: "%%%%%.meta.title%%%%%"
    },
    header: {
        title: "%%%%%.header.title%%%%%"
    },
    tab: {
        start: "%%%%%.tab.start%%%%%",
        muse: "%%%%%.tab.muse%%%%%",
        aqours: "%%%%%.tab.aqours%%%%%",
        niji: "%%%%%.tab.niji%%%%%",
        liella: "%%%%%.tab.liella%%%%%",
        dlp: "%%%%%.tab.dlp%%%%%",
        rankings: "%%%%%.tab.rankings%%%%%"
    },
    preferences: {
        title: "%%%%%.preferences.title%%%%%",
        titles: "%%%%%.preferences.titles%%%%%",
        titles_toggle: "%%%%%.preferences.titles_toggle%%%%%",
        titles_kana: "%%%%%.preferences.titles_kana%%%%%",
        titles_kana_toggle: "%%%%%.preferences.titles_kana_toggle%%%%%",
        titles_roma: "%%%%%.preferences.titles_roma%%%%%",
        titles_roma_toggle: "%%%%%.preferences.titles_roma_toggle%%%%%",
        unavailable: "%%%%%.preferences.unavailable%%%%%",
        unavailable_toggle: "%%%%%.preferences.unavailable_toggle%%%%%",
        unavailable_hide: "%%%%%.preferences.unavailable_hide%%%%%",
        unavailable_hide_toggle: "%%%%%.preferences.unavailable_hide_toggle%%%%%",
        unavailable_show: "%%%%%.preferences.unavailable_show%%%%%",
        unavailable_show_toggle: "%%%%%.preferences.unavailable_show_toggle%%%%%",
        site_theme: "%%%%%.preferences.site_theme%%%%%",
        site_theme_light: "%%%%%.preferences.site_theme_light%%%%%",
        site_theme_dark: "%%%%%.preferences.site_theme_dark%%%%%",
        save: "%%%%%.preferences.save%%%%%",
        cancel: "%%%%%.preferences.cancel%%%%%"
    },
    search: {
        label: "%%%%%.search.label%%%%%",
        tooltip: "%%%%%.search.tooltip%%%%%"
    },
    songlist: {
        unavailable: "%%%%%.songlist.unavailable%%%%%",
        daily: "%%%%%.songlist.daily%%%%%",
        weekdays: {
            1: "%%%%%.songlist.weekdays.1%%%%%",
            2: "%%%%%.songlist.weekdays.2%%%%%",
            3: "%%%%%.songlist.weekdays.3%%%%%",
            4: "%%%%%.songlist.weekdays.4%%%%%",
            5: "%%%%%.songlist.weekdays.5%%%%%",
            6: "%%%%%.songlist.weekdays.6%%%%%",
            7: "%%%%%.songlist.weekdays.7%%%%%"
        },
        time_limited: "%%%%%.songlist.time_limited%%%%%"
    },
    songinfo: {
        ranks: {
            S: "%%%%%.songinfo.ranks.S%%%%%",
            A: "%%%%%.songinfo.ranks.A%%%%%",
            B: "%%%%%.songinfo.ranks.B%%%%%",
            C: "%%%%%.songinfo.ranks.C%%%%%"
        },
        note_damage: "%%%%%.songinfo.note_damage%%%%%",
        voltage_caps: {
            tap: "%%%%%.songinfo.voltage_caps.tap%%%%%",
            sp: "%%%%%.songinfo.voltage_caps.sp%%%%%",
            skill: "%%%%%.songinfo.voltage_caps.skill%%%%%",
            swap: "%%%%%.songinfo.voltage_caps.swap%%%%%"
        },
        sp_gauge_max: "%%%%%.songinfo.sp_gauge_max%%%%%",
        note_count: "%%%%%.songinfo.note_count%%%%%",
        note_count_ac: "%%%%%.songinfo.note_count_ac%%%%%",
        note_damage_total: "%%%%%.songinfo.note_damage_total%%%%%",
        ac_reward_total: "%%%%%.songinfo.ac_reward_total%%%%%",
        song_length: "%%%%%.songinfo.song_length%%%%%",
        story_stages: "%%%%%.songinfo.story_stages%%%%%",
        no_map: "%%%%%.songinfo.no_map%%%%%"
    },
    dlp: {
        performance_points: "%%%%%.dlp.performance_points%%%%%",
        performance_points_recoverable: "%%%%%.dlp.performance_points_recoverable%%%%%",
        performance_points_recovery_cost: "%%%%%.dlp.performance_points_recovery_cost%%%%%",
        progress_reward: "%%%%%.dlp.progress_reward%%%%%",
        story_node: "%%%%%.dlp.story_node%%%%%",
        songinfo: {
            voltage_target: "%%%%%.dlp.songinfo.voltage_target%%%%%",
            song_difficulty: "%%%%%.dlp.songinfo.song_difficulty%%%%%",
            reward_clear: "%%%%%.dlp.songinfo.reward_clear%%%%%",
            voltage_target_short: "%%%%%.dlp.songinfo.voltage_target_short%%%%%",
            note_damage_short: "%%%%%.dlp.songinfo.note_damage_short%%%%%"
        }
    },
    scale: {
        label: "%%%%%.scale.label%%%%%",
        time: "%%%%%.scale.option_time%%%%%",
        turns: "%%%%%.scale.option_turns%%%%%"
    },
    gimmicks: {
        title: "%%%%%.gimmicks.title%%%%%",
        song_gimmick: {
            label: "%%%%%.gimmicks.song_gimmick.label%%%%%",
            label_multiple: "%%%%%.gimmicks.song_gimmick.label_multiple%%%%%",
            gimmick: ({effect_type, effect_amount, target, finish_type, finish_amount}: LiveDataGimmick) =>
                `$$$$$.gimmicks.song_gimmick.gimmick(${effect_type},${effect_amount},${target},${finish_type},${finish_amount})$$$$$`,
            cleansable: "%%%%%.gimmicks.song_gimmick.cleansable%%%%%",
            cleansable_yes: "%%%%%.gimmicks.song_gimmick.cleansable_yes%%%%%",
            cleansable_no: "%%%%%.gimmicks.song_gimmick.cleansable_no%%%%%",
        },
        note_gimmick: {
            label: "%%%%%.gimmicks.note_gimmick.label%%%%%",
            gimmick: ({trigger, effect_type, effect_amount, target, finish_type, finish_amount}: LiveDataGimmickNote) =>
                `$$$$$.gimmicks.note_gimmick.gimmick(${trigger},${effect_type},${effect_amount},${target},${finish_type},${finish_amount})$$$$$`,
            amount: "%%%%%.gimmicks.note_gimmick.amount%%%%%",
            position: "%%%%%.gimmicks.note_gimmick.position%%%%%",
            slot: (n: number) => `$$$$$.gimmicks.note_gimmick.slot(${n})$$$$$`,
            filter: "%%%%%.gimmicks.note_gimmick.filter%%%%%",
            filter_remove: "%%%%%.gimmicks.note_gimmick.filter_remove%%%%%",
        },
        no_gimmick: "%%%%%.gimmicks.no_gimmick%%%%%"
    },
    appeal_chances: {
        title: "%%%%%.appeal_chances.title%%%%%",
        label: "%%%%%.appeal_chances.label%%%%%",
        gimmick: ({trigger, effect_type, effect_amount, target, finish_type, finish_amount}: LiveDataGimmickAC) =>
            `$$$$$.appeal_chances.gimmick(${trigger},${effect_type},${effect_amount},${target},${finish_type},${finish_amount})$$$$$`,
        mission: ({mission_type, mission_value}: LiveDataAC) =>
            `$$$$$.appeal_chances.mission(${mission_type},${mission_value}})$$$$$`,
        length: "%%%%%.appeal_chances.length%%%%%",
        average: ({mission_type, mission_value}: LiveDataAC, notes: number) =>
            `$$$$$.appeal_chances.average(${mission_type},${mission_value},${notes})$$$$$`,
        reward_voltage_label: "%%%%%.appeal_chances.reward_voltage_label%%%%%",
        reward_voltage: "%%%%%.appeal_chances.reward_voltage%%%%%",
        penalty_damage_label: "%%%%%.appeal_chances.penalty_damage_label%%%%%",
        penalty_damage: "%%%%%.appeal_chances.penalty_damage%%%%%"
    },
    rankings: {
        column_song: "%%%%%.rankings.column_song%%%%%",
        show_all_link: "%%%%%.rankings.show_all_link%%%%%",
        length_title: "%%%%%.rankings.length_title%%%%%",
        length_column_length: "%%%%%.rankings.length_column_length%%%%%",
        length_show_all_description: "%%%%%.rankings.length_show_all_description%%%%%",
        notes_title: "%%%%%.rankings.notes_title%%%%%",
        notes_column_notes: "%%%%%.rankings.notes_column_notes%%%%%",
        notes_show_all_description: "%%%%%.rankings.notes_show_all_description%%%%%"
    },
    difficulty: {
        beginner: "%%%%%.difficulty.beginner%%%%%",
        beginner_short: "%%%%%.difficulty.beginner_short%%%%%",
        intermediate: "%%%%%.difficulty.intermediate%%%%%",
        intermediate_short: "%%%%%.difficulty.intermediate_short%%%%%",
        advanced: "%%%%%.difficulty.advanced%%%%%",
        advanced_short: "%%%%%.difficulty.advanced_short%%%%%",
        advplus: "%%%%%.difficulty.advplus%%%%%",
        advplus_short: "%%%%%.difficulty.advplus_short%%%%%",
        challenge: "%%%%%.difficulty.challenge%%%%%",
        challenge_short: "%%%%%.difficulty.challenge_short%%%%%"
    },
    attribute: {
        title: "%%%%%.attribute.title%%%%%",
        smile: "%%%%%.attribute.smile%%%%%",
        pure: "%%%%%.attribute.pure%%%%%",
        cool: "%%%%%.attribute.cool%%%%%",
        active: "%%%%%.attribute.active%%%%%",
        natural: "%%%%%.attribute.natural%%%%%",
        elegant: "%%%%%.attribute.elegant%%%%%",
        none: "%%%%%.attribute.none%%%%%"
    },
    format: {
        number: (n: number) => `$$$$$.format.number(${n})$$$$$`,
        note_count: (n: number) => `$$$$$.format.note_count(${n})$$$$$`,
        song_time: (ms: number, showMs: boolean) => `$$$$$.format.song_time(${ms},${showMs})$$$$$`
    },
    items: (itemDict: { (itemId: Item): number }) => `$$$$$items(${JSON.stringify(itemDict)})$$$$$`
};
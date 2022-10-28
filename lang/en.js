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
        numberFormat, skill, items, acRequirement
    }
}
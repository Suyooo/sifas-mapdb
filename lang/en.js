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
        tabs: {
            start: "Start",
            muse: "µ's",
            aqours: "Aqours",
            nijigaku: "Nijigaku",
            liella: "Liella!",
            dlp: "DLP",
            rankings: "Rankings"
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
            song_length: "Song Length"
        },
        dlp: {
            performance_points: "Performance Points",
            performance_points_recoverable: "recoverable",
            performance_points_recovery_cost: "PP Recovery Cost",
            progress_reward: "Progress Reward",
            story_node: "Story Node",
            /* Item Cost/Progress Rewards is item lookup function */
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
            note_gimmick: "Note Gimmick",
            note_gimmick_amount: "Amount",
            note_gimmick_by_unit: "Unit"
        },
        appeal_chances: {
            title: "Appeal Chances",
            ac: "AC",
            ac_length: "Length",
            /* avg. Voltage or % of successes is function */
            ac_reward_voltage_label: "Success",
            ac_reward_voltage: "Voltage",
            ac_penalty_damage_label: "Failure",
            ac_penalty_damage: "Damage"
        }
    }
}
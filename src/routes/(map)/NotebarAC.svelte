<script lang="ts">
    import {getContext} from "svelte";
    import {ACMissionType} from "../../enums.js";
    import type {LiveDataAC, LiveDataNote} from "../../types";

    export let acData: LiveDataAC;
    const {
        start: notebarStart,
        length: notebarLength,
        notes
    } = <{ start: number, length: number, notes: LiveDataNote[] }>getContext("notebar");
    const startTime = notes[acData.range_note_ids![0]].time;
    const endTime = notes[acData.range_note_ids![1]].time;

    const vo = acData.mission_type === ACMissionType.VOLTAGE_TOTAL
        || acData.mission_type === ACMissionType.VOLTAGE_SINGLE
        || acData.mission_type === ACMissionType.UNIQUE;
    const sp = acData.mission_type === ACMissionType.VOLTAGE_SP;
    const gd = acData.mission_type === ACMissionType.STAMINA;
    const sk = acData.mission_type === ACMissionType.TIMING_NICE
        || acData.mission_type === ACMissionType.TIMING_GREAT
        || acData.mission_type === ACMissionType.TIMING_WONDERFUL
        || acData.mission_type === ACMissionType.CRITICALS
        || acData.mission_type === ACMissionType.SKILLS;
</script>

<div class:vo class:sp class:gd class:sk style:left={(startTime-notebarStart)/notebarLength*100+"%"}
     style:width={(endTime-startTime)/notebarLength*100+"%"}>
</div>

<style lang="postcss">
    div {
        @apply absolute h-6;

        &.vo {
            @apply bg-types-vo-acbar;
        }

        &.sp {
            @apply bg-types-sp-acbar;
        }

        &.gd {
            @apply bg-types-gd-acbar;
        }

        &.sk {
            @apply bg-types-sk-acbar;
        }
    }
</style>
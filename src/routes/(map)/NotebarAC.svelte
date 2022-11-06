<script lang="ts">
    import tippy from "$lib/tooltip";
    import {getContext} from "svelte";
    import {ACMissionType} from "../../enums.js";
    import type {LiveData} from "../../types";

    const {data, notebarSize} = getContext<{
        data: LiveData,
        notebarSize: { start: number, end: number, length: number }
    }>("mapData");

    export let i: number;
    const acData = data.appeal_chances[i];
    const startTime = data.notes![acData.range_note_ids![0]].time;
    const endTime = data.notes![acData.range_note_ids![1]].time;

    const relativeStart = (startTime - notebarSize.start) / notebarSize.length;
    const relativeLength = (endTime - startTime) / notebarSize.length;

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

<div class:gd class:sk class:sp class:vo style:left={relativeStart*100+"%"} style:width={relativeLength*100+"%"}
     use:tippy={{content: "Test", theme: "notebar"}}>
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
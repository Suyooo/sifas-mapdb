<script lang="ts">
    import {tooltipNotebar} from "$actions/tooltip";
    import {acMissionTypeToRole, Role} from "$enums";
    import type {Language, LiveData} from "$types";
    import {getContext} from "svelte";
    import TooltipAC from "./TooltipAC.svelte";

    // Static database data (from +layout.svelte)
    const mapData = getContext<LiveData>("mapData");
    // Static dump data (from Notebar.svelte)
    const notebarSize = getContext<{ start: number, end: number, length: number }>("notebarSize");

    export let i: number;
    const acData = mapData.appeal_chances[i];
    const startTime = mapData.notes![acData.range_note_ids![0]].time;
    const endTime = mapData.notes![acData.range_note_ids![1]].time;

    const relativeStart = (startTime - notebarSize.start) / notebarSize.length;
    const relativeLength = (endTime - startTime) / notebarSize.length;
    const acType = Role[acMissionTypeToRole(acData.mission_type)].toLowerCase();

    const pageLanguage = getContext<Language>("pageLanguage");
</script>

<div class="{acType}" style:left={relativeStart*100+"%"} style:width={relativeLength*100+"%"}
     use:tooltipNotebar={{
         component: TooltipAC,
         props: {acData},
         context: {pageLanguage}
     }}>
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
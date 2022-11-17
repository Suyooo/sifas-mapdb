<script lang="ts">
    import {tooltipNotebar} from "$actions/tooltip";
    import {acMissionTypeToRole, Role} from "$enums";
    import type {LiveData} from "$types";
    import {getContext} from "svelte";
    import type {Writable} from "svelte/store";
    import TooltipAC from "./TooltipAC.svelte";

    // Static database data (from +layout.svelte)
    const mapData = getContext<Writable<LiveData>>("mapData");
    // Static dump data (from Notebar.svelte)
    const notebarSize = getContext<Writable<{ start: number, end: number, length: number }>>("notebarSize");

    export let i: number;
    $: acData = $mapData.appeal_chances[i];
    $: startTime = $mapData.notes![acData.range_note_ids![0]].time;
    $: endTime = $mapData.notes![acData.range_note_ids![1]].time;

    $: relativeStart = (startTime - $notebarSize.start) / $notebarSize.length;
    $: relativeLength = (endTime - startTime) / $notebarSize.length;
    $: acType = Role[acMissionTypeToRole(acData.mission_type)].toLowerCase();

    const pageLanguage = getContext("pageLanguage");
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
<script lang="ts">
    import T from "$lib/T.svelte";
    import {skillTriggerNoteHasSlotCount} from "../../enums";
    import type {LiveDataGimmickNote} from "../../types";

    export let gimmickData: LiveDataGimmickNote;
    export let i: number;
    export let hitBySlot: number;
</script>

<b><T key="gimmicks.note_gimmick.gimmick" params={[gimmickData]}/></b>
<div>
    <b><T key="gimmicks.note_gimmick.position"/>:</b> {i+1}
    {#if skillTriggerNoteHasSlotCount(gimmickData.trigger)}
        (<T key="gimmicks.note_gimmick.slot"/> {hitBySlot})
    {/if}
</div>

<style lang="postcss">
    div {
        @apply text-sm;
    }
</style>
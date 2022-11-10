<script lang="ts">
    import T from "$lib/T.svelte";
    import {skillTriggerNoteHasSlotCount} from "../../enums";
    import type {LiveDataGimmickNote} from "../../types";

    export let gimmickData: LiveDataGimmickNote;
    export let i: number;
</script>

<b><T key="gimmicks.note_gimmick.gimmick" params={[gimmickData]}/></b>
<div>
    <b><T key="gimmicks.note_gimmick.position"/>:</b> {i}
    {#if skillTriggerNoteHasSlotCount(gimmickData.trigger)}
        (<T key="gimmicks.note_gimmick.slot"/> {(i - 1) % 3 + 1})
    {/if}
</div>

<style lang="postcss">
    div {
        @apply text-sm;
    }
</style>
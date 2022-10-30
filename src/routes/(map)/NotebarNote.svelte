<script lang="ts">
    import {debug} from "svelte/internal";
    import type {LiveDataNote} from "../../types";
    import {NoteType} from "../../enums";

    export let noteData: LiveDataNote;
    export let nextNoteData: LiveDataNote;
    export let notebarStart: number;
    export let notebarLength: number;


</script>

<div class="note" class:top={noteData.rail === 1} class:bottom={noteData.rail === 2}
     style:left={(noteData.time-notebarStart)/notebarLength*100+"%"}></div>
{#if noteData.type === NoteType.HOLD_START}
    <div class="hold" class:top={noteData.rail === 1} class:bottom={noteData.rail === 2}
         style:left={(noteData.time-notebarStart)/notebarLength*100+"%"}
         style:width={(nextNoteData.time-noteData.time)/notebarLength*100+"%"}></div>
{/if}

<style lang="postcss">
    .note {
        @apply absolute w-[2px] ml-[-1px] h-3 bg-white;
    }

    .note.top {
        @apply top-0;
    }

    .note.bottom {
        @apply top-3;
    }

    .hold {
        @apply absolute h-1 w-10;
        background: repeating-linear-gradient(
                to right, white 0, white 1px, rgba(255, 225, 255, 0) 1px, rgba(255, 225, 255, 0) 2px);
    }

    .hold.top {
        @apply top-1;
    }

    .hold.bottom {
        @apply top-4;
    }
</style>
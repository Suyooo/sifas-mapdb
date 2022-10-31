<script lang="ts">
    import {getContext} from "svelte";
    import type {LiveDataNote} from "../../types";
    import {NoteType} from "../../enums";

    export let noteData: LiveDataNote;
    export let nextNoteData: LiveDataNote | undefined;
    const {
        start: notebarStart,
        length: notebarLength
    } = getContext<{ start: number, length: number }>("notebar");

    const gimmickCount = getContext<number[]>("gimmickCount");
    if (noteData.gimmick !== null) {
        gimmickCount[noteData.gimmick]++;
    }
</script>

<div class="note" class:top={noteData.rail === 1} class:bottom={noteData.rail === 2}
     class:gimmick={noteData.gimmick !== null} style:left={(noteData.time-notebarStart)/notebarLength*100+"%"}></div>
{#if noteData.type === NoteType.HOLD_START && nextNoteData}
    <div class="hold" class:top={noteData.rail === 1} class:bottom={noteData.rail === 2}
         style:left={(noteData.time-notebarStart)/notebarLength*100+"%"}
         style:width={(nextNoteData.time-noteData.time)/notebarLength*100+"%"}></div>
{/if}

<style lang="postcss">
    .note {
        @apply absolute w-[2px] ml-[-1px] h-3 bg-notebar-note pointer-events-none;

        &.top {
            @apply top-0;
        }

        &.bottom {
            @apply top-3;
        }

        &.gimmick {
            @apply bg-notebar-note-gimmick;
        }
    }

    .hold {
        @apply absolute h-1 w-10 pointer-events-none;
        background: repeating-linear-gradient(
                to right, white 0, white 1px, rgba(255, 225, 255, 0) 1px, rgba(255, 225, 255, 0) 2px);

        &.top {
            @apply top-1;
        }

        &.bottom {
            @apply top-4;
        }
    }
</style>
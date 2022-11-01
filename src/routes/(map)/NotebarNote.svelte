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

<div class="note" class:bottom={noteData.rail === 2}
     class:gimmick={noteData.gimmick !== null} style:left={(noteData.time-notebarStart)/notebarLength*100+"%"}>
    {#if noteData.gimmick !== null}
        {#if noteData.gimmick === 1}
            <div class="markertail"></div>
        {/if}
        <div class="marker">
            <span>{noteData.gimmick}</span>
        </div>
    {/if}
</div>
{#if noteData.type === NoteType.HOLD_START && nextNoteData}
    <div class="hold" class:bottom={noteData.rail === 2}
         style:left={(noteData.time-notebarStart)/notebarLength*100+"%"}
         style:width={(nextNoteData.time-noteData.time)/notebarLength*100+"%"}></div>
{/if}

<style lang="postcss">
    .note {
        @apply absolute top-0 w-[2px] ml-[-1px] h-3 bg-notebar-note pointer-events-none;

        &.bottom {
            @apply mt-3;

            & > .marker, & > .markertail {
                @apply -mt-3;
            }
        }

        &.gimmick {
            @apply bg-notebar-note-gimmick;
        }
    }

    .hold {
        @apply absolute top-1 h-1 w-10 pointer-events-none;
        background: repeating-linear-gradient(
                to right, white 0, white 1px, rgba(255, 225, 255, 0) 1px, rgba(255, 225, 255, 0) 2px);

        &.bottom {
            @apply mt-3;
        }
    }

    .marker {
        @apply absolute flex items-center justify-center -left-1.5 box-content w-3 h-3 bg-white border border-black
            rounded-full;
        top: -1rem;

        & > span {
            @apply text-[.7rem];
        }
    }

    .markertail {
        @apply absolute left-0 -top-2.5 box-content w-32 h-0.5 bg-black rounded-full;
    }
</style>
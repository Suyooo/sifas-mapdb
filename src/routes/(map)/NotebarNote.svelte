<script lang="ts">
    import {getContext} from "svelte";
    import type {Writable} from "svelte/store";
    import {MarkerTracker} from "../../lib/markerTracker";
    import type {LiveData, LiveDataNote} from "../../types";
    import {NoteType, SkillFinishType} from "../../enums";

    const {data, gimmickCount, notebarSize, gimmickMarkerTrackers} = getContext<{
        data: LiveData,
        gimmickCount: number[],
        notebarSize: { start: number, end: number, length: number },
        gimmickMarkerTrackers: Writable<{ [k: number | "global"]: MarkerTracker }>
    }>("mapData");

    export let i: number;
    const noteData: LiveDataNote = data.notes[i];
    const relativeTime = (noteData.time - notebarSize.start) / notebarSize.length;

    let relativeHoldLength: number | undefined;
    if (noteData.type === NoteType.HOLD_START) {
        let releaseNoteIndex = i + 1;
        while (data.notes[releaseNoteIndex].rail !== noteData.rail) {
            releaseNoteIndex++;
        }
        const absoluteHoldLength = data.notes[releaseNoteIndex].time - noteData.time;
        relativeHoldLength = absoluteHoldLength / notebarSize.length;
    }

    let layerGlobal: number | undefined, layerLocal: number | undefined, relativeGimmickLength: number | undefined;
    if (noteData.gimmick !== null) {
        gimmickCount[noteData.gimmick]++;

        let relativeGimmickEnd: number | undefined;
        if (data.note_gimmicks[noteData.gimmick].finish_type === SkillFinishType.NOTE_COUNT) {
            const lastGimmickNoteIndex =
                Math.min(data.notes.length - 1, i + data.note_gimmicks[noteData.gimmick].finish_amount);
            const absoluteGimmickLength = data.notes[lastGimmickNoteIndex].time - noteData.time;
            relativeGimmickLength = absoluteGimmickLength / notebarSize.length;
            relativeGimmickEnd = (data.notes[lastGimmickNoteIndex].time - notebarSize.start) / notebarSize.length;
        }

        layerGlobal = $gimmickMarkerTrackers.global.addMarker(relativeTime, relativeGimmickEnd);
        layerLocal = $gimmickMarkerTrackers[noteData.gimmick].addMarker(relativeTime, relativeGimmickEnd);
    }
</script>

<div class="notecont" style:left={relativeTime*100+"%"}>
    <div class="note" class:bottom={noteData.rail === 2} class:gimmick={noteData.gimmick !== null}></div>
    {#if noteData.type === NoteType.HOLD_START}
        <div class="hold" class:bottom={noteData.rail === 2}
             style:left={relativeTime*100+"%"} style:width={relativeHoldLength*100+"%"}></div>
    {/if}
    {#if noteData.gimmick !== null}
        <div class="marker" style:top={"-" + (layerGlobal + 1) + "rem"}>
            <span>{noteData.gimmick + 1}</span>
        </div>
        {#if relativeGimmickLength}
            <div class="markertail" style:top={"-" + (layerGlobal + 0.875) + "rem"}
                 style:width={"calc("+(relativeGimmickLength*100)+"% + 0.25rem)"}></div>
        {/if}
    {/if}
</div>

<style lang="postcss">
    .notecont {
        @apply relative w-full pointer-events-none;

        & > .note {
            @apply absolute top-0 left-0 w-[2px] ml-[-1px] h-3 bg-notebar-note;

            &.bottom {
                @apply top-3;
            }

            &.gimmick {
                @apply bg-notebar-note-gimmick;
            }
        }

        & > .hold {
            @apply absolute top-1 h-1 w-10;
            background: repeating-linear-gradient(
                    to right, white 0, white 1px, rgba(255, 225, 255, 0) 1px, rgba(255, 225, 255, 0) 2px);

            &.bottom {
                @apply mt-3;
            }
        }

        & > .marker {
            @apply absolute flex items-center justify-center -left-1.5 -top-3 w-3 h-3 bg-white border border-black
            rounded-full pointer-events-auto select-none;

            & > span {
                @apply text-[.5rem];
            }
        }

        & > .markertail {
            @apply absolute left-0 -top-3.5 -z-10 h-2 bg-white rounded-full border border-black pointer-events-auto
            select-none;
        }
    }
</style>
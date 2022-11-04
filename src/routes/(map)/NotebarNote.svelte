<script lang="ts">
    import {getContext} from "svelte";
    import type {Writable} from "svelte/store";
    import {MarkerTracker} from "../../lib/markerTracker";
    import type {LiveData, LiveDataNote} from "../../types";
    import {NoteType, SkillFinishType} from "../../enums";

    const {data, gimmickCount, notebarSize, gimmickMarkerTrackers, highlightByGimmick, highlightByNote} = getContext<{
        data: LiveData,
        gimmickCount: number[],
        notebarSize: { start: number, end: number, length: number },
        gimmickMarkerTrackers: Writable<{ [k: number | "global"]: MarkerTracker }>
        highlightByGimmick: Writable<{ [k: number]: [Set<number>, Set<number>] }>,
        highlightByNote: Writable<{ [k: number]: Set<number> }>
    }>("mapData");
    const gimmickFilter = getContext<Writable<{ note: number | null }>>("gimmickFilter");

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
        $highlightByGimmick[noteData.gimmick][0].add(i);

        let relativeGimmickEnd: number | undefined;
        if (data.note_gimmicks[noteData.gimmick].finish_type === SkillFinishType.NOTE_COUNT) {
            const lastGimmickNoteIndex =
                Math.min(data.notes.length - 1, i + data.note_gimmicks[noteData.gimmick].finish_amount);
            $highlightByNote[i] = new Set();
            for (let j = i + 1; j <= lastGimmickNoteIndex; j++) {
                $highlightByGimmick[noteData.gimmick][1].add(j);
                $highlightByNote[i].add(j);
            }
            console.log($highlightByNote[i]);

            const absoluteGimmickLength = data.notes[lastGimmickNoteIndex].time - noteData.time;
            relativeGimmickLength = absoluteGimmickLength / notebarSize.length;
            relativeGimmickEnd = (data.notes[lastGimmickNoteIndex].time - notebarSize.start) / notebarSize.length;
        }

        layerGlobal = $gimmickMarkerTrackers.global.addMarker(noteData.gimmick, relativeTime, relativeGimmickEnd);
        layerLocal = $gimmickMarkerTrackers[noteData.gimmick]
            .addMarker(noteData.gimmick, relativeTime, relativeGimmickEnd);
    }

    $: lowlight = $gimmickFilter.note !== null
        && !($gimmickFilter.note === i || $highlightByNote[$gimmickFilter.note]?.has(i))
</script>

<div class="allcont" style:left={relativeTime*100+"%"}>
    <div class="notecont" class:bottom={noteData.rail === 2} class:opacity-30={lowlight}
         style:width={relativeHoldLength ? (relativeHoldLength*100+"%") : null}>
        <div class="note" class:gimmick={noteData.gimmick !== null}></div>
        {#if noteData.type === NoteType.HOLD_START}
            <div class="hold"></div>
        {/if}
    </div>
    {#if noteData.gimmick !== null}
        <div class="markercont" style:top={"-" + (layerGlobal + 1) + "rem"}
             on:mouseenter={() => $gimmickFilter.note = i} on:mouseleave={() => $gimmickFilter.note = null}
             style:width={relativeGimmickLength ? ("calc("+(relativeGimmickLength*100)+"% + 0.375rem)") : null}>
            <div class="marker"><span>{noteData.gimmick + 1}</span></div>
            {#if relativeGimmickLength}
                <div class="markertail"></div>
            {/if}
        </div>
    {/if}
</div>

<style lang="postcss">
    .allcont {
        @apply relative w-full pointer-events-none select-none;

        & > .notecont {
            @apply absolute top-0 w-[2px] h-3 transition-opacity;

            & > .note {
                @apply absolute top-0 left-0 w-[2px] ml-[-1px] h-3 bg-notebar-note pointer-events-auto;

                &.gimmick {
                    @apply bg-notebar-note-gimmick;
                }
            }

            & > .hold {
                @apply absolute left-0 top-1 h-1 w-full;
                background: repeating-linear-gradient(
                        to right, white 0, white 1px, rgba(255, 225, 255, 0) 1px, rgba(255, 225, 255, 0) 2px);
            }

            &.bottom {
                @apply top-3;
            }
        }

        & > .markercont {
            @apply absolute -left-1.5 ml-[-1px] w-3 h-3 box-content border border-transparent pointer-events-auto;

            & > .marker {
                @apply absolute m-[-1px] flex items-center justify-center left-0 top-0 w-3 h-3 bg-white border
                border-black rounded-full pointer-events-none tracking-tighter box-content;

                & > span {
                    @apply text-[.5rem] tracking-tighter;
                }
            }

            & > .markertail {
                @apply absolute left-0 top-1 -z-10 w-full h-1 m-[-1px] bg-white rounded-full border border-black
                pointer-events-none box-content;
            }
        }
    }
</style>
<script lang="ts">
    import {tooltipNotebar} from "$actions/tooltip";
    import {NoteType} from "$enums";
    import type {LiveData, LiveDataNote} from "$types";
    import {getContext} from "svelte";
    import type {Writable} from "svelte/store";
    import TooltipGimmick from "./TooltipGimmick.svelte";

    // Static database data (from +layout.svelte)
    const mapData = getContext<LiveData>("mapData");
    // Static dump data (from Notebar.svelte)
    const notebarSize = getContext<{ start: number, end: number, length: number }>("notebarSize");
    const gimmickMarkers = getContext<{
        [k: number]:
                { layerGlobal: number, layerLocal: number, relativeGimmickLength: number | undefined }
    }>("gimmickMarkers");
    const gimmickHighlightsByGimmickId = getContext<{ [k: number]: Set<number> }>("gimmickHighlightsByGimmickId");
    const gimmickHighlightsByNoteId = getContext<{ [k: number]: Set<number> }>("gimmickHighlightsByNoteId");

    // Dynamic data (stores, from +layout.svelte)
    const filterGimmick = getContext<Writable<number | null>>("filterGimmick");
    const filterSlot = getContext<Writable<number | null>>("filterSlot");
    const filterNote = getContext<Writable<number | null>>("filterNote");

    export let i: number;
    const hitBySlot: number = i % 3;
    const noteData: LiveDataNote = mapData.notes![i];
    const relativeTime = (noteData.time - notebarSize.start) / notebarSize.length;

    // Is this a hold note?
    let releaseNoteIndex: number | undefined, relativeHoldLength: number | undefined;
    if (noteData.type === NoteType.HOLD_START) {
        releaseNoteIndex = i + 1;
        while (mapData.notes![releaseNoteIndex].rail !== noteData.rail) {
            releaseNoteIndex++;
        }
        const absoluteHoldLength = mapData.notes![releaseNoteIndex].time - noteData.time;
        relativeHoldLength = absoluteHoldLength / notebarSize.length;
    }

    // Get gimmick marker (calculated in Notebar.svelte) if the note has a gimmick
    let relativeGimmickLength: number | undefined, layerGlobal: number, layerLocal: number;
    const gimmickData = noteData.gimmick !== null ? mapData.note_gimmicks[noteData.gimmick] : null;
    if (noteData.gimmick !== null) {
        ({layerGlobal, layerLocal, relativeGimmickLength} = gimmickMarkers[i]);
    }

    let lowlight: boolean, lowlightNext: boolean, lowlightMarker: boolean;
    $: {
        if ($filterNote !== null) {
            lowlight = !($filterNote === i || gimmickHighlightsByNoteId[$filterNote]?.has(i));
            if (releaseNoteIndex !== undefined) {
                lowlightNext = !(gimmickHighlightsByNoteId[$filterNote]?.has(releaseNoteIndex));
            }
        } else if ($filterGimmick !== null) {
            console.log(hitBySlot, $filterSlot);
            lowlight = !(noteData.gimmick === $filterGimmick || gimmickHighlightsByGimmickId[$filterGimmick]?.has(i))
                    || ($filterSlot !== null && hitBySlot !== $filterSlot);
            if (releaseNoteIndex !== undefined) {
                lowlightNext = !(gimmickHighlightsByGimmickId[$filterGimmick]?.has(releaseNoteIndex))
                        || ($filterSlot !== null && ((hitBySlot + 1) % 3) !== $filterSlot);
            }
        } else {
            lowlight = lowlightNext = false;
        }

        lowlightMarker = $filterGimmick !== null && $filterGimmick !== noteData.gimmick
                || ($filterSlot !== null && hitBySlot !== $filterSlot);
    }

    const pageLanguage = getContext("pageLanguage");
</script>

<div class="allcont" style:left={relativeTime*100+"%"}>
    <div class="notecont" class:bottom={noteData.rail === 2}
         style:width={relativeHoldLength ? (relativeHoldLength*100+"%") : null}>
        {#if noteData.type === NoteType.HOLD_START}
            <div class="hold" class:opacity-30={lowlight || lowlightNext}></div>
        {/if}
        <div class="note" class:gimmick={noteData.gimmick !== null} class:opacity-30={lowlight}></div>
    </div>
    {#if noteData.gimmick !== null}
        <div class="markercont" class:opacity-10={lowlightMarker} class:pointer-events-auto={!lowlightMarker}
             style:top={"-" + (($filterGimmick === noteData.gimmick ? layerLocal : layerGlobal) + 1) + "rem"}
             style:width={relativeGimmickLength ? ("calc("+(relativeGimmickLength*100)+"% + 0.375rem)") : null}
             on:mouseenter={() => $filterNote = i} on:mouseleave={() => $filterNote = null}
             use:tooltipNotebar={{
                 component: TooltipGimmick,
                 props: {gimmickData, i, hitBySlot},
                 context: {pageLanguage}
             }}>
            {#if relativeGimmickLength}
                <div class="markertail"></div>
            {/if}
            <div class="marker"><span>{noteData.gimmick + 1}</span></div>
        </div>
    {/if}
</div>

<style lang="postcss">
    .allcont {
        @apply relative w-full pointer-events-none select-none;

        & > .notecont {
            @apply absolute top-0 w-[2px] h-3;

            & > .note {
                @apply absolute top-0 left-0 w-[2px] ml-[-1px] h-3 bg-notebar-note transition-opacity duration-300;

                &.gimmick {
                    @apply bg-notebar-note-gimmick;
                }
            }

            & > .hold {
                @apply absolute left-0 top-1 h-1 w-full transition-opacity duration-300;
                background: repeating-linear-gradient(
                        to right, white 0, white 1px, rgba(255, 225, 255, 0) 1px, rgba(255, 225, 255, 0) 2px);
            }

            &.bottom {
                @apply top-3;
            }
        }

        & > .markercont {
            @apply absolute -left-1.5 ml-[-1px] w-3 h-3 box-content border border-transparent;
            transition: top 0.3s, opacity 0.3s;

            & > .marker {
                @apply absolute m-[-1px] flex items-center justify-center left-0 top-0 w-3 h-3 bg-white border
                border-black rounded-full pointer-events-none tracking-tighter box-content;

                & > span {
                    @apply text-[.5rem] tracking-tighter;
                }
            }

            & > .markertail {
                @apply absolute left-0 top-1 w-full h-1 m-[-1px] bg-white rounded-full border border-black
                pointer-events-none box-content;
            }
        }
    }
</style>
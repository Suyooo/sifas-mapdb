<script lang="ts">
    import {getContext} from "svelte";
    import type {Writable} from "svelte/store";
    import {NoteType} from "../../enums";
    import type {LiveData, LiveDataNote} from "../../types";

    const {data, notebarSize, gimmickMarkers, highlightByGimmick, highlightByNote} = getContext<{
        data: LiveData,
        notebarSize: { start: number, end: number, length: number },
        gimmickMarkers: {
            [k: number]:
                    { layerGlobal: number, layerLocal: number, relativeGimmickLength: number | undefined }
        },
        highlightByGimmick: { [k: number]: Set<number> },
        highlightByNote: { [k: number]: Set<number> }
    }>("mapData");
    const gimmickFilter = getContext<Writable<{
        gimmick: number | null,
        slot: 1 | 2 | 3 | null,
        note: number | null
    }>>("gimmickFilter");

    export let i: number;
    const noteData: LiveDataNote = data.notes![i];
    const relativeTime = (noteData.time - notebarSize.start) / notebarSize.length;

    let releaseNoteIndex: number | undefined, relativeHoldLength: number | undefined;
    if (noteData.type === NoteType.HOLD_START) {
        releaseNoteIndex = i + 1;
        while (data.notes![releaseNoteIndex].rail !== noteData.rail) {
            releaseNoteIndex++;
        }
        const absoluteHoldLength = data.notes![releaseNoteIndex].time - noteData.time;
        relativeHoldLength = absoluteHoldLength / notebarSize.length;
    }


    let relativeGimmickLength: number | undefined, layerGlobal: number, layerLocal: number;
    if (noteData.gimmick !== null) {
        ({layerGlobal, layerLocal, relativeGimmickLength} = gimmickMarkers[i]);
    }

    $: lowlight = ($gimmickFilter.note !== null)
            ? !($gimmickFilter.note === i || highlightByNote[$gimmickFilter.note]?.has(i))
            : ($gimmickFilter.gimmick !== null)
                    ? !(noteData.gimmick === $gimmickFilter.gimmick || highlightByGimmick[$gimmickFilter.gimmick]?.has(i))
                    : false;
    $: lowlightNext = releaseNoteIndex === undefined ? false
            : ($gimmickFilter.note !== null)
                    ? !(highlightByNote[$gimmickFilter.note]?.has(releaseNoteIndex))
                    : ($gimmickFilter.gimmick !== null)
                            ? !(highlightByGimmick[$gimmickFilter.gimmick]?.has(releaseNoteIndex))
                            : false;
    $: lowlightGimmick = $gimmickFilter.gimmick !== null && $gimmickFilter.gimmick !== noteData.gimmick;
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
        <div class="markercont" class:opacity-10={lowlightGimmick} class:pointer-events-auto={!lowlightGimmick}
             style:top={"-" + (($gimmickFilter.gimmick === noteData.gimmick ? layerLocal : layerGlobal) + 1) + "rem"}
             on:mouseenter={() => $gimmickFilter.note = i} on:mouseleave={() => $gimmickFilter.note = null}
             style:width={relativeGimmickLength ? ("calc("+(relativeGimmickLength*100)+"% + 0.375rem)") : null}>
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
            transition: top, opacity;

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
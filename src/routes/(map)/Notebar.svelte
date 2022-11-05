<script lang="ts">
    import {getContext} from "svelte";
    import type {Writable} from "svelte/store";
    import {writable} from "svelte/store";
    import {SkillFinishType} from "../../enums";
    import {MarkerTracker} from "../../lib/markerTracker";
    import type {LiveData} from "../../types";
    import NotebarAC from "./NotebarAC.svelte";
    import NotebarNote from "./NotebarNote.svelte";

    const mapData = getContext<{
        data: LiveData,
        gimmickCount: number[],
        notebarSize: { start: number, end: number, length: number },
        gimmickMarkerTrackers: Writable<{ [k: number]: MarkerTracker, "global": MarkerTracker }>,
        highlightByGimmick: Writable<{ [k: number]: Set<number> }>,
        highlightByNote: Writable<{ [k: number]: Set<number> }>
    }>("mapData");

    const start = mapData.data.notes![0].time;
    const end = mapData.data.notes!.at(-1)!.time;
    const length = end - start;
    mapData.notebarSize = {start, end, length};

    const highlightByGimmickData: { [k:number]: Set<number> } = {};
    const gimmickMarkerTrackersData: { [k: number]: MarkerTracker, "global": MarkerTracker } =
            {global: new MarkerTracker()};
    mapData.data.note_gimmicks.forEach((_, i) => {
        highlightByGimmickData[i] = new Set();
        gimmickMarkerTrackersData[i] = new MarkerTracker()
    });

    const highlightByGimmick = writable<{ [k: number]: Set<number> }>(highlightByGimmickData);
    const highlightByNote = writable<{ [k: number]: Set<number> }>({});
    const gimmickMarkerTrackers =
            writable<{ [k: number]: MarkerTracker, "global": MarkerTracker }>(gimmickMarkerTrackersData);
    mapData.highlightByGimmick = highlightByGimmick;
    mapData.highlightByNote = highlightByNote;
    mapData.gimmickMarkerTrackers = gimmickMarkerTrackers;

    const gimmickMarkerOrder: (number | null)[] = mapData.data.note_gimmicks.map((_, i) => i);
    (<number[]>gimmickMarkerOrder).sort((a, b) => {
        const aHasLength = mapData.data.note_gimmicks[a].finish_type === SkillFinishType.NOTE_COUNT;
        const bHasLength = mapData.data.note_gimmicks[b].finish_type === SkillFinishType.NOTE_COUNT;
        if (aHasLength && !bHasLength) return -1;
        if (!aHasLength && bHasLength) return 1;
        return a - b;
    });
    gimmickMarkerOrder.unshift(null);

    const noteIdxsSortedByGimmick = mapData.data.notes!.map((_, i) => i);
    noteIdxsSortedByGimmick.sort((a, b) => {
        return gimmickMarkerOrder.indexOf(mapData.data.notes![a].gimmick)
                - gimmickMarkerOrder.indexOf(mapData.data.notes![b].gimmick);
    });
</script>

<div class="notebar" style:margin-top={$gimmickMarkerTrackers.global.size() + "rem"}>
    <div>
        {#each mapData.data.appeal_chances as _, i}
            <NotebarAC {i}/>
        {/each}
        {#each noteIdxsSortedByGimmick as i}
            <NotebarNote {i}/>
        {/each}
    </div>
</div>

<style lang="postcss">
    .notebar {
        @apply bg-notebar w-full h-6 px-6;

        & > div {
            @apply w-full h-full relative;
        }
    }
</style>
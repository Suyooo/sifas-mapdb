<script lang="ts">
    import {getContext} from "svelte";
    import {SkillFinishType} from "../../enums";
    import {MarkerTracker} from "../../lib/markerTracker";
    import type {LiveData} from "../../types";
    import NotebarAC from "./NotebarAC.svelte";
    import NotebarNote from "./NotebarNote.svelte";

    const mapData = getContext<{
        data: LiveData,
        gimmickCount: number[],
        notebarSize: { start: number, end: number, length: number },
        gimmickMarkers: {
            [k: number]:
                    { layerGlobal: number, layerLocal: number, relativeGimmickLength: number | undefined }
        },
        highlightByGimmick: { [k: number]: Set<number> },
        highlightByNote: { [k: number]: Set<number> }
    }>("mapData");
    const notes = mapData.data.notes!;

    const start = notes[0].time;
    const end = notes.at(-1)!.time;
    const length = end - start;
    mapData.notebarSize = {start, end, length};

    mapData.gimmickMarkers = {};
    mapData.highlightByGimmick = {};
    mapData.highlightByNote = {};
    const gimmickMarkerTrackers: { global: MarkerTracker, [k: number]: MarkerTracker } = {global: new MarkerTracker()};
    mapData.data.note_gimmicks.forEach((_, i) => {
        mapData.highlightByGimmick[i] = new Set();
        gimmickMarkerTrackers[i] = new MarkerTracker();
    });

    const gimmickMarkerOrder: (number | null)[] = mapData.data.note_gimmicks.map((_, i) => i);
    (<number[]>gimmickMarkerOrder).sort((a, b) => {
        const aHasLength = mapData.data.note_gimmicks[a].finish_type === SkillFinishType.NOTE_COUNT;
        const bHasLength = mapData.data.note_gimmicks[b].finish_type === SkillFinishType.NOTE_COUNT;
        if (aHasLength && !bHasLength) return -1;
        if (!aHasLength && bHasLength) return 1;
        return a - b;
    });
    gimmickMarkerOrder.unshift(null);

    const noteIdxsSortedByGimmick = notes.map((_, i) => i);
    noteIdxsSortedByGimmick.sort((a, b) => {
        return gimmickMarkerOrder.indexOf(notes[a].gimmick)
                - gimmickMarkerOrder.indexOf(notes[b].gimmick);
    });

    // While this could be done using a store and only one iteration when checked during initialization of NotebarNote
    // components, the result would not be able to be read during SSR. Hence, we do two - one here to count marker
    // layers, so that number can be used to set margin-top of the note bar, and another for the components
    for (const i of noteIdxsSortedByGimmick) {
        const noteData = notes[i];
        const relativeTime = (noteData.time - start) / length;

        let layerGlobal: number, layerLocal: number, relativeGimmickLength: number | undefined;
        if (noteData.gimmick !== null) {
            mapData.gimmickCount[noteData.gimmick]++;

            let relativeGimmickEnd: number | undefined;
            if (mapData.data.note_gimmicks[noteData.gimmick].finish_type === SkillFinishType.NOTE_COUNT) {
                const lastGimmickNoteIndex =
                        Math.min(notes.length - 1, i + mapData.data.note_gimmicks[noteData.gimmick].finish_amount);
                mapData.highlightByNote[i] = new Set();
                for (let j = i + 1; j <= lastGimmickNoteIndex; j++) {
                    mapData.highlightByGimmick[noteData.gimmick].add(j);
                    mapData.highlightByNote[i].add(j);
                }

                const absoluteGimmickLength = notes[lastGimmickNoteIndex].time - noteData.time;
                relativeGimmickLength = absoluteGimmickLength / length;
                relativeGimmickEnd = (notes[lastGimmickNoteIndex].time - start) / length;
            }

            layerGlobal = gimmickMarkerTrackers.global.addMarker(noteData.gimmick, relativeTime, relativeGimmickEnd);
            layerLocal = gimmickMarkerTrackers[noteData.gimmick]
                    .addMarker(noteData.gimmick, relativeTime, relativeGimmickEnd);
            mapData.gimmickMarkers[i] = {layerGlobal, layerLocal, relativeGimmickLength};
        }
    }
</script>

<div class="notebar" style:margin-top={gimmickMarkerTrackers.global.size() + "rem"}>
    <div>
        {#each mapData.data.appeal_chances as _, i}
            <NotebarAC {i}/>
        {/each}
        {#each notes as _, i}
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
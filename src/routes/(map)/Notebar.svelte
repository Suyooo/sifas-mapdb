<script lang="ts">
    import {getContext, setContext} from "svelte";
    import {SkillFinishType} from "../../enums";
    import {MarkerTracker} from "../../lib/markerTracker";
    import type {LiveData} from "../../types";
    import NotebarAC from "./NotebarAC.svelte";
    import NotebarNote from "./NotebarNote.svelte";

    // Static database data (from +layout.svelte)
    const mapData = getContext<LiveData>("mapData");

    // Static dump data (extra context only available if the notemap was dumped)
    const notebarSize: { start: number, end: number, length: number } = {start: 0, end: 0, length: 0};
    const gimmickMarkers: {
        [k: number]:
                { layerGlobal: number, layerLocal: number, relativeGimmickLength: number | undefined }
    } = {};
    const gimmickHighlightsByGimmickId: { [k: number]: Set<number> } = {};
    const gimmickHighlightsByNoteId: { [k: number]: Set<number> } = {};
    setContext("notebarSize", notebarSize);
    setContext("gimmickMarkers", gimmickMarkers);
    setContext("gimmickHighlightsByGimmickId", gimmickHighlightsByGimmickId);
    setContext("gimmickHighlightsByNoteId", gimmickHighlightsByNoteId);

    const notes = mapData.notes!;

    notebarSize.start = notes[0].time;
    notebarSize.end = notes.at(-1)!.time;
    notebarSize.length = notebarSize.end - notebarSize.start;

    const gimmickMarkerTrackers: { global: MarkerTracker, [k: number]: MarkerTracker } = {global: new MarkerTracker()};
    mapData.note_gimmicks.forEach((_, i) => {
        gimmickHighlightsByGimmickId[i] = new Set();
        gimmickMarkerTrackers[i] = new MarkerTracker();
    });

    const gimmickMarkerOrder: (number | null)[] = mapData.note_gimmicks.map((_, i) => i);
    (<number[]>gimmickMarkerOrder).sort((a, b) => {
        const aHasLength = mapData.note_gimmicks[a].finish_type === SkillFinishType.NOTE_COUNT;
        const bHasLength = mapData.note_gimmicks[b].finish_type === SkillFinishType.NOTE_COUNT;
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
        const relativeTime = (noteData.time - notebarSize.start) / notebarSize.length;

        let layerGlobal: number, layerLocal: number, relativeGimmickLength: number | undefined;
        if (noteData.gimmick !== null) {
            let relativeGimmickEnd: number | undefined;
            if (mapData.note_gimmicks[noteData.gimmick].finish_type === SkillFinishType.NOTE_COUNT) {
                const lastGimmickNoteIndex =
                        Math.min(notes.length - 1, i + mapData.note_gimmicks[noteData.gimmick].finish_amount);
                gimmickHighlightsByNoteId[i] = new Set();
                for (let j = i + 1; j <= lastGimmickNoteIndex; j++) {
                    gimmickHighlightsByGimmickId[noteData.gimmick].add(j);
                    gimmickHighlightsByNoteId[i].add(j);
                }

                const absoluteGimmickLength = notes[lastGimmickNoteIndex].time - noteData.time;
                relativeGimmickLength = absoluteGimmickLength / notebarSize.length;
                relativeGimmickEnd = (notes[lastGimmickNoteIndex].time - notebarSize.start) / notebarSize.length;
            }

            layerGlobal = gimmickMarkerTrackers.global.addMarker(noteData.gimmick, relativeTime, relativeGimmickEnd);
            layerLocal = gimmickMarkerTrackers[noteData.gimmick]
                    .addMarker(noteData.gimmick, relativeTime, relativeGimmickEnd);
            gimmickMarkers[i] = {layerGlobal, layerLocal, relativeGimmickLength};
        }
    }
</script>

<div class="notebarcont" style:padding-top={gimmickMarkerTrackers.global.size() + "rem"}>
    <div class="notebar">
        <div>
            {#each mapData.appeal_chances as _, i}
                <NotebarAC {i}/>
            {/each}
            {#each notes as _, i}
                <NotebarNote {i}/>
            {/each}
        </div>
    </div>
</div>

<style lang="postcss">
    .notebarcont {
        @apply w-full overflow-x-hidden;
    }

    .notebar {
        @apply bg-notebar w-full h-6 px-6;

        & > div {
            @apply w-full h-full relative;
        }
    }
</style>
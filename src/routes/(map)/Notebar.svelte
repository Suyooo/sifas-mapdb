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
        gimmickMarkerTrackers: Writable<{ [k: number | "global"]: MarkerTracker }>
    }>("mapData");

    const start = mapData.data.notes[0].time;
    const end = mapData.data.notes.at(-1).time;
    const length = end - start;
    mapData.notebarSize = {start, end, length};

    const gimmickMarkerTrackers = writable<{ [k: number | "global"]: MarkerTracker }>({global: new MarkerTracker()});
    mapData.data.note_gimmicks.forEach((_, i) => $gimmickMarkerTrackers[i] = new MarkerTracker());
    mapData.gimmickMarkerTrackers = gimmickMarkerTrackers;

    const gimmickMarkerOrder = mapData.data.note_gimmicks.map((_, i) => i);
    gimmickMarkerOrder.sort((a, b) => {
        const aHasLength = mapData.data.note_gimmicks[a].finish_type === SkillFinishType.NOTE_COUNT;
        const bHasLength = mapData.data.note_gimmicks[b].finish_type === SkillFinishType.NOTE_COUNT;
        if (aHasLength && !bHasLength) return -1;
        if (!aHasLength && bHasLength) return 1;
        return a - b;
    });
    gimmickMarkerOrder.unshift(null);
    console.log(gimmickMarkerOrder);

    const noteIdxsSortedByGimmick = mapData.data.notes.map((_, i) => i);
    noteIdxsSortedByGimmick.sort((a, b) => {
        return gimmickMarkerOrder.indexOf(mapData.data.notes[a].gimmick)
            - gimmickMarkerOrder.indexOf(mapData.data.notes[b].gimmick);
    });
</script>

<div class="notebar" style:margin-top={$gimmickMarkerTrackers["global"].size() + "rem"}>
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
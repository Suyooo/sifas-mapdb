<script lang="ts">
    import {getContext} from "svelte";
    import type {Writable} from "svelte/store";
    import {writable} from "svelte/store";
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
</script>

<div class="notebar" style:margin-top={$gimmickMarkerTrackers["global"].size() + "rem"}>
    <div>
        {#each mapData.data.appeal_chances as _, i}
            <NotebarAC {i}/>
        {/each}
        {#each mapData.data.notes as _, i}
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
<script lang="ts">
    import {setContext} from "svelte";
    import type {LiveData} from "../../types";
    import NotebarAC from "./NotebarAC.svelte";
    import NotebarNote from "./NotebarNote.svelte";

    export let data: LiveData;
    const notes = data.notes!;
    const start = notes[0].time;
    const end = notes.at(-1).time;
    const length = end - start;

    setContext("notebar", { start, end, length, notes });
</script>

<div class="outer">
    <div class="inner">
        {#each data.appeal_chances as acData}
            <NotebarAC {acData} />
        {/each}
        {#each notes as noteData}
            <NotebarNote {noteData} nextNoteData={notes.find(n => n.rail === noteData.rail && n.time > noteData.time)}/>
        {/each}
    </div>
</div>

<style lang="postcss">
    .outer {
        @apply bg-notebar w-full h-6 px-6;
    }
    .inner {
        @apply w-full h-full relative;
    }
</style>
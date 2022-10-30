<script lang="ts">
    import type {LiveData} from "../../types";
    import NotebarNote from "./NotebarNote.svelte";

    export let data: LiveData;
    const notes = data.notes!;
    const start = notes[0].time;
    const end = notes.at(-1).time;
    const length = end - start;
</script>

<div class="outer">
    <div class="inner">
        {#each notes as noteData}
            <NotebarNote {noteData} notebarStart={start} notebarLength={length}
                         nextNoteData={notes.find(n => n.rail === noteData.rail && n.time > noteData.time)}/>
        {/each}
    </div>
</div>

<style lang="postcss">
    .outer {
        @apply bg-black w-full h-6 px-6;
    }
    .inner {
        @apply w-full h-full relative;
    }
</style>
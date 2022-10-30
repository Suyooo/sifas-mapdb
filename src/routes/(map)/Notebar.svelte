<script lang="ts">
    export let data;
</script>

<div class="notebar">
    {#each data.notes as note}
        <div class="note" class:top={note.rail === 1} class:bottom={note.rail === 2}
             style:left={note.time/100+"px"}></div>
    {/each}
</div>

<style lang="postcss">
    .notebar {
        @apply bg-black w-full h-6 relative;
    }

    .note {
        @apply absolute w-[2px] h-3 bg-white;
    }

    .note.top {
        @apply top-0;
    }

    .note.top {
        @apply top-3;
    }
</style>
<script lang="ts">
    import T from "$lib/T.svelte";
    import type {LiveData} from "$types";
    import {setContext} from "svelte";
    import {writable} from 'svelte/store';
    import DetailAC from "./DetailAC.svelte";
    import DetailNoteGimmick from "./DetailNoteGimmick.svelte";
    import DetailSongGimmick from "./DetailSongGimmick.svelte";
    import Notebar from "./Notebar.svelte";

    // Static database data
    export let data: {liveInfo: LiveData};
    const mapData = writable<LiveData>(data.liveInfo);
    setContext("mapData", mapData);
    $: {
        $mapData = data.liveInfo;
    }

    // Dynamic data (filters etc.)
    setContext("filterGimmick", writable<number | null>(null));
    setContext("filterSlot", writable<number | null>(null));
    setContext("filterNote", writable<number | null>(null));
</script>

<div class="mb-2">
<slot/>
</div>

{#if data.liveInfo.notes !== undefined}
    <Notebar/>
{:else}
    <T key="songinfo.no_map"/>
{/if}

<div class="detailinfo">
    <div class="boxes">
        <h5>
            <T key="gimmicks.title"/>
        </h5>
        <div>
            <div class="bg-accent-100">
                {#if data.liveInfo.gimmick && data.liveInfo.gimmick.length > 1}
                    <T key="gimmicks.song_gimmick.label_multiple"/>
                {:else}
                    <T key="gimmicks.song_gimmick.label"/>
                {/if}
            </div>
            <div>
                {#if data.liveInfo.gimmick}
                    {#each data.liveInfo.gimmick as _, i}
                        <DetailSongGimmick {i}/>
                    {/each}
                {:else}
                    <T key="gimmicks.no_gimmick"/>
                {/if}
            </div>
        </div>
        {#each data.liveInfo.note_gimmicks as _, i}
            <DetailNoteGimmick {i}/>
        {/each}
    </div>
    <div class="boxes">
        <h5>
            <T key="appeal_chances.title"/>
        </h5>
        {#each data.liveInfo.appeal_chances as _, i}
            <DetailAC {i}/>
        {/each}
    </div>
</div>

<style lang="postcss">
    .detailinfo {
        @apply flex flex-col xl:flex-row;
    }

    h5 {
        @apply text-accent-700 text-xl tracking-widest uppercase mt-4 mb-2
    }

    .boxes {
        @apply px-4 flex-1;
    }

    .boxes > :global(div) {
        @apply w-full mb-4 border border-neutral-200;

        & > :global(div:first-child) {
            @apply w-full px-2 py-1 border-b border-neutral-200 font-bold;
        }

        & > :global(div:last-child) {
            @apply w-full px-2 py-1;
        }
    }
</style>
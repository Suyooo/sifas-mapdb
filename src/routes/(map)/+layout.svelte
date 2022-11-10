<script lang="ts">
    import {setContext} from "svelte";
    import {writable} from 'svelte/store';
    import T from "../../lib/T.svelte";
    import type {LiveData} from "../../types";
    import DetailAC from "./DetailAC.svelte";
    import DetailNoteGimmick from "./DetailNoteGimmick.svelte";
    import DetailSongGimmick from "./DetailSongGimmick.svelte";
    import Notebar from "./Notebar.svelte";

    // Static database data (no stores neccessary - calculated during initialization)
    export let data: LiveData;
    setContext<LiveData>("mapData", data);
    // TODO: count occurences in m_live_difficulty_note_gimmick in get_song_json.py instead, so it works even without dump
    setContext<number[]>("gimmickCount", new Array(data.note_gimmicks.length).fill(0));

    // Dynamic data (need stores for filters etc.)
    setContext("filterGimmick", writable<number | null>(null));
    setContext("filterSlot", writable<1 | 2 | 3 | null>(null));
    setContext("filterNote", writable<number | null>(null));
</script>

<a href="/">Back.</a>
<slot/><br><br>

{#if data.notes !== undefined}
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
                {#if data.gimmick && data.gimmick.length > 1}
                    <T key="gimmicks.song_gimmick.label_multiple"/>
                {:else}
                    <T key="gimmicks.song_gimmick.label"/>
                {/if}
            </div>
            <div>
                {#if data.gimmick}
                    {#each data.gimmick as _, i}
                        <DetailSongGimmick {i}/>
                    {/each}
                {:else}
                    <T key="gimmicks.no_gimmick"/>
                {/if}
            </div>
        </div>
        {#each data.note_gimmicks as _, i}
            <DetailNoteGimmick {i}/>
        {/each}
    </div>
    <div class="boxes">
        <h5>
            <T key="appeal_chances.title"/>
        </h5>
        {#each data.appeal_chances as _, i}
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
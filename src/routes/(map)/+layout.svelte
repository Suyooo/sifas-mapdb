<script lang="ts">
    import {setContext} from "svelte";
    import T from "../../lib/T.svelte";
    import type {LiveData} from "../../types";
    import DetailAC from "./DetailAC.svelte";
    import DetailNoteGimmick from "./DetailNoteGimmick.svelte";
    import DetailSongGimmick from "./DetailSongGimmick.svelte";
    import Notebar from "./Notebar.svelte";

    export let data: LiveData;
    setContext("gimmickCount", new Array(data.note_gimmicks.length).fill(0));
</script>
<svelte:options immutable={true}/>

<a href="/">Back.</a>
<slot/><br><br>

{#if data.notes !== undefined}
    <Notebar {data}/>
{:else}
    <T key="songinfo.no_map"/>
{/if}

<div class="detailinfo">
    <div class="boxes">
        <h5>
            <T key="gimmicks.title"/>
        </h5>
        <div>
            <div>
                {#if data.gimmick && data.gimmick.length > 1}
                    <T key="gimmicks.song_gimmick_label_multiple"/>
                {:else}
                    <T key="gimmicks.song_gimmick_label"/>
                {/if}
            </div>
            <div>
                {#if data.gimmick}
                    {#each data.gimmick as gimmickData, i}
                        <DetailSongGimmick {gimmickData} {i} singleGimmick={data.gimmick.length === 1}/>
                    {/each}
                {:else}
                    <T key="gimmicks.no_gimmick"/>
                {/if}
            </div>
        </div>
        {#each data.note_gimmicks as noteGimmickData, i}
            <DetailNoteGimmick {noteGimmickData} {i}/>
        {/each}
    </div>
    <div class="boxes">
        <h5>
            <T key="appeal_chances.title"/>
        </h5>
        {#each data.appeal_chances as acData,i}
            <DetailAC {acData} {i}/>
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
    }

    .boxes > :global(div > div:first-child) {
        @apply w-full px-2 py-1 bg-accent-100 border-b border-neutral-200 font-bold;
    }

    .boxes > :global(div > div:last-child) {
        @apply w-full px-2 py-1;
    }
</style>
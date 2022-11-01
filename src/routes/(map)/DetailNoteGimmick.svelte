<script lang="ts">
    import T from "$lib/T.svelte";
    import {getContext} from "svelte";
    import type {LiveDataGimmickNote} from "../../types";
    import {shortcut} from "../../actions/shortcut";

    export let noteGimmickData: LiveDataGimmickNote;
    export let i: number;

    const thisGimmickCount = getContext<number[]>("gimmickCount")[i];
    const gimmickFilter = getContext<{ gimmick?: number, slot?: 1 | 2 | 3 }>("gimmickFilter");

    $: isFilteredTarget = $gimmickFilter.gimmick !== null && $gimmickFilter.gimmick === i;
    $: isFilteredOut = $gimmickFilter.gimmick !== null && $gimmickFilter.gimmick !== i;

    function filter() {
        if ($gimmickFilter.gimmick === i) {
            $gimmickFilter.gimmick = null;
        } else {
            $gimmickFilter.gimmick = i;
        }
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events (handled by shortcut action) -->
<div class="filter" on:click={filter} use:shortcut={{control: true, code: "Digit" + ((i + 1) % 10)}}
     class:opacity-50={isFilteredOut}>
    <div class:bg-accent-300={isFilteredTarget} class:bg-accent-100={!isFilteredTarget}>
        <div>
            <T key="gimmicks.note_gimmick.label"/> {i + 1}
        </div>
        <div class:hidden={!isFilteredTarget}>
            {#if isFilteredTarget}
                <T key="gimmicks.note_gimmick.filter_remove"/>
            {:else}
                <T key="gimmicks.note_gimmick.filter_remove"/>
            {/if}
        </div>
    </div>
    <div>
        <div>
            <T key="gimmicks.note_gimmick.gimmick" params={[noteGimmickData]}/>
        </div>
        {#if thisGimmickCount > 0}
            <div>
                <b><T key="gimmicks.note_gimmick.amount"/>:</b>
                <T key="format.note_count" params={[thisGimmickCount]}/>
            </div>
        {/if}
    </div>
</div>

<style lang="postcss">
    .filter {
        @apply transition-opacity;

        & > div:first-child {
            @apply w-full flex items-center transition-colors;

            & > div:first-child {
                @apply flex-grow;
            }

            & > div:last-child {
                @apply text-xs font-normal;
            }
        }

        &:hover {
            & > div:first-child > div:last-child {
                @apply block;
            }
        }
    }
</style>
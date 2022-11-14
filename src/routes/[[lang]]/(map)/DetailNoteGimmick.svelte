<script lang="ts">
    import shortcut from "$actions/shortcut";
    import {skillTriggerNoteHasSlotCount} from "$enums";
    import T from "$lib/T.svelte";
    import type {LiveData} from "$types";
    import {getContext} from "svelte";
    import type {Writable} from "svelte/store";

    // Static database data (from +layout.svelte)
    const data = getContext<LiveData>("mapData");

    // Dynamic data (stores, from +layout.svelte)
    const filterGimmick = getContext<Writable<number | null>>("filterGimmick");
    const filterSlot = getContext<Writable<number | null>>("filterSlot");

    export let i: number;
    const noteGimmickData = data.note_gimmicks[i];

    $: isFilteredTarget = $filterGimmick !== null && $filterGimmick === i;
    $: isFilteredOut = $filterGimmick !== null && $filterGimmick !== i;

    function filter(slot?: number) {
        if ($filterGimmick === i) {
            if (slot !== undefined && slot !== $filterSlot) {
                $filterSlot = slot;
            } else {
                if (slot === undefined) $filterGimmick = null;
                $filterSlot = null;
            }
        } else {
            $filterGimmick = i;
            $filterSlot = slot ?? null;
        }
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events (handled by shortcut action) -->
<div class="filter" on:click={() => filter()} use:shortcut={{control: true, code: "Digit" + ((i + 1) % 10)}}
     class:opacity-50={isFilteredOut}>
    <div class:bg-accent-300={isFilteredTarget} class:bg-accent-100={!isFilteredTarget}>
        <div>
            <T key="gimmicks.note_gimmick.label"/> {i + 1}
        </div>
        <div class:hidden={!isFilteredTarget}>
            {#if isFilteredTarget}
                <T key="gimmicks.note_gimmick.filter_remove"/>
            {:else}
                <T key="gimmicks.note_gimmick.filter"/>
            {/if}
        </div>
    </div>
    <div>
        <div>
            <T key="gimmicks.note_gimmick.gimmick" params={[noteGimmickData]}/>
        </div>
        <div>
            <b><T key="gimmicks.note_gimmick.amount"/>:</b>
            <T key="format.note_count" params={[noteGimmickData.count]}/>
            {#if skillTriggerNoteHasSlotCount(noteGimmickData.trigger)}
                <div class="slots">
                    {#each noteGimmickData.count_slot as slotCount, slotIdx}
                        {#if slotCount > 0}
                            <div class:bg-accent-300={isFilteredTarget && $filterSlot === slotIdx}
                                 on:click|stopPropagation={() => filter(slotIdx)}>
                                <T key="gimmicks.note_gimmick.slot" params={[slotIdx + 1]}/> ×{slotCount}
                            </div>
                        {/if}
                    {/each}
                </div>
            {/if}
        </div>
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

        & .slots {
            @apply inline-block;

            & > div {
                @apply inline-block px-2 ml-2 border border-neutral-200 rounded-full transition-colors;
            }
        }
    }
</style>
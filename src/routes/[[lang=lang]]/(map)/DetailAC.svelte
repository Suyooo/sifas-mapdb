<script lang="ts">
    import {acMissionTypeHasAverage, acMissionTypeToRole, Role} from "$enums";
    import T from "$lib/T.svelte";
    import type {LiveData} from "$types";
    import {getContext} from "svelte";
    import type {Writable} from "svelte/store";

    // Static database data (from +layout.svelte)
    const data = getContext<Writable<LiveData>>("mapData");

    export let i: number;
    $: acData = $data.appeal_chances[i];
    $: acColor = Role[acMissionTypeToRole(acData.mission_type)].toLowerCase();
    $: noteCount = acData.range_note_ids !== null
            ? acData.range_note_ids[1] - acData.range_note_ids[0] + 1
            : 0;
</script>

<div>
    <div class="title">
        <div class="indicator {acColor}">&nbsp;</div>
        <T key="appeal_chances.label"/> {i + 1}:
        <T key="appeal_chances.mission" params={[acData]}/>
    </div>
    <div>
        <div>
            {#if acData.gimmick}
                <T key="appeal_chances.gimmick" params={[acData.gimmick]}/>
            {:else}
                <T key="gimmicks.no_gimmick"/>
            {/if}
        </div>
        {#if acData.range_note_ids !== null}
            <div>
                <b><T key="appeal_chances.length"/>:</b>
                <T key="format.note_count" params={[noteCount]}/>
                {#if acMissionTypeHasAverage(acData.mission_type)}
                    (<T key="appeal_chances.average" params={[acData, noteCount]}/>)
                {/if}
            </div>
            <div class="reward">
                <div>
                    <b><T key="appeal_chances.reward_voltage_label"/>:</b>
                    <T key="format.number" params={[acData.reward_voltage]}/>
                    <T key="appeal_chances.reward_voltage"/>
                </div>
                <div>
                    <b><T key="appeal_chances.penalty_damage_label"/>:</b>
                    <T key="format.number" params={[acData.penalty_damage]}/>
                    <T key="appeal_chances.penalty_damage"/>
                </div>
            </div>
        {/if}
    </div>
</div>

<style lang="postcss">
    .reward {
        @apply flex flex-col xl:flex-row;

        & > div {
            @apply flex-1;
        }
    }

    .title {
        @apply relative bg-accent-100;

        & > .indicator {
            @apply absolute left-0 top-0 w-1 h-full;

            &.vo {
                @apply bg-types-vo;
            }

            &.sp {
                @apply bg-types-sp;
            }

            &.gd {
                @apply bg-types-gd;
            }

            &.sk {
                @apply bg-types-sk;
            }
        }
    }
</style>
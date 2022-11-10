<script lang="ts">
    import T from "$lib/T.svelte";
    import {getContext} from "svelte";
    import type {LiveData} from "../../types";

    // Static database data (from +layout.svelte)
    const data = getContext<LiveData>("mapData");

    export let i: number;
    const acData = data.appeal_chances[i];
</script>

<div>
    <div class="bg-accent-100">
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
                <T key="format.note_count" params={[acData.range_note_ids[1]-acData.range_note_ids[0]+1]}/>
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
</style>
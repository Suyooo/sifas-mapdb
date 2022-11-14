<script lang="ts">
    import T from "$lib/T.svelte";
    import type {LiveData} from "$types";

    export let data: LiveData;

    const noteCountAc = data.notes === null ? 0 :
            data.appeal_chances.reduce((sum, ac) => sum + (ac.range_note_ids![1] - ac.range_note_ids![0] + 1), 0);
    const totalDamage = data.notes === null ? 0 :
            data.notes.length * data.note_damage + noteCountAc * Math.floor(data.note_damage * 0.1);
    const totalRewards = data.notes === null ? 0 :
            data.appeal_chances.reduce((sum, ac) => sum + ac.reward_voltage!, 0);

    let openRanks = false, openCaps = false;
</script>

<div class="sm:grid grid-rows-5a lg:grid-rows-3a grid-flow-col gap-x-8">
    <div>
        <div class="extra" class:open={openRanks}>
            <b><T key="songinfo.ranks.S"/>:</b> <T key="format.number" params={[data.ranks.S]}/>
            <button class="icon" on:click={() => openRanks = !openRanks}>
                <span class="open">v</span><span class="icon close">^</span>
            </button>
        </div>
        <div>
            <b><T key="songinfo.ranks.A"/>:</b> <T key="format.number" params={[data.ranks.A]}/>
            <br>
            <b><T key="songinfo.ranks.B"/>:</b> <T key="format.number" params={[data.ranks.B]}/>
            <br>
            <b><T key="songinfo.ranks.C"/>:</b> <T key="format.number" params={[data.ranks.C]}/>
        </div>
    </div>
    <div><b><T key="songinfo.note_damage"/>:</b> <T key="format.number" params={[data.note_damage]}/></div>
    {#if data.notes !== null}
        <div><b><T key="songinfo.note_count"/>:</b> <T key="format.number" params={[data.notes.length]}/></div>
        <div><b><T key="songinfo.note_count_ac"/>:</b> <T key="format.number" params={[noteCountAc]}/></div>
        <div><b><T key="songinfo.note_damage_total"/>:</b> <T key="format.number" params={[totalDamage]}/></div>
        <div><b><T key="songinfo.ac_reward_total"/>:</b> <T key="format.number" params={[totalRewards]}/></div>
    {/if}
    <div>
        <div class="extra" class:open={openCaps}>
            <b><T key="songinfo.voltage_caps.tap"/>:</b>
            <T key="format.number" params={[data.voltage_caps.tap]}/>
            <button class="icon" on:click={() => openCaps = !openCaps}>
                <span class="open">v</span><span class="icon close">^</span>
            </button>
        </div>
        <div>
            <b><T key="songinfo.voltage_caps.sp"/>:</b> <T key="format.number" params={[data.voltage_caps.sp]}/>
            <br>
            <b><T key="songinfo.voltage_caps.skill"/>:</b> <T key="format.number" params={[data.voltage_caps.skill]}/>
            <br>
            <b><T key="songinfo.voltage_caps.swap"/>:</b> <T key="format.number" params={[data.voltage_caps.swap]}/>
        </div>
    </div>
    <div><b><T key="songinfo.sp_gauge_max"/>:</b> <T key="format.number" params={[data.sp_gauge_max]}/></div>
    <div><b><T key="songinfo.song_length"/>:</b> <T key="format.number" params={[data.song_length]}/></div>
</div>

<style lang="postcss">
    div.extra {
        &:not(.open) > .icon > .close {
            @apply hidden;
        }
        & + div {
            @apply border-l border-neutral-200 ml-1 pl-2 h-0 overflow-hidden transition-[height];
        }
        &.open {
            & > .icon > .open {
                @apply hidden;
            }

            & + div {
                @apply h-18;
            }
        }
    }
</style>
<script lang="ts">
    import T from "$lib/T.svelte";
    import type {LiveData, LiveList} from "$types";

    export let data: { liveList: LiveList, liveInfo: LiveData };

    const noteCountAc = data.liveInfo.notes === null ? 0 :
            data.liveInfo.appeal_chances.reduce((sum, ac) =>
                    sum + (ac.range_note_ids![1] - ac.range_note_ids![0] + 1), 0);
    const totalDamage = data.liveInfo.notes === null ? 0 :
            data.liveInfo.notes.length * data.liveInfo.note_damage
            + noteCountAc * Math.floor(data.liveInfo.note_damage * 0.1);
    const totalRewards = data.liveInfo.notes === null ? 0 :
            data.liveInfo.appeal_chances.reduce((sum, ac) => sum + ac.reward_voltage!, 0);

    let openRanks = false, openCaps = false;
</script>

{#each data.liveList.lives[data.liveInfo.live_id].live_difficulty_ids.free as l}
    <a href="/live/{l}">{l}</a>,
{/each}<br>
{#each data.liveList.lives[data.liveInfo.live_id].live_difficulty_ids.story as l}
    <a href="/live/{l}">{l}</a>,
{/each}<br><br>

<div class="sm:grid grid-rows-5a lg:grid-rows-3a grid-flow-col gap-x-8">
    <div>
        <div class="extra" class:open={openRanks}>
            <b><T key="songinfo.ranks.S"/>:</b> <T key="format.number" params={[data.liveInfo.ranks.S]}/>
            <button class="icon" on:click={() => openRanks = !openRanks}>
                <span class="open">v</span><span class="icon close">^</span>
            </button>
        </div>
        <div>
            <b><T key="songinfo.ranks.A"/>:</b> <T key="format.number" params={[data.liveInfo.ranks.A]}/>
            <br>
            <b><T key="songinfo.ranks.B"/>:</b> <T key="format.number" params={[data.liveInfo.ranks.B]}/>
            <br>
            <b><T key="songinfo.ranks.C"/>:</b> <T key="format.number" params={[data.liveInfo.ranks.C]}/>
        </div>
    </div>
    <div><b><T key="songinfo.note_damage"/>:</b> <T key="format.number" params={[data.liveInfo.note_damage]}/></div>
    {#if data.liveInfo.notes !== null}
        <div><b><T key="songinfo.note_count"/>:</b> <T key="format.number" params={[data.liveInfo.notes.length]}/></div>
        <div><b><T key="songinfo.note_count_ac"/>:</b> <T key="format.number" params={[noteCountAc]}/></div>
        <div><b><T key="songinfo.note_damage_total"/>:</b> <T key="format.number" params={[totalDamage]}/></div>
        <div><b><T key="songinfo.ac_reward_total"/>:</b> <T key="format.number" params={[totalRewards]}/></div>
    {/if}
    <div>
        <div class="extra" class:open={openCaps}>
            <b><T key="songinfo.voltage_caps.tap"/>:</b>
            <T key="format.number" params={[data.liveInfo.voltage_caps.tap]}/>
            <button class="icon" on:click={() => openCaps = !openCaps}>
                <span class="open">v</span><span class="icon close">^</span>
            </button>
        </div>
        <div>
            <b><T key="songinfo.voltage_caps.sp"/>:</b>
            <T key="format.number" params={[data.liveInfo.voltage_caps.sp]}/>
            <br>
            <b><T key="songinfo.voltage_caps.skill"/>:</b>
            <T key="format.number" params={[data.liveInfo.voltage_caps.skill]}/>
            <br>
            <b><T key="songinfo.voltage_caps.swap"/>:</b>
            <T key="format.number" params={[data.liveInfo.voltage_caps.swap]}/>
        </div>
    </div>
    <div><b><T key="songinfo.sp_gauge_max"/>:</b> <T key="format.number" params={[data.liveInfo.sp_gauge_max]}/></div>
    <div><b><T key="songinfo.song_length"/>:</b> <T key="format.number" params={[data.liveInfo.song_length]}/></div>
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
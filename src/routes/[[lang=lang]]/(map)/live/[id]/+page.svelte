<script lang="ts">
    import {browser} from "$app/environment";
    import {goto} from "$app/navigation";
    import {page} from "$app/stores";
    import Notemap from "$lib/notemap/Notemap.svelte";
    import T from "$lib/T.svelte";
    import type {LiveData, LiveDataExtraStory, LiveList} from "$types";
    import {getContext} from "svelte";

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
    const storyStagesLabel = getContext<{ songinfo: { story_stages: string } }>("pageLanguage").songinfo.story_stages;

    function doDiffSelection(e: Event) {
        goto("/live/" + (<HTMLSelectElement>e.target)?.value, {keepFocus: true});
    }

    function optionKeyFree(liveDiffId: number): string {
        const diff = Math.floor(liveDiffId / 10) % 100;
        if (diff === 10) return "difficulty.beginner";
        else if (diff === 20) return "difficulty.intermediate";
        else if (diff === 30) return "difficulty.advanced";
        else if (diff === 40) return "difficulty.advplus";
        else if (diff === 50) return "difficulty.challenge";
        throw new Error("Unknown difficulty in live ID: " + liveDiffId);
    }

    function optionKeyStory(storyLive: { liveDiffId: number, extraInfo: LiveDataExtraStory }): string {
        const location = storyLive.extraInfo.story_chapter + "-" + storyLive.extraInfo.story_stage;
        if (storyLive.extraInfo.story_chapter >= 20 && storyLive.extraInfo.story_chapter <= 43) {
            return location + " " + (storyLive.extraInfo.story_is_hard_mode ? "Hard" : "Normal");
        } else {
            return location;
        }
    }
</script>

{#if browser}
    {#if true}
        <div class="tabbar">
            {#each data.liveList.lives[data.liveInfo.live_id].live_difficulty_ids.free as l}
                <a href="/live/{l}" class:active={$page.params.id === l.toString()}>
                    <T key={optionKeyFree(l)}/>
                    <div class="indicator">&nbsp;</div>
                </a>
            {/each}
            {#if data.liveList.lives[data.liveInfo.live_id].live_difficulty_ids.story.length > 0}
                <div class="sep">&nbsp;</div>
                <div class:active={$page.params.id.charAt(0) === "3"}>
                    <select on:change={doDiffSelection}>
                        <option disabled selected={$page.params.id.charAt(0) !== "3"}>
                            {storyStagesLabel}
                        </option>
                        {#each data.liveList.lives[data.liveInfo.live_id].live_difficulty_ids.story as l}
                            <option value={l.liveDiffId} selected={$page.params.id === l.liveDiffId.toString()}>
                                {optionKeyStory(l)}
                            </option>
                        {/each}
                    </select>
                    <div class="indicator">&nbsp;</div>
                </div>
            {/if}
        </div>
    {:else}
        <select on:change={doDiffSelection}>
            {#each data.liveList.lives[data.liveInfo.live_id].live_difficulty_ids.free as l}
                <option value={l} selected={$page.params.id === l.toString()}><T key={optionKeyFree(l)}/></option>
            {/each}
            {#if data.liveList.lives[data.liveInfo.live_id].live_difficulty_ids.story.length > 0}
                <optgroup label={storyStagesLabel}>
                    {#each data.liveList.lives[data.liveInfo.live_id].live_difficulty_ids.story as l}
                        <option value={l.liveDiffId} selected={$page.params.id === l.liveDiffId.toString()}>
                            {optionKeyStory(l)}
                        </option>
                    {/each}
                </optgroup>
            {/if}
        </select>
    {/if}
{:else}
    <div class="tabbar">
        {#each data.liveList.lives[data.liveInfo.live_id].live_difficulty_ids.free as l}
            <a href="/live/{l}" class:active={$page.params.id === l.toString()}>
                <T key={optionKeyFree(l)}/>
                <div class="indicator">&nbsp;</div>
            </a>
        {/each}
        {#if data.liveList.lives[data.liveInfo.live_id].live_difficulty_ids.story.length > 0}
            <div class="sep">&nbsp;</div>
            <div class="label"><T key="songinfo.story_stages"/></div>
            {#each data.liveList.lives[data.liveInfo.live_id].live_difficulty_ids.story as l}
                <a href="/live/{l.liveDiffId}" class:active={$page.params.id === l.liveDiffId.toString()}>
                    {optionKeyStory(l)}
                    <div class="indicator">&nbsp;</div>
                </a>
            {/each}
        {/if}
    </div>
{/if}

<div class="infogrid">
    <div>
        <div class="extra" class:open={openRanks}>
            <b><T key="songinfo.ranks.S"/>:</b> <T key="format.number" params={[data.liveInfo.ranks.S]}/>
            {#if browser}
                <button class="icon" on:click={() => openRanks = !openRanks}>
                    <span class="open">v</span><span class="icon close">^</span>
                </button>
            {/if}
        </div>
        <div>
            <b><T key="songinfo.ranks.A"/>:</b> <T key="format.number" params={[data.liveInfo.ranks.A]}/>
            <br>
            <b><T key="songinfo.ranks.B"/>:</b> <T key="format.number" params={[data.liveInfo.ranks.B]}/>
            <br>
            <b><T key="songinfo.ranks.C"/>:</b> <T key="format.number" params={[data.liveInfo.ranks.C]}/>
        </div>
    </div>
    <div>
        <b><T key="songinfo.note_damage"/>:</b> <T key="format.number" params={[data.liveInfo.note_damage]}/>
    </div>
    {#if data.liveInfo.notes !== null}
        <div>
            <b><T key="songinfo.note_count"/>:</b> <T key="format.number" params={[data.liveInfo.notes.length]}/>
        </div>
        <div>
            <b><T key="songinfo.note_count_ac"/>:</b> <T key="format.number" params={[noteCountAc]}/>
        </div>
        <div>
            <b><T key="songinfo.note_damage_total"/>:</b> <T key="format.number" params={[totalDamage]}/>
        </div>
        <div>
            <b><T key="songinfo.ac_reward_total"/>:</b> <T key="format.number" params={[totalRewards]}/>
        </div>
    {/if}
    <div>
        <div class="extra" class:open={openCaps}>
            <b><T key="songinfo.voltage_caps.tap"/>:</b>
            <T key="format.number" params={[data.liveInfo.voltage_caps.tap]}/>
            {#if browser}
                <button class="icon" on:click={() => openCaps = !openCaps}>
                    <span class="open">v</span><span class="icon close">^</span>
                </button>
            {/if}
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
    <div>
        <b><T key="songinfo.sp_gauge_max"/>:</b> <T key="format.number" params={[data.liveInfo.sp_gauge_max]}/>
    </div>
    <div>
        <b><T key="songinfo.song_length"/>:</b> <T key="format.number" params={[data.liveInfo.song_length]}/>
    </div>
</div>

{#key data.liveInfo}
    <Notemap data={data.liveInfo}/>
{/key}

<style lang="postcss">
    .infogrid {
        @apply sm:grid grid-rows-5a lg:grid-rows-3a grid-flow-col gap-x-8 my-2;

        & div.extra {
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
    }
</style>
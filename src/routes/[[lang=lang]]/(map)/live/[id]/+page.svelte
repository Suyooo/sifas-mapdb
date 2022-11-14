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
</script>

<div class="columns-md gap-8">
    <div><b><T key="songinfo.ranks.S"/>:</b> <T key="format.number" params={[data.ranks.S]}/></div>
    <div><b><T key="songinfo.note_damage"/>:</b> <T key="format.number" params={[data.note_damage]}/></div>
    {#if data.notes !== null}
        <div><b><T key="songinfo.note_count"/>:</b> <T key="format.number" params={[data.notes.length]}/></div>
        <div><b><T key="songinfo.note_count_ac"/>:</b> <T key="format.number" params={[noteCountAc]}/></div>
        <div><b><T key="songinfo.note_damage_total"/>:</b> <T key="format.number" params={[totalDamage]}/></div>
        <div><b><T key="songinfo.ac_reward_total"/>:</b> <T key="format.number" params={[totalRewards]}/></div>
    {/if}
    <div><b><T key="songinfo.voltage_caps.tap"/>:</b> <T key="format.number" params={[data.voltage_caps.tap]}/></div>
    <div><b><T key="songinfo.sp_gauge_max"/>:</b> <T key="format.number" params={[data.sp_gauge_max]}/></div>
    <div><b><T key="songinfo.song_length"/>:</b> <T key="format.number" params={[data.song_length]}/></div>
</div>
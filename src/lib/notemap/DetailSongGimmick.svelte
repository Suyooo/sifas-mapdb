<script lang="ts">
    import T from "$lib/T.svelte";
    import type {LiveData} from "$types";
    import {getContext} from "svelte";

    // Static database data (from +layout.svelte)
    const data = getContext<LiveData>("mapData");

    export let i: number;
    const gimmickData = data.gimmick![i];
    const showNum = data.gimmick!.length > 1
</script>

<div class="gimmick">
    {#if showNum}
        <div class="num">
            {String.fromCharCode(9312 /* ① */ + i)}
        </div>
    {/if}
    <div>
        <div>
            <T key="gimmicks.song_gimmick.gimmick" params={[gimmickData]}/>
        </div>
        <div>
            <b><T key="gimmicks.song_gimmick.cleansable"/>:</b>
            <T key="gimmicks.song_gimmick.cleansable_no"/>
        </div>
    </div>
</div>

<style lang="postcss">
    .gimmick {
        @apply flex w-full;
    }

    .num {
        @apply pr-2 font-bold;
    }
</style>
<script lang="ts">
    import T from "$lib/T.svelte";
    import type {LiveDataGimmick} from "../../types";

    export let gimmickData: LiveDataGimmick;
    export let i: number;
    export let singleGimmick: boolean;
</script>

<div class="gimmick">
    {#if !singleGimmick}
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
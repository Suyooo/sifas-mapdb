<script lang="ts">
    import T from "$lib/T.svelte";
    import type {LiveDataAC} from "../../types";

    export let acData: LiveDataAC;
</script>

<b><T key="appeal_chances.mission" params={[acData]}/></b>
<div>
    {#if acData.gimmick}
        <b>Gimmick:</b> <T key="appeal_chances.gimmick" params={[acData.gimmick]}/>
    {:else}
        <T key="gimmicks.no_gimmick"/>
    {/if}
</div>

<style lang="postcss">
    div {
        @apply text-sm;
    }
</style>
<script lang="ts">
    import T from "../../lib/T.svelte";
    import type {LiveData} from "../../types";
    import AC from "./AC.svelte";
    import Notebar from "./Notebar.svelte";

    export let data: LiveData;
</script>
<svelte:options immutable={true}/>

<a href="/">Back.</a>
<slot/><br><br>

{#if data.notes !== undefined}
    <Notebar {data}/>
{/if}

<div class="flex flex-col md:flex-row">
    <div class="flex-1">
        <h5><T key="gimmicks.title" /></h5>
        {#each data.note_gimmicks as noteGimmickData}
            <div>
                {noteGimmickData.effect_amount}
            </div>
        {/each}
    </div>
    <div class="flex-1">
        <h5><T key="appeal_chances.title"/></h5>
        {#each data.appeal_chances as acData}
            <AC {acData}/>
        {/each}
    </div>
</div>

<style lang="postcss">
    h5 {
        @apply text-accent-700 text-xl tracking-widest uppercase mt-4 mb-1
    }
</style>
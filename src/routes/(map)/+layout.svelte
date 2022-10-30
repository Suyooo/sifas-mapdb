<script lang="ts">
    import type {LiveData} from "../../types";
    import AC from "./AC.svelte";
    import Notebar from "./Notebar.svelte";

    export let data: LiveData;
</script>
<svelte:options immutable={true}/>

<a href="/">Back.</a>
<slot/><br><br>

<Notebar {data}/>

{#each data.appeal_chances as acData}
    <AC {acData}/>
{/each}

<style lang="postcss">
</style>
<script lang="ts">
    import type {PageData} from "./$types";
    import AC from "./AC.svelte";

    export let data: PageData;
</script>
<svelte:options immutable={true}/>

<a href="/">Back.</a>
<slot/><br><br>
{#each data.appeal_chances as ac}
    <AC {ac}/>
{/each}
<pre>{JSON.stringify(data, null, 4)}</pre>
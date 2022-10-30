<script lang="ts">
    import { page } from "$app/stores";
    import type { PageData } from "./$types";
    import AC from "./AC.svelte";
    export let data: PageData;
</script>
<svelte:options immutable={true}/>

<a href="/">Back.</a>
This is live {$page.params.id}!<br><br>
{#each data.appeal_chances as ac}
    <AC {ac} />
{/each}
<pre>{JSON.stringify(data,null,4)}</pre>
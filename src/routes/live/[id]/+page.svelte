<script lang="ts">
    import { page } from '$app/stores';
    import * as fs from "fs";
    import AC from "./AC.svelte";
    const map = JSON.parse(fs.readFileSync("mapdb/"+($page.params.id)+".json").toString());
</script>
<svelte:options immutable={true}/>

This is live {$page.params.id}!<br><br>
{#each map.appeal_chances as ac}
    <AC {ac} />
{/each}
<pre>{JSON.stringify(map,null,4)}</pre>
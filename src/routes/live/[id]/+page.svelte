<script lang="ts">
    import { page } from '$app/stores';
    import * as fs from "fs";
    const map = JSON.parse(fs.readFileSync("mapdb/"+($page.params.id)+".json").toString());
</script>
<svelte:options immutable={true}/>

This is live {$page.params.id}!<br><br>
<pre>{JSON.stringify(map,null,4)}</pre>
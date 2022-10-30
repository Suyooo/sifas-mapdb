<script lang="ts">
    import { page } from '$app/stores';
    export let data: any;
</script>

This is live {$page.params.id}!<br><br>
<pre>{JSON.stringify(data,null,4)}</pre>
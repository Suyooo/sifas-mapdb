<script lang="ts">
    import lang from "../lang/pseudo";

    export let key;
    export let params = [];

    let item = lang;
    for (const keyPart of key.split(".")) {
        item = item[keyPart];
    }
</script>

{#if typeof item === "function"}
    {item(...params)}
{:else}
    {item}
{/if}
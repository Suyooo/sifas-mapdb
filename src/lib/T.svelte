<script lang="ts">
    import lang from "../lang/en";

    export let key: string;
    export let params: any[] = [];

    let item: any = lang;
    for (const keyPart of key.split(".")) {
        item = item[keyPart];
    }
</script>

{#if typeof item === "function"}
    {@html item(...params)}
{:else}
    {@html item}
{/if}
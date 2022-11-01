<script lang="ts">
    import {lang} from "../stores/lang";

    export let key: string;
    export let params: any[] = [];

    let item: any;
    $: {
        item = $lang;
        for (const keyPart of key.split(".")) {
            item = item[keyPart];
        }
    }
</script>

{#if typeof item === "function"}
    {@html item(...params)}
{:else}
    {@html item}
{/if}
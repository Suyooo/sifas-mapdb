<script lang="ts">
    import T from "$lib/T.svelte";
    import type {LiveDataGimmickNote} from "../../types";

    export let gimmickData: LiveDataGimmickNote;
    export let i: number;
</script>

<b><T key="gimmicks.note_gimmick.gimmick" params={[gimmickData]}/></b>
<div>
    <b>Note:</b> {i}
</div>

<style lang="postcss">
    div {
        @apply text-sm;
    }
</style>
<script lang="ts">
    import T from "$lib/T.svelte";
    import {getContext} from "svelte";
    import type {LiveDataGimmickNote} from "../../types";

    export let noteGimmickData: LiveDataGimmickNote;
    export let i: number;

    const thisGimmickCount = getContext<number[]>("gimmickCount")[i];
</script>

<div>
    <div>
        <T key="gimmicks.note_gimmick_label"/> {i + 1}
    </div>
    <div>
        <div>
            <T key="gimmicks.note_gimmick" params={[noteGimmickData]}/>
        </div>
        {#if thisGimmickCount > 0}
            <div>
                <b><T key="gimmicks.note_gimmick_amount"/>:</b>
                <T key="format.note_count" params={[thisGimmickCount]}/>
            </div>
        {/if}
    </div>
</div>
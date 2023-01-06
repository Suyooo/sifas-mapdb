<script lang="ts">
    import {page} from "$app/stores";
    import type {Language, LiveList} from "$types";
    import T from "$lib/T.svelte";
    import {getContext} from "svelte";
    import {Attribute, attributeToKey} from "$enums";

    export let data: { liveList: LiveList };
    const pageLanguage = getContext<Language>("pageLanguage");

    const groupId = $page.params.group === "muse" ? 0 : $page.params.group === "aqours" ? 1 : $page.params.group === "niji" ? 2 : 3;
</script>

This is the list for
<T key="tab.{$page.params.group}"/>!

{#each data.liveList.by_group[groupId] as liveId (liveId)}
    {@const live = data.liveList.lives[liveId]}
    {@const attrKey = attributeToKey(live.attribute)}
    {@const attrImg = live.attribute === Attribute.NONE ? "x" : attrKey.at(0)}
    <a href="/live/{live.default_live_difficulty_id}">
        <img src="/img/attr/{attrImg}.png" alt="{pageLanguage.attribute.title}: {pageLanguage.attribute[attrKey]}"/>
        <div>{@html live.name.kn}</div>
    </a>
{/each}
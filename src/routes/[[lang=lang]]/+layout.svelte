<script lang="ts">
    import "$css";
    import {setContext} from "svelte";
    import type {Language} from "$types";

    export let data: { pageLanguage: any };
    setContext<Language>("pageLanguage", data.pageLanguage);

    function setLang(code: string): void {
        console.log(code);
    }
</script>

<header>
    <div>
        This is a nav.
        <button on:click={() => setLang("en")}>EN</button>
        <button on:click={() => setLang("pseudo")}>PSEUDO</button>
        <button on:click={() => setLang("ja")}>JA</button>
    </div>
</header>
<main class="max-w-screen-2xl mx-auto px-4" data-sveltekit-prefetch>
    <slot/>
</main>
<script>
    import "../app.css";
    import {langSetting} from "../stores/lang";
</script>

<header>
    <div>
        This is a nav.
        <button on:click={() => $langSetting = "en"}>EN</button>
        <button on:click={() => $langSetting = "pseudo"}>PSEUDO</button>
        <button on:click={() => $langSetting = "ja"}>JA</button>
    </div>
</header>
<main class="max-w-screen-2xl mx-auto px-4" data-sveltekit-prefetch>
    <slot/>
</main>
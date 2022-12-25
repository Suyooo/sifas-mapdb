<script context="module" lang="ts">
    interface Option {
        value: string,
        label: string,
        current?: boolean,
        disabled?: boolean,
        hidden?: boolean,

        [k: string | number | symbol]: unknown
    }
</script>
<script lang="ts">
    import {createEventDispatcher} from "svelte";

    export let label: string;
    export let ariaLabel: string | undefined = undefined;
    export let options: Option[];

    const randomId = Math.random().toString().substring(2, 6);
    let open: boolean = false;
    let container: HTMLDivElement;
    let mainButton: HTMLButtonElement;
    let listButtons: HTMLButtonElement[] = [];
    let keyboardIndex: number = 0;
    $: if (open && keyboardIndex >= 0 && listButtons[keyboardIndex]) listButtons[keyboardIndex].focus();

    const dispatch = createEventDispatcher<{ select: string }>();

    function select(o: Option) {
        dispatch("select", o.value);
        open = false;
    }

    function doOpen() {
        keyboardIndex = -1;
        open = true;
    }

    function key(e: KeyboardEvent) {
        if (e.key === "Escape") {
            open = false;
            mainButton.focus();
        } else if (e.key === "ArrowDown" || e.key === "ArrowRight" || (e.key === "Tab" && !e.shiftKey)) {
            if (open) {
                if (keyboardIndex === options.length - 1 && e.key === "Tab") {
                    open = false;
                } else {
                    keyboardIndex = Math.min(keyboardIndex + 1, options.length - 1);
                    e.preventDefault();
                    e.stopPropagation();
                }
            } else if (e.key !== "Tab") {
                doOpen();
                e.preventDefault();
                e.stopPropagation();
            }
        } else if (e.key === "ArrowUp" || e.key === "ArrowLeftt" || (e.key === "Tab" && e.shiftKey)) {
            if (open) {
                if (document.activeElement === mainButton && e.key === "Tab") {
                    open = false;
                } else if (e.key === "Tab") {
                    keyboardIndex = Math.max(keyboardIndex - 1, -1);
                    if (keyboardIndex >= 0) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                } else {
                    keyboardIndex = Math.max(keyboardIndex - 1, 0);
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        }
    }

    function blur(e: FocusEvent) {
        if (container.contains(<Node>e.relatedTarget)) {
            return;
        }
        open = false;
    }
</script>

<div class="navdropdown" class:open={open} on:keydown={key} bind:this={container}>
    <button on:mousedown={open ? (() => open = false) : doOpen} aria-expanded={open} bind:this={mainButton}
            aria-haspopup="true" aria-controls={"navdropdown" + randomId} aria-label={ariaLabel ?? label}>
        {label}
    </button>
    <ul id={"navdropdown" + randomId}>
        {#each options as option,i (option.value)}
            {#if !option.hidden}
                <li id={"navdropdown"+randomId+"-" + option.value} aria-current={option.current ? "page" : null}>
                    <button on:mouseup={() => select(option)} disabled={!open} bind:this={listButtons[i]} on:blur={blur}
                            aria-label={option.label} aria-disabled={option.disabled} role="link">
                        <slot {option}/>
                    </button>
                </li>
            {/if}
        {/each}
    </ul>
</div>

<style>
    .navdropdown {
        position: relative;
    }

    .navdropdown li, .navdropdown button {
        background: none;
        color: inherit;
        border: none;
        padding: 0;
        font: inherit;
        cursor: pointer;
        width: 100%;
        text-align: left;
    }

    .navdropdown > button {
        position: relative;
        border: 1px solid darkgray;
        padding-left: .5em;
        padding-right: 2em;
    }

    .navdropdown button:hover, .navdropdown button:focus-visible {
        background-color: lightgray;
    }

    .navdropdown > button:after {
        content: "⏷";
        position: absolute;
        right: .5em;
    }

    .navdropdown.open > button:after {
        content: "⏶";
    }

    .navdropdown:not(.open) > ul {
        display: none;
    }

    .navdropdown.open > ul {
        position: absolute;
        top: 100%;
        left: 0;
        min-width: 100%;
        z-index: 9;
        display: flex;
        flex-direction: column;
        align-items: stretch;
    }

    .navdropdown li > button {
        position: relative;
        background-color: white;
        border: 1px solid lightgray;
        padding-left: .5em;
        padding-right: .5em;
    }
</style>
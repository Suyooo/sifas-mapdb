import type {Action} from "svelte/action";

export const shortcut: Action<HTMLElement, { alt?: boolean, shift?: boolean, control?: boolean, code: string }> =
    (node, params) => {
        function handler(e: KeyboardEvent) {
            if ((!!params!.alt != e.altKey) || (!!params!.shift != e.shiftKey) ||
                (!!params!.control != (e.ctrlKey || e.metaKey)) || params!.code != e.code) {
                return;
            }
            e.preventDefault();
            node.click();
        }

        window.addEventListener("keydown", handler);
        return {
            destroy: () => window.removeEventListener("keydown", handler)
        };
    };

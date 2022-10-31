import type {Action} from "svelte/action";

export const shortcut: Action<HTMLElement, { alt?: boolean, shift?: boolean, control?: boolean, code: string }> =
    (node, params) => {
        console.log("Adding " + JSON.stringify(params));

        function handler(e: KeyboardEvent) {
            console.log("Handler " + JSON.stringify(params));
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

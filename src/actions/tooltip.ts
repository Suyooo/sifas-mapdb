import type {SvelteComponentTyped} from "svelte";
import {tippy} from "svelte-tippy";
import type {Action} from "svelte/action";
import {roundArrow} from "tippy.js";
import "tippy.js/dist/border.css";
import "tippy.js/dist/svg-arrow.css";

type SvelteComponentConstructor = new (...args: any) => SvelteComponentTyped<any>;

export const tooltipNotebar: Action<HTMLElement, { component: SvelteComponentConstructor, props?: any }> =
        (node: HTMLElement, params: { component: SvelteComponentConstructor, props?: any } | undefined) => {
            if (params === undefined) return;

            let componentInstance: SvelteComponentTyped<any> | null = null;
            let unmountTimeout: NodeJS.Timeout;
            const tippyInstance = tippy(node, {
                arrow: roundArrow + roundArrow,
                duration: 150,
                theme: "notebar",
                onTrigger(instance) {
                    const box = instance.popper.firstElementChild;
                    requestAnimationFrame(() => {
                        box!.classList.add("shown");
                    });
                    if (componentInstance) {
                        clearTimeout(unmountTimeout);
                    } else {
                        componentInstance = new params!.component({
                            target: instance.popper.querySelector(".tippy-content"),
                            props: params!.props
                        });
                    }
                },
                onHide(instance) {
                    const box = instance.popper.firstElementChild;
                    box!.classList.remove("shown");
                    unmountTimeout = setTimeout(() => {
                        instance.unmount();
                        if (componentInstance !== null) componentInstance.$destroy();
                        componentInstance = null;
                    }, 150);
                },
                offset: [0, 3]
            });
            return {
                update: (newP: { component: any, props?: any }) => {
                    if (newP === undefined) return;
                    params = newP;
                    if (componentInstance) componentInstance.$set(newP.props);
                },
                destroy: () => {
                    tippyInstance.destroy();
                    if (componentInstance !== null) componentInstance.$destroy();
                    clearTimeout(unmountTimeout);
                }
            }
        };
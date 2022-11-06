import {createTippy} from "svelte-tippy";
import {roundArrow} from "tippy.js";
import "tippy.js/dist/border.css";
import "tippy.js/dist/svg-arrow.css";

const tippy = createTippy({
    arrow: roundArrow + roundArrow,
    duration: 200,
    onTrigger(instance) {
        const box = instance.popper.firstElementChild;
        requestAnimationFrame(() => {
            box!.classList.add("shown");
        });
    },
    onHide(instance) {
        const box = instance.popper.firstElementChild;
        box!.classList.remove("shown");
    }
});

export default tippy;
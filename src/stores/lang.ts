import {derived, writable} from "svelte/store";
import {browser} from "$app/environment";
import en from "../lang/en";

let langCode = "en";
if (browser) {
    langCode = localStorage.getItem("mapdb-lang") || langCode;
}

export const langSetting = writable<string>(langCode);
export const lang = derived(langSetting,
    (langSettingCode, set) => {
        if (browser) {
            localStorage.setItem("mapdb-lang", langSettingCode);
        }
        import(`../lang/${langSettingCode}.ts`).then(module => set(module.default));
    }, en);
import type {ParamMatcher} from "@sveltejs/kit";

export const match: ParamMatcher = (param) => {
    return param === "" || param === "en" || param === "ja" || param === "pseudo";
}
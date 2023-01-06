import type {ParamMatcher} from "@sveltejs/kit";

export const match: ParamMatcher = (param) => {
    return param === "muse" || param === "aqours" || param === "niji" || param === "liella";
}
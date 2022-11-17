export const prerender = true;

import {error} from "@sveltejs/kit";
import type {LayoutLoad} from "./$types";

export const load: LayoutLoad = async ({ fetch }) => {
    const res = await fetch(`/json/list`);
    if (!res.ok) throw error(500, "Unable to load list of lives");
    return {liveList: res.json()};
}
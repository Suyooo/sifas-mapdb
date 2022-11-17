import {error} from "@sveltejs/kit";
import type {LayoutLoad} from "./$types";

export const load: LayoutLoad = async ({ params, fetch }) => {
    const res = await fetch(`/json/live/${params.id}.json`);
    if (!res.ok) throw error(res.status, res.statusText);
    return {liveInfo: res.json()};
}
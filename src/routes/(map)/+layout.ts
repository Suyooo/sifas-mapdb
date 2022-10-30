import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ params, fetch }) => {
    const res = await fetch(`/json/live/${params.id}.json`);
    return res.json();
}
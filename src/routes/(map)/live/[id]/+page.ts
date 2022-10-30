import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {
    const res = await fetch(`/json/live/${params.id}.json`);
    return res.json();
}
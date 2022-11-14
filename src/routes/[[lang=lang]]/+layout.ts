export const prerender = true;

import type {LayoutLoad} from "./$types";

export const load: LayoutLoad = async ({ params }) => {
    return (await import(`../../lang/${params.lang || "en"}.ts`)).default;
}
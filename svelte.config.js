import adapter from "@sveltejs/adapter-static";
import preprocess from "svelte-preprocess";
import postcss from './postcss.config.cjs';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: [
        preprocess({postcss}),
    ],
    kit: {
        adapter: adapter({
            pages: 'build',
            assets: 'build',
            fallback: null,
            precompress: false,
            strict: true
        })
    }
};

export default config;

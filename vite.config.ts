import {sveltekit} from "@sveltejs/kit/vite";
import * as path from "path";
import type {UserConfig} from "vite";

const config: UserConfig = {
    plugins: [sveltekit()],
    resolve: {
        alias: {
            "$actions": path.resolve(__dirname, "./src/actions"),
            "$lang": path.resolve(__dirname, "./src/lang"),
            "$stores": path.resolve(__dirname, "./src/stores"),
            "$types": path.resolve(__dirname, "./src/types.d.ts"),
            "$enums": path.resolve(__dirname, "./src/enums.ts"),
            "$css": path.resolve(__dirname, "./src/app.css")
        },
    },
    build: {
        minify: false
    }
};

export default config;

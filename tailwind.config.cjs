/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors.js");

module.exports = {
    content: ["./src/app.html", "./src/**/*.{html,js,svelte,ts}"],
    theme: {
        extend: {
            colors: {
                "accent": colors.amber,
                "neutral": colors.stone,

                "types": {
                    "vo": {
                        DEFAULT: "#cf403d",
                        dark: "#c43331"
                    },
                    "sp": {
                        DEFAULT: "#248ecf",
                        dark: "#1c6ea0"
                    },
                    "gd": {
                        DEFAULT: "#3ea15b",
                        dark: "#2e7643"
                    },
                    "sk": {
                        DEFAULT: "#e4b642",
                        dark: "#826212"
                    }
                },

                "notebar": {
                    DEFAULT: colors.black,
                    "note": {
                        DEFAULT: colors.white,
                        gimmick: colors.blue[300]
                    }
                }
            }
        },
    },
    plugins: [],
}

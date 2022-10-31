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
                        acbar: "#c43331"
                    },
                    "sp": {
                        DEFAULT: "#248ecf",
                        acbar: "#1c6ea0"
                    },
                    "gd": {
                        DEFAULT: "#3ea15b",
                        acbar: "#2e7643"
                    },
                    "sk": {
                        DEFAULT: "#e4b642",
                        dark: "#bb8e1b",
                        acbar: "#826212"
                    }
                },
                "attributes": {
                    "smile": {
                        DEFAULT: "#dd4aa5"
                    },
                    "pure": {
                        DEFAULT: "#39a85d"
                    },
                    "cool": {
                        DEFAULT: "#0099ee"
                    },
                    "active": {
                        DEFAULT: "#db3e3e"
                    },
                    "natural": {
                        DEFAULT: "#edbb3e",
                        dark: "#bb8b11"
                    },
                    "elegant": {
                        DEFAULT: "#85519c"
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

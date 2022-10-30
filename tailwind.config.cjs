/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors.js");

module.exports = {
    content: ["./src/app.html","./src/**/*.{html,js,svelte,ts}"],
    theme: {
        extend: {
            colors: {
            }
        },
    },
    plugins: [],
}

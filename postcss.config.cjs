const tailwind = require("tailwindcss");
const tailwindNested = require("tailwindcss/nesting");
const tailwindConfig = require("./tailwind.config.cjs");
const autoprefixer = require("autoprefixer");
const postcssNesting = require("postcss-nesting");

module.exports = {
  plugins: [ tailwindNested(postcssNesting), tailwind(tailwindConfig), autoprefixer]
}
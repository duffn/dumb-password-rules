/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./_site/**/*.html"],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/typography"),
  ],
};

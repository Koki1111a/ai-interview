const { light, dark } = require("@charcoal-ui/theme");
const { createTailwindConfig } = require("@charcoal-ui/tailwind-config");
/**
 * @type {import('tailwindcss/tailwind-config').TailwindConfig}
 */
module.exports = {
  darkMode: true,
  content: ["./src/**/*.tsx", "./src/**/*.html"],
  presets: [
    createTailwindConfig({
      version: "v3",
      theme: {
        ":root": light,
      },
    }),
  ],
  theme: {
    extend: {
      colors: {
        primary: "#000088",
        "primary-hover": "#2929f4",
        "primary-press": "#2568dc",
        "primary-disabled": "#1e1e2d",
        secondary: "#4747E8",
        "secondary-hover": "#7878C3",
        "secondary-press": "#9E9EC0",
        "secondary-disabled": "#4d4d51",
        base: "#5b94eb",
        "text-primary": "#000000",
      },
       fontFamily: {
        Sans_Serif : ["sans-serif"]
      }
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("@sincpro/mobile-ui/tailwind.preset")],
  content: [
    "./App.tsx",
    "./sincpro_mobile_tickets/**/*.{ts,tsx}",
    "./node_modules/@sincpro/mobile/**/*.js",
    "./node_modules/@sincpro/mobile-ui/**/*.js",
    "./node_modules/@sincpro/mobile-odoo/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        light: ["Satoshi-Regular"],
        regular: ["Satoshi-Regular"],
        medium: ["Satoshi-Medium"],
        semibold: ["Satoshi-Bold"],
        extrabold: ["Satoshi-Black"],
      },
    },
  },
};

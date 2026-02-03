/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: "class",
  content: [
    "./popup.tsx",
    "./contents/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  plugins: []
}

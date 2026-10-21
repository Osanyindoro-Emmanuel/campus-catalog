/** @type {import('tailwindcss').Config} */
// NOTE: In Tailwind v4 with @tailwindcss/vite, design tokens are defined via
// @theme in index.css. This file only configures darkMode and content paths.
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
};

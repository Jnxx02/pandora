/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
         'primary': '#000000',
        'secondary': '#B6B09F',
        'accent': '#000000',
        'background': '#FFFDEF',
        'neutral': '#F1F1F1',
        'text-main': '#000000',
        'text-secondary': '#555555',
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
        'serif': ['Merriweather', 'ui-serif', 'Georgia'],
      },
    },
  },
  plugins: [],
}

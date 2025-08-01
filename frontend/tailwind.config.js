/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#000000',       // Merah Terang (untuk header, tombol utama, footer)
        'secondary': '#B6B09F',      // Merah Tua (untuk hover, judul penting)
        'accent': '#000000',         // Aksen untuk link hover dan elemen aktif
        'background': '#FFFDEF',    // Putih Gading (latar belakang utama halaman)
        'neutral': '#F1F1F1',        // Abu-abu Muda (latar card, pemisah seksi)
        'text-main': '#000000',     // Teks Utama (hitam pekat)
        'text-secondary': '#555555', // Teks Sekunder (abu-abu muda),
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
        'serif': ['Merriweather', 'ui-serif', 'Georgia'],
      },
    },
  },
  plugins: [],
}


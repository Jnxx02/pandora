/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
         'primary': '#E70000',       // Merah Terang (untuk header, tombol utama, footer)
        'secondary': '#C50000',      // Merah Tua (untuk hover, judul penting)
        'accent': '#C50000',         // Aksen untuk link hover dan elemen aktif
        'background': '#FFFDEF',    // Putih Gading (latar belakang utama halaman)
        'neutral': '#F1F1F1',        // Abu-abu Muda (latar card, pemisah seksi)
        'text-main': '#212121',     // Teks Utama (hitam pekat)
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


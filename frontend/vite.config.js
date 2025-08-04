import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      mangle: {
        toplevel: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          motion: ['framer-motion'],
          admin: [
            './src/pages/admin/Dashboard.jsx',
            './src/pages/admin/LaporanPengaduan.jsx',
            './src/pages/admin/TambahEditBerita.jsx',
            './src/pages/admin/DaftarBerita.jsx',
            './src/pages/admin/EditStatistik.jsx',
            './src/pages/admin/EditPrasarana.jsx',
            './src/pages/admin/Login.jsx'
          ],
          public: [
            './src/pages/Home.jsx',
            './src/pages/Berita.jsx',
            './src/pages/Profil.jsx',
            './src/pages/Pengaduan.jsx',
            './src/pages/FormulirPengaduan.jsx',
            './src/pages/Sejarah.jsx',
            './src/pages/DetailBerita.jsx'
          ]
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      }
    },
    chunkSizeWarningLimit: 1000,
    target: 'es2015',
    cssCodeSplit: true,
  },
  server: {
    port: 5173,
    host: true,
    historyApiFallback: true
  },
  preview: {
    port: 5173,
    host: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion']
  }
})

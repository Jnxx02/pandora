const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = 3001;

// Inisialisasi Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Pengecekan Environment Variables (PENTING UNTUK DEPLOYMENT)
if (!supabaseUrl || !supabaseKey) {
  console.error('FATAL ERROR: SUPABASE_URL and SUPABASE_ANON_KEY must be defined in environment variables.');
  process.exit(1); // Keluar dari proses jika variabel tidak ada, mencegah crash yang tidak jelas
}
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());

// --- BAGIAN PENTING UNTUK MENYAJIKAN FRONTEND ---

// 1. Tentukan path absolut ke folder build frontend.
// `__dirname` adalah path ke folder tempat server.js berada (`/var/task/backend` di Vercel).
// `path.resolve` akan menavigasi ke atas (`..`) lalu ke `frontend/dist`.
const frontendDistPath = path.resolve(__dirname, '..', 'frontend', 'dist');

// 2. Middleware untuk menyajikan file statis (CSS, JS, gambar) dari `frontend/dist`.
// Ketika browser meminta `/assets/index-xxxx.js`, Express akan mencarinya di sini.
app.use(express.static(frontendDistPath));

// --- API ENDPOINTS ---
// Semua rute API harus didefinisikan SEBELUM rute catch-all.

app.get('/api/statistik', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('statistik')
      .select('icon, label, value');
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching statistik from Supabase:', error);
    res.status(500).json({ message: 'Gagal mengambil data dari database.' });
  }
});

app.post('/api/statistik', async (req, res) => {
  try {
    const statistikData = req.body;
    if (!Array.isArray(statistikData)) {
      return res.status(400).json({ message: 'Data yang dikirim harus berupa array.' });
    }
    const { error: deleteError } = await supabase.from('statistik').delete().neq('id', -1); // Hapus semua baris
    if (deleteError) throw deleteError;

    if (statistikData.length > 0) {
      const { error: insertError } = await supabase.from('statistik').insert(statistikData);
      if (insertError) throw insertError;
    }
    res.status(200).json({ message: 'Data statistik berhasil disinkronkan.' });
  } catch (error) {
    console.error('Error syncing statistik to Supabase:', error);
    res.status(500).json({ message: 'Gagal menyinkronkan data ke database.' });
  }
});


// --- BAGIAN PENTING UNTUK SINGLE PAGE APP (SPA) ---

// 3. Rute Catch-All. Ini harus menjadi rute TERAKHIR.
// Untuk semua permintaan GET yang tidak cocok di atas (misalnya `/profil`, `/kontak`),
// kirimkan file `index.html` dari frontend.
// Ini memungkinkan React Router mengambil alih routing di sisi klien.
app.get('*', (req, res) => {
  res.sendFile(path.resolve(frontendDistPath, 'index.html'));
});


// Jalankan server hanya jika tidak di Vercel (untuk pengembangan lokal)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// Ekspor 'app' agar Vercel dapat menggunakannya sebagai Serverless Function
module.exports = app;

const express = require('express');
const cors = require('cors');
// Load environment variables from .env file for local development
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = 3001;

// Inisialisasi Supabase Client
// Pastikan Anda sudah mengatur environment variables ini di Vercel
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());

// API endpoint untuk MENGAMBIL (GET) statistik
app.get('/api/statistik', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('statistik')
      .select('icon, label, value');

    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching statistik from Supabase:', error);
    res.status(500).json({ message: 'Gagal mengambil data dari database.' });
  }
});

// API endpoint untuk MENYIMPAN (POST) statistik ke Supabase
app.post('/api/statistik', async (req, res) => {
  try {
    const statistikData = req.body;

    // Strategi Sinkronisasi: Hapus semua, lalu masukkan semua.
    // Ini memastikan data di database sama persis dengan yang dikirim dari UI, termasuk penghapusan.

    // 1. Hapus semua data statistik yang ada.
    const { error: deleteError } = await supabase
      .from('statistik')
      .delete()
      .neq('label', 'this-is-a-dummy-value-that-will-never-exist'); // Trik untuk menargetkan semua baris

    if (deleteError) throw deleteError;

    // 2. Masukkan semua data baru yang dikirim dari frontend.
    // Kita hanya insert jika ada data untuk menghindari error.
    if (statistikData && statistikData.length > 0) {
      const { error: insertError } = await supabase.from('statistik').insert(statistikData);
      if (insertError) throw insertError;
    }

    res.status(200).json({ message: 'Data statistik berhasil disinkronkan.' });
  } catch (error) {
    console.error('Error syncing statistik to Supabase:', error);
    res.status(500).json({ message: 'Gagal menyinkronkan data ke database.' });
  }
});

// Jalankan server hanya jika tidak di Vercel (untuk pengembangan lokal)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
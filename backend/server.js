const express = require('express');
const cors = require('cors');
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
app.get('/api/statistik', (req, res) => {
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
    // 'upsert' akan meng-update baris jika ada, atau membuat baris baru jika tidak ada.
    const { error } = await supabase.from('statistik').upsert(statistikData);

    if (error) {
      throw error;
    }
    res.status(200).json({ message: 'Data statistik berhasil disimpan permanen.' });
  } catch (error) {
    console.error('Error saving statistik to Supabase:', error);
    res.status(500).json({ message: 'Gagal menyimpan data ke database.' });
  }
});

// Jalankan server hanya jika tidak di Vercel (untuk pengembangan lokal)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
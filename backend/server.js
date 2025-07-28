const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Menggunakan path.join(__dirname, ...) adalah cara paling andal untuk
// mereferensikan file yang di-deploy bersama kode Anda di lingkungan serverless.
const STATISTIK_FILE_PATH = path.join(__dirname, 'data', 'statistik.json');

app.use(cors());
app.use(express.json());

// API endpoint untuk MENGAMBIL (GET) statistik
app.get('/api/statistik', (req, res) => {
  fs.readFile(STATISTIK_FILE_PATH, 'utf8', (err, data) => {
    if (err) {
      // Log error ini akan muncul di Vercel Function Logs
      console.error('Error reading statistik.json:', err);
      return res.status(500).json({ message: 'Internal Server Error: Gagal membaca data.' });
    }
    try {
      res.status(200).json(JSON.parse(data));
    } catch (parseErr) {
      console.error('Error parsing statistik.json:', parseErr);
      res.status(500).json({ message: 'Internal Server Error: Gagal memproses data.' });
    }
  });
});

// API endpoint untuk MENYIMPAN (POST) statistik
app.post('/api/statistik', (req, res) => {
  // PENTING: Filesystem Vercel bersifat read-only (hanya bisa dibaca).
  // fs.writeFile tidak akan menyimpan data secara permanen.
  // Untuk saat ini, kita hanya akan merespons seolah-olah berhasil.
  console.log("POST /api/statistik diterima. Perubahan tidak disimpan permanen di Vercel.");
  res.status(200).json({ message: 'Data diterima. Perubahan tidak disimpan permanen.' });
});

// Jalankan server hanya jika tidak di Vercel (untuk pengembangan lokal)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
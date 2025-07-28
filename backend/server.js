const express = require('express');
const cors = require('cors');
// const fs = require('fs');
// const path = require('path');

const app = express();
const PORT = 3001;
// const STATISTIK_FILE_PATH = path.join(__dirname, 'data', 'statistik.json');

app.use(cors());
app.use(express.json());

// API endpoint untuk statistik (VERSI DEBUGGING)
app.get('/api/statistik', (req, res) => {
  // Mengembalikan data statis tanpa membaca file
  console.log("GET /api/statistik endpoint was hit");
  res.status(200).json([{ icon: '✔️', label: 'Test', value: 'Berhasil' }]);
});

// API endpoint untuk memperbarui statistik (VERSI DEBUGGING)
app.post('/api/statistik', (req, res) => {
  const newStatistik = req.body;
  if (!Array.isArray(newStatistik)) {
    return res.status(400).json({ message: 'Data yang dikirim harus berupa array' });
  }
  // Hanya merespons tanpa menulis ke file
  console.log("POST /api/statistik endpoint was hit with body:", newStatistik);
  res.status(200).json({ message: 'Data statistik berhasil diperbarui (mode debug)' });
});

// Jalankan server hanya jika tidak di Vercel (untuk pengembangan lokal)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
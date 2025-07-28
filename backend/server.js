const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const STATISTIK_FILE_PATH = path.join(__dirname, 'data', 'statistik.json');

app.use(cors());
app.use(express.json());

// API endpoint untuk MENGAMBIL (GET) statistik
app.get('/api/statistik', (req, res) => {
  fs.readFile(STATISTIK_FILE_PATH, 'utf8', (err, data) => {
    if (err) {
      console.error('Gagal membaca file statistik:', err);
      return res.status(500).json({ message: 'Gagal memuat data statistik' });
    }
    res.json(JSON.parse(data));
  });
});

// API endpoint untuk MENYIMPAN (POST) statistik
app.post('/api/statistik', (req, res) => {
  const newStatistik = req.body;

  if (!Array.isArray(newStatistik)) {
    return res.status(400).json({ message: 'Data yang dikirim harus berupa array' });
  }

  fs.writeFile(STATISTIK_FILE_PATH, JSON.stringify(newStatistik, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('Gagal menyimpan file statistik:', err);
      return res.status(500).json({ message: 'Gagal menyimpan data statistik' });
    }
    res.json({ message: 'Data statistik berhasil diperbarui' });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

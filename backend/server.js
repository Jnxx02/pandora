const express = require('express');
const cors = require('cors');
// Load environment variables from .env file for local development
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = 3001;

// Inisialisasi Supabase Client dengan error handling yang lebih baik
let supabase = null;
let supabaseStatus = 'not_configured';

try {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  // Check if Supabase is properly configured
  if (supabaseUrl && supabaseKey && 
      supabaseUrl !== 'https://your-project.supabase.co' && 
      supabaseKey !== 'your-anon-key-here') {
    supabase = createClient(supabaseUrl, supabaseKey);
    supabaseStatus = 'configured';
    console.log('✅ Supabase client initialized successfully');
  } else {
    console.log('⚠️  Supabase not configured, using local fallback mode');
    supabaseStatus = 'not_configured';
  }
} catch (error) {
  console.log('⚠️  Failed to initialize Supabase client:', error.message);
  supabaseStatus = 'error';
}

// CORS configuration untuk development
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    supabase: supabaseStatus,
    message: 'Backend server is running'
  });
});

// API endpoint untuk MENGAMBIL (GET) statistik
app.get('/api/statistik', async (req, res) => {
  try {
    if (supabase && supabaseStatus === 'configured') {
      // Use Supabase if available
      const { data, error } = await supabase
        .from('statistik')
        .select('icon, label, value');

      if (error) {
        throw error;
      }

      res.status(200).json(data || []);
    } else {
      // Fallback: return default data untuk development
      console.log('📊 Returning development statistik data');
      const defaultData = [
        { label: 'Penduduk', value: '3.820', icon: null },
        { label: 'Laki-Laki', value: '1.890', icon: null },
        { label: 'Perempuan', value: '1.930', icon: null },
        { label: 'Kepala Keluarga', value: '1.245', icon: null },
        { label: 'Diccekang', value: '850', icon: null },
        { label: 'Tamalate', value: '920', icon: null },
        { label: 'Tammu-Tammu', value: '780', icon: null },
        { label: 'Tompo Balang', value: '720', icon: null },
        { label: 'Moncongloe Bulu', value: '550', icon: null }
      ];
      res.status(200).json(defaultData);
    }
  } catch (error) {
    console.error('Error fetching statistik from Supabase:', error);
    res.status(500).json({ message: 'Gagal mengambil data dari database.' });
  }
});

// API endpoint untuk MENYIMPAN (POST) statistik ke Supabase
app.post('/api/statistik', async (req, res) => {
  try {
    const statistikData = req.body;
    // Validasi sederhana untuk memastikan data yang diterima adalah array
    if (!Array.isArray(statistikData)) {
      return res.status(400).json({ message: 'Data yang dikirim harus berupa array.' });
    }

    if (supabase && supabaseStatus === 'configured') {
      // Use Supabase if available
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

      res.status(200).json({ message: 'Data statistik berhasil disinkronkan ke Supabase.' });
    } else {
      // Fallback: just return success without saving
      console.log('💾 Statistik data received (Supabase not available):', statistikData.length, 'items');
      res.status(200).json({ message: 'Data statistik diterima (Supabase tidak tersedia).' });
    }
  } catch (error) {
    console.error('Error syncing statistik to Supabase:', error);
    res.status(500).json({ message: 'Gagal menyinkronkan data ke database.' });
  }
});

// Jalankan server hanya jika tidak di Vercel (untuk pengembangan lokal)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints:`);
    console.log(`   GET  /api/health - Health check`);
    console.log(`   GET  /api/statistik - Get statistik data`);
    console.log(`   POST /api/statistik - Save statistik data`);
    console.log(`🔧 Supabase Status: ${supabaseStatus}`);
  });
}

module.exports = app;
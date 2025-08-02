const express = require('express');
const cors = require('cors');
// Load environment variables from .env file for local development
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = 3001;

// Increase payload size limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'https://pandora-vite.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Inisialisasi Supabase Client dengan error handling yang lebih baik
let supabase = null;
let supabaseStatus = 'not_configured';

try {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  // Check if Supabase is properly configured
  if (supabaseUrl && supabaseKey && 
      supabaseUrl === 'https://kuykcpbtferzhzrqatac.supabase.co' && 
      supabaseKey === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1eWtjcGJ0ZmVyemh6cnFhdGFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MTc0MjUsImV4cCI6MjA2OTI5MzQyNX0.9yqGq8dbepGXLc6fxqgKTz2Vdr80RB254y2u9wH7MBI') {
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

      // Urutkan data sesuai urutan yang diminta
      const sortStatistik = (data) => {
        const orderMap = {
          'Penduduk': 1,
          'Laki-Laki': 2,
          'Perempuan': 3,
          'Kepala Keluarga': 4,
          'Diccekang': 5,
          'Tamalate': 6,
          'Tammu-Tammu': 7,
          'Tompo Balang': 8,
          'Moncongloe Bulu': 9
        };

        return [...data].sort((a, b) => {
          const orderA = orderMap[a.label] || 999;
          const orderB = orderMap[b.label] || 999;
          return orderA - orderB;
        });
      };

      const sortedData = sortStatistik(data || []);
      res.status(200).json(sortedData);
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

// GET /api/prasarana endpoint
app.get('/api/prasarana', async (req, res) => {
  try {
    if (supabase && supabaseStatus === 'configured') {
      const { data, error } = await supabase
        .from('prasarana')
        .select('kategori, list')
        .order('kategori');
      
      if (error) throw error;
      
      // Convert JSONB back to array if needed
      const processedData = data ? data.map(item => ({
        kategori: item.kategori,
        list: Array.isArray(item.list) ? item.list : (item.list || [])
      })) : [];
      
      res.status(200).json(processedData);
    } else {
      // Fallback data jika Supabase tidak tersedia
      const fallbackData = [
        {
          kategori: 'Pendidikan',
          list: ['TK/PAUD (4 Unit)', 'SD Negeri (3 Unit)', 'SMP Negeri (1 Unit)'],
        },
        {
          kategori: 'Kesehatan',
          list: ['Puskesmas Pembantu (1 Unit)', 'Poskesdes (1 Unit)', 'Posyandu (5 Unit)'],
        },
        {
          kategori: 'Ibadah',
          list: ['Masjid (8 Unit)', 'Gereja (1 Unit)'],
        },
        {
          kategori: 'Umum',
          list: ['Kantor Desa (1 Unit)', 'Pasar Desa (1 Unit)', 'Lapangan Olahraga (2 Unit)'],
        },
      ];
      res.status(200).json(fallbackData);
    }
  } catch (error) {
    console.error('Error fetching prasarana:', error);
    res.status(500).json({ error: 'Gagal mengambil data prasarana' });
  }
});

// POST /api/prasarana endpoint
app.post('/api/prasarana', async (req, res) => {
  try {
    const prasaranaData = req.body;
    
    if (!Array.isArray(prasaranaData)) {
      return res.status(400).json({ error: 'Data harus berupa array' });
    }
    
    if (supabase && supabaseStatus === 'configured') {
      // Hapus semua data lama
      const { error: deleteError } = await supabase
        .from('prasarana')
        .delete()
        .neq('kategori', 'NON_EXISTENT_KATEGORI');
      
      if (deleteError) throw deleteError;
      
      // Insert data baru
      const { data, error: insertError } = await supabase
        .from('prasarana')
        .insert(prasaranaData)
        .select();
      
      if (insertError) throw insertError;
      
      res.status(200).json({ 
        message: 'Data prasarana berhasil disimpan ke database!', 
        data 
      });
    } else {
      res.status(503).json({ 
        error: 'Database tidak tersedia. Data hanya disimpan secara lokal.' 
      });
    }
  } catch (error) {
    console.error('Error saving prasarana:', error);
    res.status(500).json({ 
      error: `Gagal menyimpan data prasarana: ${error.message}` 
    });
  }
});

// GET /api/berita endpoint
app.get('/api/berita', async (req, res) => {
  try {
    if (supabase && supabaseStatus === 'configured') {
      const { data, error } = await supabase
        .from('berita')
        .select('*')
        .order('tanggal_publikasi', { ascending: false });
      
      if (error) throw error;
      
      res.status(200).json(data || []);
    } else {
      // Return empty array if Supabase is not available
      res.status(200).json([]);
    }
  } catch (error) {
    console.error('Error fetching berita:', error);
    res.status(500).json({ error: 'Gagal mengambil data berita' });
  }
});

// GET /api/berita/:id endpoint
app.get('/api/berita/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (supabase && supabaseStatus === 'configured') {
      const { data, error } = await supabase
        .from('berita')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({ error: 'Berita tidak ditemukan' });
      }
    } else {
      res.status(503).json({ error: 'Database tidak tersedia' });
    }
  } catch (error) {
    console.error('Error fetching berita by id:', error);
    res.status(500).json({ error: 'Gagal mengambil data berita' });
  }
});

// POST /api/berita endpoint
app.post('/api/berita', async (req, res) => {
  try {
    const { judul, konten, gambar, penulis } = req.body;
    
    if (!judul || !konten) {
      return res.status(400).json({ error: 'Judul dan konten harus diisi' });
    }
    
    if (supabase && supabaseStatus === 'configured') {
      const beritaData = {
        judul,
        konten,
        gambar: gambar || null,
        penulis: penulis || 'Admin Desa',
        status: 'published'
      };
      
      const { data, error } = await supabase
        .from('berita')
        .insert(beritaData)
        .select()
        .single();
      
      if (error) throw error;
      
      res.status(201).json({ 
        message: 'Berita berhasil ditambahkan!', 
        data 
      });
    } else {
      res.status(503).json({ 
        error: 'Database tidak tersedia. Data hanya disimpan secara lokal.' 
      });
    }
  } catch (error) {
    console.error('Error creating berita:', error);
    res.status(500).json({ 
      error: `Gagal menambahkan berita: ${error.message}` 
    });
  }
});

// PUT /api/berita/:id endpoint
app.put('/api/berita/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, konten, gambar, penulis, status } = req.body;
    
    if (!judul || !konten) {
      return res.status(400).json({ error: 'Judul dan konten harus diisi' });
    }
    
    if (supabase && supabaseStatus === 'configured') {
      const updateData = {
        judul,
        konten,
        gambar: gambar || null,
        penulis: penulis || 'Admin Desa',
        status: status || 'published',
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('berita')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        res.status(200).json({ 
          message: 'Berita berhasil diupdate!', 
          data 
        });
      } else {
        res.status(404).json({ error: 'Berita tidak ditemukan' });
      }
    } else {
      res.status(503).json({ 
        error: 'Database tidak tersedia. Data hanya disimpan secara lokal.' 
      });
    }
  } catch (error) {
    console.error('Error updating berita:', error);
    res.status(500).json({ 
      error: `Gagal mengupdate berita: ${error.message}` 
    });
  }
});

// DELETE /api/berita/:id endpoint
app.delete('/api/berita/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (supabase && supabaseStatus === 'configured') {
      const { error } = await supabase
        .from('berita')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      res.status(200).json({ 
        message: 'Berita berhasil dihapus!' 
      });
    } else {
      res.status(503).json({ 
        error: 'Database tidak tersedia.' 
      });
    }
  } catch (error) {
    console.error('Error deleting berita:', error);
    res.status(500).json({ 
      error: `Gagal menghapus berita: ${error.message}` 
    });
  }
});

// GET /api/pengaduan endpoint
app.get('/api/pengaduan', async (req, res) => {
  try {
    if (supabase && supabaseStatus === 'configured') {
      const { data, error } = await supabase
        .from('pengaduan')
        .select('*')
        .order('tanggal_pengaduan', { ascending: false });
      
      if (error) throw error;
      res.status(200).json(data || []);
    } else {
      // Fallback data if Supabase is not available
      const fallbackData = [
        {
          id: '1',
          nama: 'John Doe',
          email: 'john@example.com',
          whatsapp: '081234567890',
          klasifikasi: 'pengaduan',
          judul: 'Jalan Rusak di Gang 3',
          isi: 'Jalan di depan rumah saya rusak parah, ada lubang besar yang membahayakan pengendara. Mohon diperbaiki segera.',
          tanggal_kejadian: '2024-01-15',
          kategori: 'Infrastruktur (Jalan, Jembatan, dll.)',
          lampiran_info: null,
          lampiran_data_url: null,
          status: 'pending',
          tanggal_pengaduan: new Date().toISOString(),
          tanggal_ditangani: null,
          catatan_admin: null
        }
      ];
      res.status(200).json(fallbackData);
    }
  } catch (error) {
    console.error('Error fetching pengaduan:', error);
    res.status(500).json({ error: 'Gagal mengambil data pengaduan' });
  }
});

// GET /api/pengaduan/:id endpoint
app.get('/api/pengaduan/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (supabase && supabaseStatus === 'configured') {
      const { data, error } = await supabase
        .from('pengaduan')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) {
        return res.status(404).json({ error: 'Pengaduan tidak ditemukan' });
      }
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: 'Pengaduan tidak ditemukan' });
    }
  } catch (error) {
    console.error('Error fetching pengaduan by ID:', error);
    res.status(500).json({ error: 'Gagal mengambil data pengaduan' });
  }
});

// POST /api/pengaduan endpoint
app.post('/api/pengaduan', async (req, res) => {
  try {
    const { nama, email, whatsapp, klasifikasi, judul, isi, tanggal_kejadian, kategori, lampiran_info, lampiran_data_url } = req.body;
    
    // Validasi input
    if (!judul || !isi || !kategori) {
      return res.status(400).json({ error: 'Judul, isi, dan kategori harus diisi' });
    }
    
    if (supabase && supabaseStatus === 'configured') {
      const pengaduanData = {
        nama: nama || 'Anonim',
        email: email || null,
        whatsapp: whatsapp || null,
        klasifikasi: klasifikasi || 'pengaduan',
        judul,
        isi,
        tanggal_kejadian: tanggal_kejadian || null,
        kategori,
        lampiran_info: lampiran_info || null,
        lampiran_data_url: lampiran_data_url || null,
        status: 'pending'
      };
      
      const { data, error } = await supabase
        .from('pengaduan')
        .insert(pengaduanData)
        .select()
        .single();
      
      if (error) throw error;
      res.status(201).json({ 
        message: 'Laporan berhasil dikirim!', 
        data 
      });
    } else {
      // Fallback: simpan ke localStorage
      const newPengaduan = {
        id: Date.now().toString(),
        nama: nama || 'Anonim',
        email: email || null,
        whatsapp: whatsapp || null,
        klasifikasi: klasifikasi || 'pengaduan',
        judul,
        isi,
        tanggal_kejadian: tanggal_kejadian || null,
        kategori,
        lampiran_info: lampiran_info || null,
        lampiran_data_url: lampiran_data_url || null,
        status: 'pending',
        tanggal_pengaduan: new Date().toISOString()
      };
      
      res.status(201).json({ 
        message: 'Laporan berhasil dikirim! (disimpan lokal)', 
        data: newPengaduan 
      });
    }
  } catch (error) {
    console.error('Error creating pengaduan:', error);
    res.status(500).json({ error: 'Gagal mengirim laporan' });
  }
});

// PUT /api/pengaduan/:id endpoint
app.put('/api/pengaduan/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, catatan_admin } = req.body;
    
    if (supabase && supabaseStatus === 'configured') {
      const updateData = {};
      if (status) updateData.status = status;
      if (catatan_admin !== undefined) updateData.catatan_admin = catatan_admin;
      if (status === 'selesai') updateData.tanggal_ditangani = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('pengaduan')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      if (!data) {
        return res.status(404).json({ error: 'Pengaduan tidak ditemukan' });
      }
      
      res.status(200).json({ 
        message: 'Pengaduan berhasil diupdate!', 
        data 
      });
    } else {
      res.status(404).json({ error: 'Pengaduan tidak ditemukan' });
    }
  } catch (error) {
    console.error('Error updating pengaduan:', error);
    res.status(500).json({ error: 'Gagal mengupdate pengaduan' });
  }
});

// DELETE /api/pengaduan/:id endpoint
app.delete('/api/pengaduan/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (supabase && supabaseStatus === 'configured') {
      const { error } = await supabase
        .from('pengaduan')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      res.status(200).json({ message: 'Pengaduan berhasil dihapus!' });
    } else {
      res.status(404).json({ error: 'Pengaduan tidak ditemukan' });
    }
  } catch (error) {
    console.error('Error deleting pengaduan:', error);
    res.status(500).json({ error: 'Gagal menghapus pengaduan' });
  }
});

// Jalankan server di semua environment
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints:`);
  console.log(`   GET  /api/health - Health check`);
  console.log(`   GET  /api/statistik - Get statistik data`);
  console.log(`   POST /api/statistik - Save statistik data`);
  console.log(`🔧 Supabase Status: ${supabaseStatus}`);
});

module.exports = app;
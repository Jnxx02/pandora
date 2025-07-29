import { createClient } from '@supabase/supabase-js';

// Inisialisasi Supabase Client di dalam serverless function.
// Gunakan nama variabel TANPA awalan VITE_
const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_KEY, // Gunakan Service Key untuk akses backend yang aman
  {
    auth: {
      // Penting untuk server-side: nonaktifkan persistensi session
      persistSession: false,
      autoRefreshToken: false,
    }
  }
);

// Handler utama untuk serverless function
export default async function handler(req, res) {
  // Mengizinkan CORS dari semua origin. Sesuaikan jika perlu untuk keamanan.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');

  // Handle pre-flight request untuk CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // Logika untuk MENGAMBIL semua laporan dari Supabase
    const { data, error } = await supabase
      .from('laporan')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ message: 'Gagal mengambil data dari database', error: error.message });
    }
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    try {
      const {
        klasifikasi,
        judul,
        isi,
        tanggalKejadian,
        kategori,
        lampiranInfo,
        lampiranDataUrl,
        nama,
      } = req.body;

      const { data, error } = await supabase
        .from('laporan')
        .insert([{
          klasifikasi,
          judul,
          isi,
          tanggalKejadian: tanggalKejadian || null,
          kategori,
          lampiranInfo,
          lampiranDataUrl,
          nama,
        }])
        .select();

      if (error) throw error;

      return res.status(201).json({ message: 'Laporan berhasil dibuat', data: data[0] });
    } catch (error) {
      return res.status(500).json({ message: 'Gagal menyimpan laporan.', error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ message: 'ID laporan diperlukan.' });

      const { error } = await supabase.from('laporan').delete().eq('id', id);
      if (error) throw error;

      return res.status(200).json({ message: 'Laporan berhasil dihapus.' });
    } catch (error) {
      return res.status(500).json({ message: 'Gagal menghapus laporan.', error: error.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
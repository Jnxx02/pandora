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

  // Method lain (seperti POST dan DELETE) akan ditambahkan di langkah berikutnya
  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
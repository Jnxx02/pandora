import { createClient } from '@supabase/supabase-js';

// Inisialisasi Supabase Client
// Pastikan Anda sudah mengatur Environment Variables ini di Vercel
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY, // Gunakan Service Key untuk akses backend
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  }
);

// Handler utama untuk serverless function
export default async function handler(req, res) {
  // Mengizinkan CORS dari semua origin.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');

  // Handle pre-flight request untuk CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('statistik')
        .select('icon, label, value');

      if (error) throw error;

      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: 'Gagal mengambil data statistik.', error: error.message });
    }
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
// File ini akan menjadi pusat untuk semua panggilan API ke backend Anda.

// 1. Tentukan base URL API secara dinamis.
//    - `import.meta.env.PROD` adalah variabel dari Vite yang bernilai `true` saat build untuk production.
//    - Saat production, base URL-nya kosong, sehingga fetch akan menggunakan path relatif (e.g., /api/statistik).
//    - Saat development, ia akan menggunakan URL dari file .env Anda.
const API_BASE_URL = import.meta.env.PROD ? '' : import.meta.env.VITE_API_URL;

export async function getStatistik() {
  const response = await fetch(`${API_BASE_URL}/api/statistik`);
  if (!response.ok) {
    // Coba baca pesan error dari server jika ada
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Gagal mengambil data statistik dari server.');
  }
  return response.json();
}

export async function saveStatistik(data) {
  const response = await fetch(`${API_BASE_URL}/api/statistik`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Gagal menyimpan data statistik ke server.');
  }
  return response.json();
}

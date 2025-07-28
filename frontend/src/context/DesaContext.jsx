import React, { createContext, useContext, useState } from 'react';

const DesaContext = createContext();

const initialBerita = [
  {
    id: 1,
    judul: 'Pembangunan Jalan Baru di Dusun 1',
    gambar: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    tanggal: '10 Juli 2024',
    ringkasan: 'Pemerintah desa memulai pembangunan jalan baru untuk meningkatkan aksesibilitas warga.'
  },
  {
    id: 2,
    judul: 'Vaksinasi Gratis untuk Warga',
    gambar: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
    tanggal: '5 Juli 2024',
    ringkasan: 'Program vaksinasi gratis diadakan di balai desa untuk seluruh warga.'
  },
  {
    id: 3,
    judul: 'Pelatihan UMKM Digital',
    gambar: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
    tanggal: '1 Juli 2024',
    ringkasan: 'Pelatihan UMKM digital untuk meningkatkan ekonomi kreatif desa.'
  },
];

const initialProfil = {
  nama: 'Desa Moncongloe Bulu',
  kecamatan: 'Moncongloe',
  kabupaten: 'Maros',
  deskripsi: 'Desa Moncongloe Bulu adalah salah satu desa strategis di Kabupaten Maros, berbatasan langsung dengan Kota Makassar dan desa-desa lain di Kecamatan Moncongloe. Luas wilayah sekitar 6,58 km², terdiri dari 3 dusun, dan menjadi pusat berbagai aktivitas masyarakat serta pelayanan publik berbasis digital.'
};

export function DesaProvider({ children }) {
  const [berita, setBerita] = useState(initialBerita);
  const [profil, setProfil] = useState(initialProfil);

  // Berita CRUD
  const addBerita = (data) => setBerita(prev => [{ ...data, id: Date.now() }, ...prev]);
  const editBerita = (id, data) => setBerita(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
  const deleteBerita = (id) => setBerita(prev => prev.filter(b => b.id !== id));

  // Profil update
  const updateProfil = (data) => setProfil(prev => ({ ...prev, ...data }));

  return (
    <DesaContext.Provider value={{ berita, addBerita, editBerita, deleteBerita, profil, updateProfil }}>
      {children}
    </DesaContext.Provider>
  );
}

export function useDesa() {
  return useContext(DesaContext);
} 
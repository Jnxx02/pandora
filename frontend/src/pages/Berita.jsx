import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Berita = () => {
  const [berita, setBerita] = useState([]);

  useEffect(() => {
    try {
      // Ambil data langsung dari localStorage setiap kali komponen ini dimuat
      const storedBerita = localStorage.getItem('berita');
      const dataBerita = storedBerita ? JSON.parse(storedBerita) : [];
      
      // Urutkan berita dari yang terbaru, dengan fallback jika properti tanggal tidak ada
      dataBerita.sort((a, b) => {
        const dateA = new Date(a.tanggalDibuat || a.tanggalLaporan || 0);
        const dateB = new Date(b.tanggalDibuat || b.tanggalLaporan || 0);
        return dateB - dateA;
      });

      setBerita(dataBerita);
    } catch (error) {
      console.error("Gagal memuat berita dari localStorage:", error);
      setBerita([]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-4xl sm:text-5xl mb-3 inline-block">📰</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-primary">Berita Desa</h1>
          <p className="text-gray-600 mt-2 text-base">Kumpulan berita dan informasi terbaru seputar Desa Moncongloe Bulu.</p>
        </div>

        {berita.length === 0 ? (
          <div className="text-center text-gray-500 text-base py-16">Belum ada berita yang dipublikasikan.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {berita.map(b => (
              <Link to={`/berita/${b.id}`} key={b.id} className="group flex flex-col bg-accent rounded-xl p-4 shadow hover:bg-secondary hover:text-white transition text-left border-none">
                <img src={b.gambar} alt={b.judul} className="w-full h-40 object-cover rounded mb-2" />
                <div className="font-bold text-primary text-lg mb-1 group-hover:text-white transition">{b.judul}</div>
                <div className="text-xs font-bold text-secondary mb-2 bg-white/80 px-2 py-1 rounded w-fit shadow">
                  {b.tanggal ? new Date(b.tanggal).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  }) : ''}
                </div>
                <div className="text-primary text-sm mb-2 line-clamp-3 group-hover:text-white transition">{b.ringkasan}</div>
                <span className="text-sm underline text-primary group-hover:text-white mt-auto">Lihat Detail</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Berita; 
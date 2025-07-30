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
          {/* GANTI: Menggunakan warna 'text-text-secondary' */}
          <p className="text-text-secondary mt-2 text-base">Kumpulan berita dan informasi terbaru seputar Desa Moncongloe Bulu.</p>
        </div>

        {berita.length === 0 ? (
          // GANTI: Menggunakan warna 'text-text-secondary'
          <div className="text-center text-text-secondary text-base py-16">Belum ada berita yang dipublikasikan.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {berita.map(b => (
              // GANTI: Kartu menggunakan bg-white dengan border, dan hover ke bg-secondary
              <Link to={`/berita/${b.id}`} key={b.id} className="group flex flex-col bg-white rounded-xl p-4 shadow hover:bg-secondary transition text-left border border-neutral hover:border-secondary">
                <img src={b.gambar} alt={b.judul} className="w-full h-40 object-cover rounded-lg mb-4" />
                {/* GANTI: Judul menggunakan warna secondary */}
                <div className="font-bold text-secondary text-lg mb-2 group-hover:text-white transition">{b.judul}</div>
                {/* GANTI: Tanggal menggunakan warna primary dengan background neutral */}
                <div className="text-xs font-bold text-primary mb-3 bg-neutral px-2 py-1 rounded-full w-fit">
                  {b.tanggal ? new Date(b.tanggal).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  }) : ''}
                </div>
                {/* GANTI: Ringkasan menggunakan warna 'text-text-secondary' */}
                <div className="text-text-secondary text-sm mb-4 line-clamp-3 group-hover:text-white/90 transition">{b.ringkasan}</div>
                {/* GANTI: Link detail menggunakan warna primary */}
                <span className="text-sm font-semibold underline text-primary group-hover:text-white mt-auto">Lihat Detail</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Berita;
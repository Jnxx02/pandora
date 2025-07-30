import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [totalBerita, setTotalBerita] = useState(0);
  const [totalLaporan, setTotalLaporan] = useState(0);

  useEffect(() => {
    try {
      const storedBerita = localStorage.getItem('berita');
      setTotalBerita(storedBerita ? JSON.parse(storedBerita).length : 0);
      const storedLaporan = localStorage.getItem('pengaduan');
      setTotalLaporan(storedLaporan ? JSON.parse(storedLaporan).length : 0);
    } catch (error) {
      console.error("Gagal memuat data dari localStorage:", error);
    }
  }, []);

  return (
    // GANTI: Latar belakang diubah menjadi 'bg-neutral' yang bersih untuk area admin
    <div className="min-h-screen bg-neutral flex flex-col items-center py-10 px-2 sm:px-4 relative">
      <div className="w-full max-w-3xl flex flex-col gap-10 items-center">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 mb-4">
          <span className="text-4xl sm:text-5xl">🛡️</span>
          {/* GANTI: Warna judul utama diubah ke secondary agar lebih tegas */}
          <h1 className="text-3xl font-extrabold text-secondary text-center tracking-tight mb-1">Dashboard Admin</h1>
          {/* GANTI: Warna subjudul diubah ke text-secondary */}
          <p className="text-text-secondary text-center text-base">Kelola konten website desa dengan mudah dan cepat</p>
        </div>

        {/* Stats */}
        <section className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* GANTI: Kartu statistik dengan border neutral */}
          <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-lg border border-neutral">
            <span className="text-3xl">📰</span>
            <div>
              <div className="text-primary font-bold text-lg">{totalBerita}</div>
              <div className="text-text-secondary text-sm">Total Berita</div>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-lg border border-neutral">
            <span className="text-3xl">📢</span>
            <div>
              <div className="text-primary font-bold text-lg">{totalLaporan}</div>
              <div className="text-text-secondary text-sm">Total Laporan</div>
            </div>
          </div>
        </section>

        {/* Links */}
        <section className="w-full grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {/* GANTI: Menyeragamkan tombol-tombol utama */}
          <Link to="/admin/tambah-edit-berita" className="bg-primary text-white p-4 rounded-xl shadow-lg hover:bg-secondary transition flex items-center justify-center gap-2 text-center font-semibold">
            <span>➕</span> Kelola Berita
          </Link>
          <Link to="/admin/laporan-pengaduan" className="bg-primary text-white p-4 rounded-xl shadow-lg hover:bg-secondary transition flex items-center justify-center gap-2 text-center font-semibold">
            <span>📢</span> Laporan
          </Link>
          <Link to="/admin/edit-statistik" className="bg-primary text-white p-4 rounded-xl shadow-lg hover:bg-secondary transition flex items-center justify-center gap-2 text-center font-semibold">
            <span>📊</span> Edit Statistik
          </Link>
          <Link to="/admin/edit-prasarana" className="bg-primary text-white p-4 rounded-xl shadow-lg hover:bg-secondary transition flex items-center justify-center gap-2 text-center font-semibold">
            <span>🏛️</span> Edit Prasarana
          </Link>
          {/* GANTI: Menyeragamkan tombol-tombol sekunder */}
          <Link to="/" className="bg-white text-primary p-4 rounded-xl shadow-lg hover:bg-background transition flex items-center justify-center gap-2 text-center font-semibold border border-neutral">
            <span>🏠</span> Lihat Website
          </Link>
          <Link to="/profil" className="bg-white text-primary p-4 rounded-xl shadow-lg hover:bg-background transition flex items-center justify-center gap-2 text-center font-semibold border border-neutral">
            <span>👤</span> Profil Desa
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
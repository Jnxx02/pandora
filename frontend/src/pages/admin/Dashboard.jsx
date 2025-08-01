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
          <svg className="w-16 h-16 sm:w-20 sm:h-20 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
          {/* GANTI: Warna judul utama diubah ke secondary agar lebih tegas */}
          <h1 className="text-3xl font-extrabold text-secondary text-center tracking-tight mb-1">Dashboard Admin</h1>
          {/* GANTI: Warna subjudul diubah ke text-secondary */}
          <p className="text-text-secondary text-center text-base">Kelola konten website desa dengan mudah dan cepat</p>
        </div>

        {/* Stats */}
        <section className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* GANTI: Kartu statistik dengan border neutral */}
          <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-lg border border-neutral">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
            </svg>
            <div>
              <div className="text-primary font-bold text-lg">{totalBerita}</div>
              <div className="text-text-secondary text-sm">Total Berita</div>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-lg border border-neutral">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4a2 2 0 00-1.81 1.81V19a2 2 0 002 2h12a2 2 0 002-2V5.81A2 2 0 0019.81 4H4.19zM16 2v4M8 2v4M3 10h18"></path>
            </svg>
            <div>
              <div className="text-primary font-bold text-lg">{totalLaporan}</div>
              <div className="text-text-secondary text-sm">Total Laporan</div>
            </div>
          </div>
        </section>

        {/* Links */}
        <section className="w-full grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {/* GANTI: Menyeragamkan tombol-tombol utama */}
          <Link to="/admin/berita" className="bg-primary text-white p-4 rounded-xl shadow-lg hover:bg-secondary transition flex items-center justify-center gap-2 text-center font-semibold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Kelola Berita
          </Link>
          <Link to="/admin/pengaduan" className="bg-primary text-white p-4 rounded-xl shadow-lg hover:bg-secondary transition flex items-center justify-center gap-2 text-center font-semibold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Laporan
          </Link>
          <Link to="/admin/statistik" className="bg-primary text-white p-4 rounded-xl shadow-lg hover:bg-secondary transition flex items-center justify-center gap-2 text-center font-semibold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            Edit Statistik
          </Link>
          <Link to="/admin/prasarana" className="bg-primary text-white p-4 rounded-xl shadow-lg hover:bg-secondary transition flex items-center justify-center gap-2 text-center font-semibold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            Edit Prasarana
          </Link>
          {/* GANTI: Menyeragamkan tombol-tombol sekunder */}
          <Link to="/" className="bg-white text-primary p-4 rounded-xl shadow-lg hover:bg-background transition flex items-center justify-center gap-2 text-center font-semibold border border-neutral">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Lihat Website
          </Link>
          <Link to="/profil" className="bg-white text-primary p-4 rounded-xl shadow-lg hover:bg-background transition flex items-center justify-center gap-2 text-center font-semibold border border-neutral">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            Profil Desa
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
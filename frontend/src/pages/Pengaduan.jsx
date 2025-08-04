import React from 'react';
import { Link } from 'react-router-dom';

// Komponen banner dengan slogan dan layout yang diperbaiki
const SuarakuBanner = () => (
  <div className="w-full bg-primary text-white p-4 shadow-lg sticky top-0 z-10">
    <div className="relative max-w-7xl mx-auto flex items-center justify-between h-16">
      {/* Logo SUARAKU di kiri */}
      <div className="flex items-center">
        <img 
          src="/images/logos/suaraku.png" 
          alt="Logo SUARAKU" 
          className="h-80 object-contain" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = 'none';
            // Fallback ke teks jika gambar tidak ada
            e.target.nextSibling.style.display = 'block';
          }}
        />
        <h1 className="text-xl font-bold" style={{display: 'none'}}>Suaraku</h1>
      </div>

      {/* Slogan di kanan */}
      <div className="flex items-center">
        <span className="text-sm font-bold text-white hover:text-yellow-300 transition-colors duration-300 cursor-default">
          #DariWargaUntukDesa
        </span>
      </div>
    </div>
  </div>
);

const Pengaduan = () => {
  // Get current year for dynamic copyright
  const currentYear = new Date().getFullYear();

  return (
    // GANTI: Latar belakang utama menggunakan 'bg-neutral'
    <div className="min-h-screen bg-neutral">
      <SuarakuBanner />

      <main className="py-6 px-4 sm:px-6">
        {/* Container untuk layout side-by-side */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* Penjelasan dan Regulasi Section - SEBELAH KIRI */}
          <section className="p-4">
            <h2 className="text-2xl font-bold text-primary mb-3">Penjelasan dan Regulasi</h2>
            {/* GANTI: Menggunakan warna 'text-text-secondary' */}
            <p className="text-text-secondary mb-6">
              Setiap warga berhak menyampaikan saran, keluhan, atau pendapat terhadap pelayanan publik. Hak ini dijamin oleh UU No. 25 Tahun 2009 tentang Pelayanan Publik dan UU No. 6 Tahun 2014 tentang Desa, yang menegaskan bahwa aspirasi masyarakat harus difasilitasi.
              Didukung oleh Permendagri No. 3 Tahun 2007 dan sistem nasional SP4N-LAPOR!, pemerintah desa wajib membuka saluran pengaduan yang mudah diakses.
              Melalui program “Suaraku Desa”, warga Desa Moncongloe Bulu kini bisa menyampaikan aspirasi secara mudah, cepat, dan terdokumentasi melalui formulir digital berbasis QR code.
            </p>

          </section>

          {/* Poster Section - SEBELAH KANAN */}
          <section className="p-4">
          
            {/* GANTI: Latar placeholder menggunakan 'bg-neutral' */}
            <div className="flex items-center justify-center overflow-hidden">
                              <img
                  src="/images/posters/PHOTO-2025-07-31-20-17-09.jpg"
                  alt="Poster Alur Layanan Pengaduan"
                  className="w-full h-auto max-h-[600px] object-contain rounded-lg"
                />
            </div>
          </section>
          
        </div>
      </div>
    </main>

    {/* Floating Action Buttons */}
    {/* Tombol kembali - Floating di kiri */}
    <Link
      to="/"
      className="fixed bottom-6 left-6 bg-white text-primary px-4 py-3 rounded-full shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-transform transform hover:scale-105 flex items-center gap-2"
      aria-label="Kembali ke Beranda"
    >
      <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
      </svg>
      <span className="font-semibold hidden sm:inline">Kembali</span>
    </Link>

    {/* Tombol buat laporan - Floating di kanan */}
    <Link
      to="/pengaduan/formulir"
      className="fixed bottom-6 right-6 bg-primary text-white px-5 py-3 rounded-full shadow-lg hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-transform transform hover:scale-105 flex items-center gap-3"
      aria-label="Buat Pengaduan Baru"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
      </svg>
      <span className="font-semibold hidden sm:inline">Buat Laporan</span>
      <span className="font-semibold sm:hidden">Lapor</span>
    </Link>

    {/* Copyright Footer */}
    <footer className="bg-neutral border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
        <div className="text-center">
          <p className="text-text-secondary text-sm">
            © {currentYear} Desa Moncongloe Bulu. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
  );
};

export default Pengaduan;
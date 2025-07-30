import React from 'react';
import { Link } from 'react-router-dom';

// Komponen banner tidak perlu diubah karena sudah menggunakan warna primary.
const SuarakuBanner = () => (
  <div className="w-full bg-primary text-white p-4 shadow-lg sticky top-0 z-10">
    <div className="relative max-w-xl mx-auto flex items-center justify-center h-16">
      {/* Tombol kembali ke Beranda */}
      <div className="absolute inset-y-0 left-0 flex items-center">
        <Link
          to="/"
          className="p-2 rounded-full text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          aria-label="Kembali ke Beranda"
        >
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-xl font-bold">Suaraku</h1>
      </div>
    </div>
  </div>
);

const Pengaduan = () => (
  // GANTI: Latar belakang utama menggunakan 'bg-neutral'
  <div className="min-h-screen bg-neutral">
    <SuarakuBanner />

    <main className="py-12 px-4 sm:px-6">
      {/* Penjelasan dan Regulasi Section */}
      <section className="w-full max-w-xl mx-auto mb-16 text-center">
        <h2 className="text-3xl font-bold text-primary mb-4">Penjelasan dan Regulasi</h2>
        {/* GANTI: Menggunakan warna 'text-text-secondary' */}
        <p className="text-text-secondary mb-8">
          Layanan "Suaraku" adalah platform bagi masyarakat Desa Moncongloe Bulu untuk menyampaikan pengaduan, aspirasi, dan permintaan informasi secara online. Kami berkomitmen untuk memberikan respon yang cepat dan transparan.
        </p>

        <h3 className="font-semibold text-xl text-secondary mb-4">Regulasi Layanan</h3>
        {/* GANTI: Menggunakan warna 'text-text-main' */}
        <ul className="list-disc list-outside pl-5 space-y-2 max-w-md mx-auto text-left text-text-main">
          <li>Setiap pengaduan akan diverifikasi oleh admin desa.</li>
          <li>Pengaduan harus menggunakan bahasa yang sopan dan tidak mengandung unsur SARA.</li>
          <li>Identitas pelapor akan dirahasiakan (opsional saat mengisi formulir).</li>
          <li>Waktu respon maksimal adalah 3x24 jam pada hari kerja.</li>
        </ul>
      </section>

      {/* Poster Section */}
      <section className="w-full max-w-xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-neutral/50">
          <h2 className="text-3xl font-bold text-primary mb-4 text-center">Alur Pengaduan</h2>
          {/* GANTI: Latar placeholder menggunakan 'bg-neutral' */}
          <div className="bg-neutral rounded-lg flex items-center justify-center aspect-w-4 aspect-h-3">
            <img
              src="https://placehold.co/800x600/F1F1F1/C50000?text=Poster+Alur+Layanan"
              alt="Poster Alur Layanan Pengaduan"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </section>
    </main>

    {/* Floating Action Button */}
    {/* GANTI: Tombol FAB menggunakan warna 'primary' dan 'secondary' */}
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
  </div>
);

export default Pengaduan;
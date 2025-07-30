import React from 'react';
import { Link } from 'react-router-dom';

// Banner component with a back button and title "Suaraku"
const SuarakuBanner = () => (
  <div className="w-full bg-primary text-white p-4 shadow-lg">
    <div className="relative max-w-xl mx-auto flex items-center justify-center h-16">
      {/* Back Button */}
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
      {/* Title */}
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-xl font-bold">Suaraku</h1>
      </div>
    </div>
  </div>
);

const Pengaduan = () => (
  <div className="min-h-screen bg-gray-100">
    <SuarakuBanner />

    {/* Penjelasan dan Regulasi Section */}
    <section className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-100 p-6 sm:p-8">
      <div className="w-full max-w-xl text-center">
        <h2 className="text-3xl font-bold text-primary mb-4">Penjelasan dan Regulasi</h2>
        <p className="text-gray-600 mb-8">
          Layanan "Suaraku" adalah platform bagi masyarakat Desa Moncongloe Bulu untuk menyampaikan pengaduan, aspirasi, dan permintaan informasi secara online. Kami berkomitmen untuk memberikan respon yang cepat dan transparan.
        </p>

        <h3 className="font-semibold text-xl text-primary mb-4">Regulasi Layanan</h3>
        <ul className="list-disc list-outside pl-5 space-y-2 max-w-md mx-auto text-left text-gray-700">
          <li>Setiap pengaduan akan diverifikasi oleh admin desa.</li>
          <li>Pengaduan harus menggunakan bahasa yang sopan dan tidak mengandung unsur SARA.</li>
          <li>Identitas pelapor akan dirahasiakan (opsional saat mengisi formulir).</li>
          <li>Waktu respon maksimal adalah 3x24 jam pada hari kerja.</li>
        </ul>
      </div>
    </section>

    {/* Poster Section */}
    <section className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4 sm:p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <h2 className="text-3xl font-bold text-primary mb-4 text-center">Alur Pengaduan</h2>
        <div className="bg-gray-200 rounded-lg flex items-center justify-center aspect-w-4 aspect-h-3">
          <img
            src="https://via.placeholder.com/800x500.png?text=Poster+Alur+Layanan+Pengaduan"
            alt="Poster Alur Layanan Pengaduan"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>
    </section>

    {/* Floating Action Button */}
    <Link
      to="/pengaduan/formulir"
      className="fixed bottom-6 right-6 bg-accent text-primary px-5 py-3 rounded-full shadow-lg hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-transform transform hover:scale-105 flex items-center gap-3"
      aria-label="Buat Pengaduan Baru"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
      </svg>
      <span className="font-semibold">Klik disini untuk pengaduan</span>
    </Link>
  </div>
);

export default Pengaduan; 
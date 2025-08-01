import React from 'react';
import { useDesa } from '../context/DesaContext';

const Berita = () => {
  const { berita } = useDesa();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-1 sm:px-4 py-6">
      <div className="w-full max-w-3xl text-center bg-white rounded-2xl shadow p-4 sm:p-8 border border-accent">
        <svg className="w-12 h-12 sm:w-16 sm:h-16 text-primary mb-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
        </svg>
        <h1 className="text-xl sm:text-2xl font-bold mb-2 text-primary">Berita Desa</h1>
        <p className="text-secondary mb-4 sm:mb-8 text-sm sm:text-base">Kumpulan berita dan informasi terbaru seputar Desa Moncongloe Bulu akan tampil di sini.</p>
        <div className="grid gap-6 sm:grid-cols-2">
          {berita.length === 0 && <div className="col-span-2 text-accent">Belum ada berita.</div>}
          {berita.map(b => (
            <div key={b.id} className="flex flex-col items-start bg-accent rounded-xl p-4 shadow-sm">
              <img src={b.gambar} alt={b.judul} className="w-full h-32 object-cover rounded mb-2" />
              <h2 className="text-lg font-semibold text-primary mb-1 text-left">{b.judul}</h2>
              <div className="text-xs text-secondary mb-1 text-left">{b.tanggal}</div>
              <p className="text-primary mb-2 text-left text-sm">{b.ringkasan}</p>
              <a href="#" className="inline-block bg-secondary text-white px-3 py-1 rounded hover:bg-primary transition text-xs">Lihat Selengkapnya</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Berita; 
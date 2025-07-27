import React from 'react';
import { useDesa } from '../context/DesaContext';
import { Link } from 'react-router-dom';

const Berita = () => {
  const { berita } = useDesa();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-1 sm:px-4 py-6">
      <div className="w-full max-w-5xl text-center bg-accent rounded-2xl shadow p-4 sm:p-8 border border-accent">
        <span className="text-3xl sm:text-4xl mb-4 inline-block">📰</span>
        <h1 className="text-xl sm:text-2xl font-bold mb-2 text-primary">Berita Desa</h1>
        <p className="text-secondary mb-4 sm:mb-8 text-sm sm:text-base">Kumpulan berita dan informasi terbaru seputar Desa Moncongloe Bulu akan tampil di sini.</p>
        {berita.length === 0 ? (
          <div className="text-accent text-base">Belum ada berita yang dipublikasikan.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {berita.map(b => (
              <Link to={`/berita/${b.id}`} key={b.id} className="flex flex-col bg-accent rounded-xl p-4 shadow hover:bg-secondary hover:text-white transition text-left border-none">
                <img src={b.gambar} alt={b.judul} className="w-full h-40 object-cover rounded mb-2" />
                <div className="font-bold text-primary text-lg mb-1 group-hover:text-white transition">{b.judul}</div>
                <div className="text-xs font-bold text-secondary mb-2 bg-white/80 px-2 py-1 rounded w-fit shadow">{b.tanggal}</div>
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
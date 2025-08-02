import React from 'react';
import { Link } from 'react-router-dom';
import { useBerita } from '../context/BeritaContext';

const Berita = () => {
  const { berita, loading, error } = useBerita();

  if (loading) {
    return (
      <div className="min-h-screen bg-background px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <svg className="w-16 h-16 sm:w-20 sm:h-20 text-primary mb-3 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
            </svg>
            <h1 className="text-3xl sm:text-4xl font-bold text-primary">Berita Desa</h1>
            <p className="text-gray-600 mt-2 text-base">Kumpulan berita dan informasi terbaru seputar Desa Moncongloe Bulu.</p>
          </div>
          <div className="text-center text-gray-500 text-base py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            Memuat berita...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <svg className="w-16 h-16 sm:w-20 sm:h-20 text-primary mb-3 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
            </svg>
            <h1 className="text-3xl sm:text-4xl font-bold text-primary">Berita Desa</h1>
            <p className="text-gray-600 mt-2 text-base">Kumpulan berita dan informasi terbaru seputar Desa Moncongloe Bulu.</p>
          </div>
          <div className="text-center text-red-500 text-base py-16">
            Gagal memuat berita. Silakan coba lagi nanti.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <svg className="w-16 h-16 sm:w-20 sm:h-20 text-primary mb-3 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
          </svg>
          <h1 className="text-3xl sm:text-4xl font-bold text-primary">Berita Desa</h1>
          <p className="text-gray-600 mt-2 text-base">Kumpulan berita dan informasi terbaru seputar Desa Moncongloe Bulu.</p>
        </div>

        {berita.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
            </svg>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Belum Ada Berita</h3>
            <p className="text-gray-500 mb-6">Saat ini belum ada berita yang dipublikasikan. Silakan kembali lagi nanti.</p>
            <Link 
              to="/" 
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              Kembali ke Beranda
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {berita.map(b => (
              <Link to={`/berita/${b.id}`} key={b.id} className="group flex flex-col bg-secondary rounded-xl p-4 shadow hover:bg-primary hover:text-white transition text-left border-none">
                <img src={b.gambar || 'https://via.placeholder.com/400x300'} alt={b.judul} className="w-full h-40 object-cover rounded mb-2" />
                <div className="font-bold text-primary text-lg mb-1 group-hover:text-white transition">{b.judul}</div>
                <div className="text-xs font-bold text-secondary mb-2 bg-white/80 px-2 py-1 rounded w-fit shadow">
                  {b.tanggal_publikasi ? new Date(b.tanggal_publikasi).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  }) : ''}
                </div>
                <div className="text-primary text-sm mb-2 line-clamp-3 group-hover:text-white transition">
                  {b.konten ? b.konten.substring(0, 150) + (b.konten.length > 150 ? '...' : '') : ''}
                </div>
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
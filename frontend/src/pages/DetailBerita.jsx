import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBerita } from '../context/BeritaContext';

const DetailBerita = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { berita, loading } = useBerita();
  const [data, setData] = useState(null);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    if (berita && berita.length > 0) {
      const foundBerita = berita.find(b => String(b.id) === String(id));
      setData(foundBerita);
    } else {
      setData(null);
    }
  }, [id, berita]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Sembunyikan tombol saat scroll ke bawah (setelah 100px), tampilkan saat scroll ke atas
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsButtonVisible(false);
      } else {
        setIsButtonVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Tanggal tidak tersedia';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Tanggal tidak tersedia';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-primary">Memuat berita...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {data ? (
        <div className="min-h-screen bg-background py-0">
          {/* GANTI: Border menggunakan warna neutral */}
          <div className="w-full bg-white shadow-lg border-b border-neutral">
            <img 
              src={data.gambar || 'https://via.placeholder.com/800x400'} 
              alt={data.judul} 
              className="w-full h-72 sm:h-96 object-cover object-center" 
            />
          </div>
          <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8">
            <h1 className="text-3xl font-bold text-primary mb-2">{data.judul}</h1>
            <div className="flex items-center gap-4 text-sm text-secondary mb-4">
              <span>📅 {formatDate(data.tanggal_publikasi)}</span>
              <span>👤 {data.penulis || 'Admin Desa'}</span>
            </div>
            {/* GANTI: Isi berita menggunakan text-text-main untuk keterbacaan */}
            <div className="text-text-main text-justify text-base leading-relaxed whitespace-pre-line">
              {data.konten || 'Tidak ada isi berita.'}
            </div>
          </div>
        </div>
      ) : (
        <div className="py-10 min-h-screen flex flex-col items-center justify-center bg-background">
          {/* GANTI: Card menggunakan border neutral */}
          <div className="bg-white rounded-xl shadow p-6 border border-neutral text-center">
            <h1 className="text-xl font-bold text-primary mb-2">Berita Tidak Ditemukan</h1>
            <p className="text-text-secondary mb-4">Berita dengan ID tersebut tidak tersedia atau sudah dihapus.</p>
            <button
              onClick={() => navigate('/berita')}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
            >
              Kembali ke Daftar Berita
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => navigate(-1)}
        className={`fixed top-24 left-6 bg-primary text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-secondary transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 z-30 ${
          isButtonVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-24'
        }`}
        aria-label="Kembali"
      >
        <span className="text-2xl font-bold">&larr;</span>
      </button>
    </>
  );
};

export default DetailBerita;
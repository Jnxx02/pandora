import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const DetailBerita = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    try {
      const storedBerita = localStorage.getItem('berita');
      const allBerita = storedBerita ? JSON.parse(storedBerita) : [];
      const foundBerita = allBerita.find(b => String(b.id) === String(id));
      setData(foundBerita);
    } catch (error) {
      console.error("Gagal memuat detail berita dari localStorage:", error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-primary">Memuat berita...</div>;
  }

  return (
    <>
      {data ? (
        <div className="min-h-screen bg-background py-0">
          {/* GANTI: Border menggunakan warna neutral */}
          <div className="w-full bg-white shadow-lg border-b border-neutral">
            <img src={data.gambar} alt={data.judul} className="w-full h-72 sm:h-96 object-cover object-center" />
          </div>
          <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8">
            <h1 className="text-3xl font-bold text-primary mb-2">{data.judul}</h1>
            <div className="text-sm text-secondary mb-4">
              {data.tanggal ? new Date(data.tanggal).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
              }) : ''}
            </div>
            {/* GANTI: Ringkasan menggunakan text-text-secondary */}
            <div className="text-text-secondary text-lg mb-4 italic">{data.ringkasan}</div>
            {/* GANTI: Isi berita menggunakan text-text-main untuk keterbacaan */}
            <div className="text-text-main text-justify text-base leading-relaxed whitespace-pre-line">{data.isi || 'Tidak ada isi berita.'}</div>
          </div>
        </div>
      ) : (
        <div className="py-10 min-h-screen flex flex-col items-center justify-center bg-background">
          {/* GANTI: Card menggunakan border neutral */}
          <div className="bg-white rounded-xl shadow p-6 border border-neutral text-center">
            <h1 className="text-xl font-bold text-primary mb-2">Berita Tidak Ditemukan</h1>
            <p className="text-text-secondary mb-4">Berita dengan ID tersebut tidak tersedia atau sudah dihapus.</p>
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
import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDesa } from '../context/DesaContext';

const DetailBerita = () => {
  const { id } = useParams();
  const { berita } = useDesa();
  const navigate = useNavigate();
  const location = useLocation();
  const data = berita.find(b => String(b.id) === String(id));

  if (!data) {
    return (
      <div className="py-10 min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="bg-white rounded-xl shadow p-6 border border-accent text-center">
          <h1 className="text-xl font-bold text-primary mb-2">Berita Tidak Ditemukan</h1>
          <p className="text-secondary mb-4">Berita dengan ID tersebut tidak tersedia atau sudah dihapus.</p>
          <button onClick={() => navigate('/berita')} className="bg-secondary text-white px-4 py-2 rounded hover:bg-primary transition">Kembali ke Daftar Berita</button>
          <button onClick={() => navigate('/admin/dashboard')} className="bg-accent text-primary px-4 py-2 rounded hover:bg-secondary hover:text-white transition ml-2 mt-2">Kembali ke Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-0">
      <div className="w-full bg-white shadow-lg border-b border-accent">
        <img src={data.gambar} alt={data.judul} className="w-full h-72 sm:h-96 object-cover object-center" />
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8">
        <h1 className="text-3xl font-bold text-primary mb-2">{data.judul}</h1>
        <div className="text-xs text-secondary mb-4">{data.tanggal}</div>
        <div className="text-primary text-lg mb-4">{data.ringkasan}</div>
        <div className="text-primary text-justify text-base leading-relaxed whitespace-pre-line">{data.isi || 'Tidak ada isi berita.'}</div>
        <div className="flex flex-wrap gap-2 mt-8">
          <button onClick={() => navigate('/berita')} className="bg-secondary text-white px-4 py-2 rounded hover:bg-primary transition w-fit">Kembali ke Daftar Berita</button>
          <button onClick={() => navigate('/admin/dashboard')} className="bg-accent text-primary px-4 py-2 rounded hover:bg-secondary hover:text-white transition w-fit">Kembali ke Dashboard</button>
        </div>
      </div>
    </div>
  );
};

export default DetailBerita; 
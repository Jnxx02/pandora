import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [berita, setBerita] = useState([]);
  const [jumlahLaporan, setJumlahLaporan] = useState(0);

  useEffect(() => {
    try {
      // Ambil data berita
      const storedBerita = localStorage.getItem('berita');
      const dataBerita = storedBerita ? JSON.parse(storedBerita) : [];
      
      dataBerita.sort((a, b) => {
        const dateA = new Date(a.tanggalDibuat || a.tanggalLaporan || 0);
        const dateB = new Date(b.tanggalDibuat || b.tanggalLaporan || 0);
        return dateB - dateA;
      });
      setBerita(dataBerita);

      // Ambil data laporan
      const storedLaporan = localStorage.getItem('pengaduan');
      const dataLaporan = storedLaporan ? JSON.parse(storedLaporan) : [];
      setJumlahLaporan(dataLaporan.length);

    } catch (error) {
      console.error("Gagal memuat data dari localStorage:", error);
      setBerita([]);
      setJumlahLaporan(0);
    }
  }, []);

  const beritaTerbaru = berita.slice(0, 3);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent to-secondary flex flex-col items-center py-10 px-2 sm:px-4 relative">
      {/* Tombol Logout di pojok kanan atas - DIHAPUS */}
      <div className="w-full max-w-3xl flex flex-col gap-10 items-center">
        <div className="flex flex-col items-center gap-2 mb-4">
          <span className="text-4xl sm:text-5xl">🛡️</span>
          <h1 className="text-3xl font-extrabold text-primary text-center tracking-tight mb-1">Dashboard Admin</h1>
          <p className="text-secondary text-center text-base">Kelola konten website desa dengan mudah dan cepat</p>
        </div>
        {/* Statistik */}
        <section className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-lg border-none">
            <span className="text-3xl">📰</span>
            <div>
              <div className="text-primary font-bold text-lg">{berita.length}</div>
              <div className="text-secondary text-sm">Total Berita</div>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-lg border-none">
            <span className="text-3xl">📢</span>
            <div>
              <div className="text-primary font-bold text-lg">{jumlahLaporan}</div>
              <div className="text-secondary text-sm">Total Laporan</div>
            </div>
          </div>
        </section>
        {/* Daftar Berita Terbaru */}
        <section className="w-full">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🆕</span>
            <div className="text-primary font-semibold text-lg">Berita Terbaru</div>
          </div>
          {beritaTerbaru.length === 0 ? (
            <div className="text-white">Belum ada berita.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {beritaTerbaru.map(b => (
                <div key={b.id} className="group flex flex-col bg-white rounded-xl p-3 shadow-lg border-none h-full hover:bg-primary transition">
                  <img src={b.gambar} alt={b.judul} className="w-full h-28 object-cover rounded mb-2" />
                  <div className="font-bold text-primary text-base mb-1 line-clamp-1 group-hover:text-white transition">{b.judul}</div>
                  <div className="text-xs font-bold text-secondary mb-1 bg-gray-100 px-2 py-1 rounded w-fit shadow group-hover:bg-gray-200 transition">
                    {b.tanggal ? new Date(b.tanggal).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    }) : ''}
                  </div>
                  <Link to={`/berita/${b.id}`} className="text-sm text-primary hover:text-secondary underline group-hover:text-accent transition mt-auto pt-1">Lihat Detail</Link>
                </div>
              ))}
            </div>
          )}
        </section>
        {/* Menu Aksi Cepat */}
        <section className="w-full grid grid-cols-2 gap-4 mt-6">
          <Link to="/admin/tambah-edit-berita" className="bg-primary text-white p-4 rounded-xl shadow-lg hover:bg-secondary transition flex items-center justify-center gap-2 text-center font-semibold"><span>➕</span> Kelola Berita</Link>
          <Link to="/admin/laporan-pengaduan" className="bg-accent text-primary p-4 rounded-xl shadow-lg hover:bg-secondary hover:text-white transition flex items-center justify-center gap-2 text-center font-semibold"><span>📢</span> Laporan Pengaduan</Link>
          <Link to="/" className="bg-white text-primary p-4 rounded-xl shadow-lg hover:bg-gray-200 transition flex items-center justify-center gap-2 text-center font-semibold"><span>🏠</span> Lihat Website</Link>
          <Link to="/profil" className="bg-white text-primary p-4 rounded-xl shadow-lg hover:bg-gray-200 transition flex items-center justify-center gap-2 text-center font-semibold"><span>👤</span> Profil Desa</Link>
        </section>
      </div>
    </div>
  );
};

export default Dashboard; 
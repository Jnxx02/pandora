import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Komponen Modal yang akan menampilkan detail isi laporan
const DetailModal = ({ laporan, onClose }) => {
  if (!laporan) return null;

  return (
    // Backdrop / Overlay
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose} // Menutup modal saat backdrop diklik
    >
      {/* GANTI: Konten Modal dengan gaya baru */}
      <div 
        className="bg-white rounded-lg shadow-xl p-6 w-11/12 md:w-1/2 lg:w-1/3 relative animate-slide-in"
        onClick={e => e.stopPropagation()} // Mencegah modal tertutup saat kontennya diklik
      >
        <h3 className="text-xl font-bold text-secondary mb-4 border-b border-neutral pb-3">{laporan.judul}</h3>
        <p className="text-text-main whitespace-pre-wrap max-h-[60vh] overflow-y-auto">{laporan.isi}</p>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-primary transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
};


// Komponen Tabel Laporan yang sudah dimodifikasi
const LaporanTable = ({ title, data, onShowDetail, onDelete }) => (
  <div className="overflow-x-auto rounded-lg border border-neutral">
    <table className="min-w-full bg-white">
      {/* GANTI: Header tabel dengan warna neutral dan teks secondary */}
      <thead className="bg-neutral/60">
        <tr>
          <th className="py-3 px-4 border-b border-neutral text-left text-sm font-semibold text-secondary uppercase tracking-wider">ID</th>
          <th className="py-3 px-4 border-b border-neutral text-left text-sm font-semibold text-secondary uppercase tracking-wider">
            {title === 'Pengaduan' ? 'Tanggal Kejadian' : 'Tanggal'}
          </th>
          <th className="py-3 px-4 border-b border-neutral text-left text-sm font-semibold text-secondary uppercase tracking-wider">Kategori</th>
          <th className="py-3 px-4 border-b border-neutral text-left text-sm font-semibold text-secondary uppercase tracking-wider">Judul</th>
          <th className="py-3 px-4 border-b border-neutral text-center text-sm font-semibold text-secondary uppercase tracking-wider">Detail</th>
          <th className="py-3 px-4 border-b border-neutral text-left text-sm font-semibold text-secondary uppercase tracking-wider">Pelapor</th>
          <th className="py-3 px-4 border-b border-neutral text-left text-sm font-semibold text-secondary uppercase tracking-wider">Lampiran</th>
          <th className="py-3 px-4 border-b border-neutral text-center text-sm font-semibold text-secondary uppercase tracking-wider">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((laporan) => (
            // GANTI: Baris tabel dengan warna teks yang sesuai
            <tr key={laporan.id} className="hover:bg-neutral/40 transition-colors">
              <td className="py-3 px-4 border-b border-neutral text-text-secondary">{laporan.id}</td>
              <td className="py-3 px-4 border-b border-neutral text-text-main">{laporan.tanggal}</td>
              <td className="py-3 px-4 border-b border-neutral text-text-main">{laporan.kategori}</td>
              <td className="py-3 px-4 border-b border-neutral text-text-main font-semibold">{laporan.judul}</td>
              <td className="py-3 px-4 border-b border-neutral text-center">
                {/* GANTI: Tombol "Lihat" dengan gaya baru */}
                <button
                  onClick={() => onShowDetail(laporan)}
                  className="bg-white text-primary border-2 border-primary px-3 py-1 rounded-md text-sm hover:bg-primary hover:text-white transition-colors"
                >
                  Lihat
                </button>
              </td>
              <td className="py-3 px-4 border-b border-neutral text-text-main">{laporan.nama}</td>
              <td className="py-3 px-4 border-b border-neutral text-text-main">
                {laporan.lampiranDataUrl ? (
                  // GANTI: Link dengan warna primary
                  <a href={laporan.lampiranDataUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Lihat Gambar
                  </a>
                ) : (laporan.lampiranInfo || '-')}
              </td>
              <td className="py-3 px-4 border-b border-neutral text-center">
                {/* GANTI: Tombol "Hapus" dengan warna dari palet */}
                <button
                  onClick={() => onDelete(laporan.id)}
                  className="bg-primary text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-secondary transition-colors"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            {/* GANTI: Teks menggunakan warna 'text-text-secondary' */}
            <td colSpan="8" className="text-center py-4 text-text-secondary">
              Belum ada data untuk kategori ini.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);


// Komponen Utama
function LaporanPengaduan() {
  const [laporanPengaduan, setLaporanPengaduan] = useState([]);
  const [laporanAspirasi, setLaporanAspirasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pengaduan');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLaporan, setSelectedLaporan] = useState(null);

  const fetchLaporan = () => {
    setLoading(true);
    try {
      const storedLaporan = localStorage.getItem('pengaduan');
      const dataLaporan = storedLaporan ? JSON.parse(storedLaporan) : [];
      
      dataLaporan.sort((a, b) => new Date(b.tanggalLaporan) - new Date(a.tanggalLaporan));

      const pengaduan = dataLaporan
        .filter(l => l.klasifikasi === 'pengaduan')
        .map(l => ({
          ...l,
          tanggal: l.tanggalKejadian 
            ? new Date(l.tanggalKejadian).toLocaleDateString('id-ID', {
                year: 'numeric', month: 'long', day: 'numeric'
              }) 
            : '-'
        }));

      const aspirasi = dataLaporan
        .filter(l => l.klasifikasi === 'aspirasi')
        .map(l => ({
          ...l,
          tanggal: new Date(l.tanggalLaporan).toLocaleDateString('id-ID', {
            year: 'numeric', month: 'long', day: 'numeric'
          })
        }));

      setLaporanPengaduan(pengaduan);
      setLaporanAspirasi(aspirasi);
    } catch (err) {
      console.error("Error fetching from localStorage: ", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
      try {
        const storedLaporan = localStorage.getItem('pengaduan');
        let dataLaporan = storedLaporan ? JSON.parse(storedLaporan) : [];
        const updatedLaporan = dataLaporan.filter(l => l.id !== id);
        localStorage.setItem('pengaduan', JSON.stringify(updatedLaporan));
        fetchLaporan();
      } catch (err) {
        console.error("Error deleting from localStorage: ", err);
        alert('Gagal menghapus laporan.');
      }
    }
  };

  const handleShowDetail = (laporan) => {
    setSelectedLaporan(laporan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLaporan(null);
  };

  return (
    // GANTI: Latar belakang menggunakan 'bg-neutral'
    <div className="container mx-auto p-4 md:p-8 bg-neutral min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6 border-b border-neutral pb-4">
          <h1 className="text-3xl font-bold text-secondary">Laporan Warga</h1>
          {/* GANTI: Tombol kembali dengan gaya konsisten */}
          <Link to="/admin/dashboard" className="bg-white text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-background transition-colors border border-neutral flex items-center gap-2">
            <span>←</span> Kembali ke Dashboard
          </Link>
        </div>

        {/* GANTI: Navigasi Tab dengan gaya baru */}
        <div className="border-b border-neutral">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('pengaduan')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'pengaduan'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:text-secondary hover:border-secondary/50'
              }`}
            >
              Pengaduan ({laporanPengaduan.length})
            </button>
            <button
              onClick={() => setActiveTab('aspirasi')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'aspirasi'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:text-secondary hover:border-secondary/50'
              }`}
            >
              Aspirasi ({laporanAspirasi.length})
            </button>
          </nav>
        </div>

        {loading ? (
          <div className="text-center py-4 text-text-secondary">Memuat data...</div>
        ) : error ? (
          <div className="text-center py-4 text-primary">Error: {error.message}</div>
        ) : (
          <div className="mt-6">
            {activeTab === 'pengaduan' && <LaporanTable title="Pengaduan" data={laporanPengaduan} onShowDetail={handleShowDetail} onDelete={handleDelete} />}
            {activeTab === 'aspirasi' && <LaporanTable title="Aspirasi" data={laporanAspirasi} onShowDetail={handleShowDetail} onDelete={handleDelete} />}
          </div>
        )}
      </div>

      {isModalOpen && <DetailModal laporan={selectedLaporan} onClose={handleCloseModal} />}
    </div>
  );
}

export default LaporanPengaduan;
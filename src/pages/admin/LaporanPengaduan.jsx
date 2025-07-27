import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Komponen Modal yang akan menampilkan detail isi laporan
const DetailModal = ({ laporan, onClose }) => {
  if (!laporan) return null;

  return (
    // Backdrop / Overlay
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose} // Menutup modal saat backdrop diklik
    >
      {/* Konten Modal */}
      <div 
        className="bg-white rounded-lg shadow-xl p-6 w-11/12 md:w-1/2 lg:w-1/3 relative"
        onClick={e => e.stopPropagation()} // Mencegah modal tertutup saat kontennya diklik
      >
        <h3 className="text-xl font-bold text-primary mb-4">{laporan.judul}</h3>
        <p className="text-gray-700 whitespace-pre-wrap">{laporan.isi}</p>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
      </div>
    </div>
  );
};


// Komponen Tabel Laporan yang sudah dimodifikasi
const LaporanTable = ({ title, data, onShowDetail, onDelete }) => (
  <div className="mb-10">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">ID</th>
            {/* PERUBAHAN 1: Header tanggal kondisional */}
            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
              {title === 'Pengaduan' ? 'Tanggal Kejadian' : 'Tanggal'}
            </th>
            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Kategori</th>
            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Judul</th>
            {/* PERUBAHAN 2: Kolom 'Isi' diubah menjadi 'Detail' */}
            <th className="py-3 px-4 border-b text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">Detail</th>
            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Pelapor</th>
            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Lampiran</th>
            <th className="py-3 px-4 border-b text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((laporan) => (
              <tr key={laporan.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b text-gray-700">{laporan.id}</td>
                <td className="py-3 px-4 border-b text-gray-700">{laporan.tanggal}</td>
                <td className="py-3 px-4 border-b text-gray-700">{laporan.kategori}</td>
                <td className="py-3 px-4 border-b text-gray-700 font-semibold">{laporan.judul}</td>
                {/* PERUBAHAN 2: Tombol untuk menampilkan detail */}
                <td className="py-3 px-4 border-b text-gray-700 text-center">
                  <button
                    onClick={() => onShowDetail(laporan)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors"
                  >
                    Lihat
                  </button>
                </td>
                <td className="py-3 px-4 border-b text-gray-700">{laporan.nama}</td>
                <td className="py-3 px-4 border-b text-gray-700">
                  {laporan.lampiranDataUrl ? (
                    <a href={laporan.lampiranDataUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      Lihat Gambar
                    </a>
                  ) : (laporan.lampiranInfo || '-')}
                </td>
                <td className="py-3 px-4 border-b text-gray-700 text-center">
                  <button
                    onClick={() => onDelete(laporan.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-red-600 transition-colors"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center py-4 text-gray-500">
                Belum ada data untuk kategori ini.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);


// Komponen Utama
function LaporanPengaduan() {
  const [laporanPengaduan, setLaporanPengaduan] = useState([]);
  const [laporanAspirasi, setLaporanAspirasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk mengelola modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLaporan, setSelectedLaporan] = useState(null);

  const fetchLaporan = () => { /* ... (fungsi fetchLaporan tidak berubah) ... */
    setLoading(true);
    try {
      const storedLaporan = localStorage.getItem('pengaduan');
      const dataLaporan = storedLaporan ? JSON.parse(storedLaporan) : [];
      dataLaporan.sort((a, b) => new Date(b.tanggalLaporan) - new Date(a.tanggalLaporan));
      const formatLaporan = (l) => ({
        ...l,
        tanggal: new Date(l.tanggalLaporan).toLocaleDateString('id-ID', {
          year: 'numeric', month: 'long', day: 'numeric'
        })
      });
      const pengaduan = dataLaporan.filter(l => l.klasifikasi === 'Pengaduan').map(formatLaporan);
      const aspirasi = dataLaporan.filter(l => l.klasifikasi === 'Aspirasi').map(formatLaporan);
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

  const handleDelete = (id) => { /* ... (fungsi handleDelete tidak berubah) ... */
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

  // Handler untuk membuka modal
  const handleShowDetail = (laporan) => {
    setSelectedLaporan(laporan);
    setIsModalOpen(true);
  };

  // Handler untuk menutup modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLaporan(null);
  };

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-3xl font-bold text-primary">Laporan Warga</h1>
          <Link to="/admin/dashboard" className="bg-gray-200 text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors flex items-center gap-2">
            <span>←</span> Kembali ke Dashboard
          </Link>
        </div>
        
        {loading ? (
          <div className="text-center py-4 text-gray-500">Memuat data...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">Error: {error.message}</div>
        ) : (
          <>
            <LaporanTable 
              title="Pengaduan" 
              data={laporanPengaduan} 
              onShowDetail={handleShowDetail}
              onDelete={handleDelete}
            />
            
            <LaporanTable 
              title="Aspirasi" 
              data={laporanAspirasi} 
              onShowDetail={handleShowDetail}
              onDelete={handleDelete}
            />
          </>
        )}
      </div>

      {/* Render komponen modal jika isModalOpen bernilai true */}
      {isModalOpen && <DetailModal laporan={selectedLaporan} onClose={handleCloseModal} />}
    </div>
  );
}

export default LaporanPengaduan;
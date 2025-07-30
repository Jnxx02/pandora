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
const LaporanTable = ({ title, data, onShowDetail, onDelete, selectedIds, onSelectionChange }) => {
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = data.map((item) => item.id);
      onSelectionChange(new Set(allIds));
    } else {
      onSelectionChange(new Set());
    }
  };

  const handleSelectOne = (id) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(id)) {
      newSelectedIds.delete(id);
    } else {
      newSelectedIds.add(id);
    }
    onSelectionChange(newSelectedIds);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 border-b text-left">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={data.length > 0 && selectedIds.size === data.length}
                onChange={handleSelectAll}
                disabled={data.length === 0}
              />
            </th>
            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">ID</th>
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
              <tr key={laporan.id} className={`hover:bg-gray-50 ${selectedIds.has(laporan.id) ? 'bg-blue-50' : ''}`}>
                <td className="py-3 px-4 border-b">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={selectedIds.has(laporan.id)}
                    onChange={() => handleSelectOne(laporan.id)}
                  />
                </td>
                <td className="py-3 px-4 border-b text-gray-700 font-medium">{laporan.id}</td>
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
              <td colSpan="9" className="text-center py-4 text-gray-500">
                Belum ada data untuk kategori ini.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};


// Komponen Utama
function LaporanPengaduan() {
  const [laporanPengaduan, setLaporanPengaduan] = useState([]);
  const [laporanAspirasi, setLaporanAspirasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pengaduan'); // State untuk tab aktif

  // State baru untuk seleksi laporan
  const [selectedIds, setSelectedIds] = useState(new Set());

  // State untuk mengelola modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLaporan, setSelectedLaporan] = useState(null);

  const fetchLaporan = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/api/laporan');
      if (!response.ok) throw new Error('Gagal memuat data laporan');
      const dataLaporan = await response.json();
      
      // Filter untuk 'pengaduan' dan format tanggal yang benar
      const pengaduan = dataLaporan
        .filter(l => l.klasifikasi === 'pengaduan') // FIX: Menggunakan huruf kecil
        .map(l => ({
          ...l,
          // Gunakan tanggalKejadian untuk pengaduan, beri fallback jika kosong
          tanggal: l.tanggalKejadian 
            ? new Date(l.tanggalKejadian).toLocaleDateString('id-ID', {
                year: 'numeric', month: 'long', day: 'numeric'
              }) 
            : '-'
        }));

      // Filter untuk 'aspirasi' dan format tanggal laporan
      const aspirasi = dataLaporan
        .filter(l => l.klasifikasi === 'aspirasi') // FIX: Menggunakan huruf kecil
        .map(l => ({
          ...l,
          tanggal: new Date(l.tanggalLaporan).toLocaleDateString('id-ID', {
            year: 'numeric', month: 'long', day: 'numeric'
          })
        }));

      setLaporanPengaduan(pengaduan);
      setLaporanAspirasi(aspirasi);
    } catch (err) {
      console.error("Error fetching from API: ", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
      try {
        const response = await fetch(`http://localhost:3001/api/laporan/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Gagal menghapus laporan dari server.');
        }
        fetchLaporan();
        alert('Laporan berhasil dihapus.');
      } catch (err) {
        console.error("Error deleting report:", err);
        alert('Gagal menghapus laporan.');
      }
    }
  };

  // Handler untuk mengubah seleksi
  const handleSelectionChange = (newSelectedIds) => {
    setSelectedIds(newSelectedIds);
  };

  // Fungsi untuk mengunduh laporan yang dipilih sebagai file CSV
  const handleDownload = () => {
    const dataToDownload = activeTab === 'pengaduan' ? laporanPengaduan : laporanAspirasi;
    const selectedData = dataToDownload.filter((item) => selectedIds.has(item.id));

    if (selectedData.length === 0) {
      alert('Pilih setidaknya satu laporan untuk diunduh.');
      return;
    }

    const headers = ['ID', 'Klasifikasi', 'Judul', 'Isi Laporan', 'Tanggal Kejadian/Lapor', 'Kategori', 'Pelapor', 'Tanggal Laporan (ISO)'];

    const escapeCsv = (value) => {
      if (value == null) return '';
      const str = String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvRows = selectedData.map((row) => {
      return [row.id, row.klasifikasi, row.judul, row.isi, row.tanggal, row.kategori, row.nama, new Date(row.tanggalLaporan).toISOString()].map(escapeCsv).join(',');
    });

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      const timestamp = new Date().toISOString().slice(0, 10);
      link.setAttribute('href', url);
      link.setAttribute('download', `laporan-${activeTab}-${timestamp}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Reset seleksi saat tab diganti
  useEffect(() => {
    setSelectedIds(new Set());
  }, [activeTab]);

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
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Laporan Warga</h1>
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={handleDownload}
              disabled={selectedIds.size === 0}
              className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Download ({selectedIds.size})
            </button>
            <Link to="/admin/dashboard" className="bg-gray-200 text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors flex items-center gap-2">
              <span>←</span> <span className="hidden md:inline">Kembali ke Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Navigasi Tab */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('pengaduan')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pengaduan'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pengaduan ({laporanPengaduan.length})
            </button>
            <button
              onClick={() => setActiveTab('aspirasi')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'aspirasi'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Aspirasi ({laporanAspirasi.length})
            </button>
          </nav>
        </div>

        {loading ? (
          <div className="text-center py-4 text-gray-500">Memuat data...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">Error: {error.message}</div>
        ) : (
          <div className="mt-6">
            {activeTab === 'pengaduan' && <LaporanTable title="Pengaduan" data={laporanPengaduan} onShowDetail={handleShowDetail} onDelete={handleDelete} selectedIds={selectedIds} onSelectionChange={handleSelectionChange} />}
            {activeTab === 'aspirasi' && <LaporanTable title="Aspirasi" data={laporanAspirasi} onShowDetail={handleShowDetail} onDelete={handleDelete} selectedIds={selectedIds} onSelectionChange={handleSelectionChange} />}
          </div>
        )}
      </div>

      {/* Render komponen modal jika isModalOpen bernilai true */}
      {isModalOpen && <DetailModal laporan={selectedLaporan} onClose={handleCloseModal} />}
    </div>
  );
}

export default LaporanPengaduan;
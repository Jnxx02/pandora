import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Komponen Modal yang akan menampilkan detail isi laporan
const DetailModal = ({ laporan, onClose }) => {
  if (!laporan) return null;

  return (
    // Backdrop / Overlay
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* GANTI: Konten Modal dengan gaya baru */}
      <motion.div 
        className="bg-white rounded-lg shadow-xl p-6 w-11/12 md:w-1/2 lg:w-1/3 relative"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <h3 className="text-xl font-bold text-secondary mb-4 border-b border-neutral pb-3">{laporan.judul}</h3>
        <p className="text-text-main whitespace-pre-wrap max-h-[60vh] overflow-y-auto">{laporan.isi}</p>
        <motion.button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-primary transition"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};


// Komponen Tabel Laporan yang sudah dimodifikasi
const LaporanTable = ({ title, data, onShowDetail, onDelete }) => (
  <motion.div 
    className="overflow-x-auto rounded-lg border border-neutral"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
  >
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
          data.map((laporan, index) => (
            // GANTI: Baris tabel dengan warna teks yang sesuai
            <motion.tr 
              key={laporan.id} 
              className="hover:bg-neutral/40 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <td className="py-3 px-4 border-b border-neutral text-text-secondary">{laporan.id}</td>
              <td className="py-3 px-4 border-b border-neutral text-text-main">{laporan.tanggal}</td>
              <td className="py-3 px-4 border-b border-neutral text-text-main">{laporan.kategori}</td>
              <td className="py-3 px-4 border-b border-neutral text-text-main font-semibold">{laporan.judul}</td>
              <td className="py-3 px-4 border-b border-neutral text-center">
                {/* GANTI: Tombol "Lihat" dengan gaya baru */}
                <motion.button
                  onClick={() => onShowDetail(laporan)}
                  className="bg-white text-primary border-2 border-primary px-3 py-1 rounded-md text-sm hover:bg-primary hover:text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Lihat
                </motion.button>
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
                <motion.button
                  onClick={() => onDelete(laporan.id)}
                  className="bg-primary text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-secondary transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Hapus
                </motion.button>
              </td>
            </motion.tr>
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
  </motion.div>
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

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="py-10 max-w-6xl mx-auto bg-neutral min-h-screen px-4"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <motion.div 
        className="bg-white rounded-xl shadow p-6 border border-neutral/50"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="mb-6"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-bold text-secondary">Laporan Warga</h2>
        </motion.div>

        {/* GANTI: Navigasi Tab dengan gaya baru */}
        <motion.div 
          className="border-b border-neutral"
          variants={itemVariants}
        >
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <motion.button
              onClick={() => setActiveTab('pengaduan')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'pengaduan'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:text-secondary hover:border-secondary/50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Pengaduan ({laporanPengaduan.length})
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('aspirasi')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'aspirasi'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:text-secondary hover:border-secondary/50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Aspirasi ({laporanAspirasi.length})
            </motion.button>
          </nav>
        </motion.div>

        {loading ? (
          <motion.div 
            className="text-center py-4 text-text-secondary"
            variants={itemVariants}
          >
            Memuat data...
          </motion.div>
        ) : error ? (
          <motion.div 
            className="text-center py-4 text-primary"
            variants={itemVariants}
          >
            Error: {error.message}
          </motion.div>
        ) : (
          <motion.div 
            className="mt-6"
            variants={itemVariants}
          >
            {activeTab === 'pengaduan' && <LaporanTable title="Pengaduan" data={laporanPengaduan} onShowDetail={handleShowDetail} onDelete={handleDelete} />}
            {activeTab === 'aspirasi' && <LaporanTable title="Aspirasi" data={laporanAspirasi} onShowDetail={handleShowDetail} onDelete={handleDelete} />}
          </motion.div>
        )}
      </motion.div>

      {isModalOpen && <DetailModal laporan={selectedLaporan} onClose={handleCloseModal} />}
    </motion.div>
  );
}

export default LaporanPengaduan;
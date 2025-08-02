import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePengaduan } from '../../context/PengaduanContext';
import CustomNotification from '../../components/CustomNotification';

// Komponen Modal yang akan menampilkan detail isi laporan
const DetailModal = ({ laporan, onClose }) => {
  if (!laporan) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    // Backdrop / Overlay
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Konten Modal dengan gaya baru */}
      <motion.div 
        className="bg-white rounded-lg shadow-xl p-6 w-11/12 md:w-2/3 lg:w-1/2 max-h-[80vh] overflow-y-auto relative"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <div className="flex items-center justify-between mb-4 border-b border-neutral pb-3">
          <h3 className="text-xl font-bold text-secondary">{laporan.judul}</h3>
          <motion.button
            onClick={onClose}
            className="text-text-secondary hover:text-primary transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </div>

        <div className="space-y-4">
          {/* Informasi Pelapor */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Informasi Pelapor</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Nama:</span> {laporan.nama || 'Anonim'}
              </div>
              <div>
                <span className="font-medium">Email:</span> {laporan.email || '-'}
              </div>
              <div>
                <span className="font-medium">WhatsApp:</span> {laporan.whatsapp || '-'}
              </div>
              <div>
                <span className="font-medium">Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  laporan.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  laporan.status === 'selesai' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {laporan.status === 'pending' ? 'Menunggu' : 
                   laporan.status === 'selesai' ? 'Selesai' : laporan.status}
                </span>
              </div>
            </div>
          </div>

          {/* Detail Laporan */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Detail Laporan</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Klasifikasi:</span> {laporan.klasifikasi}
              </div>
              <div>
                <span className="font-medium">Kategori:</span> {laporan.kategori}
              </div>
              <div>
                <span className="font-medium">Tanggal Kejadian:</span> {formatDate(laporan.tanggal_kejadian)}
              </div>
              <div>
                <span className="font-medium">Tanggal Pengaduan:</span> {formatDate(laporan.tanggal_pengaduan)}
              </div>
              {laporan.tanggal_ditangani && (
                <div>
                  <span className="font-medium">Tanggal Ditangani:</span> {formatDate(laporan.tanggal_ditangani)}
                </div>
              )}
            </div>
          </div>

          {/* Isi Laporan */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Isi Laporan</h4>
            <p className="text-text-main whitespace-pre-wrap">{laporan.isi}</p>
          </div>

          {/* Lampiran */}
          {laporan.lampiran_info && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Lampiran</h4>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">File:</span> {laporan.lampiran_info}
                </div>
                {laporan.lampiran_data_url && (
                  <div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          try {
                            // Coba buat blob URL untuk gambar
                            fetch(laporan.lampiran_data_url)
                              .then(response => response.blob())
                              .then(blob => {
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = laporan.lampiran_info || 'lampiran.jpg';
                                document.body.appendChild(a);
                                a.click();
                                window.URL.revokeObjectURL(url);
                                document.body.removeChild(a);
                              })
                              .catch(error => {
                                console.error('Error downloading image:', error);
                                alert('Gagal mengunduh gambar. Silakan coba lagi.');
                              });
                          } catch (error) {
                            console.error('Error with image URL:', error);
                            alert('Gambar tidak dapat diakses. Silakan hubungi admin.');
                          }
                        }}
                        className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors inline-flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Gambar
                      </button>
                      
                      <button
                        onClick={() => {
                          try {
                            // Coba tampilkan gambar dalam tab baru
                            const newWindow = window.open();
                            newWindow.document.write(`
                              <html>
                                <head>
                                  <title>Preview Lampiran</title>
                                  <style>
                                    body { margin: 0; padding: 20px; background: #f5f5f5; }
                                    img { max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                                    .container { text-align: center; }
                                    .error { color: #e53e3e; background: #fed7d7; padding: 20px; border-radius: 8px; margin: 20px 0; }
                                  </style>
                                </head>
                                <body>
                                  <div class="container">
                                    <h2>Preview Lampiran</h2>
                                    <img src="${laporan.lampiran_data_url}" alt="Lampiran" onerror="this.parentElement.innerHTML='<div class=error>Gambar tidak dapat ditampilkan. Silakan download file untuk melihatnya.</div>'"/>
                                  </div>
                                </body>
                              </html>
                            `);
                            newWindow.document.close();
                          } catch (error) {
                            console.error('Error opening image:', error);
                            alert('Gagal membuka gambar. Silakan download file untuk melihatnya.');
                          }
                        }}
                        className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600 transition-colors inline-flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Preview Gambar
                      </button>
                    </div>
                    
                    {/* Info tentang ukuran data */}
                    <div className="text-xs text-gray-500 mt-2">
                      <p>Ukuran data: {Math.round(laporan.lampiran_data_url.length / 1024)} KB</p>
                      {laporan.lampiran_data_url.length > 1000 && (
                        <p className="text-yellow-600">
                          ⚠️ Data gambar sangat besar. Gunakan tombol download untuk mengunduh file.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Catatan Admin */}
          {laporan.catatan_admin && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Catatan Admin</h4>
              <p className="text-blue-700">{laporan.catatan_admin}</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Komponen untuk menangani gambar lampiran
const ImageHandler = ({ lampiran_info, lampiran_data_url, lampiran_size, lampiran_type, lampiran_compressed }) => {
  const handleDownload = () => {
    try {
      fetch(lampiran_data_url)
        .then(response => response.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = lampiran_info || 'lampiran.jpg';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        })
        .catch(error => {
          console.error('Error downloading image:', error);
          alert('Gagal mengunduh gambar. Silakan coba lagi.');
        });
    } catch (error) {
      console.error('Error with image URL:', error);
      alert('Gambar tidak dapat diakses.');
    }
  };

  const handlePreview = () => {
    try {
      // Validasi URL gambar
      if (!lampiran_data_url || lampiran_data_url.length < 100) {
        alert('URL gambar tidak valid atau terlalu pendek');
        return;
      }

      const newWindow = window.open();
      newWindow.document.write(`
        <html>
          <head>
            <title>Preview Lampiran</title>
            <style>
              body { margin: 0; padding: 20px; background: #f5f5f5; }
              img { max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
              .container { text-align: center; }
              .error { color: #e53e3e; background: #fed7d7; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .info { background: #e6fffa; padding: 10px; border-radius: 8px; margin: 10px 0; font-size: 14px; }
              .loading { color: #3182ce; background: #ebf8ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Preview Lampiran</h2>
              <div class="info">
                <strong>File:</strong> ${lampiran_info}<br>
                <strong>Ukuran:</strong> ${lampiran_size ? Math.round(lampiran_size / 1024) : 'Unknown'} KB<br>
                <strong>Tipe:</strong> ${lampiran_type || 'Unknown'}<br>
                <strong>Status:</strong> ${lampiran_compressed ? 'Dikompresi' : 'Belum dikompresi'}<br>
                <strong>URL Length:</strong> ${lampiran_data_url.length} characters
              </div>
              <div class="loading">Memuat gambar...</div>
              <img src="${lampiran_data_url}" alt="Lampiran" 
                onload="document.querySelector('.loading').style.display='none';"
                onerror="this.parentElement.innerHTML='<div class=error>Gambar tidak dapat ditampilkan. URL mungkin terlalu panjang atau tidak valid. Silakan download file untuk melihatnya.</div>'"/>
            </div>
          </body>
        </html>
      `);
      newWindow.document.close();
    } catch (error) {
      console.error('Error opening image:', error);
      alert('Gagal membuka gambar. Silakan download file untuk melihatnya.');
    }
  };

  if (!lampiran_info) return <span className="text-xs text-gray-400">-</span>;

  const getSizeCategory = (size) => {
    if (!size) return 'Unknown';
    if (size < 1024) return 'Kecil';
    if (size < 10240) return 'Sedang';
    if (size < 102400) return 'Besar';
    return 'Sangat Besar';
  };

  const getTypeIcon = (type) => {
    if (!type) return '📄';
    if (type.includes('jpeg') || type.includes('jpg')) return '🖼️';
    if (type.includes('png')) return '🖼️';
    if (type.includes('gif')) return '🎬';
    return '📄';
  };

  return (
    <div className="flex items-center justify-center space-x-1">
      <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
      </svg>
      <div className="flex flex-col space-y-1">
        <span className="text-xs text-green-600">Ada</span>
        <div className="flex space-x-1">
          <button
            onClick={handleDownload}
            className="text-xs bg-blue-500 text-white px-1 py-0.5 rounded hover:bg-blue-600 transition-colors"
            title="Download gambar"
          >
            ⬇️
          </button>
          <button
            onClick={handlePreview}
            className="text-xs bg-green-500 text-white px-1 py-0.5 rounded hover:bg-green-600 transition-colors"
            title="Preview gambar"
          >
            👁️
          </button>
        </div>
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-center">
            <span className="mr-1">{getTypeIcon(lampiran_type)}</span>
            <span>{getSizeCategory(lampiran_size)}</span>
          </div>
          {lampiran_compressed && (
            <span className="text-green-600">✓ Kompresi</span>
          )}
        </div>
      </div>
    </div>
  );
};

// Komponen Tabel Laporan yang sudah dimodifikasi
const LaporanTable = ({ title, data, onShowDetail, onDelete, onUpdateStatus }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <motion.div 
      className="overflow-x-auto rounded-lg border border-neutral"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <table className="min-w-full bg-white">
        {/* Header tabel dengan warna neutral dan teks secondary */}
        <thead className="bg-neutral/60">
          <tr>
            <th className="py-3 px-4 border-b border-neutral text-left text-sm font-semibold text-secondary uppercase tracking-wider">ID</th>
            <th className="py-3 px-4 border-b border-neutral text-left text-sm font-semibold text-secondary uppercase tracking-wider">Tanggal</th>
            <th className="py-3 px-4 border-b border-neutral text-left text-sm font-semibold text-secondary uppercase tracking-wider">Pelapor</th>
            <th className="py-3 px-4 border-b border-neutral text-left text-sm font-semibold text-secondary uppercase tracking-wider">Judul</th>
            <th className="py-3 px-4 border-b border-neutral text-left text-sm font-semibold text-secondary uppercase tracking-wider">Kategori</th>
            <th className="py-3 px-4 border-b border-neutral text-center text-sm font-semibold text-secondary uppercase tracking-wider">Status</th>
            <th className="py-3 px-4 border-b border-neutral text-center text-sm font-semibold text-secondary uppercase tracking-wider">Lampiran</th>
            <th className="py-3 px-4 border-b border-neutral text-center text-sm font-semibold text-secondary uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((laporan, index) => (
              // Baris tabel dengan warna teks yang sesuai
              <motion.tr 
                key={laporan.id} 
                className="hover:bg-neutral/40 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <td className="py-3 px-4 border-b border-neutral text-text-secondary text-sm">{laporan.id}</td>
                <td className="py-3 px-4 border-b border-neutral text-text-main text-sm">{formatDate(laporan.tanggal_pengaduan)}</td>
                <td className="py-3 px-4 border-b border-neutral text-text-main text-sm">
                  <div>
                    <div className="font-medium">{laporan.nama || 'Anonim'}</div>
                    <div className="text-xs text-text-secondary">
                      {laporan.email && `${laporan.email}`}
                      {laporan.email && laporan.whatsapp && ' / '}
                      {laporan.whatsapp && `${laporan.whatsapp}`}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 border-b border-neutral text-text-main font-semibold text-sm max-w-xs truncate">{laporan.judul}</td>
                <td className="py-3 px-4 border-b border-neutral text-text-main text-sm">{laporan.kategori}</td>
                <td className="py-3 px-4 border-b border-neutral text-center">
                  <select
                    value={laporan.status || 'pending'}
                    onChange={(e) => onUpdateStatus(laporan.id, e.target.value)}
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${
                      laporan.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      laporan.status === 'selesai' ? 'bg-green-100 text-green-800 border-green-200' :
                      'bg-gray-100 text-gray-800 border-gray-200'
                    }`}
                  >
                    <option value="pending">Menunggu</option>
                    <option value="proses">Proses</option>
                    <option value="selesai">Selesai</option>
                  </select>
                </td>
                <td className="py-3 px-4 border-b border-neutral text-center">
                  <ImageHandler lampiran_info={laporan.lampiran_info} lampiran_data_url={laporan.lampiran_data_url} lampiran_size={laporan.lampiran_size} lampiran_type={laporan.lampiran_type} lampiran_compressed={laporan.lampiran_compressed} />
                </td>
                <td className="py-3 px-4 border-b border-neutral text-center">
                  <div className="flex items-center justify-center space-x-2">
                    {/* Tombol "Lihat" dengan gaya baru */}
                    <motion.button
                      onClick={() => onShowDetail(laporan)}
                      className="bg-white text-primary border-2 border-primary px-2 py-1 rounded-md text-xs hover:bg-primary hover:text-white transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Detail
                    </motion.button>
                    {/* Tombol "Hapus" dengan warna dari palet */}
                    <motion.button
                      onClick={() => onDelete(laporan.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold hover:bg-red-600 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Hapus
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))
          ) : (
            <tr>
              {/* Teks menggunakan warna 'text-text-secondary' */}
              <td colSpan="8" className="text-center py-8 text-text-secondary">
                <div className="flex flex-col items-center space-y-2">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>Belum ada data untuk kategori ini.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );
};

// Komponen Utama
function LaporanPengaduan() {
  const { pengaduan, loading, error, refetchPengaduan, updatePengaduan, deletePengaduan } = usePengaduan();
  const [activeTab, setActiveTab] = useState('pengaduan');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLaporan, setSelectedLaporan] = useState(null);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
  };

  // Filter data berdasarkan klasifikasi
  const laporanPengaduan = pengaduan.filter(l => l.klasifikasi === 'pengaduan');
  const laporanAspirasi = pengaduan.filter(l => l.klasifikasi === 'aspirasi');

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
      try {
        await deletePengaduan(id);
        showNotification('success', 'Laporan berhasil dihapus!');
      } catch (error) {
        console.error("Error deleting pengaduan:", error);
        showNotification('error', 'Gagal menghapus laporan.');
      }
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updatePengaduan(id, { status: newStatus });
      showNotification('success', 'Status laporan berhasil diupdate!');
    } catch (error) {
      console.error("Error updating pengaduan status:", error);
      showNotification('error', 'Gagal mengupdate status laporan.');
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
      className="py-10 max-w-7xl mx-auto bg-neutral min-h-screen px-4"
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
          <p className="text-text-secondary mt-1">Kelola dan pantau laporan pengaduan dan aspirasi warga</p>
        </motion.div>

        {/* Navigasi Tab dengan gaya baru */}
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
            className="text-center py-8 text-text-secondary"
            variants={itemVariants}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Memuat data...</span>
            </div>
          </motion.div>
        ) : error ? (
          <motion.div 
            className="text-center py-8 text-red-500"
            variants={itemVariants}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>Error: {error}</span>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="mt-6"
            variants={itemVariants}
          >
            {activeTab === 'pengaduan' && (
              <LaporanTable 
                title="Pengaduan" 
                data={laporanPengaduan} 
                onShowDetail={handleShowDetail} 
                onDelete={handleDelete}
                onUpdateStatus={handleUpdateStatus}
              />
            )}
            {activeTab === 'aspirasi' && (
              <LaporanTable 
                title="Aspirasi" 
                data={laporanAspirasi} 
                onShowDetail={handleShowDetail} 
                onDelete={handleDelete}
                onUpdateStatus={handleUpdateStatus}
              />
            )}
          </motion.div>
        )}
      </motion.div>

      {isModalOpen && <DetailModal laporan={selectedLaporan} onClose={handleCloseModal} />}
      <CustomNotification notification={notification} setNotification={setNotification} />
    </motion.div>
  );
}

export default LaporanPengaduan;
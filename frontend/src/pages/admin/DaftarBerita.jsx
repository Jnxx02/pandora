import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBerita } from '../../context/BeritaContext';
import CustomNotification from '../../components/CustomNotification';

const DaftarBerita = () => {
  const { berita, deleteBerita, loading } = useBerita();
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingBerita, setDeletingBerita] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
  };

  const handleDeleteClick = (berita) => {
    setDeletingBerita(berita);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingBerita) return;
    
    setIsDeleting(true);
    try {
      await deleteBerita(deletingBerita.id);
      showNotification('success', 'Berita berhasil dihapus!');
      setShowDeleteModal(false);
      setDeletingBerita(null);
    } catch (error) {
      console.error("Gagal menghapus berita:", error);
      showNotification('error', `Gagal menghapus berita: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingBerita(null);
  };

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
      {/* Custom Notification */}
      <CustomNotification notification={notification} setNotification={setNotification} />

      <motion.div 
        className="mb-6 flex justify-between items-center"
        variants={itemVariants}
      >
        <h2 className="text-2xl font-bold text-secondary">Daftar Berita</h2>
        <Link
          to="/admin/berita/tambah"
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors font-semibold flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Tambah Berita Baru
        </Link>
      </motion.div>

      <motion.div 
        className="bg-white rounded-xl shadow p-6 border border-neutral/50"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">Memuat berita...</p>
          </div>
        ) : berita.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
            </svg>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Belum Ada Berita</h3>
            <p className="text-gray-500 mb-6">Saat ini belum ada berita yang dipublikasikan.</p>
            <Link
              to="/admin/berita/tambah"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Tambah Berita Pertama
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {berita.map((b) => (
              <motion.div 
                key={b.id} 
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 bg-gray-50/50"
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="font-bold text-xl text-primary">{b.judul}</h4>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                        {b.status || 'published'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(b.tanggal_publikasi)}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {b.penulis || 'Admin Desa'}
                      </span>
                      {b.gambar && (
                        <span className="flex items-center gap-1 text-blue-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Ada gambar
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                      {b.konten ? b.konten.substring(0, 250) + (b.konten.length > 250 ? '...' : '') : ''}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        {b.konten ? `${b.konten.length} karakter` : '0 karakter'}
                      </div>
                      
                      <div className="flex gap-2">
                        <Link
                          to={`/admin/berita/edit/${b.id}`}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </Link>
                        <motion.button
                          onClick={() => handleDeleteClick(b)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium flex items-center gap-1"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Hapus
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingBerita && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Konfirmasi Hapus Berita</h3>
            <p className="text-gray-700 mb-6">
              Apakah Anda yakin ingin menghapus berita "{deletingBerita.judul}"?
              <br />
              Aksi ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCloseDeleteModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
                disabled={isDeleting}
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
                disabled={isDeleting}
              >
                {isDeleting ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DaftarBerita; 
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBerita } from '../../context/BeritaContext';

const TambahEditBerita = () => {
  const { berita, addBerita, updateBerita, deleteBerita, loading } = useBerita();
  const [form, setForm] = useState({ judul: '', gambar: '', konten: '', penulis: 'Admin Desa' });
  const [editId, setEditId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const navigate = useNavigate();

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 3000);
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi form
    if (!form.judul.trim()) {
      showNotification('error', 'Judul berita harus diisi!');
      return;
    }

    if (!form.konten.trim()) {
      showNotification('error', 'Konten berita harus diisi!');
      return;
    }

    if (form.konten.trim().length < 50) {
      showNotification('error', 'Konten berita minimal 50 karakter!');
      return;
    }

    if (form.judul.trim().length < 10) {
      showNotification('error', 'Judul berita minimal 10 karakter!');
      return;
    }

    setIsSaving(true);
    try {
      if (editId) {
        await updateBerita(editId, form);
        showNotification('success', 'Berita berhasil diupdate!');
      } else {
        await addBerita(form);
        showNotification('success', 'Berita berhasil dipublikasikan!');
      }
      
      setForm({ judul: '', gambar: '', konten: '', penulis: 'Admin Desa' });
      setEditId(null);
    } catch (error) {
      console.error("Gagal menyimpan berita:", error);
      showNotification('error', `Gagal menyimpan berita: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (b) => {
    setForm({ 
      judul: b.judul, 
      gambar: b.gambar || '', 
      konten: b.konten, 
      penulis: b.penulis || 'Admin Desa' 
    });
    setEditId(b.id);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus berita ini?')) return;
    
    try {
      await deleteBerita(id);
      showNotification('success', 'Berita berhasil dihapus!');
    } catch (error) {
      console.error("Gagal menghapus berita:", error);
      showNotification('error', `Gagal menghapus berita: ${error.message}`);
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
      {notification.show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
            notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            {notification.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </motion.div>
      )}

      <motion.div 
        className="mb-6"
        variants={itemVariants}
      >
        <h2 className="text-2xl font-bold text-secondary">
          {editId ? 'Edit Berita' : 'Tambah Berita Baru'}
        </h2>
      </motion.div>

      <motion.div 
        className="bg-white rounded-xl shadow p-6 border border-neutral/50"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Judul Berita <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="judul"
              value={form.judul}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral rounded bg-white text-text-main focus:ring-1 focus:ring-primary focus:border-primary transition"
              placeholder="Contoh: Pembangunan Jalan Desa Moncongloe Bulu"
              required
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL Gambar (Opsional)</label>
            <input
              type="url"
              name="gambar"
              value={form.gambar}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral rounded bg-white text-text-main focus:ring-1 focus:ring-primary focus:border-primary transition"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">Jika tidak diisi, akan menggunakan gambar default</p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Konten Berita <span className="text-red-500">*</span>
            </label>
            <textarea
              name="konten"
              value={form.konten}
              onChange={handleChange}
              rows={12}
              className="w-full px-3 py-2 border border-neutral rounded bg-white text-text-main focus:ring-1 focus:ring-primary focus:border-primary transition"
              placeholder="Tulis konten berita lengkap di sini. Anda dapat menggunakan paragraf untuk memisahkan bagian-bagian berita..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">Minimal 50 karakter. Gunakan paragraf untuk memisahkan bagian berita.</p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Penulis</label>
            <input
              type="text"
              name="penulis"
              value={form.penulis}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral rounded bg-white text-text-main focus:ring-1 focus:ring-primary focus:border-primary transition"
              placeholder="Admin Desa"
            />
            <p className="text-xs text-gray-500 mt-1">Jika tidak diisi, akan menggunakan "Admin Desa"</p>
          </motion.div>

          <motion.div 
            className="flex gap-4"
            variants={itemVariants}
          >
            <motion.button
              type="submit"
              disabled={isSaving}
              className={`px-6 py-2 rounded-md font-semibold transition ${
                isSaving
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-secondary text-white hover:bg-primary'
              }`}
              whileHover={!isSaving ? { scale: 1.02 } : {}}
              whileTap={!isSaving ? { scale: 0.98 } : {}}
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyimpan...
                </span>
              ) : (
                editId ? 'Update Berita' : 'Publikasikan Berita'
              )}
            </motion.button>

            {editId && (
              <motion.button
                type="button"
                onClick={() => {
                  setForm({ judul: '', gambar: '', konten: '', penulis: 'Admin Desa' });
                  setEditId(null);
                }}
                className="px-6 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600 transition font-semibold"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Batal Edit
              </motion.button>
            )}
          </motion.div>
        </form>
      </motion.div>

      {/* Daftar Berita */}
      <motion.div 
        className="mt-8 bg-white rounded-xl shadow p-6 border border-neutral/50"
        variants={containerVariants}
      >
        <h3 className="text-xl font-bold text-secondary mb-6">Daftar Berita</h3>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">Memuat berita...</p>
          </div>
        ) : berita.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Belum ada berita yang ditambahkan.</div>
        ) : (
          <div className="space-y-4">
            {berita.map((b) => (
              <motion.div 
                key={b.id} 
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                variants={itemVariants}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-lg text-primary">{b.judul}</h4>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {b.status || 'published'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span>
                        📅 {b.tanggal_publikasi ? new Date(b.tanggal_publikasi).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        }) : ''}
                      </span>
                      <span>
                        👤 {b.penulis || 'Admin Desa'}
                      </span>
                      {b.gambar && (
                        <span className="text-blue-600">🖼️ Ada gambar</span>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm line-clamp-3">
                      {b.konten ? b.konten.substring(0, 200) + (b.konten.length > 200 ? '...' : '') : ''}
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      {b.konten ? `${b.konten.length} karakter` : '0 karakter'}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <motion.button
                      onClick={() => handleEdit(b)}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ✏️ Edit
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(b.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      🗑️ Hapus
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default TambahEditBerita;
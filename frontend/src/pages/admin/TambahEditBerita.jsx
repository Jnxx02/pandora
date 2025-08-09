import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBerita } from '../../context/BeritaContext';
import CustomNotification from '../../components/CustomNotification';

const TambahEditBerita = () => {
  const { id } = useParams();
  const { berita, addBerita, updateBerita, loading } = useBerita();
  const [form, setForm] = useState({ judul: '', gambar: '', konten: '', penulis: 'Admin Desa' });
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const navigate = useNavigate();

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
  };

  // Load berita data if editing
  useEffect(() => {
    if (id && berita.length > 0) {
      const beritaToEdit = berita.find(b => String(b.id) === String(id));
      if (beritaToEdit) {
        setForm({ 
          judul: beritaToEdit.judul, 
          gambar: beritaToEdit.gambar || '', 
          konten: beritaToEdit.konten, 
          penulis: beritaToEdit.penulis || 'Admin Desa' 
        });
        // Set preview if there's an existing image URL
        if (beritaToEdit.gambar) {
          setImagePreview(beritaToEdit.gambar);
        }
      }
    }
  }, [id, berita]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        showNotification('error', 'Ukuran file maksimal 5MB!');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showNotification('error', 'File harus berupa gambar!');
        return;
      }
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Clear URL field if user uploads file
      setForm({ ...form, gambar: '' });
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    
    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await fetch('http://localhost:3001/api/upload-image', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const data = await response.json();
      return data.imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      showNotification('error', 'Gagal mengupload gambar!');
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setForm({ ...form, gambar: '' });
  };

  // Handle URL input change to show preview
  const handleUrlChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, gambar: value });
    if (value && !imageFile) {
      setImagePreview(value);
    } else if (!value) {
      setImagePreview('');
    }
  };

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
      let imageUrl = form.gambar;
      
      // Upload image if user selected a file
      if (imageFile) {
        imageUrl = await uploadImage();
        if (!imageUrl) {
          // If upload failed, stop the process
          setIsSaving(false);
          return;
        }
      }
      
      const formDataToSubmit = { ...form, gambar: imageUrl };
      
      if (id) {
        await updateBerita(id, formDataToSubmit);
        showNotification('success', 'Berita berhasil diupdate!');
      } else {
        await addBerita(formDataToSubmit);
        showNotification('success', 'Berita berhasil dipublikasikan!');
      }
      
      // Navigate back to list after short delay
      setTimeout(() => {
        navigate('/admin/berita');
      }, 1500);
    } catch (error) {
      console.error("Gagal menyimpan berita:", error);
      showNotification('error', `Gagal menyimpan berita: ${error.message}`);
    } finally {
      setIsSaving(false);
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
      className="py-10 max-w-4xl mx-auto bg-neutral min-h-screen px-4"
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
        <h2 className="text-2xl font-bold text-secondary">
          {id ? 'Edit Berita' : 'Tambah Berita Baru'}
        </h2>
        <Link
          to="/admin/berita"
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Daftar
        </Link>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Berita (Opsional)</label>
            
            {/* Upload File Section */}
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                  id="imageUpload"
                />
                <label htmlFor="imageUpload" className="cursor-pointer">
                  <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-primary hover:text-secondary">Upload gambar</span> atau drag & drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF hingga 5MB</p>
                </label>
              </div>
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              
              {/* OR Divider */}
              <div className="flex items-center">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-3 text-sm text-gray-500">ATAU</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>
              
              {/* URL Input */}
              <div>
                <input
                  type="url"
                  name="gambar"
                  value={form.gambar}
                  onChange={handleUrlChange}
                  disabled={!!imageFile}
                  className={`w-full px-3 py-2 border border-neutral rounded bg-white text-text-main focus:ring-1 focus:ring-primary focus:border-primary transition ${
                    imageFile ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {imageFile ? 'Hapus file yang diupload untuk menggunakan URL' : 'Masukkan URL gambar dari internet'}
                </p>
              </div>
            </div>
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
              disabled={isSaving || isUploadingImage}
              className={`px-6 py-2 rounded-md font-semibold transition ${
                (isSaving || isUploadingImage)
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-secondary text-white hover:bg-primary'
              }`}
              whileHover={!(isSaving || isUploadingImage) ? { scale: 1.02 } : {}}
              whileTap={!(isSaving || isUploadingImage) ? { scale: 0.98 } : {}}
            >
              {(isSaving || isUploadingImage) ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isUploadingImage ? 'Mengupload gambar...' : 'Menyimpan...'}
                </span>
              ) : (
                id ? 'Update Berita' : 'Publikasikan Berita'
              )}
            </motion.button>

            <Link
              to="/admin/berita"
              className="px-6 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600 transition font-semibold"
            >
              Batal
            </Link>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default TambahEditBerita;
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
  const [imageDataUrl, setImageDataUrl] = useState('');
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
      
      // Create preview and data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          // Kompresi gambar jika terlalu besar
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Resize jika terlalu besar
            let { width, height } = img;
            const maxDimension = 1200; // Lebih besar untuk berita
            
            if (width > maxDimension || height > maxDimension) {
              if (width > height) {
                height = (height * maxDimension) / width;
                width = maxDimension;
              } else {
                width = (width * maxDimension) / height;
                height = maxDimension;
              }
            }
            
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            
            // Kompresi dengan kualitas 0.8 untuk berita
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
            
            if (compressedDataUrl && compressedDataUrl.length > 100) {
              setImageDataUrl(compressedDataUrl);
              setImagePreview(compressedDataUrl);
              console.log('✅ Gambar berhasil dikompresi:', {
                originalSize: file.size,
                compressedSize: compressedDataUrl.length,
                dimensions: `${width}x${height}`
              });
            } else {
              throw new Error('Kompresi gambar gagal');
            }
          };
          
          img.onerror = () => {
            throw new Error('Gagal memuat gambar untuk kompresi');
          };
          
          img.src = e.target.result;
        } catch (error) {
          console.error('Error processing image:', error);
          showNotification('error', 'Gagal memproses gambar. Silakan coba lagi.');
          e.target.value = '';
          setImageFile(null);
          setImageDataUrl('');
          setImagePreview('');
        }
      };
      
      reader.onerror = () => {
        showNotification('error', 'Gagal membaca file. Silakan coba lagi.');
        e.target.value = '';
        setImageFile(null);
        setImageDataUrl('');
        setImagePreview('');
      };
      
      reader.readAsDataURL(file);
      
      // Clear URL field if user uploads file
      setForm({ ...form, gambar: '' });
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setImageDataUrl('');
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
      
      // Use data URL if user selected a file
      if (imageFile && imageDataUrl) {
        imageUrl = imageDataUrl;
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

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text-main">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-neutral"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {/* Header */}
      <div className="bg-primary text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {id ? 'Edit Berita' : 'Tambah Berita Baru'}
              </h1>
              <p className="text-primary-light mt-1">
                {id ? 'Edit berita yang sudah ada' : 'Publikasikan berita baru untuk warga'}
              </p>
            </div>
            <Link
              to="/admin/berita"
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali
            </Link>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.form onSubmit={handleSubmit} className="space-y-6" variants={itemVariants}>
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
              placeholder="Masukkan judul berita yang menarik dan informatif..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">Minimal 10 karakter. Buat judul yang menarik dan mudah dipahami.</p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Penulis</label>
            <input
              type="text"
              name="penulis"
              value={form.penulis}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral rounded bg-white text-text-main focus:ring-1 focus:ring-primary focus:border-primary transition"
              placeholder="Nama penulis berita"
            />
            <p className="text-xs text-gray-500 mt-1">Kosongkan untuk menggunakan default 'Admin Desa'</p>
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
                    className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              
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

          <motion.div variants={itemVariants} className="flex justify-end space-x-4">
            <Link
              to="/admin/berita"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className={`px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors flex items-center ${
                isSaving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyimpan...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {id ? 'Update Berita' : 'Publikasikan Berita'}
                </>
              )}
            </button>
          </motion.div>
        </motion.form>
      </div>

      {/* Notification */}
      <CustomNotification
        show={notification.show}
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification({ show: false, type: '', message: '' })}
      />
    </motion.div>
  );
};

export default TambahEditBerita;
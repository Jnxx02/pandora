import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStatistik } from '../../context/StatistikContext';
import { motion } from 'framer-motion';

const EditStatistik = () => {
  const [statistik, setStatistik] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const navigate = useNavigate();
  const { statistik: contextStatistik, refetchStatistik } = useStatistik();

  // Fungsi untuk menampilkan notifikasi
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 3000);
  };

  // Fungsi untuk mengurutkan statistik sesuai urutan yang diminta
  const sortStatistik = (data) => {
    const orderMap = {
      'Penduduk': 1,
      'Laki-Laki': 2,
      'Perempuan': 3,
      'Kepala Keluarga': 4,
      'Diccekang': 5,
      'Tamalate': 6,
      'Tammu-Tammu': 7,
      'Tompo Balang': 8,
      'Moncongloe Bulu': 9
    };

    return [...data].sort((a, b) => {
      const orderA = orderMap[a.label] || 999;
      const orderB = orderMap[b.label] || 999;
      return orderA - orderB;
    });
  };

  useEffect(() => {
    if (contextStatistik && contextStatistik.length > 0) {
      // Urutkan data sesuai urutan yang diminta
      const sortedStatistik = sortStatistik(contextStatistik);
      setStatistik(sortedStatistik);
    }
  }, [contextStatistik]);

  const handleChange = (index, field, value) => {
    const updatedStatistik = [...statistik];
    updatedStatistik[index] = { ...updatedStatistik[index], [field]: value };
    setStatistik(updatedStatistik);
  };

  const handleSave = async () => {
    const hasEmptyLabel = statistik.some(item => !item.label || item.label.trim() === '');
    if (hasEmptyLabel) {
      showNotification('error', 'Setiap item statistik harus memiliki "Label". Kolom label tidak boleh kosong.');
      return;
    }

    setIsSaving(true);

    try {
      // Urutkan data sebelum menyimpan
      const sortedData = sortStatistik(statistik);
      
      // Gunakan URL yang dinamis berdasarkan environment
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? 'https://pandora-vite.vercel.app/api/statistik'
        : 'http://localhost:3001/api/statistik';
      
      // POST data ke backend
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sortedData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Simpan juga ke localStorage sebagai backup
      localStorage.setItem('statistik', JSON.stringify(sortedData));
      
      // Refresh data dari context
      await refetchStatistik();

      // Tampilkan notifikasi sukses
      showNotification('success', result.message || 'Data statistik berhasil disimpan ke database!');
      
      // Navigate setelah delay singkat agar user bisa lihat notifikasi
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1500);
    } catch (error) {
      console.error("Gagal menyimpan statistik:", error);
      
      // Tampilkan notifikasi error
      showNotification('error', `Gagal menyimpan data statistik! Error: ${error.message}. Data hanya disimpan secara lokal.`);
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
      {notification.show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
            notification.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
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
        <h2 className="text-2xl font-bold text-secondary">Edit Statistik Desa</h2>
      </motion.div>

      {/* GANTI: Card utama dengan border neutral */}
      <motion.div 
        className="bg-white rounded-xl shadow p-6 border border-neutral/50"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="space-y-4"
          variants={containerVariants}
        >
          {statistik.map((item, index) => (
            // GANTI: Latar baris item menggunakan bg-neutral/50
            <motion.div 
              key={index} 
              className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start p-3 bg-neutral/50 rounded-lg"
              variants={itemVariants}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* GANTI: Input field dengan gaya yang diseragamkan */}
              <input
                type="text"
                placeholder="Label (e.g., Penduduk)"
                value={item.label}
                onChange={(e) => handleChange(index, 'label', e.target.value)}
                className="w-full px-3 py-2 border border-neutral rounded bg-white text-text-main focus:ring-1 focus:ring-primary focus:border-primary transition"
              />
              <input
                type="text"
                placeholder="Value (e.g., 6.564)"
                value={item.value}
                onChange={(e) => handleChange(index, 'value', e.target.value)}
                className="w-full px-3 py-2 border border-neutral rounded bg-white text-text-main focus:ring-1 focus:ring-primary focus:border-primary transition"
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mt-6 flex flex-col md:flex-row gap-4"
          variants={itemVariants}
        >
          {/* GANTI: Tombol simpan dengan loading state */}
          <motion.button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-6 py-2 rounded-md w-full md:w-auto font-semibold transition ${
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
              'Simpan Perubahan'
            )}
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default EditStatistik;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStatistik } from '../../context/StatistikContext';
import { motion } from 'framer-motion';
import CustomNotification from '../../components/CustomNotification';

const EditStatistik = () => {
  const [statistik, setStatistik] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const navigate = useNavigate();
  const { statistik: contextStatistik, refetchStatistik } = useStatistik();

  // Fungsi untuk menampilkan notifikasi
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
  };

  // Fungsi untuk mengurutkan statistik yang lebih fleksibel
  const sortStatistikFlexible = (data) => {
    // Jika ada label yang tidak ada di orderMap, tambahkan ke akhir
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
      const sortedStatistik = sortStatistikFlexible(contextStatistik);
      setStatistik(sortedStatistik);
    }
  }, [contextStatistik]);

  const handleChange = (index, field, value) => {
    const updatedStatistik = [...statistik];
    updatedStatistik[index] = { ...updatedStatistik[index], [field]: value };
    setStatistik(updatedStatistik);
  };

  const handleAddItem = () => {
    setStatistik([...statistik, { label: '', value: '' }]);
  };

  const handleRemoveItem = (index) => {
    if (statistik.length > 1) {
      setStatistik(statistik.filter((_, i) => i !== index));
    } else {
      showNotification('error', 'Minimal harus ada 1 item statistik.');
    }
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
      const sortedData = sortStatistikFlexible(statistik);
      
      // Gunakan URL yang dinamis berdasarkan environment
            const apiUrl = process.env.NODE_ENV === 'production'
        ? 'https://www.moncongloebulu.com/api/statistik'
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
      <CustomNotification notification={notification} setNotification={setNotification} />

      <motion.div 
        className="mb-6"
        variants={itemVariants}
      >
        <h2 className="text-2xl font-bold text-secondary">Edit Statistik Desa</h2>
        <p className="text-sm text-gray-600 mt-2">
          Anda dapat menambah, mengubah, atau menghapus item statistik. Item baru akan otomatis ditambahkan ke urutan yang sesuai.
        </p>
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
              className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start p-3 bg-neutral/50 rounded-lg relative"
              variants={itemVariants}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Delete Button */}
              <button
                onClick={() => handleRemoveItem(index)}
                className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700 transition-colors"
                title="Hapus item ini"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              
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
          <motion.button
            onClick={handleAddItem}
            className="px-6 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 font-semibold transition"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Tambah Statistik
            </span>
          </motion.button>
          
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
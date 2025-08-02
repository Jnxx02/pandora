import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePrasarana } from '../../context/PrasaranaContext';
import CustomNotification from '../../components/CustomNotification';

const initialPrasarana = [
  {
    kategori: 'Pendidikan',
    list: ['TK/PAUD (4 Unit)', 'SD Negeri (3 Unit)', 'SMP Negeri (1 Unit)'],
  },
  {
    kategori: 'Kesehatan',
    list: ['Puskesmas Pembantu (1 Unit)', 'Poskesdes (1 Unit)', 'Posyandu (5 Unit)'],
  },
  {
    kategori: 'Ibadah',
    list: ['Masjid (8 Unit)', 'Gereja (1 Unit)'],
  },
  {
    kategori: 'Umum',
    list: ['Kantor Desa (1 Unit)', 'Pasar Desa (1 Unit)', 'Lapangan Olahraga (2 Unit)'],
  },
];

const EditPrasarana = () => {
  const [prasarana, setPrasarana] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const navigate = useNavigate();
  const { prasarana: contextPrasarana, refetchPrasarana } = usePrasarana();

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
  };

  useEffect(() => {
    if (contextPrasarana && contextPrasarana.length > 0) {
      setPrasarana(contextPrasarana);
    } else {
      setPrasarana(initialPrasarana);
    }
  }, [contextPrasarana]);

  const handleChange = (index, field, value) => {
    const updatedPrasarana = [...prasarana];
    if (field === 'list') {
      updatedPrasarana[index] = { ...updatedPrasarana[index], list: value.split('\n') };
    } else {
      updatedPrasarana[index] = { ...updatedPrasarana[index], [field]: value };
    }
    setPrasarana(updatedPrasarana);
  };

  const handleAddItem = () => {
    setPrasarana([...prasarana, { kategori: '', list: [] }]);
  };

  const handleSave = async () => {
    // Validasi data
    const hasEmptyKategori = prasarana.some(item => !item.kategori.trim());
    if (hasEmptyKategori) {
      showNotification('error', 'Setiap item prasarana harus memiliki "Kategori". Kolom kategori tidak boleh kosong.');
      return;
    }

    setIsSaving(true);
    try {
      const cleanedPrasarana = prasarana.map(item => ({
        kategori: item.kategori.trim(),
        list: item.list.filter(line => line.trim() !== '')
      }));

      const apiUrl = process.env.NODE_ENV === 'production'
        ? 'https://pandora-vite.vercel.app/api/prasarana'
        : 'http://localhost:3001/api/prasarana';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedPrasarana)
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      localStorage.setItem('prasarana', JSON.stringify(cleanedPrasarana)); // Backup to localStorage
      await refetchPrasarana();
      showNotification('success', result.message || 'Data prasarana berhasil disimpan ke database!');
      setTimeout(() => { navigate('/admin/dashboard'); }, 1500);
    } catch (error) {
      console.error("Gagal menyimpan prasarana:", error);
      showNotification('error', `Gagal menyimpan data prasarana! Error: ${error.message}. Data hanya disimpan secara lokal.`);
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
        <h2 className="text-2xl font-bold text-secondary">Edit Prasarana Desa</h2>
      </motion.div>

      <motion.div 
        className="bg-white rounded-xl shadow p-6 border border-neutral/50"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="space-y-6"
          variants={containerVariants}
        >
          {prasarana.map((item, index) => (
            <motion.div 
              key={index} 
              className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-neutral/50 rounded-lg border"
              variants={itemVariants}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="md:col-span-2">
                <input 
                  type="text" 
                  placeholder="Kategori (e.g., Pendidikan)" 
                  value={item.kategori} 
                  onChange={(e) => handleChange(index, 'kategori', e.target.value)} 
                  className="w-full px-3 py-2 border border-neutral rounded bg-white text-text-main focus:ring-1 focus:ring-primary focus:border-primary transition" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Daftar Fasilitas (satu per baris)</label>
                <textarea 
                  placeholder="TK/PAUD (4 Unit)&#10;SD Negeri (3 Unit)" 
                  value={item.list.join('\n')} 
                  onChange={(e) => handleChange(index, 'list', e.target.value)} 
                  className="w-full px-3 py-2 border border-neutral rounded bg-white text-text-main focus:ring-1 focus:ring-primary focus:border-primary transition h-24" 
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
        <motion.div 
          className="mt-6 flex flex-col md:flex-row gap-4"
          variants={itemVariants}
        >
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

export default EditPrasarana;
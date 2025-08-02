import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const initialPrasarana = [
  {
    kategori: 'Pendidikan',
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
      </svg>
    ),
    list: ['TK/PAUD (4 Unit)', 'SD Negeri (3 Unit)', 'SMP Negeri (1 Unit)'],
  },
  {
    kategori: 'Kesehatan',
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
      </svg>
    ),
    list: ['Puskesmas Pembantu (1 Unit)', 'Poskesdes (1 Unit)', 'Posyandu (5 Unit)'],
  },
  {
    kategori: 'Ibadah',
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    ),
    list: ['Masjid (8 Unit)', 'Gereja (1 Unit)'],
  },
  {
    kategori: 'Umum',
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
      </svg>
    ),
    list: ['Kantor Desa (1 Unit)', 'Pasar Desa (1 Unit)', 'Lapangan Olahraga (2 Unit)'],
  },
];

const EditPrasarana = () => {
  const [prasarana, setPrasarana] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedPrasarana = localStorage.getItem('prasarana');
      if (storedPrasarana) {
        const parsedPrasarana = JSON.parse(storedPrasarana);
        // Periksa apakah data lama menggunakan nama icon (string)
        const hasOldFormat = parsedPrasarana.some(item => 
          typeof item.icon === 'string' && item.icon !== '' && !item.icon.includes('<svg')
        );
        
        if (hasOldFormat) {
          // Jika ada data lama, gunakan data baru
          setPrasarana(initialPrasarana);
          localStorage.setItem('prasarana', JSON.stringify(initialPrasarana));
        } else {
          setPrasarana(parsedPrasarana);
        }
      } else {
        setPrasarana(initialPrasarana);
        localStorage.setItem('prasarana', JSON.stringify(initialPrasarana));
      }
    } catch (error) {
      console.error("Gagal memuat prasarana dari localStorage:", error);
      setPrasarana(initialPrasarana);
    }
  }, []);

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

  const handleSave = () => {
    try {
      const cleanedPrasarana = prasarana.map(item => ({
        ...item,
        list: item.list.filter(line => line.trim() !== '')
      }));
      localStorage.setItem('prasarana', JSON.stringify(cleanedPrasarana));
      window.dispatchEvent(new Event('storage'));
      alert('Data prasarana berhasil disimpan!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error("Gagal menyimpan prasarana ke localStorage:", error);
      alert('Gagal menyimpan data prasarana.');
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
                <input type="text" placeholder="Kategori (e.g., Pendidikan)" value={item.kategori} onChange={(e) => handleChange(index, 'kategori', e.target.value)} className="w-full px-3 py-2 border border-neutral rounded bg-white text-text-main focus:ring-1 focus:ring-primary focus:border-primary transition" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Daftar Fasilitas (satu per baris)</label>
                <textarea placeholder="TK/PAUD (4 Unit)&#10;SD Negeri (3 Unit)" value={item.list.join('\n')} onChange={(e) => handleChange(index, 'list', e.target.value)} className="w-full px-3 py-2 border border-neutral rounded bg-white text-text-main focus:ring-1 focus:ring-primary focus:border-primary transition h-24" />
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
            className="bg-secondary text-white px-6 py-2 rounded-md w-full md:w-auto hover:bg-primary transition font-semibold"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Simpan Perubahan
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default EditPrasarana;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const initialPrasarana = [
  {
    kategori: 'Pendidikan',
    icon: '🎓',
    list: ['TK/PAUD (4 Unit)', 'SD Negeri (3 Unit)', 'SMP Negeri (1 Unit)'],
  },
  {
    kategori: 'Kesehatan',
    icon: '🏥',
    list: ['Puskesmas Pembantu (1 Unit)', 'Poskesdes (1 Unit)', 'Posyandu (5 Unit)'],
  },
  {
    kategori: 'Ibadah',
    icon: '🕌',
    list: ['Masjid (8 Unit)', 'Gereja (1 Unit)'],
  },
  {
    kategori: 'Umum',
    icon: '🏛️',
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
        setPrasarana(JSON.parse(storedPrasarana));
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
    setPrasarana([...prasarana, { kategori: '', icon: '', list: [] }]);
  };

  const handleRemoveItem = (index) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      const updatedPrasarana = prasarana.filter((_, i) => i !== index);
      setPrasarana(updatedPrasarana);
    }
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

  return (
    <div className="py-10 max-w-4xl mx-auto bg-background min-h-screen px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Edit Infrastruktur & Sarana</h2>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="bg-gray-200 text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors"
        >
          ← Kembali ke Dashboard
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-6 border border-accent">
        <div className="space-y-6">
          {prasarana.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border">
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input type="text" placeholder="Ikon (emoji)" value={item.icon} onChange={(e) => handleChange(index, 'icon', e.target.value)} className="w-full px-3 py-2 border border-accent rounded bg-white text-primary" />
                <input type="text" placeholder="Kategori (e.g., Pendidikan)" value={item.kategori} onChange={(e) => handleChange(index, 'kategori', e.target.value)} className="w-full px-3 py-2 border border-accent rounded bg-white text-primary sm:col-span-2" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Daftar Fasilitas (satu per baris)</label>
                <textarea placeholder="TK/PAUD (4 Unit)&#10;SD Negeri (3 Unit)" value={item.list.join('\n')} onChange={(e) => handleChange(index, 'list', e.target.value)} className="w-full px-3 py-2 border border-accent rounded bg-white text-primary h-24" />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button onClick={() => handleRemoveItem(index)} className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-semibold hover:bg-red-600 transition-colors">Hapus Kategori</button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <button onClick={handleAddItem} className="bg-blue-500 text-white px-4 py-2 rounded-md w-full md:w-auto hover:bg-blue-600 transition font-semibold">Tambah Kategori</button>
          <button onClick={handleSave} className="bg-secondary text-white px-6 py-2 rounded-md w-full md:w-auto hover:bg-primary transition font-semibold">Simpan Perubahan</button>
        </div>
      </div>
    </div>
  );
};

export default EditPrasarana;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const initialStatistik = [
  { icon: '👥', label: 'Penduduk', value: '0' },
  { icon: '👨', label: 'Laki-laki', value: '0' },
  { icon: '👩', label: 'Perempuan', value: '0' },
  { icon: '🏠', label: 'Kepala Keluarga', value: '0' },
  { icon: '📍', label: 'Diccekang', value: '0' },
  { icon: '📍', label: 'Tamalate', value: '0' },
  { icon: '📍', label: 'Tammu-Tammu', value: '0' },
  { icon: '📍', label: 'Tompo Balang', value: '0' },
  { icon: '📍', label: 'Moncongloe Bulu', value: '0' },
];

const EditStatistik = () => {
  const [statistik, setStatistik] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedStatistik = localStorage.getItem('statistik');
      if (storedStatistik) {
        setStatistik(JSON.parse(storedStatistik));
      } else {
        setStatistik(initialStatistik);
        localStorage.setItem('statistik', JSON.stringify(initialStatistik));
      }
    } catch (error) {
      console.error("Gagal memuat statistik dari localStorage:", error);
      setStatistik(initialStatistik);
    }
  }, []);

  const handleChange = (index, field, value) => {
    const updatedStatistik = [...statistik];
    updatedStatistik[index] = { ...updatedStatistik[index], [field]: value };
    setStatistik(updatedStatistik);
  };

  const handleAddItem = () => {
    setStatistik([...statistik, { icon: '', label: '', value: '' }]);
  };

  const handleRemoveItem = (index) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus item statistik ini?')) {
      const updatedStatistik = statistik.filter((_, i) => i !== index);
      setStatistik(updatedStatistik);
    }
  };

  const handleSave = () => {
    try {
      localStorage.setItem('statistik', JSON.stringify(statistik));
      window.dispatchEvent(new Event('storage')); // Memicu event agar halaman lain update
      alert('Data statistik berhasil disimpan!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error("Gagal menyimpan statistik ke localStorage:", error);
      alert('Gagal menyimpan data statistik.');
    }
  };

  return (
    <div className="py-10 max-w-4xl mx-auto bg-background min-h-screen px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Edit Statistik Penduduk</h2>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="bg-gray-200 text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors"
        >
          ← Kembali ke Dashboard
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-6 border border-accent">
        <div className="space-y-4">
          {statistik.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-3 bg-gray-50 rounded-lg">
              <input
                type="text"
                placeholder="Ikon (emoji)"
                value={item.icon}
                onChange={(e) => handleChange(index, 'icon', e.target.value)}
                className="w-full px-3 py-2 border border-accent rounded bg-white text-primary"
              />
              <input
                type="text"
                placeholder="Label (e.g., Penduduk)"
                value={item.label}
                onChange={(e) => handleChange(index, 'label', e.target.value)}
                className="w-full px-3 py-2 border border-accent rounded bg-white text-primary"
              />
              <input
                type="text"
                placeholder="Value (e.g., 6.564)"
                value={item.value}
                onChange={(e) => handleChange(index, 'value', e.target.value)}
                className="w-full px-3 py-2 border border-accent rounded bg-white text-primary"
              />
              <button
                onClick={() => handleRemoveItem(index)}
                className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-semibold hover:bg-red-600 transition-colors"
              >
                Hapus
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <button
            onClick={handleAddItem}
            className="bg-blue-500 text-white px-4 py-2 rounded-md w-full md:w-auto hover:bg-blue-600 transition font-semibold"
          >
            Tambah Item
          </button>
          <button
            onClick={handleSave}
            className="bg-secondary text-white px-6 py-2 rounded-md w-full md:w-auto hover:bg-primary transition font-semibold"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStatistik;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStatistik } from '../../context/StatistikContext';

const EditStatistik = () => {
  // State lokal untuk form, diinisialisasi dari context
  const [statistik, setStatistik] = useState([]);
  const navigate = useNavigate();
  const { statistik: contextStatistik, refetchStatistik } = useStatistik();

  useEffect(() => {
    // Ketika data dari context berubah (misalnya setelah fetch awal),
    // perbarui state lokal untuk form.
    if (contextStatistik && contextStatistik.length > 0) {
      setStatistik(contextStatistik);
    }
  }, [contextStatistik]);

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

  const handleSave = async () => {
    try {
      const response = await fetch('/api/statistik', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(statistik),
      });

      if (!response.ok) {
        throw new Error('Gagal menyimpan data ke server');
      }

      // Panggil refetch untuk memperbarui data di context
      await refetchStatistik();

      alert('Data statistik berhasil diperbarui di server!');
      navigate('/admin/dashboard'); // Arahkan kembali setelah berhasil
    } catch (error) {
      console.error("Gagal menyimpan statistik:", error);
      alert('Terjadi kesalahan saat menyimpan data statistik.');
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
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStatistik } from '../../context/StatistikContext';

const EditStatistik = () => {
  const [statistik, setStatistik] = useState([]);
  const navigate = useNavigate();
  const { statistik: contextStatistik, refetchStatistik } = useStatistik();

  useEffect(() => {
    if (contextStatistik && contextStatistik.length > 0) {
      setStatistik(contextStatistik);
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
      alert('Setiap item statistik harus memiliki "Label". Kolom label tidak boleh kosong.');
      return;
    }

    try {
      // Simulasi penyimpanan ke localStorage karena tidak ada API endpoint
      localStorage.setItem('statistik', JSON.stringify(statistik));
      
      await refetchStatistik();

      alert('Data statistik berhasil disimpan!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error("Gagal menyimpan statistik:", error);
      alert('Terjadi kesalahan saat menyimpan data statistik.');
    }
  };

  return (
    <div className="py-10 max-w-4xl mx-auto bg-neutral min-h-screen px-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-secondary">Edit Statistik Desa</h2>
      </div>

      {/* GANTI: Card utama dengan border neutral */}
      <div className="bg-white rounded-xl shadow p-6 border border-neutral/50">
        <div className="space-y-4">
          {statistik.map((item, index) => (
            // GANTI: Latar baris item menggunakan bg-neutral/50
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start p-3 bg-neutral/50 rounded-lg">
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
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col md:flex-row gap-4">
          {/* GANTI: Tombol simpan dengan warna secondary dan primary */}
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
import React, { useState, useEffect } from 'react';
// 1. Impor fungsi-fungsi dari api.js yang sudah kita buat.
//    Ini menggantikan penulisan `fetch` secara langsung di dalam komponen.
import { getStatistik, saveStatistik } from '../api';

function AdminStatistik() {
  // State untuk menyimpan data, status loading, dan pesan error
  const [statistik, setStatistik] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // 2. Gunakan useEffect untuk mengambil data saat komponen pertama kali dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        setIsLoading(true);
        // Panggil `getStatistik` dari api.js
        const data = await getStatistik();
        setStatistik(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Array dependensi kosong berarti ini hanya berjalan sekali

  // 3. Buat fungsi untuk menangani perubahan pada input
  const handleValueChange = (index, newValue) => {
    const updatedStatistik = [...statistik];
    // Pastikan kita hanya mengubah properti 'value'
    updatedStatistik[index] = { ...updatedStatistik[index], value: newValue };
    setStatistik(updatedStatistik);
  };

  // 4. Buat fungsi untuk menangani penyimpanan data
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      // Panggil `saveStatistik` dari api.js dengan data terbaru dari state
      const result = await saveStatistik(statistik);
      alert(result.message); // Tampilkan notifikasi sukses
    } catch (err) {
      setError(err.message);
      alert(`Error: ${err.message}`); // Tampilkan notifikasi error
    } finally {
      setIsSaving(false);
    }
  };

  // Tampilkan UI berdasarkan state
  if (isLoading) {
    return <div>Memuat data statistik...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Editor Statistik Desa</h2>
      {statistik.map((item, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <label>{item.label}: </label>
          <input
            type="text"
            value={item.value}
            onChange={(e) => handleValueChange(index, e.target.value)}
          />
        </div>
      ))}
      <button onClick={handleSave} disabled={isSaving}>
        {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
      </button>
    </div>
  );
}

export default AdminStatistik;


import React, { useState, useEffect } from 'react';

const BERITA_KEY = 'berita';
const PENGADUAN_KEY = 'pengaduan';

const safelyParseJSON = (jsonString, fallback) => {
  try {
    return JSON.parse(jsonString) || fallback;
  } catch (error) {
    console.error("Gagal mem-parsing JSON dari localStorage:", error);
    return fallback;
  }
};

export const useBerita = () => {
  const [berita, setBerita] = useState([]);

  useEffect(() => {
    const storedBerita = localStorage.getItem(BERITA_KEY);
    const dataBerita = safelyParseJSON(storedBerita, []);
    
    dataBerita.sort((a, b) => {
      const dateA = new Date(a.tanggalDibuat || a.tanggal || 0);
      const dateB = new Date(b.tanggalDibuat || b.tanggal || 0);
      return dateB - dateA;
    });

    setBerita(dataBerita);
  }, []);

  return { berita, totalBerita: berita.length };
};

export const useLaporan = () => {
  const { length: totalLaporan } = safelyParseJSON(localStorage.getItem(PENGADUAN_KEY), []);
  return { totalLaporan };
};

const Dashboard = () => {
  const { totalBerita } = useBerita();
  const { totalLaporan } = useLaporan();

  return (
    <div className="container mx-auto p-8 pt-12">
      <h1 className="text-3xl font-bold text-primary mb-8">Dashboard Admin</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-secondary mb-2">Total Berita</h2>
          <p className="text-5xl font-bold text-primary">{totalBerita}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-secondary mb-2">Total Laporan Pengaduan</h2>
          <p className="text-5xl font-bold text-primary">{totalLaporan}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
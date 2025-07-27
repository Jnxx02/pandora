import { useState, useEffect } from 'react';

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
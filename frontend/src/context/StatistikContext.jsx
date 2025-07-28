import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

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

const StatistikContext = createContext();

export const StatistikProvider = ({ children }) => {
  const [statistik, setStatistik] = useState(initialStatistik);
  const [loading, setLoading] = useState(true);

  const fetchStatistik = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/statistik');
      if (!response.ok) {
        throw new Error('Gagal memuat data statistik dari server');
      }
      const data = await response.json();
      setStatistik(data);
    } catch (error) {
      console.error("Gagal mengambil statistik dari backend:", error);
      setStatistik(initialStatistik); // Fallback jika gagal
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatistik();
  }, [fetchStatistik]);

  const value = { statistik, loading, refetchStatistik: fetchStatistik };

  return (
    <StatistikContext.Provider value={value}>
      {children}
    </StatistikContext.Provider>
  );
};

export const useStatistik = () => {
  const context = useContext(StatistikContext);
  if (context === undefined) {
    throw new Error('useStatistik must be used within a StatistikProvider');
  }
  return context;
};
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const StatistikContext = createContext();

export const useStatistik = () => {
  const context = useContext(StatistikContext);
  if (context === undefined) {
    throw new Error('useStatistik must be used within a StatistikProvider');
  }
  return context;
};

export const StatistikProvider = ({ children }) => {
  const [statistik, setStatistik] = useState([]);
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
      setStatistik([]); // Fallback ke array kosong jika terjadi error
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
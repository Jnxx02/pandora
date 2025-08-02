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
  const [error, setError] = useState(null);

  // Default statistik data untuk development
  const defaultStatistik = [
    { label: 'Penduduk', value: '3.820', icon: null },
    { label: 'Laki-Laki', value: '1.890', icon: null },
    { label: 'Perempuan', value: '1.930', icon: null },
    { label: 'Kepala Keluarga', value: '1.245', icon: null },
    { label: 'Diccekang', value: '850', icon: null },
    { label: 'Tamalate', value: '920', icon: null },
    { label: 'Tammu-Tammu', value: '780', icon: null },
    { label: 'Tompo Balang', value: '720', icon: null },
    { label: 'Moncongloe Bulu', value: '550', icon: null }
  ];

  const fetchStatistik = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Coba ambil dari backend terlebih dahulu
      const response = await fetch('http://localhost:3001/api/statistik', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Tambahkan timeout untuk mencegah hanging
        signal: AbortSignal.timeout(5000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Jika data kosong dari backend, gunakan default
      if (data && data.length > 0) {
        setStatistik(data);
      } else {
        console.log('📊 Backend returned empty data, using default statistik');
        setStatistik(defaultStatistik);
      }
    } catch (error) {
      console.error("Gagal mengambil statistik dari backend:", error);
      setError(error.message);
      
      // Gunakan data default jika backend tidak tersedia
      console.log('📊 Using default statistik data for development');
      setStatistik(defaultStatistik);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatistik();
  }, [fetchStatistik]);

  const value = { 
    statistik, 
    loading, 
    error,
    refetchStatistik: fetchStatistik 
  };

  return (
    <StatistikContext.Provider value={value}>
      {children}
    </StatistikContext.Provider>
  );
};
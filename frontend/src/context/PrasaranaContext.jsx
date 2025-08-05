import React, { createContext, useContext, useState, useEffect } from 'react';

const PrasaranaContext = createContext();

export const usePrasarana = () => {
  const context = useContext(PrasaranaContext);
  if (!context) {
    throw new Error('usePrasarana must be used within a PrasaranaProvider');
  }
  return context;
};

const defaultPrasarana = [
  {
    kategori: 'Pendidikan',
    list: ['TK/PAUD (4 Unit)', 'SD Negeri (3 Unit)', 'SMP Negeri (1 Unit)'],
  },
  {
    kategori: 'Kesehatan',
    list: ['Puskesmas Pembantu (1 Unit)', 'Poskesdes (1 Unit)', 'Posyandu (5 Unit)'],
  },
  {
    kategori: 'Ibadah',
    list: ['Masjid (8 Unit)', 'Gereja (1 Unit)'],
  },
  {
    kategori: 'Umum',
    list: ['Kantor Desa (1 Unit)', 'Pasar Desa (1 Unit)', 'Lapangan Olahraga (2 Unit)'],
  },
];

export const PrasaranaProvider = ({ children }) => {
  const [prasarana, setPrasarana] = useState(defaultPrasarana);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrasarana = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = process.env.NODE_ENV === 'production'
        ? 'https://www.moncongloebulu.com/api/prasarana'
        : 'http://localhost:3001/api/prasarana';
      
      console.log('🔍 Fetching prasarana from:', apiUrl);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(apiUrl, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      clearTimeout(timeoutId);
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📊 Received prasarana data:', data);
      
      if (data && data.length > 0) {
        setPrasarana(data);
        // Backup ke localStorage
        localStorage.setItem('prasarana', JSON.stringify(data));
        console.log('✅ Prasarana data loaded successfully');
      } else {
        // Jika data kosong, gunakan default
        setPrasarana(defaultPrasarana);
        localStorage.setItem('prasarana', JSON.stringify(defaultPrasarana));
        console.log('⚠️ No data received, using default prasarana');
      }
    } catch (error) {
      console.error('❌ Gagal mengambil prasarana dari backend:', error);
      setError(error.message);
      
      // Fallback ke localStorage
      try {
        const storedPrasarana = localStorage.getItem('prasarana');
        if (storedPrasarana) {
          setPrasarana(JSON.parse(storedPrasarana));
          console.log('📦 Loaded prasarana from localStorage');
        } else {
          setPrasarana(defaultPrasarana);
          localStorage.setItem('prasarana', JSON.stringify(defaultPrasarana));
          console.log('📦 Using default prasarana from localStorage');
        }
      } catch (localError) {
        console.error('❌ Gagal memuat prasarana dari localStorage:', localError);
        setPrasarana(defaultPrasarana);
      }
    } finally {
      setLoading(false);
    }
  };

  const refetchPrasarana = async () => {
    await fetchPrasarana();
  };

  useEffect(() => {
    fetchPrasarana();
  }, []);

  const value = {
    prasarana,
    setPrasarana,
    loading,
    error,
    refetchPrasarana,
  };

  return (
    <PrasaranaContext.Provider value={value}>
      {children}
    </PrasaranaContext.Provider>
  );
}; 
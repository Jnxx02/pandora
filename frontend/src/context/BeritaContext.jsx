import React, { createContext, useContext, useState, useEffect } from 'react';

const BeritaContext = createContext();

export const useBerita = () => {
  const context = useContext(BeritaContext);
  if (!context) {
    throw new Error('useBerita must be used within a BeritaProvider');
  }
  return context;
};

const defaultBerita = [];

export const BeritaProvider = ({ children }) => {
  const [berita, setBerita] = useState(defaultBerita);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBerita = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = process.env.NODE_ENV === 'production'
        ? 'https://pandora-vite.vercel.app/api/berita'
        : 'http://localhost:3001/api/berita';
      
      console.log('🔍 Fetching berita from:', apiUrl);
      
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
      console.log('📊 Received berita data:', data);
      
      if (data && data.length > 0) {
        setBerita(data);
        // Backup ke localStorage
        localStorage.setItem('berita', JSON.stringify(data));
        console.log('✅ Berita data loaded successfully');
      } else {
        // Jika data kosong, gunakan default
        setBerita(defaultBerita);
        localStorage.setItem('berita', JSON.stringify(defaultBerita));
        console.log('⚠️ No data received, using default berita');
      }
    } catch (error) {
      console.error('❌ Gagal mengambil berita dari backend:', error);
      setError(error.message);
      
      // Fallback ke localStorage
      try {
        const storedBerita = localStorage.getItem('berita');
        if (storedBerita) {
          setBerita(JSON.parse(storedBerita));
          console.log('📦 Loaded berita from localStorage');
        } else {
          setBerita(defaultBerita);
          localStorage.setItem('berita', JSON.stringify(defaultBerita));
          console.log('📦 Using default berita from localStorage');
        }
      } catch (localError) {
        console.error('❌ Gagal memuat berita dari localStorage:', localError);
        setBerita(defaultBerita);
      }
    } finally {
      setLoading(false);
    }
  };

  const refetchBerita = async () => {
    await fetchBerita();
  };

  const addBerita = async (beritaData) => {
    try {
      const apiUrl = process.env.NODE_ENV === 'production'
        ? 'https://pandora-vite.vercel.app/api/berita'
        : 'http://localhost:3001/api/berita';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(beritaData)
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      await refetchBerita();
      return result;
    } catch (error) {
      console.error('Error adding berita:', error);
      throw error;
    }
  };

  const updateBerita = async (id, beritaData) => {
    try {
      const apiUrl = process.env.NODE_ENV === 'production'
        ? `https://pandora-vite.vercel.app/api/berita/${id}`
        : `http://localhost:3001/api/berita/${id}`;
      
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(beritaData)
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      await refetchBerita();
      return result;
    } catch (error) {
      console.error('Error updating berita:', error);
      throw error;
    }
  };

  const deleteBerita = async (id) => {
    try {
      const apiUrl = process.env.NODE_ENV === 'production'
        ? `https://pandora-vite.vercel.app/api/berita/${id}`
        : `http://localhost:3001/api/berita/${id}`;
      
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      await refetchBerita();
      return result;
    } catch (error) {
      console.error('Error deleting berita:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchBerita();
  }, []);

  const value = {
    berita,
    setBerita,
    loading,
    error,
    refetchBerita,
    addBerita,
    updateBerita,
    deleteBerita,
  };

  return (
    <BeritaContext.Provider value={value}>
      {children}
    </BeritaContext.Provider>
  );
}; 
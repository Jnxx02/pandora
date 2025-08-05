import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const BeritaContext = createContext();

export const useBerita = () => {
  const context = useContext(BeritaContext);
  if (!context) {
    throw new Error('useBerita must be used within a BeritaProvider');
  }
  return context;
};

export const BeritaProvider = ({ children }) => {
  const [berita, setBerita] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBerita = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = process.env.NODE_ENV === 'production'
        ? 'https://www.moncongloebulu.com/api/berita'
        : 'http://localhost:3001/api/berita';
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setBerita(data);
    } catch (error) {
      console.error('Error fetching berita:', error);
      setError(error.message);
      
      // Fallback to default data if API fails
      const defaultBerita = [
        {
          id: 1,
          judul: 'Selamat Datang di Website Desa Moncongloe Bulu',
          isi: 'Website resmi Desa Moncongloe Bulu telah diluncurkan untuk memberikan informasi terbaru kepada warga.',
          tanggal_publikasi: new Date().toISOString(),
          gambar_url: null
        }
      ];
      setBerita(defaultBerita);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetchBerita = useCallback(async () => {
    await fetchBerita();
  }, [fetchBerita]);

  const addBerita = useCallback(async (beritaData) => {
    try {
      const apiUrl = process.env.NODE_ENV === 'production'
        ? 'https://www.moncongloebulu.com/api/berita'
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
  }, [refetchBerita]);

  const updateBerita = useCallback(async (id, beritaData) => {
    try {
      const apiUrl = process.env.NODE_ENV === 'production'
        ? `https://www.moncongloebulu.com/api/berita/${id}`
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
  }, [refetchBerita]);

  const deleteBerita = useCallback(async (id) => {
    try {
      const apiUrl = process.env.NODE_ENV === 'production'
        ? `https://www.moncongloebulu.com/api/berita/${id}`
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
  }, [refetchBerita]);

  useEffect(() => {
    fetchBerita();
  }, [fetchBerita]);

  const value = useMemo(() => ({
    berita,
    setBerita,
    loading,
    error,
    refetchBerita,
    addBerita,
    updateBerita,
    deleteBerita,
  }), [berita, loading, error, refetchBerita, addBerita, updateBerita, deleteBerita]);

  return (
    <BeritaContext.Provider value={value}>
      {children}
    </BeritaContext.Provider>
  );
}; 
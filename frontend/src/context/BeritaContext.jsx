import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';

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

  // API configuration with fallbacks
  const getApiUrl = useCallback((endpoint) => {
    // Detect current environment
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const isVercel = window.location.hostname.includes('vercel.app');
    const isProduction = window.location.hostname === 'www.moncongloebulu.com' || window.location.hostname === 'moncongloebulu.com';
    
    let baseUrl;
    
    if (isLocalhost) {
      // Local development
      baseUrl = 'http://localhost:3001/api';
    } else if (isProduction) {
      // Production domain
      baseUrl = 'https://www.moncongloebulu.com/api';
    } else if (isVercel) {
      // Vercel deployment
      baseUrl = 'https://pandora-vite.vercel.app/api';
    } else {
      // Fallback to production
      baseUrl = 'https://www.moncongloebulu.com/api';
    }
    
    console.log('🌍 Environment detected:', {
      hostname: window.location.hostname,
      isLocalhost,
      isVercel,
      isProduction,
      baseUrl
    });
    
    return `${baseUrl}/${endpoint}`;
  }, []);

  const fetchBerita = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = getApiUrl('berita');
      console.log('🔗 Fetching berita from:', apiUrl);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setBerita(data);
    } catch (error) {
      console.error('❌ Error fetching berita:', error);
      setError(error.message);
      
      // Fallback to default data if API fails
      const defaultBerita = [
        {
          id: 1,
          judul: 'Selamat Datang di Website Desa Moncongloe Bulu',
          konten: 'Website ini sedang dalam pengembangan. Silakan cek kembali nanti.',
          gambar: '',
          penulis: 'Admin Desa',
          tanggal: new Date().toISOString()
        }
      ];
      setBerita(defaultBerita);
    } finally {
      setLoading(false);
    }
  }, [getApiUrl]);

  const refetchBerita = useCallback(async () => {
    await fetchBerita();
  }, [fetchBerita]);

  const addBerita = useCallback(async (beritaData) => {
    const maxRetries = 3;
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const apiUrl = getApiUrl('berita');
        console.log(`📤 Adding berita to: ${apiUrl} (attempt ${attempt}/${maxRetries})`);
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(beritaData)
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`❌ Server response (attempt ${attempt}):`, response.status, errorText);
          
          // Handle specific error cases
          if (response.status === 503) {
            try {
              const errorData = JSON.parse(errorText);
              if (errorData.error && errorData.error.includes('Database tidak tersedia')) {
                // Database unavailable - show warning but continue
                console.warn('⚠️ Database unavailable, data stored locally only');
                
                // Create a local success response
                const localResult = {
                  id: Date.now(), // Generate temporary ID
                  ...beritaData,
                  tanggal: new Date().toISOString(),
                  storedLocally: true,
                  message: 'Data berhasil disimpan secara lokal (database tidak tersedia)'
                };
                
                // Add to local state
                setBerita(prev => [localResult, ...prev]);
                
                return {
                  ...localResult,
                  warning: 'Data disimpan secara lokal karena database tidak tersedia. Data akan hilang jika server restart.'
                };
              }
            } catch (parseError) {
              console.error('Failed to parse error response:', parseError);
            }
            
            // Other 503 errors - might be temporary
            if (attempt < maxRetries) {
              console.log(`⏳ Service unavailable, retrying in ${attempt * 1000}ms...`);
              await new Promise(resolve => setTimeout(resolve, attempt * 1000));
              continue;
            }
          }
          
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
        
        const result = await response.json();
        console.log('✅ Berita added successfully:', result);
        await refetchBerita();
        return result;
      } catch (error) {
        console.error(`❌ Error adding berita (attempt ${attempt}):`, error);
        lastError = error;
        
        if (attempt < maxRetries && error.message.includes('503')) {
          console.log(`⏳ Retrying in ${attempt * 1000}ms...`);
          await new Promise(resolve => setTimeout(resolve, attempt * 1000));
          continue;
        }
        
        break;
      }
    }
    
    throw lastError || new Error('Failed to add berita after multiple attempts');
  }, [getApiUrl, refetchBerita]);

  const updateBerita = useCallback(async (id, beritaData) => {
    try {
      const apiUrl = getApiUrl(`berita/${id}`);
      console.log('📝 Updating berita at:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(beritaData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Server response:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Berita updated successfully:', result);
      await refetchBerita();
      return result;
    } catch (error) {
      console.error('❌ Error updating berita:', error);
      throw error;
    }
  }, [getApiUrl, refetchBerita]);

  const deleteBerita = useCallback(async (id) => {
    try {
      const apiUrl = getApiUrl(`berita/${id}`);
      console.log('🗑️ Deleting berita at:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Server response:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Berita deleted successfully:', result);
      await refetchBerita();
      return result;
    } catch (error) {
      console.error('❌ Error deleting berita:', error);
      throw error;
    }
  }, [getApiUrl, refetchBerita]);

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
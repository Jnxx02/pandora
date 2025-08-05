import React, { createContext, useContext, useState, useEffect } from 'react';

const PengaduanContext = createContext();

export const usePengaduan = () => {
  const context = useContext(PengaduanContext);
  if (!context) {
    throw new Error('usePengaduan must be used within a PengaduanProvider');
  }
  return context;
};

const defaultPengaduan = [];

export const PengaduanProvider = ({ children }) => {
  const [pengaduan, setPengaduan] = useState(defaultPengaduan);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPengaduan = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = process.env.NODE_ENV === 'production'
        ? 'https://www.moncongloebulu.com/api/pengaduan'
        : 'http://localhost:3001/api/pengaduan';
      
      console.log('🔍 Fetching pengaduan from:', apiUrl);
      
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
      console.log('📊 Received pengaduan data:', data);
      
      if (data && data.length > 0) {
        setPengaduan(data);
        localStorage.setItem('pengaduan', JSON.stringify(data));
        console.log('✅ Pengaduan data loaded successfully');
      } else {
        setPengaduan(defaultPengaduan);
        localStorage.setItem('pengaduan', JSON.stringify(defaultPengaduan));
        console.log('⚠️ No data received, using default pengaduan');
      }
    } catch (error) {
      console.error('❌ Gagal mengambil pengaduan dari backend:', error);
      setError(error.message);
      
      // Fallback ke localStorage
      try {
        const storedPengaduan = localStorage.getItem('pengaduan');
        if (storedPengaduan) {
          setPengaduan(JSON.parse(storedPengaduan));
          console.log('📦 Loaded pengaduan from localStorage');
        } else {
          setPengaduan(defaultPengaduan);
          localStorage.setItem('pengaduan', JSON.stringify(defaultPengaduan));
          console.log('📦 Using default pengaduan from localStorage');
        }
      } catch (localError) {
        console.error('❌ Gagal memuat pengaduan dari localStorage:', localError);
        setPengaduan(defaultPengaduan);
      }
    } finally {
      setLoading(false);
    }
  };

  const refetchPengaduan = async () => {
    await fetchPengaduan();
  };

  const addPengaduan = async (pengaduanData) => {
    try {
      const apiUrl = process.env.NODE_ENV === 'production'
        ? `https://www.moncongloebulu.com/api/pengaduan`
        : `http://localhost:3001/api/pengaduan`;

      // Optimize payload size and ensure proper structure
      const optimizedData = {
        nama: pengaduanData.nama || 'Anonim',
        email: pengaduanData.email || null,
        whatsapp: pengaduanData.whatsapp || null,
        klasifikasi: pengaduanData.klasifikasi || 'pengaduan',
        judul: pengaduanData.judul,
        isi: pengaduanData.isi,
        tanggal_kejadian: pengaduanData.tanggal_kejadian || null,
        kategori: pengaduanData.kategori,
        lampiran_info: pengaduanData.lampiran_info || null,
        lampiran_data_url: pengaduanData.lampiran_data_url || null,
        // Optimize tracking data - hanya IP address
        tracking: pengaduanData.tracking ? {
          deviceInfo: {
            userAgent: pengaduanData.tracking.deviceInfo?.userAgent?.substring(0, 200) || '',
            language: pengaduanData.tracking.deviceInfo?.language || '',
            platform: pengaduanData.tracking.deviceInfo?.platform || '',
            screenResolution: pengaduanData.tracking.deviceInfo?.screenResolution || '',
            timezone: pengaduanData.tracking.deviceInfo?.timezone || ''
          },
          clientIP: pengaduanData.tracking.clientIP || '',
          sessionId: pengaduanData.tracking.sessionId || '',
          formSubmissionTime: pengaduanData.tracking.formSubmissionTime || '',
          formFillingDuration: pengaduanData.tracking.formFillingDuration || 0,
          captchaQuestion: pengaduanData.tracking.captchaQuestion || '',
          hasContactInfo: pengaduanData.tracking.hasContactInfo || false,
          isAnonymous: pengaduanData.tracking.isAnonymous || false
        } : null
      };

      console.log('📤 Sending pengaduan data:', {
        nama: optimizedData.nama,
        judul: optimizedData.judul,
        kategori: optimizedData.kategori,
        hasLampiran: !!optimizedData.lampiran_data_url,
        lampiranSize: optimizedData.lampiran_data_url ? optimizedData.lampiran_data_url.length : 0,
        hasTracking: !!optimizedData.tracking
      });

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(optimizedData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Server response:', response.status, errorText);
        
        if (response.status === 413) {
          throw new Error('Data yang dikirim terlalu besar. Silakan kurangi ukuran lampiran atau coba lagi.');
        } else if (response.status === 400) {
          throw new Error('Data yang dikirim tidak valid. Silakan periksa kembali form Anda.');
        } else {
          throw new Error(`Server error: ${response.status} - ${errorText}`);
        }
      }
      
      const result = await response.json();
      console.log('✅ Pengaduan saved successfully:', result);
      await refetchPengaduan();
      return result;
    } catch (error) {
      console.error('Error adding pengaduan:', error);
      throw error;
    }
  };

  const updatePengaduan = async (id, pengaduanData) => {
    try {
      const apiUrl = process.env.NODE_ENV === 'production'
        ? `https://www.moncongloebulu.com/api/pengaduan/${id}`
        : `http://localhost:3001/api/pengaduan/${id}`;
      
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pengaduanData)
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      await refetchPengaduan();
      return result;
    } catch (error) {
      console.error('Error updating pengaduan:', error);
      throw error;
    }
  };

  const deletePengaduan = async (id) => {
    try {
      const apiUrl = process.env.NODE_ENV === 'production'
        ? `https://www.moncongloebulu.com/api/pengaduan/${id}`
        : `http://localhost:3001/api/pengaduan/${id}`;
      
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      await refetchPengaduan();
      return result;
    } catch (error) {
      console.error('Error deleting pengaduan:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchPengaduan();
  }, []);

  const value = {
    pengaduan,
    setPengaduan,
    loading,
    error,
    refetchPengaduan,
    addPengaduan,
    updatePengaduan,
    deletePengaduan,
  };

  return (
    <PengaduanContext.Provider value={value}>
      {children}
    </PengaduanContext.Provider>
  );
}; 
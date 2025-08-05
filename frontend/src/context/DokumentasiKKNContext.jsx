import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const DokumentasiKKNContext = createContext();

export const useDokumentasiKKN = () => {
    const context = useContext(DokumentasiKKNContext);
    if (!context) {
        throw new Error('useDokumentasiKKN must be used within a DokumentasiKKNProvider');
    }
    return context;
};

export const DokumentasiKKNProvider = ({ children }) => {
    const [dokumentasi, setDokumentasi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Default dokumentasi data untuk development - menggunakan useMemo agar timestamp konsisten
    const defaultDokumentasi = useMemo(() => [
        {
            id: 1,
            title: 'Template Pembukuan Koperasi Merah Putih',
            description: 'Template spreadsheet untuk pembukuan koperasi dengan format laporan arus kas yang terstruktur',
            category: 'template',
            author: 'KKN-T 114',
            downloads: 0,
            download_url: 'https://docs.google.com/spreadsheets/d/1Y-ObJc-RytTjuqph8g-1sCDJBAGWub6h_Ws5tlV04kY/edit?gid=1160742352#gid=1160742352',
            is_active: true,
            created_at: new Date().toISOString()
        },
        {
            id: 2,
            title: 'Template Pembukuan BUMDES',
            description: 'Template spreadsheet untuk pembukuan BUMDES yang sudah siap digunakan',
            category: 'template',
            author: 'KKN-T 114',
            downloads: 0,
            download_url: 'https://docs.google.com/spreadsheets/d/1KvX4oxlQra7IURkn4V6L8GNskuMhJUk0KMQW12uyoK4/edit?gid=919066220#gid=919066220',
            is_active: true,
            created_at: new Date().toISOString()
        }
    ], []);

    // Fetch semua dokumentasi
    const fetchDokumentasi = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Gunakan URL yang dinamis berdasarkan environment
            const apiUrl = process.env.NODE_ENV === 'production' 
                ? 'https://www.moncongloebulu.com/api/dokumentasi'
                : 'http://localhost:3001/api/dokumentasi';
            
            // Coba ambil dari backend terlebih dahulu
            const response = await fetch(apiUrl, {
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
                setDokumentasi(data);
            } else {
                console.log('📚 Backend returned empty data, using default dokumentasi');
                setDokumentasi(defaultDokumentasi);
            }
        } catch (error) {
            console.error("Gagal mengambil dokumentasi dari backend:", error);
            setError(error.message);
            
            // Gunakan data default jika backend tidak tersedia
            console.log('📚 Using default dokumentasi data for development');
            setDokumentasi(defaultDokumentasi);
        } finally {
            setLoading(false);
        }
    }, []);

    // Increment download count
    const incrementDownload = useCallback(async (id) => {
        try {
            // Update local state immediately for better UX
            setDokumentasi(prev => 
                prev.map(item => 
                    item.id === id 
                        ? { ...item, downloads: item.downloads + 1 }
                        : item
                )
            );

            // Try to update on backend if available
            const apiUrl = process.env.NODE_ENV === 'production' 
                ? 'https://www.moncongloebulu.com/api/dokumentasi/download'
                : 'http://localhost:3001/api/dokumentasi/download';

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
                signal: AbortSignal.timeout(3000)
            });

            if (!response.ok) {
                console.warn('Failed to update download count on backend');
            }

            return true;
        } catch (err) {
            console.error('Error incrementing download:', err);
            // Don't revert the local state update for better UX
            return true;
        }
    }, []);

    // Search dokumentasi
    const searchDokumentasi = useCallback((searchTerm, category = 'all') => {
        let filtered = category === 'all' ? dokumentasi : dokumentasi.filter(item => item.category === category);
        
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(item =>
                item.title.toLowerCase().includes(term) ||
                item.description.toLowerCase().includes(term) ||
                item.author.toLowerCase().includes(term)
            );
        }
        
        return filtered;
    }, [dokumentasi]);

    // Add new dokumentasi
    const addDokumentasi = useCallback(async (newDokumentasi) => {
        try {
            // Create new dokumentasi object with required fields
            const dokumentasiToAdd = {
                title: newDokumentasi.title,
                description: newDokumentasi.description,
                category: newDokumentasi.category,
                author: newDokumentasi.author,
                download_url: newDokumentasi.file_url, // Map file_url to download_url
                thumbnail_url: newDokumentasi.thumbnail_url || null
            };

            // Try to add to backend first
            const apiUrl = process.env.NODE_ENV === 'production' 
                ? 'https://www.moncongloebulu.com/api/dokumentasi'
                : 'http://localhost:3001/api/dokumentasi';

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dokumentasiToAdd),
                signal: AbortSignal.timeout(5000)
            });

            if (response.ok) {
                const responseData = await response.json();
                // Update local state with the response from backend
                setDokumentasi(prev => [responseData.data, ...prev]);
                return responseData.data;
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error adding dokumentasi:', error);
            
            // If backend fails, add to local state only
            const dokumentasiToAdd = {
                id: Date.now(), // Only for local state fallback
                title: newDokumentasi.title,
                description: newDokumentasi.description,
                category: newDokumentasi.category,
                author: newDokumentasi.author,
                downloads: 0,
                download_url: newDokumentasi.file_url, // Map file_url to download_url
                thumbnail_url: newDokumentasi.thumbnail_url || null,
                is_active: true,
                created_at: new Date().toISOString()
            };
            
            setDokumentasi(prev => [dokumentasiToAdd, ...prev]);
            return dokumentasiToAdd;
        }
    }, []);

    // Update dokumentasi
    const updateDokumentasi = useCallback(async (id, updatedDokumentasi) => {
        try {
            // Create updated dokumentasi object with required fields
            const dokumentasiToUpdate = {
                title: updatedDokumentasi.title,
                description: updatedDokumentasi.description,
                category: updatedDokumentasi.category,
                author: updatedDokumentasi.author,
                download_url: updatedDokumentasi.file_url, // Map file_url to download_url
                thumbnail_url: updatedDokumentasi.thumbnail_url || null
            };

            // Try to update in backend first
            const apiUrl = process.env.NODE_ENV === 'production' 
                ? `https://www.moncongloebulu.com/api/dokumentasi/${id}`
                : `http://localhost:3001/api/dokumentasi/${id}`;

            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dokumentasiToUpdate),
                signal: AbortSignal.timeout(5000)
            });

            if (response.ok) {
                const updatedData = await response.json();
                // Update local state
                setDokumentasi(prev => prev.map(item => 
                    item.id === id ? { ...item, ...updatedData.data } : item
                ));
                return updatedData;
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error updating dokumentasi:', error);
            
            // If backend fails, update local state only
            const updatedItem = {
                id: parseInt(id),
                title: updatedDokumentasi.title,
                description: updatedDokumentasi.description,
                category: updatedDokumentasi.category,
                author: updatedDokumentasi.author,
                download_url: updatedDokumentasi.file_url,
                thumbnail_url: updatedDokumentasi.thumbnail_url || null,
                updated_at: new Date().toISOString()
            };
            
            setDokumentasi(prev => prev.map(item => 
                item.id === parseInt(id) ? { ...item, ...updatedItem } : item
            ));
            return { data: updatedItem };
        }
    }, []);

    // Delete dokumentasi
    const deleteDokumentasi = useCallback(async (id) => {
        try {
            // Try to delete from backend first
            const apiUrl = process.env.NODE_ENV === 'production' 
                ? `https://www.moncongloebulu.com/api/dokumentasi/${id}`
                : `http://localhost:3001/api/dokumentasi/${id}`;

            const response = await fetch(apiUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                signal: AbortSignal.timeout(5000)
            });

            if (response.ok) {
                // Remove from local state
                setDokumentasi(prev => prev.filter(item => item.id !== parseInt(id)));
                return { success: true };
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error deleting dokumentasi:', error);
            
            // If backend fails, remove from local state only
            setDokumentasi(prev => prev.filter(item => item.id !== parseInt(id)));
            return { success: true };
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchDokumentasi();
    }, [fetchDokumentasi]);

    const value = {
        dokumentasi,
        loading,
        error,
        refetchDokumentasi: fetchDokumentasi,
        incrementDownload,
        searchDokumentasi,
        addDokumentasi,
        updateDokumentasi,
        deleteDokumentasi
    };

    return (
        <DokumentasiKKNContext.Provider value={value}>
            {children}
        </DokumentasiKKNContext.Provider>
    );
}; 
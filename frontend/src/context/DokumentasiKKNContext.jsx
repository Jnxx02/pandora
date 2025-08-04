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

    // Default dokumentasi data untuk development
    const defaultDokumentasi = [
        {
            id: 1,
            title: 'Template BUMDes',
            description: 'Template spreadsheet untuk pengelolaan BUMDes yang sudah siap digunakan',
            category: 'template',
            author: 'KKN-T 114',
            downloads: 0,
            file_url: '#',
            is_active: true,
            created_at: '2024-01-01T00:00:00Z'
        },
        {
            id: 2,
            title: 'Modul Pelatihan UMKM',
            description: 'Modul pelatihan untuk pengembangan usaha mikro, kecil, dan menengah',
            category: 'modul',
            author: 'KKN-T 114',
            downloads: 0,
            file_url: '#',
            is_active: true,
            created_at: '2024-01-01T00:00:00Z'
        },
        {
            id: 3,
            title: 'Buku Panduan Desa Digital',
            description: 'Panduan lengkap untuk implementasi teknologi digital di desa',
            category: 'buku_panduan',
            author: 'KKN-T 114',
            downloads: 0,
            file_url: '#',
            is_active: true,
            created_at: '2024-01-01T00:00:00Z'
        }
    ];

    // Fetch semua dokumentasi
    const fetchDokumentasi = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Gunakan URL yang dinamis berdasarkan environment
            const apiUrl = process.env.NODE_ENV === 'production' 
                ? 'https://pandora-vite.vercel.app/api/dokumentasi'
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
                ? 'https://pandora-vite.vercel.app/api/dokumentasi/download'
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

    // Filter dokumentasi berdasarkan kategori
    const getDokumentasiByCategory = useCallback((category) => {
        if (category === 'all') {
            return dokumentasi;
        }
        return dokumentasi.filter(item => item.category === category);
    }, [dokumentasi]);

    // Search dokumentasi
    const searchDokumentasi = useCallback((searchTerm, category = 'all') => {
        let filtered = getDokumentasiByCategory(category);
        
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(item =>
                item.title.toLowerCase().includes(term) ||
                item.description.toLowerCase().includes(term) ||
                item.author.toLowerCase().includes(term)
            );
        }
        
        return filtered;
    }, [getDokumentasiByCategory]);

    // Group dokumentasi berdasarkan kategori
    const dokumentasiByCategory = useMemo(() => {
        const grouped = {
            modul: [],
            buku_panduan: [],
            template: []
        };

        dokumentasi.forEach(item => {
            if (grouped[item.category]) {
                grouped[item.category].push(item);
            }
        });

        return grouped;
    }, [dokumentasi]);

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
        getDokumentasiByCategory,
        searchDokumentasi,
        dokumentasiByCategory
    };

    return (
        <DokumentasiKKNContext.Provider value={value}>
            {children}
        </DokumentasiKKNContext.Provider>
    );
}; 
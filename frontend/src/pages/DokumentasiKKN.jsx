import React, { useState, useEffect } from 'react';
import { useDokumentasiKKN } from '../context/DokumentasiKKNContext';
import { useNavigate, useLocation } from 'react-router-dom';

const DokumentasiKKN = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    const { 
        dokumentasi, 
        loading, 
        error, 
        incrementDownload,
        searchDokumentasi 
    } = useDokumentasiKKN();

    // Check admin status
    useEffect(() => {
        const checkAdminStatus = () => {
            try {
                const adminSession = sessionStorage.getItem('adminSession');
                if (adminSession) {
                    const sessionData = JSON.parse(adminSession);
                    const now = Date.now();
                    const sessionTimeout = 30 * 60 * 1000; // 30 menit
                    
                    if (sessionData.isAdmin && (now - sessionData.loginTime) < sessionTimeout) {
                        setIsAdmin(true);
                        return;
                    }
                }
                setIsAdmin(false);
            } catch (error) {
                console.error('Error checking admin status:', error);
                setIsAdmin(false);
            }
        };

        checkAdminStatus();
        
        // Check admin status periodically
        const interval = setInterval(checkAdminStatus, 60000); // Check every minute
        
        return () => clearInterval(interval);
    }, []);

    // Check for success message from navigation
    useEffect(() => {
        if (location.state?.message) {
            setShowSuccessMessage(true);
            // Clear the message from location state
            navigate(location.pathname, { replace: true });
            
            // Auto-hide success message after 5 seconds
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 5000);
        }
    }, [location.state, navigate, location.pathname]);

    // Filter data berdasarkan kategori dan search term
    const getFilteredData = () => {
        return searchDokumentasi(searchTerm, activeCategory);
    };

    const filteredData = getFilteredData();

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-neutral flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-text-secondary">Memuat dokumentasi...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-neutral flex items-center justify-center">
                <div className="text-center">
                    <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Terjadi Kesalahan</h3>
                    <p className="text-gray-500 mb-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
                    >
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral">
            {/* Success Message */}
            {showSuccessMessage && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
                    <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{location.state?.message || 'Dokumentasi berhasil ditambahkan!'}</span>
                        <button
                            onClick={() => setShowSuccessMessage(false)}
                            className="ml-4 text-green-500 hover:text-green-700"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
            
            <main className="py-6 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
                            Dokumentasi KKN
                        </h1>
                        <p className="text-text-secondary text-lg max-w-3xl mx-auto mb-6">
                            Kumpulan hasil karya mahasiswa KKN-T 114 Moncongloe Bulu berupa modul, buku panduan, dan template spreadsheet untuk kemajuan desa. Saat ini tersedia template BUMDes yang sudah siap digunakan.
                        </p>
                        
                        {/* Admin Action Button */}
                        {isAdmin && (
                            <div className="flex justify-center">
                                <button
                                    onClick={() => navigate('/admin/dokumentasi/tambah')}
                                    className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-primary transition-colors duration-200 flex items-center gap-2 shadow-lg"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Tambah Dokumentasi
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Search and Filter Section */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search Bar */}
                            <div className="flex-1">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Cari dokumentasi..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                    />
                                    <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setActiveCategory('all')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        activeCategory === 'all'
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Semua
                                </button>
                                <button
                                    onClick={() => setActiveCategory('modul')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        activeCategory === 'modul'
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    📚 Modul
                                </button>
                                <button
                                    onClick={() => setActiveCategory('bukuPanduan')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        activeCategory === 'bukuPanduan'
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    📖 Panduan
                                </button>
                                <button
                                    onClick={() => setActiveCategory('template')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        activeCategory === 'template'
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    📊 Template
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mb-6">
                        <p className="text-text-secondary">
                            Menampilkan {filteredData.length} dokumentasi
                        </p>
                    </div>

                    {/* Documentation Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredData.map((item) => (
                            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                {/* Thumbnail */}
                                <div className="h-48 bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                    <div className="text-white text-6xl opacity-80">
                                        {item.thumbnail_url ? (
                                            <img 
                                                src={item.thumbnail_url} 
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'block';
                                                }}
                                            />
                                        ) : (
                                            <div className="text-center">
                                                <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                                                </svg>
                                                <span className="text-sm">Preview</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-text-main mb-2 line-clamp-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-text-secondary text-sm mb-4 line-clamp-3">
                                        {item.description}
                                    </p>

                                    {/* Meta Info */}
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                        <span>Oleh: {item.author}</span>
                                        <span>{new Date(item.created_at).toLocaleDateString('id-ID')}</span>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                        <span>📁 {item.file_size}</span>
                                        <span>⬇️ {item.downloads} download</span>
                                    </div>

                                    {/* Download Button */}
                                    <button
                                        onClick={async () => {
                                            if (item.download_url.startsWith('http')) {
                                                // Increment download count
                                                await incrementDownload(item.id);
                                                // Open link
                                                window.open(item.download_url, '_blank');
                                            } else {
                                                // Fallback untuk link yang belum tersedia
                                                alert('Link download akan segera tersedia');
                                            }
                                        }}
                                        className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-secondary transition-colors duration-200 flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        {item.download_url.startsWith('http') ? 'Buka Template' : 'Download'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredData.length === 0 && (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada dokumentasi ditemukan</h3>
                            <p className="text-gray-500">Coba ubah filter atau kata kunci pencarian Anda</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DokumentasiKKN; 
import React, { useState, useEffect } from 'react';
import { useDokumentasiKKN } from '../context/DokumentasiKKNContext';
import { useNavigate, useLocation } from 'react-router-dom';

const DokumentasiKKN = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Function untuk mendapatkan preview berdasarkan tipe file
    const getFilePreview = (item) => {
        // Safety check untuk item yang undefined
        if (!item) {
            return (
                <div className="text-center">
                    <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                        <path d="M14 2v6h6"/>
                        <path d="M9 13h6"/>
                        <path d="M9 17h6"/>
                        <path d="M9 9h1"/>
                    </svg>
                    <span className="text-xs sm:text-sm">📄 File</span>
                </div>
            );
        }

        // Jika ada thumbnail_url, gunakan itu
        if (item.thumbnail_url) {
            return (
                <img 
                    src={item.thumbnail_url} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                    }}
                />
            );
        }

        // Deteksi tipe file berdasarkan download_url atau file_url
        const fileUrl = item?.download_url || item?.file_url || '';
        const fileExtension = fileUrl ? fileUrl.split('.').pop()?.toLowerCase() : '';

        // Preview berdasarkan ekstensi file
        if (fileExtension) {
            if (['pdf'].includes(fileExtension)) {
                return (
                    <div className="text-center">
                        <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                            <path d="M14 2v6h6"/>
                            <path d="M9 13h6"/>
                            <path d="M9 17h6"/>
                            <path d="M9 9h1"/>
                        </svg>
                        <span className="text-xs sm:text-sm">📄 PDF</span>
                    </div>
                );
            } else if (['xlsx', 'xls'].includes(fileExtension)) {
                return (
                    <div className="text-center">
                        <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                            <path d="M14 2v6h6"/>
                            <path d="M9 13h6"/>
                            <path d="M9 17h6"/>
                            <path d="M9 9h1"/>
                        </svg>
                        <span className="text-xs sm:text-sm">📊 Excel</span>
                    </div>
                );
            } else if (['docx', 'doc'].includes(fileExtension)) {
                return (
                    <div className="text-center">
                        <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                            <path d="M14 2v6h6"/>
                            <path d="M9 13h6"/>
                            <path d="M9 17h6"/>
                            <path d="M9 9h1"/>
                        </svg>
                        <span className="text-xs sm:text-sm">📝 Word</span>
                    </div>
                );
            } else if (['pptx', 'ppt'].includes(fileExtension)) {
                return (
                    <div className="text-center">
                        <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                            <path d="M14 2v6h6"/>
                            <path d="M9 13h6"/>
                            <path d="M9 17h6"/>
                            <path d="M9 9h1"/>
                        </svg>
                        <span className="text-xs sm:text-sm">📊 PowerPoint</span>
                    </div>
                );
            }
        }

        // Fallback berdasarkan kategori
        return (
            <div className="text-center">
                {item?.category === 'template' ? (
                    <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                        <path d="M14 2v6h6"/>
                        <path d="M9 13h6"/>
                        <path d="M9 17h6"/>
                        <path d="M9 9h1"/>
                    </svg>
                ) : item?.category === 'modul' ? (
                    <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                ) : item?.category === 'buku_panduan' ? (
                    <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                ) : (
                    <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                    </svg>
                )}
                <span className="text-xs sm:text-sm">
                    {item.category === 'template' ? '📊 Template' : 
                     item.category === 'modul' ? '📋 Modul' : 
                     item.category === 'buku_panduan' ? '📝 Panduan' : 'Preview'}
                </span>
            </div>
        );
    };
    
    const { 
        dokumentasi, 
        loading, 
        error, 
        incrementDownload,
        searchDokumentasi 
    } = useDokumentasiKKN();



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
            <main className="py-4 sm:py-6 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3 sm:mb-4">
                            Dokumentasi KKN
                        </h1>
                        <p className="text-text-secondary text-base sm:text-lg max-w-3xl mx-auto mb-4 sm:mb-6 px-2">
                            Kumpulan hasil karya mahasiswa yang berupa modul, buku panduan, dan template spreadsheet untuk kemajuan desa.
                        </p>
                        

                    </div>

                    {/* Search and Filter Section */}
                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
                        <div className="flex flex-col gap-4">
                            {/* Search Bar */}
                            <div className="w-full">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Cari dokumentasi..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base"
                                    />
                                    <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                <button
                                    onClick={() => setActiveCategory('all')}
                                    className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                                        activeCategory === 'all'
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Semua
                                </button>
                                <button
                                    onClick={() => setActiveCategory('modul')}
                                    className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                                        activeCategory === 'modul'
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    📋 Modul
                                </button>
                                <button
                                    onClick={() => setActiveCategory('bukuPanduan')}
                                    className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                                        activeCategory === 'bukuPanduan'
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    📝 Panduan
                                </button>
                                <button
                                    onClick={() => setActiveCategory('template')}
                                    className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                                        activeCategory === 'template'
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    📄 Template
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mb-4 sm:mb-6">
                        <p className="text-text-secondary text-sm sm:text-base">
                            Menampilkan {filteredData.length} dokumentasi
                        </p>
                    </div>

                    {/* Documentation Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {filteredData.map((item) => (
                            <div key={item?.id || Math.random()} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                {/* Thumbnail */}
                                <div className="h-40 sm:h-48 bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                    <div className="text-white text-6xl opacity-80">
                                        {getFilePreview(item)}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 sm:p-6">
                                    <h3 className="text-base sm:text-lg font-semibold text-text-main mb-2 line-clamp-2">
                                        {item?.title || 'Judul tidak tersedia'}
                                    </h3>
                                    <p className="text-text-secondary text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3">
                                        {item?.description || 'Deskripsi tidak tersedia'}
                                    </p>

                                    {/* Meta Info */}
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3 sm:mb-4">
                                        <span className="truncate">Oleh: {item?.author || 'Anonim'}</span>
                                        <span className="flex-shrink-0 ml-2">{item?.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : 'Tanggal tidak tersedia'}</span>
                                    </div>

                                    {/* Download Button */}
                                    <button
                                        onClick={async () => {
                                            const downloadUrl = item?.download_url || item?.file_url || '';
                                            if (downloadUrl && downloadUrl.startsWith('http')) {
                                                // Increment download count
                                                if (item?.id) {
                                                    await incrementDownload(item.id);
                                                }
                                                // Open link
                                                window.open(downloadUrl, '_blank');
                                            } else {
                                                // Fallback untuk link yang belum tersedia
                                                alert('Link download akan segera tersedia');
                                            }
                                        }}
                                        className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-secondary transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        {(item.download_url || item.file_url || '').startsWith('http') ? 'Buka Template' : 'Download'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredData.length === 0 && (
                        <div className="text-center py-8 sm:py-12">
                            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Tidak ada dokumentasi ditemukan</h3>
                            <p className="text-gray-500 text-sm sm:text-base">Coba ubah filter atau kata kunci pencarian Anda</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DokumentasiKKN; 
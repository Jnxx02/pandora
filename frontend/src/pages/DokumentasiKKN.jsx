import React, { useState, useMemo } from 'react';
import { useDokumentasiKKN } from '../context/DokumentasiKKNContext';

const DokumentasiKKN = () => {
    const { dokumentasi, incrementDownload, searchDokumentasi } = useDokumentasiKKN();
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showInfo, setShowInfo] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9; // 3x3 grid

    // Filter data berdasarkan kategori dan search term
    const getFilteredData = () => {
        return searchDokumentasi(searchTerm, activeCategory);
    };

    const filteredData = getFilteredData();

    // Hitung pagination
    const { currentDokumentasi, totalPages, startIndex, endIndex } = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentDokumentasi = filteredData.slice(startIndex, endIndex);
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        
        return {
            currentDokumentasi,
            totalPages,
            startIndex,
            endIndex: Math.min(endIndex, filteredData.length)
        };
    }, [filteredData, currentPage, itemsPerPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Reset ke halaman 1 ketika filter berubah
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, activeCategory]);

    // Function untuk mendapatkan icon berdasarkan tipe file
    const getFilePreview = (item) => {
        const url = item?.download_url || item?.file_url || '';
        
        if (url.toLowerCase().includes('.pdf')) {
            return '📄';
        } else if (url.toLowerCase().includes('.doc')) {
            return '📝';
        } else if (url.toLowerCase().includes('.xls')) {
            return '📊';
        } else if (url.toLowerCase().includes('.ppt')) {
            return '📊';
        } else {
            return '📁';
        }
    };

    const handleDownload = async (item) => {
        try {
            // Increment download count
            await incrementDownload(item.id);

            // Open download URL
            const downloadUrl = item.download_url || item.file_url;
            if (downloadUrl) {
                if ((item.download_url || item.file_url || '').startsWith('http')) {
                    window.open(downloadUrl, '_blank');
                } else {
                    // For local files, create a download link
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.download = item.title || 'document';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary/5 to-secondary/5">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary to-secondary text-white py-12 sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                            Dokumentasi
                        </h1>
                        <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8">
                            Kumpulan template, modul pembelajaran, dan panduan untuk mendukung Desa Moncongloe Bulu
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm sm:text-base">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>{dokumentasi?.length || 0} Dokumen Tersedia</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span>Gratis untuk Semua</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Search and Filter Section */}
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search Bar */}
                        <div className="flex-1">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Cari template, modul, atau panduan..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm sm:text-base"
                                />
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="lg:w-64">
                            <select
                                value={activeCategory}
                                onChange={(e) => setActiveCategory(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm sm:text-base"
                            >
                                <option value="all">🗂️ Semua Kategori</option>
                                <option value="template">📄 Template</option>
                                <option value="modul">📋 Modul</option>
                                <option value="buku_panduan">📝 Panduan</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Info Accordion */}
                <div className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden">
                    <button
                        onClick={() => setShowInfo(!showInfo)}
                        className="w-full px-4 sm:px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Tentang Dokumentasi</h3>
                                <p className="text-xs sm:text-sm text-gray-500">Pelajari lebih lanjut tentang koleksi dokumentasi kami</p>
                            </div>
                        </div>
                        <svg 
                            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showInfo ? 'rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    
                    {showInfo && (
                        <div className="px-4 sm:px-6 pb-6 border-t border-gray-100">
                            <div className="pt-4">
                                <p className="text-gray-600 text-sm sm:text-base mb-6">
                                    Dokumentasi ini berisi berbagai template, modul pembelajaran, dan panduan yang telah dikembangkan oleh 
                                    tim KKN-T 114 Universitas Hasanuddin untuk mendukung kegiatan pembangunan dan pemberdayaan masyarakat di Desa Moncongloe Bulu.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                            <span className="text-xl">📄</span>
                                        </div>
                                        <h4 className="font-medium text-gray-900 mb-1 text-sm">Template</h4>
                                        <p className="text-xs text-gray-600">Format dokumen siap pakai untuk keperluan administratif</p>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 rounded-lg">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                            <span className="text-xl">📋</span>
                                        </div>
                                        <h4 className="font-medium text-gray-900 mb-1 text-sm">Modul</h4>
                                        <p className="text-xs text-gray-600">Materi pembelajaran dan pelatihan pengembangan kapasitas</p>
                                    </div>
                                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                            <span className="text-xl">📝</span>
                                        </div>
                                        <h4 className="font-medium text-gray-900 mb-1 text-sm">Panduan</h4>
                                        <p className="text-xs text-gray-600">Petunjuk teknis dan prosedur implementasi program</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Info Pagination */}
                {filteredData.length > 0 && (
                    <div className="flex justify-between items-center mb-6 text-sm text-gray-600">
                        <div>
                            Menampilkan {startIndex + 1}-{endIndex} dari {filteredData.length} dokumentasi
                        </div>
                        <div>
                            Halaman {currentPage} dari {totalPages}
                        </div>
                    </div>
                )}

                {/* Dokumentasi Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {currentDokumentasi.map((item) => (
                        <div key={item?.id || Math.random()} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                            {/* Document Header */}
                            <div className="p-6 bg-gradient-to-br from-primary to-secondary">
                                <div className="flex items-center gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center">
                                            <div className="text-white text-3xl">
                                                {getFilePreview(item)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-white text-base mb-1 line-clamp-2">{item.title}</h3>
                                        <p className="text-white/80 text-sm">
                                            {item?.category === 'template' ? '📄 Template' :
                                             item?.category === 'modul' ? '📋 Modul' :
                                             '📝 Panduan'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                    {item?.description || 'Deskripsi tidak tersedia'}
                                </p>

                                {/* Meta Info */}
                                <div className="flex flex-col gap-2 text-xs text-gray-500 mb-4">
                                    <div className="flex items-center justify-between">
                                        <span className="truncate">Oleh: {item?.author || 'Anonim'}</span>
                                        <span className="flex-shrink-0">
                                            {item?.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : 'Tanggal tidak tersedia'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            {item?.downloads || 0} pelihat
                                        </span>
                                        {/* File Type Badge */}
                                        {(item.download_url || item.file_url) && (
                                            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                {(item.download_url || item.file_url).toLowerCase().includes('.pdf') ? '📄 PDF' :
                                                 (item.download_url || item.file_url).toLowerCase().includes('.doc') ? '📝 DOC' :
                                                 (item.download_url || item.file_url).toLowerCase().includes('.xls') ? '📊 XLS' :
                                                 (item.download_url || item.file_url).toLowerCase().includes('.ppt') ? '📊 PPT' :
                                                 '📁 File'}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Download Button */}
                                <button
                                    onClick={() => handleDownload(item)}
                                    disabled={!item.download_url && !item.file_url}
                                    className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span>
                                        {(item.download_url || item.file_url || '').startsWith('http') ? 'Buka Dokumentasi' : 'Download'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-1 sm:space-x-2 mb-8">
                        {/* Previous Button */}
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                currentPage === 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-primary border border-primary hover:bg-primary hover:text-white shadow-sm'
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        {/* Page Numbers */}
                        {Array.from({ length: totalPages }, (_, index) => {
                            const page = index + 1;
                            const showPage = page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                            
                            if (!showPage && page === currentPage - 2) {
                                return <span key={page} className="px-2 text-gray-400">...</span>;
                            }
                            if (!showPage && page === currentPage + 2) {
                                return <span key={page} className="px-2 text-gray-400">...</span>;
                            }
                            if (!showPage) return null;

                            return (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        currentPage === page
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'bg-white text-primary border border-primary hover:bg-primary hover:text-white shadow-sm'
                                    }`}
                                >
                                    {page}
                                </button>
                            );
                        })}

                        {/* Next Button */}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                currentPage === totalPages
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-primary border border-primary hover:bg-primary hover:text-white shadow-sm'
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {filteredData.length === 0 && (
                    <div className="text-center py-16">
                        <div className="max-w-md mx-auto">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Tidak ada dokumentasi ditemukan</h3>
                            <p className="text-gray-600 mb-6">
                                Coba ubah kata kunci pencarian atau filter kategori untuk menemukan dokumentasi yang Anda cari.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setActiveCategory('all');
                                }}
                                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Reset Filter
                            </button>
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
};

export default DokumentasiKKN;

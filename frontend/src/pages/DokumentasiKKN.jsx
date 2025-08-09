import React, { useState, useEffect } from 'react';
import { useDokumentasiKKN } from '../context/DokumentasiKKNContext';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomNotification from '../components/CustomNotification';

const DokumentasiKKN = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        author: '',
        category: 'template',
        file_url: '',
        thumbnail_url: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deletingItem, setDeletingItem] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });
    const navigate = useNavigate();
    const location = useLocation();

    const showNotification = (type, message) => {
        setNotification({ show: true, type, message });
    };

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
                <div className="relative w-full h-full">
                    <img
                        src={item.thumbnail_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                        }}
                    />
                    {/* Fallback ketika gambar gagal dimuat */}
                    <div className="hidden w-full h-full items-center justify-center bg-gradient-to-br from-primary to-secondary">
                        <div className="text-center text-white">
                            <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-xs sm:text-sm">🖼️ Gambar</span>
                        </div>
                    </div>
                </div>
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
                {/* Logo Pandora sebagai default */}
                <img
                    src="https://images.icon-icons.com/1715/PNG/512/2730367-box-inkcontober-pandora-shattered-square_112695.png"
                    alt="Logo Pandora"
                    className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2 object-contain"
                />
            </div>
        );
    };

    const {
        dokumentasi,
        loading,
        error,
        incrementDownload,
        searchDokumentasi,
        addDokumentasi,
        updateDokumentasi,
        deleteDokumentasi
    } = useDokumentasiKKN();



    // Filter data berdasarkan kategori dan search term
    const getFilteredData = () => {
        return searchDokumentasi(searchTerm, activeCategory);
    };

    const filteredData = getFilteredData();

    // Check admin session
    useEffect(() => {
        const checkAdminSession = () => {
            const session = sessionStorage.getItem('adminSession');
            const lastLogin = localStorage.getItem('adminLastLogin');
            const sessionId = localStorage.getItem('adminSessionId');

            if (!session || !lastLogin || !sessionId) {
                setIsAdmin(false);
                return;
            }

            try {
                const sessionData = JSON.parse(session);
                const timeSinceActivity = Date.now() - sessionData.lastActivity;
                const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

                if (sessionData.isAdmin && sessionData.sessionId === sessionId && timeSinceActivity <= SESSION_TIMEOUT) {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            } catch (error) {
                setIsAdmin(false);
            }
        };

        checkAdminSession();
        // Check session every minute
        const interval = setInterval(checkAdminSession, 60000);
        return () => clearInterval(interval);
    }, []);

    // Form handling functions
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await addDokumentasi(formData);
            showNotification('success', 'Dokumentasi berhasil ditambahkan!');
            setShowAddModal(false);
            setFormData({
                title: '',
                description: '',
                author: '',
                category: 'template',
                file_url: '',
                thumbnail_url: ''
            });
        } catch (error) {
            console.error('Error adding documentation:', error);
            showNotification('error', 'Gagal menambahkan dokumentasi. Silakan coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        setFormData({
            title: '',
            description: '',
            author: '',
            category: 'template',
            file_url: '',
            thumbnail_url: ''
        });
    };

    // Edit functions
    const handleEditClick = (item) => {
        setEditingItem(item);
        setFormData({
            title: item.title || '',
            description: item.description || '',
            author: item.author || '',
            category: item.category || 'template',
            file_url: item.download_url || item.file_url || '',
            thumbnail_url: item.thumbnail_url || ''
        });
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setIsEditing(true);

        try {
            await updateDokumentasi(editingItem.id, formData);
            showNotification('success', 'Dokumentasi berhasil diupdate!');
            setShowEditModal(false);
            setEditingItem(null);
            setFormData({
                title: '',
                description: '',
                author: '',
                category: 'template',
                file_url: '',
                thumbnail_url: ''
            });
        } catch (error) {
            console.error('Error updating documentation:', error);
            showNotification('error', 'Gagal mengupdate dokumentasi. Silakan coba lagi.');
        } finally {
            setIsEditing(false);
        }
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditingItem(null);
        setFormData({
            title: '',
            description: '',
            author: '',
            category: 'template',
            file_url: '',
            thumbnail_url: ''
        });
    };

    // Delete functions
    const handleDeleteClick = (item) => {
        setDeletingItem(item);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        setIsDeleting(true);

        try {
            await deleteDokumentasi(deletingItem.id);
            showNotification('success', 'Dokumentasi berhasil dihapus!');
            setShowDeleteModal(false);
            setDeletingItem(null);
        } catch (error) {
            console.error('Error deleting documentation:', error);
            showNotification('error', 'Gagal menghapus dokumentasi. Silakan coba lagi.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setDeletingItem(null);
    };

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
                            Dokumentasi dan Template
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
                                    onClick={() => setActiveCategory('buku_panduan')}
                                    className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                                        activeCategory === 'buku_panduan'
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
                                    {item?.thumbnail_url ? (
                                        <div className="w-full h-full">
                                            {getFilePreview(item)}
                                        </div>
                                    ) : (
                                        <div className="text-white text-6xl opacity-80">
                                            {getFilePreview(item)}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4 sm:p-6">
                                    <h3 className="text-base sm:text-lg font-semibold text-text-main mb-2 line-clamp-2">
                                        {item?.title 
                                            ? item.title.length > 50 
                                                ? item.title.substring(0, 50) + '...' 
                                                : item.title
                                            : 'Judul tidak tersedia'
                                        }
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
                                                showNotification('info', 'Link download akan segera tersedia');
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

            {/* Add Documentation Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Tambah Dokumentasi Baru</h2>
                                <button
                                    onClick={handleCloseModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Title */}
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                        Judul Dokumentasi *
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="Contoh: Template Laporan Keuangan Desa"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                        Deskripsi *
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="Deskripsi singkat tentang dokumentasi ini"
                                    />
                                </div>

                                {/* Author */}
                                <div>
                                    <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                                        Penulis *
                                    </label>
                                    <input
                                        type="text"
                                        id="author"
                                        name="author"
                                        value={formData.author}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="Nama penulis"
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                        Kategori *
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                    >
                                        <option value="template">📄 Template</option>
                                        <option value="modul">📋 Modul</option>
                                        <option value="buku_panduan">📝 Panduan</option>
                                    </select>
                                </div>

                                {/* File URL */}
                                <div>
                                    <label htmlFor="file_url" className="block text-sm font-medium text-gray-700 mb-2">
                                        URL File *
                                    </label>
                                    <input
                                        type="url"
                                        id="file_url"
                                        name="file_url"
                                        value={formData.file_url}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="https://example.com/file.pdf"
                                    />
                                </div>

                                {/* Thumbnail URL */}
                                <div>
                                    <label htmlFor="thumbnail_url" className="block text-sm font-medium text-gray-700 mb-2">
                                        URL Thumbnail (Opsional)
                                    </label>
                                    <input
                                        type="url"
                                        id="thumbnail_url"
                                        name="thumbnail_url"
                                        value={formData.thumbnail_url}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="https://example.com/thumbnail.jpg"
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Menyimpan...
                                            </div>
                                        ) : (
                                            'Simpan Dokumentasi'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Documentation Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Edit Dokumentasi</h2>
                                <button
                                    onClick={handleCloseEditModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                {/* Title */}
                                <div>
                                    <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-2">
                                        Judul Dokumentasi *
                                    </label>
                                    <input
                                        type="text"
                                        id="edit-title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="Contoh: Template Laporan Keuangan Desa"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-2">
                                        Deskripsi *
                                    </label>
                                    <textarea
                                        id="edit-description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="Deskripsi singkat tentang dokumentasi ini"
                                    />
                                </div>

                                {/* Author */}
                                <div>
                                    <label htmlFor="edit-author" className="block text-sm font-medium text-gray-700 mb-2">
                                        Penulis *
                                    </label>
                                    <input
                                        type="text"
                                        id="edit-author"
                                        name="author"
                                        value={formData.author}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="Nama penulis"
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700 mb-2">
                                        Kategori *
                                    </label>
                                                                         <select
                                         id="edit-category"
                                         name="category"
                                         value={formData.category}
                                         onChange={handleInputChange}
                                         required
                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                     >
                                         <option value="template">📄 Template</option>
                                         <option value="modul">📋 Modul</option>
                                         <option value="buku_panduan">📝 Panduan</option>
                                     </select>
                                </div>

                                {/* File URL */}
                                <div>
                                    <label htmlFor="edit-file_url" className="block text-sm font-medium text-gray-700 mb-2">
                                        URL File *
                                    </label>
                                    <input
                                        type="url"
                                        id="edit-file_url"
                                        name="file_url"
                                        value={formData.file_url}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="https://example.com/file.pdf"
                                    />
                                </div>

                                {/* Thumbnail URL */}
                                <div>
                                    <label htmlFor="edit-thumbnail_url" className="block text-sm font-medium text-gray-700 mb-2">
                                        URL Thumbnail (Opsional)
                                    </label>
                                    <input
                                        type="url"
                                        id="edit-thumbnail_url"
                                        name="thumbnail_url"
                                        value={formData.thumbnail_url}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="https://example.com/thumbnail.jpg"
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleCloseEditModal}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isEditing}
                                        className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isEditing ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Menyimpan...
                                            </div>
                                        ) : (
                                            'Update Dokumentasi'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Konfirmasi Hapus</h2>
                                <button
                                    onClick={handleCloseDeleteModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="mb-6">
                                <p className="text-gray-700 mb-4">
                                    Apakah Anda yakin ingin menghapus dokumentasi ini?
                                </p>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-900 mb-2">{deletingItem?.title}</h3>
                                    <p className="text-sm text-gray-600">{deletingItem?.description}</p>
                                    <p className="text-xs text-gray-500 mt-2">Oleh: {deletingItem?.author}</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleCloseDeleteModal}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleDeleteConfirm}
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isDeleting ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Menghapus...
                                        </div>
                                    ) : (
                                        'Hapus Dokumentasi'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Notification */}
            <CustomNotification notification={notification} setNotification={setNotification} />
        </div>
    );
};

export default DokumentasiKKN; 
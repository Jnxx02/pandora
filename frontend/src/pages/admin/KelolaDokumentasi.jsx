import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDokumentasiKKN } from '../../context/DokumentasiKKNContext';
import CustomNotification from '../../components/CustomNotification';

const KelolaDokumentasi = () => {
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
    const [documentFile, setDocumentFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [documentPreview, setDocumentPreview] = useState('');
    const [thumbnailPreview, setThumbnailPreview] = useState('');
    const [isUploadingDocument, setIsUploadingDocument] = useState(false);
    const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deletingItem, setDeletingItem] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });

    const showNotification = (type, message) => {
        setNotification({ show: true, type, message });
    };

    const {
        dokumentasi,
        loading,
        error,
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

    // Form handling functions
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle document file upload
    const handleDocumentFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (50MB max)
            if (file.size > 50 * 1024 * 1024) {
                showNotification('error', 'Ukuran file maksimal 50MB!');
                return;
            }
            
            // Validate file type
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation'
            ];
            
            if (!allowedTypes.includes(file.type)) {
                showNotification('error', 'File harus berupa PDF, Word, Excel, atau PowerPoint!');
                return;
            }
            
            setDocumentFile(file);
            setDocumentPreview(file.name);
            
            // Clear URL field if user uploads file
            setFormData({ ...formData, file_url: '' });
        }
    };

    // Handle thumbnail file upload
    const handleThumbnailFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                showNotification('error', 'Ukuran thumbnail maksimal 5MB!');
                return;
            }
            
            // Validate file type
            if (!file.type.startsWith('image/')) {
                showNotification('error', 'Thumbnail harus berupa gambar!');
                return;
            }
            
            setThumbnailFile(file);
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setThumbnailPreview(e.target.result);
            };
            reader.readAsDataURL(file);
            
            // Clear URL field if user uploads file
            setFormData({ ...formData, thumbnail_url: '' });
        }
    };

    // Upload document file
    const uploadDocument = async () => {
        if (!documentFile) return null;
        
        setIsUploadingDocument(true);
        try {
            const formData = new FormData();
            formData.append('document', documentFile);
            
            const response = await fetch('http://localhost:3001/api/upload-document', {
                method: 'POST',
                body: formData,
            });
            
            if (!response.ok) {
                throw new Error('Failed to upload document');
            }
            
            const data = await response.json();
            return data.documentUrl;
        } catch (error) {
            console.error('Error uploading document:', error);
            showNotification('error', 'Gagal mengupload dokumen!');
            return null;
        } finally {
            setIsUploadingDocument(false);
        }
    };

    // Upload thumbnail file
    const uploadThumbnail = async () => {
        if (!thumbnailFile) return null;
        
        setIsUploadingThumbnail(true);
        try {
            const formData = new FormData();
            formData.append('thumbnail', thumbnailFile);
            
            const response = await fetch('http://localhost:3001/api/upload-thumbnail', {
                method: 'POST',
                body: formData,
            });
            
            if (!response.ok) {
                throw new Error('Failed to upload thumbnail');
            }
            
            const data = await response.json();
            return data.thumbnailUrl;
        } catch (error) {
            console.error('Error uploading thumbnail:', error);
            showNotification('error', 'Gagal mengupload thumbnail!');
            return null;
        } finally {
            setIsUploadingThumbnail(false);
        }
    };

    // Remove document file
    const removeDocument = () => {
        setDocumentFile(null);
        setDocumentPreview('');
        setFormData({ ...formData, file_url: '' });
    };

    // Remove thumbnail file
    const removeThumbnail = () => {
        setThumbnailFile(null);
        setThumbnailPreview('');
        setFormData({ ...formData, thumbnail_url: '' });
    };

    // Handle URL input changes
    const handleFileUrlChange = (e) => {
        const value = e.target.value;
        setFormData({ ...formData, file_url: value });
        if (value && !documentFile) {
            setDocumentPreview(value);
        } else if (!value) {
            setDocumentPreview('');
        }
    };

    const handleThumbnailUrlChange = (e) => {
        const value = e.target.value;
        setFormData({ ...formData, thumbnail_url: value });
        if (value && !thumbnailFile) {
            setThumbnailPreview(value);
        } else if (!value) {
            setThumbnailPreview('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let documentUrl = formData.file_url;
            let thumbnailUrl = formData.thumbnail_url;
            
            // Upload document file if user selected a file
            if (documentFile) {
                documentUrl = await uploadDocument();
                if (!documentUrl) {
                    // If upload failed, stop the process
                    setIsSubmitting(false);
                    return;
                }
            }
            
            // Upload thumbnail file if user selected a file
            if (thumbnailFile) {
                thumbnailUrl = await uploadThumbnail();
                if (!thumbnailUrl) {
                    // If upload failed, stop the process
                    setIsSubmitting(false);
                    return;
                }
            }
            
            const formDataToSubmit = { 
                ...formData, 
                file_url: documentUrl, 
                thumbnail_url: thumbnailUrl 
            };
            
            await addDokumentasi(formDataToSubmit);
            showNotification('success', 'Dokumentasi berhasil ditambahkan!');
            setShowAddModal(false);
            
            // Reset form and files
            setFormData({
                title: '',
                description: '',
                author: '',
                category: 'template',
                file_url: '',
                thumbnail_url: ''
            });
            setDocumentFile(null);
            setThumbnailFile(null);
            setDocumentPreview('');
            setThumbnailPreview('');
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
        setDocumentFile(null);
        setThumbnailFile(null);
        setDocumentPreview('');
        setThumbnailPreview('');
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
        
        // Set previews from existing data
        if (item.download_url || item.file_url) {
            setDocumentPreview(item.download_url || item.file_url);
        }
        if (item.thumbnail_url) {
            setThumbnailPreview(item.thumbnail_url);
        }
        
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setIsEditing(true);

        try {
            let documentUrl = formData.file_url;
            let thumbnailUrl = formData.thumbnail_url;
            
            // Upload document file if user selected a new file
            if (documentFile) {
                documentUrl = await uploadDocument();
                if (!documentUrl) {
                    setIsEditing(false);
                    return;
                }
            }
            
            // Upload thumbnail file if user selected a new file
            if (thumbnailFile) {
                thumbnailUrl = await uploadThumbnail();
                if (!thumbnailUrl) {
                    setIsEditing(false);
                    return;
                }
            }
            
            const formDataToSubmit = { 
                ...formData, 
                file_url: documentUrl, 
                thumbnail_url: thumbnailUrl 
            };
            
            await updateDokumentasi(editingItem.id, formDataToSubmit);
            showNotification('success', 'Dokumentasi berhasil diupdate!');
            setShowEditModal(false);
            setEditingItem(null);
            
            // Reset form and files
            setFormData({
                title: '',
                description: '',
                author: '',
                category: 'template',
                file_url: '',
                thumbnail_url: ''
            });
            setDocumentFile(null);
            setThumbnailFile(null);
            setDocumentPreview('');
            setThumbnailPreview('');
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
        setDocumentFile(null);
        setThumbnailFile(null);
        setDocumentPreview('');
        setThumbnailPreview('');
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

    // Function untuk mendapatkan preview berdasarkan tipe file
    const getFilePreview = (item) => {
        if (!item) {
            return (
                <div className="text-center">
                    <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                        <path d="M14 2v6h6"/>
                        <path d="M9 13h6"/>
                        <path d="M9 17h6"/>
                        <path d="M9 9h1"/>
                    </svg>
                    <span className="text-sm">📄 File</span>
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
                    <div className="hidden w-full h-full items-center justify-center bg-gradient-to-br from-primary to-secondary">
                        <div className="text-center text-white">
                            <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm">🖼️ Gambar</span>
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
                        <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                            <path d="M14 2v6h6"/>
                            <path d="M9 13h6"/>
                            <path d="M9 17h6"/>
                            <path d="M9 9h1"/>
                        </svg>
                        <span className="text-sm">📄 PDF</span>
                    </div>
                );
            } else if (['xlsx', 'xls'].includes(fileExtension)) {
                return (
                    <div className="text-center">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                            <path d="M14 2v6h6"/>
                            <path d="M9 13h6"/>
                            <path d="M9 17h6"/>
                            <path d="M9 9h1"/>
                        </svg>
                        <span className="text-sm">📊 Excel</span>
                    </div>
                );
            } else if (['docx', 'doc'].includes(fileExtension)) {
                return (
                    <div className="text-center">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                            <path d="M14 2v6h6"/>
                            <path d="M9 13h6"/>
                            <path d="M9 17h6"/>
                            <path d="M9 9h1"/>
                        </svg>
                        <span className="text-sm">📝 Word</span>
                    </div>
                );
            } else if (['pptx', 'ppt'].includes(fileExtension)) {
                return (
                    <div className="text-center">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                            <path d="M14 2v6h6"/>
                            <path d="M9 13h6"/>
                            <path d="M9 17h6"/>
                            <path d="M9 9h1"/>
                        </svg>
                        <span className="text-sm">📊 PowerPoint</span>
                    </div>
                );
            }
        }

        // Fallback berdasarkan kategori
        return (
            <div className="text-center">
                <img
                    src="https://images.icon-icons.com/1715/PNG/512/2730367-box-inkcontober-pandora-shattered-square_112695.png"
                    alt="Logo Pandora"
                    className="w-16 h-16 mx-auto mb-2 object-contain"
                />
            </div>
        );
    };

    // Animation variants
    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -20 }
    };

    const pageTransition = {
        type: "tween",
        ease: "anticipate",
        duration: 0.5
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.2,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
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
        <motion.div 
            className="py-4 sm:py-10 max-w-7xl mx-auto bg-neutral min-h-screen px-4 sm:px-6"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
        >
            {/* Custom Notification */}
            <CustomNotification notification={notification} setNotification={setNotification} />

            <motion.div 
                className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
                variants={itemVariants}
            >
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-secondary">Kelola Dokumentasi</h2>
                    <p className="text-gray-600 mt-1 text-sm sm:text-base">Kelola dokumentasi dan template untuk website</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-3 sm:px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Tambah Dokumentasi
                    </button>
                    <Link
                        to="/admin/dashboard"
                        className="px-3 sm:px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Kembali ke Dashboard
                    </Link>
                </div>
            </motion.div>

            {/* Search and Filter Section */}
            <motion.div 
                className="bg-white rounded-xl shadow p-4 sm:p-6 border border-neutral/50 mb-4 sm:mb-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="flex flex-col gap-3 sm:gap-4">
                    {/* Search Bar */}
                    <div className="w-full">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Cari dokumentasi..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm sm:text-base"
                            />
                            <svg className="absolute left-3 top-2.5 sm:top-3.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                        <button
                            onClick={() => setActiveCategory('all')}
                            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                                activeCategory === 'all'
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Semua ({dokumentasi.length})
                        </button>
                        <button
                            onClick={() => setActiveCategory('modul')}
                            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                                activeCategory === 'modul'
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            📋 Modul ({dokumentasi.filter(d => d.category === 'modul').length})
                        </button>
                        <button
                            onClick={() => setActiveCategory('buku_panduan')}
                            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                                activeCategory === 'buku_panduan'
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            📝 Panduan ({dokumentasi.filter(d => d.category === 'buku_panduan').length})
                        </button>
                        <button
                            onClick={() => setActiveCategory('template')}
                            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                                activeCategory === 'template'
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            📄 Template ({dokumentasi.filter(d => d.category === 'template').length})
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Results Count */}
            <motion.div 
                className="mb-4 sm:mb-6"
                variants={itemVariants}
            >
                <p className="text-gray-600 text-sm sm:text-base">
                    Menampilkan {filteredData.length} dokumentasi
                </p>
            </motion.div>

            {/* Documentation Grid */}
            <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {filteredData.map((item) => (
                    <motion.div 
                        key={item?.id || Math.random()} 
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        variants={itemVariants}
                    >
                        {/* Thumbnail */}
                        <div className="h-32 sm:h-48 bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
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
                        <div className="p-3 sm:p-6">
                            <h3 className="text-base sm:text-lg font-semibold text-text-main mb-2 line-clamp-2">
                                {item?.title 
                                    ? item.title.length > 40 
                                        ? item.title.substring(0, 40) + '...' 
                                        : item.title
                                    : 'Judul tidak tersedia'
                                }
                            </h3>
                            <p className="text-text-secondary text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">
                                {item?.description || 'Deskripsi tidak tersedia'}
                            </p>

                            {/* Meta Info */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 mb-3 sm:mb-4 gap-1 sm:gap-0">
                                <span className="truncate">Oleh: {item?.author || 'Anonim'}</span>
                                <span className="flex-shrink-0">
                                    {item?.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : 'Tanggal tidak tersedia'}
                                </span>
                            </div>

                            {/* Downloads Count */}
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-3 sm:mb-4">
                                <span className="flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    {item?.downloads || 0} downloads
                                </span>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    item?.category === 'template' ? 'bg-blue-100 text-blue-800' :
                                    item?.category === 'modul' ? 'bg-green-100 text-green-800' :
                                    'bg-purple-100 text-purple-800'
                                }`}>
                                    {item?.category === 'template' ? '📄 Template' :
                                     item?.category === 'modul' ? '📋 Modul' :
                                     '📝 Panduan'}
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEditClick(item)}
                                    className="flex-1 bg-blue-500 text-white py-2 px-2 sm:px-3 rounded text-xs sm:text-sm hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
                                >
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    <span className="hidden sm:inline">Edit</span>
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(item)}
                                    className="flex-1 bg-red-500 text-white py-2 px-2 sm:px-3 rounded text-xs sm:text-sm hover:bg-red-600 transition-colors flex items-center justify-center gap-1"
                                >
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    <span className="hidden sm:inline">Hapus</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Empty State */}
            {filteredData.length === 0 && (
                <motion.div 
                    className="text-center py-12"
                    variants={itemVariants}
                >
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada dokumentasi ditemukan</h3>
                    <p className="text-gray-500 mb-4">Coba ubah filter atau kata kunci pencarian Anda</p>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
                    >
                        Tambah Dokumentasi Pertama
                    </button>
                </motion.div>
            )}

            {/* Add Documentation Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                        <div className="p-4 sm:p-6">
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Tambah Dokumentasi Baru</h2>
                                <button
                                    onClick={handleCloseModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                                >
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                                {/* Title */}
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                        Judul Dokumentasi *
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm sm:text-base"
                                        placeholder="Contoh: Template Laporan Keuangan Desa"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                        Deskripsi *
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm sm:text-base"
                                        placeholder="Deskripsi singkat tentang dokumentasi ini"
                                    />
                                </div>

                                {/* Author */}
                                <div>
                                    <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                        Penulis *
                                    </label>
                                    <input
                                        type="text"
                                        id="author"
                                        name="author"
                                        value={formData.author}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm sm:text-base"
                                        placeholder="Nama penulis"
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                        Kategori *
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm sm:text-base"
                                    >
                                        <option value="template">📄 Template</option>
                                        <option value="modul">📋 Modul</option>
                                        <option value="buku_panduan">📝 Panduan</option>
                                    </select>
                                </div>

                                {/* File Upload Section */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">File Dokumentasi *</label>
                                    
                                    {/* Upload File Section */}
                                    <div className="space-y-4">
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                                                onChange={handleDocumentFileChange}
                                                className="hidden"
                                                id="documentUpload"
                                            />
                                            <label htmlFor="documentUpload" className="cursor-pointer">
                                                <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium text-primary hover:text-secondary">Upload file</span>
                                                </p>
                                                <p className="text-xs text-gray-500">PDF, Word, Excel, PowerPoint hingga 50MB</p>
                                            </label>
                                        </div>
                                        
                                        {/* Document Preview */}
                                        {documentPreview && (
                                            <div className="relative bg-gray-50 p-3 rounded-lg border">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        <span className="text-sm text-gray-700 truncate">{documentPreview}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={removeDocument}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* OR Divider */}
                                        <div className="flex items-center">
                                            <div className="flex-1 border-t border-gray-300"></div>
                                            <span className="px-3 text-sm text-gray-500">ATAU</span>
                                            <div className="flex-1 border-t border-gray-300"></div>
                                        </div>
                                        
                                        {/* URL Input */}
                                        <div>
                                            <input
                                                type="url"
                                                id="file_url"
                                                name="file_url"
                                                value={formData.file_url}
                                                onChange={handleFileUrlChange}
                                                disabled={!!documentFile}
                                                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                                                    documentFile ? 'bg-gray-100 cursor-not-allowed' : ''
                                                }`}
                                                placeholder="https://example.com/file.pdf"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                {documentFile ? 'Hapus file yang diupload untuk menggunakan URL' : 'Masukkan URL file dari internet'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Thumbnail Upload Section */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail (Opsional)</label>
                                    
                                    <div className="space-y-4">
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleThumbnailFileChange}
                                                className="hidden"
                                                id="thumbnailUpload"
                                            />
                                            <label htmlFor="thumbnailUpload" className="cursor-pointer">
                                                <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium text-primary hover:text-secondary">Upload gambar</span>
                                                </p>
                                                <p className="text-xs text-gray-500">PNG, JPG, GIF hingga 5MB</p>
                                            </label>
                                        </div>
                                        
                                        {/* Thumbnail Preview */}
                                        {thumbnailPreview && (
                                            <div className="relative">
                                                <img 
                                                    src={thumbnailPreview} 
                                                    alt="Preview" 
                                                    className="w-full h-32 object-cover rounded-lg border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeThumbnail}
                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                        
                                        {/* OR Divider */}
                                        <div className="flex items-center">
                                            <div className="flex-1 border-t border-gray-300"></div>
                                            <span className="px-3 text-sm text-gray-500">ATAU</span>
                                            <div className="flex-1 border-t border-gray-300"></div>
                                        </div>
                                        
                                        {/* URL Input */}
                                        <div>
                                            <input
                                                type="url"
                                                id="thumbnail_url"
                                                name="thumbnail_url"
                                                value={formData.thumbnail_url}
                                                onChange={handleThumbnailUrlChange}
                                                disabled={!!thumbnailFile}
                                                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                                                    thumbnailFile ? 'bg-gray-100 cursor-not-allowed' : ''
                                                }`}
                                                placeholder="https://example.com/thumbnail.jpg"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                {thumbnailFile ? 'Hapus gambar yang diupload untuk menggunakan URL' : 'Masukkan URL gambar dari internet'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || isUploadingDocument || isUploadingThumbnail}
                                        className="flex-1 px-3 sm:px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                    >
                                        {(isSubmitting || isUploadingDocument || isUploadingThumbnail) ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                {isUploadingDocument ? 'Mengupload file...' : 
                                                 isUploadingThumbnail ? 'Mengupload gambar...' : 
                                                 'Menyimpan...'}
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                        <div className="p-4 sm:p-6">
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Edit Dokumentasi</h2>
                                <button
                                    onClick={handleCloseEditModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                                >
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleEditSubmit} className="space-y-3 sm:space-y-4">
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

                                {/* File Upload Section */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">File Dokumentasi *</label>
                                    
                                    {/* Upload File Section */}
                                    <div className="space-y-4">
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                                                onChange={handleDocumentFileChange}
                                                className="hidden"
                                                id="editDocumentUpload"
                                            />
                                            <label htmlFor="editDocumentUpload" className="cursor-pointer">
                                                <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium text-primary hover:text-secondary">Upload file baru</span>
                                                </p>
                                                <p className="text-xs text-gray-500">PDF, Word, Excel, PowerPoint hingga 50MB</p>
                                            </label>
                                        </div>
                                        
                                        {/* Document Preview */}
                                        {documentPreview && (
                                            <div className="relative bg-gray-50 p-3 rounded-lg border">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        <span className="text-sm text-gray-700 truncate">{documentPreview}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={removeDocument}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* OR Divider */}
                                        <div className="flex items-center">
                                            <div className="flex-1 border-t border-gray-300"></div>
                                            <span className="px-3 text-sm text-gray-500">ATAU</span>
                                            <div className="flex-1 border-t border-gray-300"></div>
                                        </div>
                                        
                                        {/* URL Input */}
                                        <div>
                                            <input
                                                type="url"
                                                id="edit-file_url"
                                                name="file_url"
                                                value={formData.file_url}
                                                onChange={handleFileUrlChange}
                                                disabled={!!documentFile}
                                                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                                                    documentFile ? 'bg-gray-100 cursor-not-allowed' : ''
                                                }`}
                                                placeholder="https://example.com/file.pdf"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                {documentFile ? 'Hapus file yang diupload untuk menggunakan URL' : 'Masukkan URL file dari internet'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Thumbnail Upload Section */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail (Opsional)</label>
                                    
                                    <div className="space-y-4">
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleThumbnailFileChange}
                                                className="hidden"
                                                id="editThumbnailUpload"
                                            />
                                            <label htmlFor="editThumbnailUpload" className="cursor-pointer">
                                                <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium text-primary hover:text-secondary">Upload gambar baru</span>
                                                </p>
                                                <p className="text-xs text-gray-500">PNG, JPG, GIF hingga 5MB</p>
                                            </label>
                                        </div>
                                        
                                        {/* Thumbnail Preview */}
                                        {thumbnailPreview && (
                                            <div className="relative">
                                                <img 
                                                    src={thumbnailPreview} 
                                                    alt="Preview" 
                                                    className="w-full h-32 object-cover rounded-lg border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeThumbnail}
                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                        
                                        {/* OR Divider */}
                                        <div className="flex items-center">
                                            <div className="flex-1 border-t border-gray-300"></div>
                                            <span className="px-3 text-sm text-gray-500">ATAU</span>
                                            <div className="flex-1 border-t border-gray-300"></div>
                                        </div>
                                        
                                        {/* URL Input */}
                                        <div>
                                            <input
                                                type="url"
                                                id="edit-thumbnail_url"
                                                name="thumbnail_url"
                                                value={formData.thumbnail_url}
                                                onChange={handleThumbnailUrlChange}
                                                disabled={!!thumbnailFile}
                                                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                                                    thumbnailFile ? 'bg-gray-100 cursor-not-allowed' : ''
                                                }`}
                                                placeholder="https://example.com/thumbnail.jpg"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                {thumbnailFile ? 'Hapus gambar yang diupload untuk menggunakan URL' : 'Masukkan URL gambar dari internet'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
                                    <button
                                        type="button"
                                        onClick={handleCloseEditModal}
                                        className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isEditing || isUploadingDocument || isUploadingThumbnail}
                                        className="flex-1 px-3 sm:px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                    >
                                        {(isEditing || isUploadingDocument || isUploadingThumbnail) ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                {isUploadingDocument ? 'Mengupload file...' : 
                                                 isUploadingThumbnail ? 'Mengupload gambar...' : 
                                                 'Menyimpan...'}
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
        </motion.div>
    );
};

export default KelolaDokumentasi;

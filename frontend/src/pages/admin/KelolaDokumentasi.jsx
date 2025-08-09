import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDokumentasiKKN } from '../../context/DokumentasiKKNContext';
import CustomNotification from '../../components/CustomNotification';

const KelolaDokumentasi = () => {
    const { dokumentasi, refetchDokumentasi: fetchDokumentasi, updateDokumentasi, deleteDokumentasi, searchDokumentasi, addDokumentasi } = useDokumentasiKKN();
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        author: '',
        category: 'template',
        file_url: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [documentFile, setDocumentFile] = useState(null);
    const [documentPreview, setDocumentPreview] = useState('');
    const [isUploadingDocument, setIsUploadingDocument] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deletingItem, setDeletingItem] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    // Show notification
    const showNotification = (type, message) => {
        setNotification({ show: true, type, message });
    };

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
                showNotification('error', 'Hanya file PDF, Word, Excel, atau PowerPoint yang diizinkan!');
                return;
            }
            
            setDocumentFile(file);
            setDocumentPreview(file.name);
            
            // Clear URL field if user uploads file
            setFormData({ ...formData, file_url: '' });
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
            showNotification('error', 'Gagal upload dokumen!');
            return null;
        } finally {
            setIsUploadingDocument(false);
        }
    };

    // Remove document file
    const removeDocument = () => {
        setDocumentFile(null);
        setDocumentPreview('');
        setFormData({ ...formData, file_url: '' });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let documentUrl = formData.file_url;
            
            // Upload document file if user selected a file
            if (documentFile) {
                documentUrl = await uploadDocument();
                if (!documentUrl) {
                    // If upload failed, stop the process
                    setIsSubmitting(false);
                    return;
                }
            }
            
            const formDataToSubmit = { 
                ...formData, 
                file_url: documentUrl
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
                file_url: ''
            });
            setDocumentFile(null);
            setDocumentPreview('');
        } catch (error) {
            console.error('Error adding documentation:', error);
            showNotification('error', 'Gagal menambahkan dokumentasi. Silakan coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseAddModal = () => {
        setShowAddModal(false);
        setFormData({
            title: '',
            description: '',
            author: '',
            category: 'template',
            file_url: ''
        });
        setDocumentFile(null);
        setDocumentPreview('');
    };

    const handleEditClick = (item) => {
        setEditingItem(item);
        setFormData({
            title: item.title || '',
            description: item.description || '',
            author: item.author || '',
            category: item.category || 'template',
            file_url: item.download_url || item.file_url || ''
        });
        
        // Set previews from existing data
        if (item.download_url || item.file_url) {
            setDocumentPreview(item.download_url || item.file_url);
        }
        
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setIsEditing(true);

        try {
            let documentUrl = formData.file_url;
            
            // Upload document file if user selected a new file
            if (documentFile) {
                documentUrl = await uploadDocument();
                if (!documentUrl) {
                    setIsEditing(false);
                    return;
                }
            }
            
            const formDataToSubmit = { 
                ...formData, 
                file_url: documentUrl
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
                file_url: ''
            });
            setDocumentFile(null);
            setDocumentPreview('');
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
            file_url: ''
        });
        setDocumentFile(null);
        setDocumentPreview('');
    };

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
            // Refresh data to ensure UI is updated
            fetchDokumentasi();
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

    // Get file preview icon
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

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            {/* Custom Notification */}
            <CustomNotification
                notification={notification}
                setNotification={setNotification}
            />

            {/* Header */}
            <div className="max-w-7xl mx-auto">
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                                Kelola Dokumentasi KKN
                            </h1>
                            <p className="text-gray-600 text-sm sm:text-base">
                                Kelola template, modul, dan panduan untuk dokumentasi KKN
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <Link 
                                to="/admin/dashboard"
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm sm:text-base flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Kembali ke Dashboard
                            </Link>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Tambah Dokumentasi
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
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
                                    placeholder="Cari dokumentasi..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm sm:text-base"
                                />
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="lg:w-64">
                            <select
                                value={activeCategory}
                                onChange={(e) => setActiveCategory(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm sm:text-base"
                            >
                                <option value="all">Semua Kategori</option>
                                <option value="template">📄 Template</option>
                                <option value="modul">📋 Modul</option>
                                <option value="buku_panduan">📝 Panduan</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Dokumentasi Grid */}
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
                            {/* Document Header */}
                            <div className="p-4 sm:p-6 bg-gradient-to-br from-primary to-secondary">
                                <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-lg flex items-center justify-center">
                                            <div className="text-white text-2xl">
                                                {getFilePreview(item)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-white text-sm sm:text-base mb-1 line-clamp-2">{item.title}</h3>
                                        <p className="text-white/80 text-xs sm:text-sm">
                                            {item?.category === 'template' ? '📄 Template' :
                                             item?.category === 'modul' ? '📋 Modul' :
                                             '📝 Panduan'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-3 sm:p-6">
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
                                    {/* File Type Badge */}
                                    {item.download_url && (
                                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                            {item.download_url.toLowerCase().includes('.pdf') ? '📄 PDF' :
                                             item.download_url.toLowerCase().includes('.doc') ? '📝 DOC' :
                                             item.download_url.toLowerCase().includes('.xls') ? '📊 XLS' :
                                             item.download_url.toLowerCase().includes('.ppt') ? '📊 PPT' :
                                             '📁 File'}
                                        </span>
                                    )}
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
                            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Tambah Dokumentasi Pertama
                        </button>
                    </motion.div>
                )}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
                            <h2 className="text-xl font-semibold text-gray-900">Tambah Dokumentasi</h2>
                            <button
                                onClick={handleCloseAddModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-4 sm:p-6">
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
                                        placeholder="Masukkan judul dokumentasi"
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm sm:text-base resize-none"
                                        placeholder="Masukkan deskripsi dokumentasi"
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
                                        placeholder="Masukkan nama penulis"
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

                                {/* File Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        File Dokumen *
                                    </label>
                                    
                                    {/* File Upload Area */}
                                    <div className="space-y-3">
                                        <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                                            documentFile ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-primary'
                                        }`}>
                                            {documentFile ? (
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-center gap-2 text-green-600">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span className="text-sm font-medium">File terpilih: {documentFile.name}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={removeDocument}
                                                        className="text-xs text-red-600 hover:text-red-800"
                                                    >
                                                        Hapus file
                                                    </button>
                                                </div>
                                            ) : (
                                                <div>
                                                    <input
                                                        type="file"
                                                        id="document-upload"
                                                        onChange={handleDocumentFileChange}
                                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                                                        className="hidden"
                                                    />
                                                    <label htmlFor="document-upload" className="cursor-pointer">
                                                        <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                        </svg>
                                                        <p className="text-sm text-gray-600 mb-1">
                                                            <span className="font-medium text-primary">Klik untuk upload</span> atau drag & drop
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            PDF, Word, Excel, PowerPoint (Max. 50MB)
                                                        </p>
                                                    </label>
                                                </div>
                                            )}
                                        </div>

                                        {/* OR Divider */}
                                        <div className="flex items-center">
                                            <div className="flex-1 border-t border-gray-300"></div>
                                            <div className="px-3 text-sm text-gray-500 bg-white">ATAU</div>
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
                                                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm sm:text-base ${
                                                    documentFile ? 'bg-gray-100 cursor-not-allowed' : ''
                                                }`}
                                                placeholder="https://example.com/document.pdf"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                {documentFile ? 'Hapus file yang diupload untuk menggunakan URL' : 'Masukkan URL dokumen dari internet'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleCloseAddModal}
                                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || isUploadingDocument}
                                        className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                {isUploadingDocument ? 'Mengupload file...' : 'Menyimpan...'}
                                            </div>
                                        ) : (
                                            'Tambah Dokumentasi'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
                            <h2 className="text-xl font-semibold text-gray-900">Edit Dokumentasi</h2>
                            <button
                                onClick={handleCloseEditModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-4 sm:p-6">
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
                                        placeholder="Masukkan judul dokumentasi"
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                                        placeholder="Masukkan deskripsi dokumentasi"
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
                                        placeholder="Masukkan nama penulis"
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

                                {/* File Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        File Dokumen *
                                    </label>
                                    
                                    {/* File Upload Area */}
                                    <div className="space-y-3">
                                        <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                                            documentFile ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-primary'
                                        }`}>
                                            {documentFile ? (
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-center gap-2 text-green-600">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span className="text-sm font-medium">File baru: {documentFile.name}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={removeDocument}
                                                        className="text-xs text-red-600 hover:text-red-800"
                                                    >
                                                        Hapus file
                                                    </button>
                                                </div>
                                            ) : (
                                                <div>
                                                    <input
                                                        type="file"
                                                        id="edit-document-upload"
                                                        onChange={handleDocumentFileChange}
                                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                                                        className="hidden"
                                                    />
                                                    <label htmlFor="edit-document-upload" className="cursor-pointer">
                                                        <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                        </svg>
                                                        <p className="text-sm text-gray-600 mb-1">
                                                            <span className="font-medium text-primary">Klik untuk upload file baru</span>
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            PDF, Word, Excel, PowerPoint (Max. 50MB)
                                                        </p>
                                                    </label>
                                                </div>
                                            )}
                                        </div>

                                        {/* OR Divider */}
                                        <div className="flex items-center">
                                            <div className="flex-1 border-t border-gray-300"></div>
                                            <div className="px-3 text-sm text-gray-500 bg-white">ATAU</div>
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
                                                placeholder="https://example.com/document.pdf"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                {documentFile ? 'Hapus file yang diupload untuk menggunakan URL' : 'Masukkan URL dokumen dari internet'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleCloseEditModal}
                                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isEditing || isUploadingDocument}
                                        className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isEditing ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                {isUploadingDocument ? 'Mengupload file...' : 'Menyimpan...'}
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

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Hapus Dokumentasi</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Apakah Anda yakin ingin menghapus dokumentasi "{deletingItem?.title}"?
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-6">
                                Tindakan ini tidak dapat dibatalkan. Dokumentasi akan dihapus secara permanen.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleCloseDeleteModal}
                                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
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
        </div>
    );
};

export default KelolaDokumentasi;

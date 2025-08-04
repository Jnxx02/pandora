import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const TambahDokumentasi = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [form, setForm] = useState({
        title: '',
        description: '',
        category: 'template',
        author: 'KKN-T 114',
        file_url: '',
        download_url: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

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
                // Redirect to login if not admin
                navigate('/admin/login');
            } catch (error) {
                console.error('Error checking admin status:', error);
                navigate('/admin/login');
            }
        };

        checkAdminStatus();
    }, [navigate]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Validasi form
            if (!form.title || !form.description || !form.category) {
                setError('Judul, deskripsi, dan kategori harus diisi');
                setIsLoading(false);
                return;
            }

            // Simulasi API call untuk menambah dokumentasi
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Redirect ke halaman dokumentasi setelah berhasil
            navigate('/dokumentasi-kkn', { 
                state: { message: 'Dokumentasi berhasil ditambahkan!' }
            });
        } catch (error) {
            setError('Terjadi kesalahan saat menambah dokumentasi');
            setIsLoading(false);
        }
    };

    if (!isAdmin) {
        return null; // Will redirect to login
    }

    return (
        <motion.div 
            className="min-h-screen bg-neutral"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/dokumentasi-kkn')}
                        className="flex items-center gap-2 text-primary hover:text-secondary transition-colors mb-4"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali ke Dokumentasi
                    </button>
                    <h1 className="text-3xl font-bold text-primary mb-2">Tambah Dokumentasi</h1>
                    <p className="text-text-secondary">Tambahkan dokumentasi baru ke koleksi KKN</p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Judul */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Judul Dokumentasi *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="Contoh: Template BUMDes"
                                required
                            />
                        </div>

                        {/* Deskripsi */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Deskripsi *
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="Jelaskan isi dan manfaat dokumentasi ini..."
                                required
                            />
                        </div>

                        {/* Kategori */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                Kategori *
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                required
                            >
                                <option value="template">📊 Template</option>
                                <option value="modul">📚 Modul</option>
                                <option value="buku_panduan">📖 Buku Panduan</option>
                            </select>
                        </div>

                        {/* Penulis */}
                        <div>
                            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                                Penulis
                            </label>
                            <input
                                type="text"
                                id="author"
                                name="author"
                                value={form.author}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="KKN-T 114"
                            />
                        </div>

                        {/* URL File */}
                        <div>
                            <label htmlFor="file_url" className="block text-sm font-medium text-gray-700 mb-2">
                                URL File (Opsional)
                            </label>
                            <input
                                type="url"
                                id="file_url"
                                name="file_url"
                                value={form.file_url}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="https://example.com/file.pdf"
                            />
                        </div>

                        {/* URL Download */}
                        <div>
                            <label htmlFor="download_url" className="block text-sm font-medium text-gray-700 mb-2">
                                URL Download (Opsional)
                            </label>
                            <input
                                type="url"
                                id="download_url"
                                name="download_url"
                                value={form.download_url}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="https://example.com/download"
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 bg-primary text-white py-3 px-6 rounded-lg hover:bg-secondary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Tambah Dokumentasi
                                    </>
                                )}
                            </button>
                                                            <button
                                    type="button"
                                    onClick={() => navigate('/dokumentasi-kkn')}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                >
                                    Batal
                                </button>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default TambahDokumentasi; 
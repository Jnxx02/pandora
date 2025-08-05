import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBerita } from '../../context/BeritaContext';
import { usePengaduan } from '../../context/PengaduanContext';

const Dashboard = () => {
  const { berita } = useBerita();
  const { pengaduan, loading } = usePengaduan();
  const [statistik, setStatistik] = useState([]);

  useEffect(() => {
    try {
      // Load statistik data
      const storedStatistik = localStorage.getItem('statistik');
      const statistikData = storedStatistik ? JSON.parse(storedStatistik) : [];
      setStatistik(statistikData);
    } catch (error) {
      console.error("Gagal memuat data statistik:", error);
    }
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Tanggal tidak tersedia';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Tanggal tidak valid';
      
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Tanggal tidak tersedia';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'selesai':
        return 'bg-green-100 text-green-800';
      case 'proses':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  // Get recent laporan (last 3)
  const recentLaporan = pengaduan.slice(-3).reverse();
  
  // Get recent berita (last 3)
  const recentBerita = berita.slice(0, 3);

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
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="min-h-screen bg-neutral"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          variants={itemVariants}
        >
          <h1 className="text-3xl font-bold text-secondary mb-2">Dashboard Admin</h1>
          <p className="text-gray-600">Selamat datang di panel admin Desa Moncongloe Bulu</p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-lg border border-neutral/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Berita</p>
                <p className="text-2xl font-bold text-primary">{berita.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-lg border border-neutral/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Laporan</p>
                <p className="text-2xl font-bold text-primary">{pengaduan.length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4a2 2 0 00-1.81 1.81V19a2 2 0 002 2h12a2 2 0 002-2V5.81A2 2 0 0019.81 4H4.19zM16 2v4M8 2v4M3 10h18"></path>
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-lg border border-neutral/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Data Statistik</p>
                <p className="text-2xl font-bold text-primary">{statistik.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-lg border border-neutral/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Website Status</p>
                <p className="text-2xl font-bold text-green-600">Online</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Complaints Summary */}
        <motion.div 
          className="mb-8"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="bg-white rounded-xl shadow-lg border border-neutral/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-secondary">Ringkasan Pengaduan</h2>
              <Link to="/admin/pengaduan" className="text-primary hover:text-secondary text-sm font-medium">
                Kelola Pengaduan →
              </Link>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2 text-gray-600">Memuat data pengaduan...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Pending Complaints */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-600">Menunggu Proses</p>
                      <p className="text-2xl font-bold text-red-700">
                        {pengaduan.filter(item => item.status === 'pending').length}
                      </p>
                    </div>
                    <div className="p-2 bg-red-100 rounded-lg">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* In Progress Complaints */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-600">Sedang Diproses</p>
                      <p className="text-2xl font-bold text-yellow-700">
                        {pengaduan.filter(item => item.status === 'proses').length}
                      </p>
                    </div>
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Completed Complaints */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Selesai</p>
                      <p className="text-2xl font-bold text-green-700">
                        {pengaduan.filter(item => item.status === 'selesai').length}
                      </p>
                    </div>
                    <div className="p-2 bg-green-100 rounded-lg">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Warning for pending complaints */}
            {pengaduan.filter(item => item.status === 'pending').length > 0 && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                  <span className="text-red-700 font-medium">
                    Ada {pengaduan.filter(item => item.status === 'pending').length} pengaduan yang belum diproses
                  </span>
                  <Link 
                    to="/admin/pengaduan" 
                    className="ml-auto text-red-600 hover:text-red-800 text-sm font-medium underline"
                  >
                    Proses Sekarang
                  </Link>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Recent Berita */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-neutral/50">
            <div className="p-6 border-b border-neutral/100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-secondary">Berita Terbaru</h2>
                <Link to="/berita" className="text-primary hover:text-secondary text-sm font-medium">
                  Lihat Semua →
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentBerita.length > 0 ? (
                <div className="space-y-4">
                  {recentBerita.map((beritaItem, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {beritaItem.judul || 'Judul tidak tersedia'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(beritaItem.tanggal_publikasi)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                  </svg>
                  <p className="text-gray-500 mb-4">Belum ada berita yang dipublikasikan</p>
                  <Link 
                    to="/admin/berita" 
                    className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Tambah Berita Pertama
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Laporan */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-neutral/50">
            <div className="p-6 border-b border-neutral/100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-secondary">Laporan Terbaru</h2>
                <Link to="/admin/pengaduan" className="text-primary hover:text-secondary text-sm font-medium">
                  Lihat Semua →
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentLaporan.length > 0 ? (
                <div className="space-y-4">
                  {recentLaporan.map((laporan, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4a2 2 0 00-1.81 1.81V19a2 2 0 002 2h12a2 2 0 002-2V5.81A2 2 0 0019.81 4H4.19zM16 2v4M8 2v4M3 10h18"></path>
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {laporan.nama || 'Anonim'}
                          </p>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(laporan.status)}`}>
                            {laporan.status || 'Baru'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {formatDate(laporan.tanggal_pengaduan)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4a2 2 0 00-1.81 1.81V19a2 2 0 002 2h12a2 2 0 002-2V5.81A2 2 0 0019.81 4H4.19zM16 2v4M8 2v4M3 10h18"></path>
                  </svg>
                  <p className="text-gray-500">Belum ada laporan</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="mt-8 bg-white rounded-xl shadow-lg border border-neutral/50"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="p-6 border-b border-neutral/100">
            <h2 className="text-xl font-semibold text-secondary">Aksi Cepat</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/admin/berita" className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <div className="p-2 bg-blue-500 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Tambah Berita</p>
                    <p className="text-sm text-gray-500">Buat berita baru</p>
                  </div>
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/admin/statistik" className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <div className="p-2 bg-green-500 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Edit Statistik</p>
                    <p className="text-sm text-gray-500">Update data statistik</p>
                  </div>
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/admin/prasarana" className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <div className="p-2 bg-purple-500 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Edit Prasarana</p>
                    <p className="text-sm text-gray-500">Kelola prasarana</p>
                  </div>
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/" className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                  <div className="p-2 bg-orange-500 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Lihat Website</p>
                    <p className="text-sm text-gray-500">Kunjungi halaman utama</p>
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
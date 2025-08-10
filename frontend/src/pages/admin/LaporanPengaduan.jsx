import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePengaduan } from '../../context/PengaduanContext';
import CustomNotification from '../../components/CustomNotification';

// Komponen Modal yang akan menampilkan detail isi laporan
const DetailModal = ({ laporan, onClose }) => {
  if (!laporan) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    // Backdrop / Overlay
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Konten Modal dengan gaya baru */}
      <motion.div 
        className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] sm:max-h-[80vh] overflow-y-auto relative"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <div className="flex items-center justify-between mb-4 border-b border-neutral pb-3">
          <h3 className="text-xl font-bold text-secondary">{laporan.judul}</h3>
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={onClose}
              className="text-text-secondary hover:text-primary transition"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Informasi Pelapor */}
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Informasi Pelapor</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="font-medium text-gray-600">Nama:</span> 
                <span className="text-gray-900 sm:ml-2">{laporan.nama || 'Anonim'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="font-medium text-gray-600">Email:</span> 
                <span className="text-gray-900 sm:ml-2 break-all">{laporan.email || '-'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="font-medium text-gray-600">WhatsApp:</span> 
                <span className="text-gray-900 sm:ml-2">{laporan.whatsapp || '-'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="font-medium text-gray-600">Status:</span> 
                <span className={`sm:ml-2 px-2 py-1 rounded-full text-xs font-medium mt-1 sm:mt-0 ${
                  laporan.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  laporan.status === 'selesai' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {laporan.status === 'pending' ? 'Menunggu' : 
                   laporan.status === 'selesai' ? 'Selesai' : laporan.status}
                </span>
              </div>
            </div>
          </div>

          {/* Detail Laporan */}
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Detail Laporan</h4>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="font-medium text-gray-600">Klasifikasi:</span> 
                <span className="text-gray-900 sm:ml-2">{laporan.klasifikasi}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="font-medium text-gray-600">Kategori:</span> 
                <span className="text-gray-900 sm:ml-2">{laporan.kategori}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="font-medium text-gray-600">Tanggal Kejadian:</span> 
                <span className="text-gray-900 sm:ml-2">{formatDate(laporan.tanggal_kejadian)}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="font-medium text-gray-600">Tanggal Pengaduan:</span> 
                <span className="text-gray-900 sm:ml-2">{formatDate(laporan.tanggal_pengaduan)}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="font-medium text-gray-600">Tanggal Ditangani:</span>
                <span className="text-gray-900 sm:ml-2">
                  {laporan.tanggal_ditangani ? formatDate(laporan.tanggal_ditangani) : 'Belum ditangani'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="font-medium text-gray-600">IP Address:</span>
                <span className="text-gray-900 sm:ml-2 break-all">{laporan.client_ip || 'Tidak tersedia'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start">
                <span className="font-medium text-gray-600">User Agent:</span>
                <span className="text-gray-900 sm:ml-2 break-all">{laporan.user_agent ? laporan.user_agent.substring(0, 100) + '...' : 'Tidak tersedia'}</span>
              </div>
            </div>
          </div>

          {/* Isi Laporan */}
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Isi Laporan</h4>
            <p className="text-text-main whitespace-pre-wrap text-xs sm:text-sm leading-relaxed">{laporan.isi}</p>
          </div>

          {/* Lampiran */}
          {laporan.lampiran_data_url && (
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center text-sm sm:text-base">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                Lampiran
              </h4>
              
              <div className="space-y-3">
                {/* File Info */}
                <div className="flex items-center justify-between bg-white p-3 rounded-md border">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{laporan.lampiran_info || 'Lampiran'}</p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {Math.round(laporan.lampiran_data_url.length / 1024)} KB • {laporan.lampiran_type || 'Image'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                    onClick={() => {
                      try {
                        fetch(laporan.lampiran_data_url)
                          .then(response => response.blob())
                          .then(blob => {
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = laporan.lampiran_info || 'lampiran.jpg';
                            document.body.appendChild(a);
                            a.click();
                            window.URL.revokeObjectURL(url);
                            document.body.removeChild(a);
                          })
                          .catch(error => {
                            console.error('Error downloading image:', error);
                            showNotification('error', 'Gagal mengunduh gambar. Silakan coba lagi.');
                          });
                      } catch (error) {
                        console.error('Error with image URL:', error);
                        showNotification('error', 'Gambar tidak dapat diakses.');
                      }
                    }}
                    className="flex-1 bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm hover:bg-blue-600 transition-colors flex items-center justify-center"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download
                  </button>
                  
                  <button
                    onClick={() => {
                      try {
                        const newWindow = window.open();
                        newWindow.document.write(`
                          <html>
                            <head>
                              <title>Preview Lampiran</title>
                              <style>
                                body { margin: 0; padding: 20px; background: #f5f5f5; font-family: Arial, sans-serif; }
                                img { max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                                .container { text-align: center; max-width: 800px; margin: 0 auto; }
                                .header { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                                .info { background: #e6fffa; padding: 15px; border-radius: 8px; margin: 15px 0; font-size: 14px; text-align: left; }
                                .loading { color: #3182ce; background: #ebf8ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
                                .error { color: #e53e3e; background: #fed7d7; padding: 20px; border-radius: 8px; margin: 20px 0; }
                              </style>
                            </head>
                            <body>
                              <div class="container">
                                <div class="header">
                                  <h2>Preview Lampiran</h2>
                                  <div class="info">
                                    <strong>File:</strong> ${laporan.lampiran_info}<br>
                                    <strong>Ukuran:</strong> ${Math.round(laporan.lampiran_data_url.length / 1024)} KB<br>
                                    <strong>Tipe:</strong> ${laporan.lampiran_type || 'Image'}
                                  </div>
                                </div>
                                <div class="loading">Memuat gambar...</div>
                                <img src="${laporan.lampiran_data_url}" alt="Lampiran" 
                                  onload="document.querySelector('.loading').style.display='none';"
                                  onerror="this.parentElement.innerHTML='<div class=error>Gambar tidak dapat ditampilkan. Silakan download file untuk melihatnya.</div>'"/>
                              </div>
                            </body>
                          </html>
                        `);
                        newWindow.document.close();
                      } catch (error) {
                        console.error('Error opening image:', error);
                        showNotification('error', 'Gagal membuka gambar. Silakan download file untuk melihatnya.');
                      }
                    }}
                    className="flex-1 bg-green-500 text-white px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm hover:bg-green-600 transition-colors flex items-center justify-center"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Preview
                  </button>
                </div>

                {/* Warning for large files */}
                {laporan.lampiran_data_url.length > 500000 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                    <div className="flex">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <div>
                        <p className="text-xs sm:text-sm text-yellow-800">
                          <strong>File besar:</strong> Gunakan tombol Download untuk mengunduh file dengan ukuran optimal.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Catatan Admin */}
          {laporan.catatan_admin && (
            <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">Catatan Admin</h4>
              <p className="text-blue-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{laporan.catatan_admin}</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Komponen Modal Preview Laporan
const PreviewModal = ({ laporan, onClose, onDownload }) => {
  if (!laporan) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Menunggu';
      case 'proses': return 'Proses';
      case 'selesai': return 'Selesai';
      default: return status || 'Baru';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'proses': return 'bg-blue-100 text-blue-800';
      case 'selesai': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white rounded-lg shadow-xl p-6 w-11/12 md:w-4/5 lg:w-3/4 max-h-[90vh] overflow-y-auto relative"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <div className="flex items-center justify-between mb-6 border-b border-neutral pb-4">
          <div>
            <h3 className="text-2xl font-bold text-secondary">Preview Laporan</h3>
            <p className="text-sm text-gray-500">Laporan akan ditampilkan seperti ini saat di-download</p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button
              onClick={() => onDownload(laporan)}
              className="bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600 transition-colors flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </motion.button>
            <motion.button
              onClick={onClose}
              className="text-text-secondary hover:text-primary transition"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="bg-gray-50 p-6 rounded-lg border">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            {/* Header */}
            <div className="text-center border-b-2 border-gray-300 pb-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">LAPORAN WARGA</h1>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">{laporan.judul}</h2>
              <p className="text-gray-600">Desa Moncongloe Bulu</p>
              <p className="text-sm text-gray-500 mt-2">Kecamatan Moncongloe, Kabupaten Maros, Sulawesi Selatan</p>
            </div>

            {/* Informasi Pelapor */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-600 border-b border-gray-200 pb-2 mb-4">INFORMASI PELAPOR</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-gray-700">Nama:</span>
                  <span className="ml-2 text-gray-900">{laporan.nama || 'Anonim'}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Email:</span>
                  <span className="ml-2 text-gray-900">{laporan.email || '-'}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">WhatsApp:</span>
                  <span className="ml-2 text-gray-900">{laporan.whatsapp || '-'}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Status:</span>
                  <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(laporan.status)}`}>
                    {getStatusText(laporan.status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Detail Laporan */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-600 border-b border-gray-200 pb-2 mb-4">DETAIL LAPORAN</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-gray-700">ID Laporan:</span>
                  <span className="ml-2 text-gray-900">{laporan.id}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Klasifikasi:</span>
                  <span className="ml-2 text-gray-900">{laporan.klasifikasi}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Kategori:</span>
                  <span className="ml-2 text-gray-900">{laporan.kategori}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Tanggal Kejadian:</span>
                  <span className="ml-2 text-gray-900">{formatDate(laporan.tanggal_kejadian)}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Tanggal Pengaduan:</span>
                  <span className="ml-2 text-gray-900">{formatDate(laporan.tanggal_pengaduan)}</span>
                </div>
                {laporan.tanggal_ditangani && (
                  <div>
                    <span className="font-semibold text-gray-700">Tanggal Ditangani:</span>
                    <span className="ml-2 text-gray-900">{formatDate(laporan.tanggal_ditangani)}</span>
                  </div>
                )}
                <div>
                  <span className="font-semibold text-gray-700">IP Address:</span>
                  <span className="ml-2 text-gray-900">{laporan.client_ip || 'Tidak tersedia'}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">User Agent:</span>
                  <span className="ml-2 text-gray-900">{laporan.user_agent ? laporan.user_agent.substring(0, 100) + '...' : 'Tidak tersedia'}</span>
                </div>
              </div>
            </div>

            {/* Isi Laporan */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-600 border-b border-gray-200 pb-2 mb-4">ISI LAPORAN</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">{laporan.isi}</p>
              </div>
            </div>

            {/* Lampiran */}
            {laporan.lampiran_info && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-blue-600 border-b border-gray-200 pb-2 mb-4">LAMPIRAN</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="font-semibold text-gray-700">File:</span>
                      <span className="ml-2 text-gray-900">{laporan.lampiran_info}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Ukuran:</span>
                      <span className="ml-2 text-gray-900">{laporan.lampiran_size ? Math.round(laporan.lampiran_size / 1024) : 'Unknown'} KB</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Tipe:</span>
                      <span className="ml-2 text-gray-900">{laporan.lampiran_type || 'Unknown'}</span>
                    </div>
                  </div>
                  {laporan.lampiran_data_url && (
                    <div className="mt-4">
                      <img 
                        src={laporan.lampiran_data_url} 
                        alt={laporan.lampiran_info} 
                        className="max-w-full max-h-64 border border-gray-300 rounded-lg shadow-sm"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <div className="hidden text-center text-gray-500 text-sm py-4">
                        Gambar tidak dapat ditampilkan. Silakan download file untuk melihatnya.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Catatan Admin */}
            {laporan.catatan_admin && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-blue-600 border-b border-gray-200 pb-2 mb-4">CATATAN ADMIN</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-900 leading-relaxed whitespace-pre-wrap">{laporan.catatan_admin}</p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-300 text-center text-sm text-gray-500">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div className="flex-1 text-left">
                  <p>Dokumen ini dibuat secara otomatis pada {new Date().toLocaleDateString('id-ID')} {new Date().toLocaleTimeString('id-ID')}</p>
                </div>
                <div className="flex-1 text-right">
                  <p>© 2025 Desa Moncongloe Bulu</p>
                  <p>Sistem Pengaduan Warga</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Komponen Tabel Laporan yang sudah dimodifikasi
const LaporanTable = ({ title, data, onShowDetail, onDelete, onUpdateStatus }) => {
  // Debug: Log the data being passed to the table
  console.log(`🔍 LaporanTable ${title} data:`, data);
  if (data && data.length > 0) {
    console.log(`🔍 First ${title} item:`, data[0]);
    console.log(`🔍 First ${title} ID:`, data[0].id);
  }
  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Add scroll event listener to show/hide scroll indicators
  React.useEffect(() => {
    const container = document.getElementById('tableContainer');
    if (container) {
      const handleScroll = () => {
        const leftIndicator = container.querySelector('.left-scroll-indicator');
        const rightIndicator = container.querySelector('.right-scroll-indicator');
        
        if (leftIndicator && rightIndicator) {
          // Show left indicator if scrolled right
          leftIndicator.style.opacity = container.scrollLeft > 0 ? '1' : '0';
          // Show right indicator if there's more content to scroll
          rightIndicator.style.opacity = 
            container.scrollLeft < (container.scrollWidth - container.clientWidth) ? '1' : '0';
        }
      };

      container.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
      
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <motion.div 
      className="rounded-lg border border-neutral"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Mobile Card View - Enhanced */}
      <div className="md:hidden">
        {data.length > 0 ? (
          <div className="space-y-4 p-4">
            {data.map((laporan, index) => (
              <motion.div 
                key={laporan.id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">{laporan.judul}</h3>
                    <p className="text-xs text-gray-500">No: {index + 1} • {formatDate(laporan.tanggal_pengaduan)}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-2">
                    <select
                      value={laporan.status || 'pending'}
                      onChange={(e) => onUpdateStatus(laporan.id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        laporan.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        laporan.status === 'selesai' ? 'bg-green-100 text-green-800 border-green-200' :
                        'bg-gray-100 text-gray-800 border-gray-200'
                      }`}
                    >
                      <option value="pending">Menunggu</option>
                      <option value="proses">Proses</option>
                      <option value="selesai">Selesai</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pelapor:</span>
                    <span className="text-gray-900 font-medium">{laporan.nama || 'Anonim'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kategori:</span>
                    <span className="text-gray-900">{laporan.kategori}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Isi:</span>
                    <span className="text-gray-900 text-xs truncate max-w-48">{laporan.isi || '-'}</span>
                  </div>
                  {laporan.email && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="text-gray-900 text-xs truncate max-w-32">{laporan.email}</span>
                    </div>
                  )}
                  {laporan.whatsapp && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">WhatsApp:</span>
                      <span className="text-gray-900">{laporan.whatsapp}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">IP:</span>
                    <span className="text-gray-900 text-xs">{laporan.client_ip || '-'}</span>
                  </div>
                </div>

                {/* Lampiran Info */}
                {laporan.lampiran_data_url && (
                  <div className="mt-3 p-2 bg-green-50 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        <span className="text-xs text-green-700 font-medium">Ada Lampiran</span>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => {
                            try {
                              const newWindow = window.open();
                              newWindow.document.write(`
                                <html>
                                  <head>
                                    <title>Preview Lampiran</title>
                                    <style>
                                      body { margin: 0; padding: 20px; background: #f5f5f5; font-family: Arial, sans-serif; }
                                      img { max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                                      .container { text-align: center; max-width: 800px; margin: 0 auto; }
                                      .header { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                                      .info { background: #e6fffa; padding: 15px; border-radius: 8px; margin: 15px 0; font-size: 14px; text-align: left; }
                                      .loading { color: #3182ce; background: #ebf8ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
                                      .error { color: #e53e3e; background: #fed7d7; padding: 20px; border-radius: 8px; margin: 20px 0; }
                                    </style>
                                  </head>
                                  <body>
                                    <div class="container">
                                      <div class="header">
                                        <h2>Preview Lampiran</h2>
                                        <div class="info">
                                          <strong>File:</strong> ${laporan.lampiran_info}<br>
                                          <strong>Ukuran:</strong> ${Math.round(laporan.lampiran_data_url.length / 1024)} KB<br>
                                          <strong>Tipe:</strong> ${laporan.lampiran_type || 'Image'}
                                        </div>
                                      </div>
                                      <div class="loading">Memuat gambar...</div>
                                      <img src="${laporan.lampiran_data_url}" alt="Lampiran" 
                                        onload="document.querySelector('.loading').style.display='none';"
                                        onerror="this.parentElement.innerHTML='<div class=error>Gambar tidak dapat ditampilkan. Silakan download file untuk melihatnya.</div>'"/>
                                    </div>
                                  </body>
                                </html>
                              `);
                              newWindow.document.close();
                            } catch (error) {
                              console.error('Error opening image:', error);
                              showNotification('error', 'Gagal membuka gambar. Silakan download file untuk melihatnya.');
                            }
                          }}
                          className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                          title="Lihat lampiran"
                        >
                          Lihat
                        </button>
                        <button
                          onClick={() => {
                            try {
                              fetch(laporan.lampiran_data_url)
                                .then(response => response.blob())
                                .then(blob => {
                                  const url = window.URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = laporan.lampiran_info || 'lampiran.jpg';
                                  document.body.appendChild(a);
                                  a.click();
                                  window.URL.revokeObjectURL(url);
                                  document.body.removeChild(a);
                                })
                                .catch(error => {
                                  console.error('Error downloading image:', error);
                                  showNotification('error', 'Gagal mengunduh gambar. Silakan coba lagi.');
                                });
                            } catch (error) {
                              console.error('Error with image URL:', error);
                              showNotification('error', 'Gambar tidak dapat diakses.');
                            }
                          }}
                          className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition-colors"
                          title="Download lampiran"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2 mt-3">
                  <motion.button
                    onClick={() => onShowDetail(laporan)}
                    className="flex-1 bg-white text-primary border-2 border-primary px-3 py-2 rounded-md text-xs hover:bg-primary hover:text-white transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Detail
                  </motion.button>
                  <motion.button
                    onClick={() => onDelete(laporan.id)}
                    className="flex-1 bg-red-500 text-white px-3 py-2 rounded-md text-xs font-semibold hover:bg-red-600 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Hapus
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-text-secondary">
            <div className="flex flex-col items-center space-y-2">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm sm:text-base">Belum ada data untuk kategori ini.</p>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Table View - Enhanced with horizontal scroll */}
      <div className="hidden md:block">
        <div className="overflow-x-auto relative" id="tableContainer">
          <div className="inline-block min-w-[1200px] align-middle">
            <div className="overflow-hidden shadow-sm border-0 relative">
              <div className="text-xs text-gray-500 mb-2 text-center bg-blue-50 p-2 rounded border border-blue-200">
                💡 <strong>Tips:</strong> Geser ke kanan untuk melihat tombol aksi (Detail & Hapus)
                <button 
                  onClick={() => {
                    const container = document.getElementById('tableContainer');
                    if (container) {
                      container.scrollTo({
                        left: container.scrollWidth,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className="ml-2 bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
                >
                  📍 Lihat Tombol Aksi
                </button>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 right-scroll-indicator transition-opacity duration-200"></div>
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 left-scroll-indicator transition-opacity duration-200" style={{opacity: 0}}></div>
              <table className="min-w-full divide-y divide-neutral">
                {/* Header tabel dengan warna neutral dan teks secondary */}
                <thead className="bg-neutral/60">
                  <tr>
                    <th className="py-3 px-2 border-b border-neutral text-left text-xs font-semibold text-secondary uppercase tracking-wider w-10">No</th>
                    <th className="py-3 px-2 border-b border-neutral text-left text-xs font-semibold text-secondary uppercase tracking-wider w-20">Tanggal</th>
                    <th className="py-3 px-2 border-b border-neutral text-left text-xs font-semibold text-secondary uppercase tracking-wider w-28">Pelapor</th>
                    <th className="py-3 px-2 border-b border-neutral text-left text-xs font-semibold text-secondary uppercase tracking-wider w-40">Judul</th>
                    <th className="py-3 px-2 border-b border-neutral text-left text-xs font-semibold text-secondary uppercase tracking-wider w-36">Isi Laporan</th>
                    <th className="py-3 px-2 border-b border-neutral text-left text-xs font-semibold text-secondary uppercase tracking-wider w-24">Kategori</th>
                    <th className="py-3 px-2 border-b border-neutral text-center text-xs font-semibold text-secondary uppercase tracking-wider w-20">Status</th>
                    <th className="py-3 px-2 border-b border-neutral text-center text-xs font-semibold text-secondary uppercase tracking-wider w-24">IP Address</th>
                    <th className="py-3 px-2 border-b border-neutral text-center text-xs font-semibold text-secondary uppercase tracking-wider w-24">Lampiran</th>
                    <th className="py-3 px-2 border-b border-neutral text-center text-xs font-semibold text-secondary uppercase tracking-wider w-28 sticky right-0 bg-neutral/60 shadow-[-2px_0_5px_rgba(0,0,0,0.1)]">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral">
                  {data.length > 0 ? (
                    data.map((laporan, index) => (
                      // Baris tabel dengan warna teks yang sesuai
                      <motion.tr 
                        key={laporan.id} 
                        className="hover:bg-neutral/40 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <td className="py-3 px-2 border-b border-neutral text-text-secondary text-xs font-medium">{index + 1}</td>
                        <td className="py-3 px-2 border-b border-neutral text-text-main text-xs">{formatDate(laporan.tanggal_pengaduan)}</td>
                        <td className="py-3 px-2 border-b border-neutral text-text-main text-xs">
                          <div className="max-w-[110px]">
                            <div className="font-medium truncate" title={laporan.nama || 'Anonim'}>{laporan.nama || 'Anonim'}</div>
                            <div className="text-xs text-text-secondary truncate">
                              {laporan.email && `${laporan.email}`}
                              {laporan.email && laporan.whatsapp && ' / '}
                              {laporan.whatsapp && `${laporan.whatsapp}`}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2 border-b border-neutral text-text-main font-semibold text-xs">
                          <div className="max-w-[160px] truncate" title={laporan.judul}>
                            {laporan.judul}
                          </div>
                        </td>
                        <td className="py-3 px-2 border-b border-neutral text-text-main text-xs">
                          <div className="max-w-[140px] truncate" title={laporan.isi || '-'}>
                            {laporan.isi || '-'}
                          </div>
                        </td>
                        <td className="py-3 px-2 border-b border-neutral text-text-main text-xs">{laporan.kategori}</td>
                        <td className="py-3 px-2 border-b border-neutral text-center">
                          <select
                            value={laporan.status || 'pending'}
                            onChange={(e) => onUpdateStatus(laporan.id, e.target.value)}
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${
                              laporan.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                              laporan.status === 'selesai' ? 'bg-green-100 text-green-800 border-green-200' :
                              'bg-gray-100 text-gray-800 border-gray-200'
                            }`}
                          >
                            <option value="pending">Menunggu</option>
                            <option value="proses">Proses</option>
                            <option value="selesai">Selesai</option>
                          </select>
                        </td>
                        <td className="py-3 px-2 border-b border-neutral text-center text-text-main text-xs font-mono">{laporan.client_ip || '-'}</td>
                        <td className="py-3 px-2 border-b border-neutral text-center">
                          {laporan.lampiran_data_url ? (
                            <div className="flex flex-col items-center space-y-1">
                              <div className="flex items-center space-x-1">
                                <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                </svg>
                                <span className="text-xs text-green-600 font-medium">Ada</span>
                              </div>
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => {
                                    try {
                                      const newWindow = window.open();
                                      newWindow.document.write(`
                                        <html>
                                          <head>
                                            <title>Preview Lampiran</title>
                                            <style>
                                              body { margin: 0; padding: 20px; background: #f5f5f5; font-family: Arial, sans-serif; }
                                              img { max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                                              .container { text-align: center; max-width: 800px; margin: 0 auto; }
                                              .header { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                                              .info { background: #e6fffa; padding: 15px; border-radius: 8px; margin: 15px 0; font-size: 14px; text-align: left; }
                                              .loading { color: #3182ce; background: #ebf8ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
                                              .error { color: #e53e3e; background: #fed7d7; padding: 20px; border-radius: 8px; margin: 20px 0; }
                                            </style>
                                          </head>
                                          <body>
                                            <div class="container">
                                              <div class="header">
                                                <h2>Preview Lampiran</h2>
                                                <div class="info">
                                                  <strong>File:</strong> ${laporan.lampiran_info}<br>
                                                  <strong>Ukuran:</strong> ${Math.round(laporan.lampiran_data_url.length / 1024)} KB<br>
                                                  <strong>Tipe:</strong> ${laporan.lampiran_type || 'Image'}
                                                </div>
                                              </div>
                                              <div class="loading">Memuat gambar...</div>
                                              <img src="${laporan.lampiran_data_url}" alt="Lampiran" 
                                                onload="document.querySelector('.loading').style.display='none';"
                                                onerror="this.parentElement.innerHTML='<div class=error>Gambar tidak dapat ditampilkan. Silakan download file untuk melihatnya.</div>'"/>
                                            </div>
                                          </body>
                                        </html>
                                      `);
                                      newWindow.document.close();
                                    } catch (error) {
                                      console.error('Error opening image:', error);
                                      showNotification('error', 'Gagal membuka gambar. Silakan download file untuk melihatnya.');
                                    }
                                  }}
                                  className="text-xs bg-blue-500 text-white px-1 py-0.5 rounded hover:bg-blue-600 transition-colors"
                                  title="Lihat lampiran"
                                >
                                  Lihat
                                </button>
                                <button
                                  onClick={() => {
                                    try {
                                      fetch(laporan.lampiran_data_url)
                                        .then(response => response.blob())
                                        .then(blob => {
                                          const url = window.URL.createObjectURL(blob);
                                          const a = document.createElement('a');
                                          a.href = url;
                                          a.download = laporan.lampiran_info || 'lampiran.jpg';
                                          document.body.appendChild(a);
                                          a.click();
                                          window.URL.revokeObjectURL(url);
                                          document.body.removeChild(a);
                                        })
                                        .catch(error => {
                                          console.error('Error downloading image:', error);
                                          showNotification('error', 'Gagal mengunduh gambar. Silakan coba lagi.');
                                        });
                                    } catch (error) {
                                      console.error('Error with image URL:', error);
                                      showNotification('error', 'Gambar tidak dapat diakses.');
                                    }
                                  }}
                                  className="text-xs bg-green-500 text-white px-1 py-0.5 rounded hover:bg-green-600 transition-colors"
                                  title="Download lampiran"
                                >
                                  Download
                                </button>
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-2 border-b border-neutral text-center sticky right-0 bg-white shadow-[-2px_0_5px_rgba(0,0,0,0.1)]">
                          <div className="flex items-center justify-center space-x-1">
                            {/* Debug: Log the laporan object */}
                            {console.log('🔍 Rendering delete button for laporan:', laporan)}
                            {console.log('🔍 Laporan ID in render:', laporan.id)}
                            
                            {/* Tombol "Lihat" dengan gaya baru */}
                            <motion.button
                              onClick={() => onShowDetail(laporan)}
                              className="bg-white text-primary border-2 border-primary px-2 py-1 rounded-md text-xs hover:bg-primary hover:text-white transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Detail
                            </motion.button>
                            {/* Tombol "Hapus" dengan warna dari palet */}
                            <motion.button
                              onClick={() => {
                                console.log('🔍 Delete button clicked for laporan:', laporan);
                                console.log('🔍 Laporan ID:', laporan.id);
                                console.log('🔍 Laporan keys:', Object.keys(laporan));
                                onDelete(laporan);
                              }}
                              className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold hover:bg-red-600 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Hapus
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      {/* Teks menggunakan warna 'text-text-secondary' */}
                      <td colSpan="10" className="text-center py-8 text-text-secondary">
                        <div className="flex flex-col items-center space-y-2">
                          <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <p className="text-sm sm:text-base">Belum ada data untuk kategori ini.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Helper functions untuk format data
const getSizeCategory = (size) => {
  if (!size) return 'Unknown';
  if (size < 1024) return 'Kecil';
  if (size < 10240) return 'Sedang';
  if (size < 102400) return 'Besar';
  return 'Sangat Besar';
};

const getTypeIcon = (type) => {
  if (!type) return '📄';
  if (type.includes('jpeg') || type.includes('jpg')) return '🖼️';
  if (type.includes('png')) return '🖼️';
  if (type.includes('gif')) return '🎬';
  return '📄';
};

// Komponen Utama
function LaporanPengaduan() {
  const { pengaduan, loading, error, refetchPengaduan, updatePengaduan, deletePengaduan } = usePengaduan();
  const [activeTab, setActiveTab] = useState('pengaduan');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLaporan, setSelectedLaporan] = useState(null);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [downloadPeriod, setDownloadPeriod] = useState('all'); // all, weekly, monthly, yearly
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingLaporan, setDeletingLaporan] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
  };

  // Filter data berdasarkan klasifikasi
  console.log('🔍 Raw pengaduan data:', pengaduan);
  const laporanPengaduan = pengaduan.filter(l => l.klasifikasi === 'pengaduan');
  const laporanAspirasi = pengaduan.filter(l => l.klasifikasi === 'aspirasi');
  console.log('🔍 Filtered laporanPengaduan:', laporanPengaduan);
  console.log('🔍 Filtered laporanAspirasi:', laporanAspirasi);

  // Function untuk filter data berdasarkan periode
  const filterDataByPeriod = (data, period) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (period) {
      case 'weekly':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return data.filter(l => {
          const reportDate = new Date(l.tanggal_pengaduan);
          return reportDate >= weekAgo && reportDate <= today;
        });
      
      case 'monthly':
        const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        return data.filter(l => {
          const reportDate = new Date(l.tanggal_pengaduan);
          return reportDate >= monthAgo && reportDate <= today;
        });
      
      case 'yearly':
        const yearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        return data.filter(l => {
          const reportDate = new Date(l.tanggal_pengaduan);
          return reportDate >= yearAgo && reportDate <= today;
        });
      
      default: // 'all'
        return data;
    }
  };

  // Function untuk mendapatkan nama periode
  const getPeriodName = (period) => {
    switch (period) {
      case 'weekly': return 'Mingguan';
      case 'monthly': return 'Bulanan';
      case 'yearly': return 'Tahunan';
      default: return 'Semua';
    }
  };

  const handleDelete = async (id) => {
    // This function is now replaced by handleDeleteClick and handleDeleteConfirm
    // Keeping it for backward compatibility but it should not be used
    console.warn('handleDelete is deprecated, use handleDeleteClick instead');
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updatePengaduan(id, { status: newStatus });
      showNotification('success', 'Status laporan berhasil diupdate!');
    } catch (error) {
      console.error("Error updating pengaduan status:", error);
      showNotification('error', 'Gagal mengupdate status laporan.');
    }
  };

  const handleShowDetail = (laporan) => {
    setSelectedLaporan(laporan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLaporan(null);
  };

  const handleDeleteClick = (laporan) => {
    console.log('🔍 Delete clicked for laporan:', laporan);
    console.log('🔍 Laporan ID:', laporan.id);
    console.log('🔍 Laporan keys:', Object.keys(laporan));
    console.log('🔍 Laporan nama:', laporan.nama);
    console.log('🔍 Laporan judul:', laporan.judul);
    console.log('🔍 Laporan isi:', laporan.isi);
    setDeletingLaporan(laporan);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingLaporan) return;
    
    console.log('🔍 Confirming delete for laporan:', deletingLaporan);
    console.log('🔍 DeletingLaporan ID:', deletingLaporan.id);
    console.log('🔍 DeletingLaporan nama:', deletingLaporan.nama);
    console.log('🔍 DeletingLaporan judul:', deletingLaporan.judul);
    console.log('🔍 DeletingLaporan isi:', deletingLaporan.isi);
    
    setIsDeleting(true);
    try {
      await deletePengaduan(deletingLaporan.id);
      showNotification('success', 'Laporan berhasil dihapus!');
      setShowDeleteModal(false);
      setDeletingLaporan(null);
    } catch (error) {
      console.error("Error deleting pengaduan:", error);
      showNotification('error', 'Gagal menghapus laporan.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingLaporan(null);
  };

  // Function untuk download semua laporan dalam format PDF berdasarkan periode
  const downloadBulkReports = (laporanList) => {
    try {
      // Filter data berdasarkan periode yang dipilih
      const filteredData = filterDataByPeriod(laporanList, downloadPeriod);
      
      if (filteredData.length === 0) {
        showNotification('warning', `Tidak ada laporan ${activeTab} untuk periode ${getPeriodName(downloadPeriod)}`);
        return;
      }

      // Generate comprehensive PDF content for bulk reports
      const pdfContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Laporan ${activeTab === 'pengaduan' ? 'Pengaduan' : 'Aspirasi'} ${getPeriodName(downloadPeriod)} - ${new Date().toLocaleDateString('id-ID')}</title>
          <style>
            @page {
              size: A4;
              margin: 2cm;
            }
            body { 
              font-family: 'Times New Roman', serif; 
              margin: 0; 
              padding: 20px; 
              line-height: 1.6;
              color: #333;
            }
            .header { 
              text-align: center; 
              border-bottom: 3px solid #333; 
              padding-bottom: 20px; 
              margin-bottom: 30px; 
            }
            .logo-container {
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 15px;
            }
            .logo {
              width: 80px;
              height: 80px;
              margin-right: 20px;
            }
            .header h1 { 
              font-size: 24px; 
              font-weight: bold; 
              margin: 0 0 10px 0;
              text-transform: uppercase;
            }
            .header h2 { 
              font-size: 18px; 
              font-weight: bold; 
              margin: 0 0 5px 0;
              color: #2563eb;
            }
            .header p { 
              margin: 5px 0; 
              font-size: 14px;
            }
            .summary { 
              background-color: #f3f4f6; 
              padding: 20px; 
              border-radius: 8px; 
              margin-bottom: 30px;
              border: 2px solid #e5e7eb;
            }
            .summary h3 { 
              margin-top: 0; 
              color: #2563eb; 
              font-size: 18px;
              text-transform: uppercase;
              border-bottom: 2px solid #2563eb;
              padding-bottom: 10px;
            }
            .summary-grid { 
              display: grid; 
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
              gap: 20px; 
              margin-top: 20px;
            }
            .summary-item { 
              text-align: center; 
              background: white;
              padding: 15px;
              border-radius: 8px;
              border: 1px solid #e5e7eb;
            }
            .summary-number { 
              font-size: 28px; 
              font-weight: bold; 
              color: #2563eb; 
              margin-bottom: 5px;
            }
            .summary-label { 
              font-size: 14px; 
              color: #6b7280; 
              font-weight: 500;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 30px;
              font-size: 12px;
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 10px; 
              text-align: left; 
              vertical-align: top;
            }
            th { 
              background-color: #f9fafb; 
              font-weight: bold;
              text-transform: uppercase;
              font-size: 11px;
              color: #374151;
            }
            .status { 
              padding: 4px 8px; 
              border-radius: 4px; 
              font-size: 11px; 
              font-weight: bold;
              text-transform: uppercase;
            }
            .status-pending { background-color: #fef3c7; color: #92400e; }
            .status-proses { background-color: #dbeafe; color: #1e40af; }
            .status-selesai { background-color: #d1fae5; color: #065f46; }
            .attachment-link {
              display: inline-block;
              background-color: #2563eb;
              color: white;
              padding: 5px 10px;
              border-radius: 4px;
              text-decoration: none;
              font-size: 11px;
              font-weight: bold;
              margin: 2px;
              border: 1px solid #1d4ed8;
            }
            .footer { 
              margin-top: 40px; 
              text-align: center; 
              font-size: 12px; 
              color: #6b7280;
              border-top: 1px solid #ddd;
              padding-top: 20px;
            }
            .footer-content {
              display: flex;
              justify-content: space-between;
              align-items: center;
              flex-wrap: wrap;
              gap: 10px;
            }
            .footer-left, .footer-right {
              flex: 1;
              min-width: 200px;
            }
            .page-break { page-break-before: always; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
              .page-break { page-break-before: always; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo-container">
              <img src="https://desamoncongloe.com/img/logo.png" alt="Logo Desa Moncongloe Bulu" class="logo">
              <div>
                <h1>LAPORAN ${activeTab === 'pengaduan' ? 'PENGADUAN' : 'ASPIRASI'} WARGA</h1>
                <h2>Desa Moncongloe Bulu</h2>
                <p>Kecamatan Moncongloe, Kabupaten Maros, Sulawesi Selatan</p>
                <p>Kode Pos: 90564</p>
              </div>
            </div>
            <div style="text-align: right; margin-top: 15px; font-size: 12px; color: #666;">
              <p><strong>Periode:</strong> ${getPeriodName(downloadPeriod)}</p>
              <p><strong>Tanggal:</strong> ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          <div class="summary">
            <h3>RINGKASAN STATISTIK</h3>
            <div class="summary-grid">
              <div class="summary-item">
                <div class="summary-number">${filteredData.length}</div>
                <div class="summary-label">Total Laporan</div>
              </div>
              <div class="summary-item">
                <div class="summary-number">${filteredData.filter(l => l.status === 'pending').length}</div>
                <div class="summary-label">Menunggu</div>
              </div>
              <div class="summary-item">
                <div class="summary-number">${filteredData.filter(l => l.status === 'proses').length}</div>
                <div class="summary-label">Proses</div>
              </div>
              <div class="summary-item">
                <div class="summary-number">${filteredData.filter(l => l.status === 'selesai').length}</div>
                <div class="summary-label">Selesai</div>
              </div>
              <div class="summary-item">
                <div class="summary-number">${filteredData.filter(l => l.lampiran_info).length}</div>
                <div class="summary-label">Dengan Lampiran</div>
              </div>
              <div class="summary-item">
                <div class="summary-number">${filteredData.filter(l => l.client_ip).length}</div>
                <div class="summary-label">Dengan IP Address</div>
              </div>
            </div>
            <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 12px; margin-top: 20px; font-size: 12px; color: #92400e; text-align: left;">
              <strong>📝 Catatan Penting:</strong> Untuk melihat gambar lampiran dengan benar, buka file PDF ini di browser web (Chrome, Firefox, Safari, dll). Gambar tidak akan terlihat jika dibuka di aplikasi PDF desktop.
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Tanggal</th>
                <th>Pelapor</th>
                <th>Judul Laporan</th>
                <th>Isi Laporan</th>
                <th>Kategori</th>
                <th>Status</th>
                <th>IP Address</th>
                <th>Lampiran</th>
              </tr>
            </thead>
            <tbody>
              ${filteredData.map((l, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${l.tanggal_pengaduan ? new Date(l.tanggal_pengaduan).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-'}</td>
                  <td>${l.nama || 'Anonim'}</td>
                  <td>${l.judul}</td>
                  <td style="max-width: 200px; word-wrap: break-word;">${l.isi || '-'}</td>
                  <td>${l.kategori}</td>
                  <td><span class="status status-${l.status || 'pending'}">${l.status === 'pending' ? 'MENUNGGU' : l.status === 'proses' ? 'PROSES' : l.status === 'selesai' ? 'SELESAI' : l.status}</span></td>
                  <td>${l.client_ip || '-'}</td>
                  <td>
                    ${l.lampiran_data_url ? `
                      <div style="text-align: center;">
                        <div style="margin-bottom: 5px; font-weight: bold; color: #2563eb;">${l.lampiran_info || 'Lampiran'}</div>
                        <div style="font-size: 10px; color: #666; margin-bottom: 10px;">
                          ${Math.round(l.lampiran_data_url.length / 1024)} KB • ${l.lampiran_type || 'Image'}
                        </div>
                        <a href="${l.lampiran_data_url}" target="_blank" class="attachment-link">Lihat Gambar</a>
                        <div style="font-size: 9px; color: #9ca3af; margin-top: 5px;">
                          * Klik untuk melihat di browser
                        </div>
                      </div>
                    ` : '-'}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <div class="footer-content">
              <div className="flex-1 text-center">
                <p><strong>Dokumen ini dibuat secara otomatis pada:</strong> ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
              </div>
            </div>
            <div style="text-align: left; margin-top: 10px; font-size: 10px; color: #9ca3af;">
              <p>* Untuk melihat gambar lampiran, buka file PDF ini di browser web</p>
            </div>
            </div>
            <div style="text-align: center; margin-top: 20px; padding-top: 10px; border-top: 1px solid #ddd;">
              <p>© 2025 Desa Moncongloe Bulu</p>
              <p>Sistem Pengaduan Warga</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Create a new window with the PDF content
      const newWindow = window.open('', '_blank');
      newWindow.document.write(pdfContent);
      newWindow.document.close();
      
      // Wait for content to load then print
      newWindow.onload = function() {
        newWindow.print();
      };
      
      showNotification('success', `Berhasil membuka ${filteredData.length} laporan ${activeTab} periode ${getPeriodName(downloadPeriod)} untuk print!`);
    } catch (error) {
      console.error('Error downloading bulk reports:', error);
      showNotification('error', 'Gagal membuka laporan.');
    }
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

  return (
    <motion.div 
      className="py-6 sm:py-10 max-w-7xl mx-auto bg-neutral min-h-screen px-3 sm:px-4"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <motion.div 
        className="bg-white rounded-xl shadow p-4 sm:p-6 border border-neutral/50"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="mb-4 sm:mb-6"
          variants={itemVariants}
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-secondary">Laporan Warga</h2>
              <p className="text-text-secondary mt-1 text-sm lg:text-base">Kelola dan pantau laporan pengaduan dan aspirasi warga</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
              {/* Filter Periode Download */}
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Periode:</label>
                <select
                  value={downloadPeriod}
                  onChange={(e) => setDownloadPeriod(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent flex-1 sm:flex-none"
                >
                  <option value="all">Semua</option>
                  <option value="weekly">Mingguan</option>
                  <option value="monthly">Bulanan</option>
                  <option value="yearly">Tahunan</option>
                </select>
              </div>
              
              {/* Tombol Download */}
              <motion.button
                onClick={() => downloadBulkReports(activeTab === 'pengaduan' ? laporanPengaduan : laporanAspirasi)}
                className="bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600 transition-colors flex items-center justify-center w-full sm:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="hidden sm:inline">Download {activeTab === 'pengaduan' ? 'Pengaduan' : 'Aspirasi'} {getPeriodName(downloadPeriod)}</span>
                <span className="sm:hidden">Download {activeTab === 'pengaduan' ? 'Pengaduan' : 'Aspirasi'}</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Navigasi Tab dengan gaya baru */}
        <motion.div 
          className="border-b border-neutral"
          variants={itemVariants}
        >
          <nav className="-mb-px flex space-x-4 lg:space-x-8 overflow-x-auto pb-1" aria-label="Tabs">
            <motion.button
              onClick={() => setActiveTab('pengaduan')}
              className={`whitespace-nowrap py-3 lg:py-4 px-2 lg:px-1 border-b-2 font-medium text-xs lg:text-sm transition-colors flex-shrink-0 ${
                activeTab === 'pengaduan'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:text-secondary hover:border-secondary/50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="hidden sm:inline">Pengaduan</span>
              <span className="sm:hidden">Pengaduan</span>
              <span className="ml-1">({laporanPengaduan.length})</span>
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('aspirasi')}
              className={`whitespace-nowrap py-3 lg:py-4 px-2 lg:px-1 border-b-2 font-medium text-xs lg:text-sm transition-colors flex-shrink-0 ${
                activeTab === 'aspirasi'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:text-secondary hover:border-secondary/50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="hidden sm:inline">Aspirasi</span>
              <span className="sm:hidden">Aspirasi</span>
              <span className="ml-1">({laporanAspirasi.length})</span>
            </motion.button>
          </nav>
        </motion.div>

        {loading ? (
          <motion.div 
            className="text-center py-8 text-text-secondary"
            variants={itemVariants}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-primary" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm sm:text-base">Memuat data...</span>
            </div>
          </motion.div>
        ) : error ? (
          <motion.div 
            className="text-center py-8 text-red-500"
            variants={itemVariants}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-sm sm:text-base">Error: {error}</span>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="mt-4 sm:mt-6"
            variants={itemVariants}
          >
            {activeTab === 'pengaduan' && (
              <LaporanTable 
                title="Pengaduan" 
                data={laporanPengaduan} 
                onShowDetail={handleShowDetail} 
                onDelete={handleDeleteClick}
                onUpdateStatus={handleUpdateStatus}
              />
            )}
            {activeTab === 'aspirasi' && (
              <LaporanTable 
                title="Aspirasi" 
                data={laporanAspirasi} 
                onShowDetail={handleShowDetail} 
                onDelete={handleDeleteClick}
                onUpdateStatus={handleUpdateStatus}
              />
            )}
          </motion.div>
        )}
      </motion.div>

      {isModalOpen && <DetailModal laporan={selectedLaporan} onClose={handleCloseModal} />}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingLaporan && (
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
                  Apakah Anda yakin ingin menghapus laporan ini?
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">{deletingLaporan.judul}</h3>
                  <p className="text-sm text-gray-600">{deletingLaporan.isi}</p>
                  <p className="text-xs text-gray-500 mt-2">Oleh: {deletingLaporan.nama || 'Anonim'}</p>
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
                    'Hapus Laporan'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <CustomNotification notification={notification} setNotification={setNotification} />
    </motion.div>
  );
}

export default LaporanPengaduan;
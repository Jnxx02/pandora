import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PanduanAdmin = () => {
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <motion.div 
          className="mb-6 sm:mb-8"
          variants={itemVariants}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-secondary mb-2">Panduan Admin PANDORA</h1>
              <p className="text-gray-600 text-sm sm:text-base">Tata cara pengelolaan website Desa Moncongloe Bulu</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <a 
                href="/assets/PEDOMAN-PANDORA.pdf"
                download="PEDOMAN_PANDORA.pdf"
                className="flex items-center justify-center px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Download PDF
              </a>
              <Link 
                to="/admin/dashboard" 
                className="flex items-center justify-center px-3 sm:px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Kembali ke Dashboard
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="space-y-4 sm:space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Pengelolaan Berita */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-neutral/50 p-4 sm:p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-secondary">Pengelolaan Berita</h2>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Cara Menambah Berita Baru:</h3>
                <ol className="list-decimal list-inside space-y-1 sm:space-y-2 text-gray-700 text-sm sm:text-base pl-2">
                  <li>Klik tombol "Tambah Berita" di dashboard atau menu "Kelola Berita"</li>
                  <li>Isi semua field yang diperlukan (judul, konten, kategori, gambar)</li>
                  <li>Upload gambar berita dengan format JPG, PNG, atau JPEG (maksimal 2MB)</li>
                  <li>Klik "Simpan Berita" untuk menyimpan</li>
                  <li>Berita akan langsung muncul di halaman utama website</li>
                </ol>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Cara Mengedit Berita:</h3>
                <ol className="list-decimal list-inside space-y-1 sm:space-y-2 text-gray-700 text-sm sm:text-base pl-2">
                  <li>Buka menu "Kelola Berita"</li>
                  <li>Klik tombol "Edit" pada berita yang ingin diubah</li>
                  <li>Ubah konten yang diperlukan</li>
                  <li>Klik "Update Berita" untuk menyimpan perubahan</li>
                </ol>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Cara Menghapus Berita:</h3>
                <ol className="list-decimal list-inside space-y-1 sm:space-y-2 text-gray-700 text-sm sm:text-base pl-2">
                  <li>Buka menu "Kelola Berita"</li>
                  <li>Klik tombol "Hapus" pada berita yang ingin dihapus</li>
                  <li>Konfirmasi penghapusan</li>
                  <li>Berita akan dihapus secara permanen</li>
                </ol>
              </div>
            </div>
          </motion.div>

          {/* Pengelolaan Pengaduan */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-neutral/50 p-4 sm:p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4a2 2 0 00-1.81 1.81V19a2 2 0 002 2h12a2 2 0 002-2V5.81A2 2 0 0019.81 4H4.19zM16 2v4M8 2v4M3 10h18"></path>
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-secondary">Pengelolaan Pengaduan</h2>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Cara Mengelola Pengaduan:</h3>
                <ol className="list-decimal list-inside space-y-1 sm:space-y-2 text-gray-700 text-sm sm:text-base pl-2">
                  <li>Buka menu "Kelola Pengaduan" di dashboard</li>
                  <li>Lihat daftar semua pengaduan yang masuk</li>
                  <li>Klik pada pengaduan untuk melihat detail lengkap</li>
                  <li>Update status pengaduan sesuai progress penanganan</li>
                  <li>Tambahkan catatan atau respon untuk pengadu</li>
                </ol>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Status Pengaduan:</h3>
                <ul className="space-y-1 sm:space-y-2 text-gray-700 text-sm sm:text-base pl-2">
                  <li><span className="font-medium text-yellow-600">Pending:</span> Pengaduan baru yang belum diproses</li>
                  <li><span className="font-medium text-blue-600">Proses:</span> Pengaduan sedang dalam penanganan</li>
                  <li><span className="font-medium text-green-600">Selesai:</span> Pengaduan telah selesai ditangani</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Pengelolaan Statistik */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-neutral/50 p-4 sm:p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 sm:p-3 bg-purple-100 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-secondary">Pengelolaan Data Statistik</h2>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Cara Mengupdate Statistik:</h3>
                <ol className="list-decimal list-inside space-y-1 sm:space-y-2 text-gray-700 text-sm sm:text-base pl-2">
                  <li>Klik tombol "Edit Statistik" di dashboard</li>
                  <li>Pilih kategori statistik yang ingin diupdate</li>
                  <li>Masukkan data terbaru sesuai dengan kategori</li>
                  <li>Klik "Simpan" untuk menyimpan perubahan</li>
                  <li>Data akan langsung terupdate di halaman statistik</li>
                </ol>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Kategori Statistik yang Tersedia:</h3>
                <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-gray-700 text-sm sm:text-base pl-2">
                  <li>Data Kependudukan (jumlah penduduk, KK, dll)</li>
                  <li>Data Ekonomi (UMKM, lapangan kerja, dll)</li>
                  <li>Data Pendidikan (jumlah sekolah, siswa, dll)</li>
                  <li>Data Kesehatan (fasilitas kesehatan, dll)</li>
                  <li>Data Infrastruktur (jalan, listrik, air, dll)</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Pengelolaan Prasarana */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-neutral/50 p-4 sm:p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 sm:p-3 bg-orange-100 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-secondary">Pengelolaan Data Prasarana</h2>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Cara Mengupdate Data Prasarana:</h3>
                <ol className="list-decimal list-inside space-y-1 sm:space-y-2 text-gray-700 text-sm sm:text-base pl-2">
                  <li>Klik tombol "Edit Prasarana" di dashboard</li>
                  <li>Pilih jenis prasarana yang ingin diupdate</li>
                  <li>Masukkan data terbaru (nama, lokasi, kondisi, dll)</li>
                  <li>Upload foto prasarana jika diperlukan</li>
                  <li>Klik "Simpan" untuk menyimpan perubahan</li>
                </ol>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Jenis Prasarana yang Dikelola:</h3>
                <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-gray-700 text-sm sm:text-base pl-2">
                  <li>Fasilitas Pendidikan (SD, SMP, SMA, dll)</li>
                  <li>Fasilitas Kesehatan (Puskesmas, Posyandu, dll)</li>
                  <li>Fasilitas Umum (Balai Desa, Masjid, dll)</li>
                  <li>Infrastruktur (Jalan, Jembatan, dll)</li>
                  <li>Fasilitas Ekonomi (Pasar, Warung, dll)</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Pengelolaan Dokumentasi KKN */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-neutral/50 p-4 sm:p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 sm:p-3 bg-teal-100 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-secondary">Pengelolaan Dokumentasi</h2>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Cara Menambah Dokumentasi Baru:</h3>
                <ol className="list-decimal list-inside space-y-1 sm:space-y-2 text-gray-700 text-sm sm:text-base pl-2">
                  <li>Klik menu "Kelola Dokumentasi" di dashboard</li>
                  <li>Klik tombol "Tambah Dokumentasi"</li>
                  <li>Isi judul, deskripsi, dan nama penulis</li>
                  <li>Pilih kategori yang sesuai (Template, Modul, atau Panduan)</li>
                  <li>Upload file dokumen (PDF, Word, Excel, PowerPoint) atau masukkan URL</li>
                  <li>Klik "Simpan Dokumentasi" untuk menyimpan</li>
                </ol>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Cara Mengedit Dokumentasi:</h3>
                <ol className="list-decimal list-inside space-y-1 sm:space-y-2 text-gray-700 text-sm sm:text-base pl-2">
                  <li>Buka menu "Kelola Dokumentasi"</li>
                  <li>Cari dokumentasi yang ingin diedit</li>
                  <li>Klik tombol "Edit" pada card dokumentasi</li>
                  <li>Ubah informasi yang diperlukan</li>
                  <li>Upload file baru jika diperlukan</li>
                  <li>Klik "Update Dokumentasi" untuk menyimpan perubahan</li>
                </ol>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Cara Menghapus Dokumentasi:</h3>
                <ol className="list-decimal list-inside space-y-1 sm:space-y-2 text-gray-700 text-sm sm:text-base pl-2">
                  <li>Buka menu "Kelola Dokumentasi"</li>
                  <li>Cari dokumentasi yang ingin dihapus</li>
                  <li>Klik tombol "Hapus" (ikon tempat sampah) pada card dokumentasi</li>
                  <li>Konfirmasi penghapusan pada dialog yang muncul</li>
                  <li>Dokumentasi akan langsung hilang dari daftar</li>
                </ol>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Tips Upload File:</h3>
                <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-gray-700 text-sm sm:text-base pl-2">
                  <li>File dokumen maksimal 50MB (PDF, Word, Excel, PowerPoint)</li>
                  <li>Gunakan nama file yang deskriptif dan mudah dipahami</li>
                  <li>Pastikan file dapat dibuka dengan baik sebelum upload</li>
                  <li>File akan ditampilkan dengan ikon sesuai jenisnya (PDF, DOC, XLS, PPT)</li>
                  <li>Dokumen dapat diupload langsung atau menggunakan URL eksternal</li>
                  <li>Periksa kembali informasi sebelum menyimpan</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Kategori Dokumentasi:</h3>
                <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-gray-700 text-sm sm:text-base pl-2">
                  <li><span className="font-medium text-blue-600">📄 Template:</span> Format dokumen kosong yang dapat digunakan berulang</li>
                  <li><span className="font-medium text-green-600">📋 Modul:</span> Materi pembelajaran atau pelatihan</li>
                  <li><span className="font-medium text-purple-600">📝 Panduan:</span> Petunjuk teknis dan prosedur</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Tips Umum */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-neutral/50 p-4 sm:p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 sm:p-3 bg-red-100 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-secondary">Tips dan Best Practices</h2>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Keamanan Akun:</h3>
                <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-gray-700 text-sm sm:text-base pl-2">
                  <li>Gunakan password yang kuat dan unik</li>
                  <li>Jangan bagikan kredensial login dengan siapapun</li>
                  <li>Logout setelah selesai menggunakan sistem</li>
                  <li>Periksa aktivitas login secara berkala</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Konten Berkualitas:</h3>
                <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-gray-700 text-sm sm:text-base pl-2">
                  <li>Pastikan konten berita akurat dan informatif</li>
                  <li>Gunakan gambar berkualitas tinggi</li>
                  <li>Update informasi secara berkala</li>
                  <li>Respon cepat terhadap pengaduan warga</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Pengelolaan Dokumentasi:</h3>
                <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-gray-700 text-sm sm:text-base pl-2">
                  <li>Organisir dokumentasi berdasarkan kategori yang tepat</li>
                  <li>Gunakan judul dan deskripsi yang jelas dan informatif</li>
                  <li>Update dokumentasi secara berkala sesuai kebutuhan</li>
                  <li>Hapus dokumentasi yang sudah tidak relevan</li>
                  <li>Backup file penting secara terpisah</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Kontak Support */}
          <motion.div variants={itemVariants} className="bg-gradient-to-r from-primary to-secondary rounded-xl shadow-lg p-4 sm:p-6 text-white">
            <div className="flex items-center mb-4">
              <div className="p-2 sm:p-3 bg-white/20 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold">Butuh Bantuan?</h2>
            </div>
            <div className="space-y-2">
              <p className="text-sm sm:text-base">Jika Anda mengalami kesulitan dalam menggunakan sistem admin PANDORA, silakan hubungi:</p>
              <ul className="list-disc list-inside space-y-1 text-sm sm:text-base pl-2">
                <li>Tim Pengembang: kkn114.moncongloebulu@gmail.com</li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PanduanAdmin;
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';

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

  const handleDownloadPDF = () => {
    // Create PDF document
    const doc = new jsPDF();
    
    // Set font for Indonesian text
    doc.setFont("helvetica");
    
    // Page 1 - Cover
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("PEDOMAN PENGELOLAAN PORTAL INFORMASI DESA PANDORA", 20, 20);
    
    // Subtitle
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("(Pusat Akses iNformasi DAn dOkumentasi Resmi desA)", 20, 30);
    
    // Author info
    doc.setFontSize(12);
    doc.text("Disusun oleh: Tim KKNT 114 Moncongloe Bulu", 20, 45);
    doc.text("Program Kerja KKN Individu Universitas Hasanuddin", 20, 52);
    doc.text("Pemerintah Desa Moncongloe Bulu, Tahun 2025", 20, 59);
    
    // Page 2 - Table of Contents
    doc.addPage();
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("DAFTAR ISI", 20, 20);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("SAMPUL ........................................................................................ i", 20, 35);
    doc.text("DAFTAR ISI .................................................................................... ii", 20, 42);
    doc.text("BAB I. PENDAHULUAN ................................................................... 1", 20, 49);
    doc.text("BAB II. LANDASAN TEORI ............................................................. 5", 20, 56);
    doc.text("BAB III. METODOLOGI ................................................................... 9", 20, 63);
    doc.text("BAB IV. LANGKAH-LANGKAH PENGELOLAAN .......................... 13", 20, 70);
    doc.text("BAB V. STUDI KASUS ..................................................................... 35", 20, 77);
    doc.text("BAB VI. PENUTUP .......................................................................... 45", 20, 84);
    doc.text("LAMPIRAN ...................................................................................... 47", 20, 91);
    
    // Page 3 - BAB I
    doc.addPage();
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("BAB I. PENDAHULUAN", 20, 20);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("1.1. Latar Belakang", 20, 35);
    doc.setFont("helvetica", "normal");
    
    const latarBelakang = [
      "Di era digital yang semakin berkembang, kebutuhan akan informasi yang cepat, akurat, dan mudah diakses menjadi sangat penting. Desa Moncongloe Bulu sebagai bagian dari Kabupaten Maros, Sulawesi Selatan, tidak luput dari tantangan komunikasi dan penyebaran informasi yang efektif kepada seluruh warga desa.",
      "",
      "Portal PANDORA (Pusat Akses iNformasi DAn dOkumentasi Resmi desA) hadir sebagai solusi digital untuk mengatasi berbagai tantangan komunikasi di desa, termasuk:",
      "",
      "• Keterbatasan Akses Informasi: Warga desa sering kesulitan mendapatkan informasi resmi dari pemerintah desa secara real-time",
      "• Penyebaran Hoax: Maraknya berita bohong yang beredar di media sosial membutuhkan sumber informasi terpercaya",
      "• Transparansi Pemerintahan: Kebutuhan akan keterbukaan informasi publik yang dapat diakses kapan saja",
      "• Efisiensi Komunikasi: Mengurangi ketergantungan pada pengumuman tradisional yang memakan waktu dan biaya"
    ];
    
    let yPosition = 50;
    latarBelakang.forEach(line => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 20, yPosition);
      yPosition += 7;
    });
    
    // Page 4 - BAB I continued
    doc.addPage();
    doc.setFont("helvetica", "bold");
    doc.text("1.2. Tujuan Pedoman", 20, 20);
    doc.setFont("helvetica", "normal");
    
    const tujuan = [
      "Pedoman Pengelolaan Portal PANDORA ini disusun dengan tujuan:",
      "",
      "1. Menjadi panduan teknis langkah demi langkah",
      "2. Memastikan admin dapat mengelola website secara mandiri",
      "3. Menjadi dokumen standar untuk menjaga kualitas informasi",
      "4. Meningkatkan efektivitas komunikasi",
      "5. Mengurangi kesalahan teknis"
    ];
    
    yPosition = 35;
    tujuan.forEach(line => {
      doc.text(line, 20, yPosition);
      yPosition += 7;
    });
    
    doc.setFont("helvetica", "bold");
    doc.text("1.3. Sasaran Pengguna", 20, 80);
    doc.setFont("helvetica", "normal");
    
    const sasaran = [
      "Pedoman ini secara khusus ditujukan untuk:",
      "",
      "• Perangkat Desa Moncongloe Bulu yang ditunjuk sebagai admin pengelola website",
      "• Kepala Desa dan Sekretaris Desa yang bertanggung jawab atas konten resmi",
      "• Staf Pemerintahan Desa yang terlibat dalam penyebaran informasi",
      "• Tim Pendamping Desa yang membantu dalam pengelolaan konten"
    ];
    
    yPosition = 95;
    sasaran.forEach(line => {
      doc.text(line, 20, yPosition);
      yPosition += 7;
    });
    
    // Page 5 - BAB II
    doc.addPage();
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("BAB II. LANDASAN TEORI", 20, 20);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("2.1. Pengertian Portal PANDORA", 20, 35);
    doc.setFont("helvetica", "normal");
    
    const pengertian = [
      "Portal PANDORA adalah sistem informasi desa berbasis web yang berfungsi sebagai pusat informasi resmi pemerintah desa. PANDORA merupakan akronim dari \"Pusat Akses iNformasi DAn dOkumentasi Resmi desA\" yang mencerminkan fungsi utamanya sebagai:",
      "",
      "• Pusat Informasi: Tempat berkumpulnya semua informasi resmi desa",
      "• Akses Terbuka: Dapat diakses oleh siapa saja tanpa batasan waktu",
      "• Dokumentasi Resmi: Menyimpan dan mengarsipkan dokumen-dokumen penting desa",
      "• Sumber Terpercaya: Menjadi rujukan utama untuk informasi desa"
    ];
    
    yPosition = 50;
    pengertian.forEach(line => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 20, yPosition);
      yPosition += 7;
    });
    
    // Page 6 - BAB II continued
    doc.addPage();
    doc.setFont("helvetica", "bold");
    doc.text("2.2. Komponen Utama Website", 20, 20);
    doc.setFont("helvetica", "normal");
    
    const komponen = [
      "Portal PANDORA terdiri dari dua komponen utama:",
      "",
      "Halaman Publik (Frontend):",
      "• Beranda: Halaman utama dengan informasi ringkas dan navigasi",
      "• Profil Desa: Informasi lengkap tentang desa, sejarah, dan struktur pemerintahan",
      "• Berita: Kumpulan berita dan pengumuman resmi desa",
      "• Sejarah: Dokumentasi sejarah dan perkembangan desa",
      "• Pengaduan: Formulir untuk warga menyampaikan keluhan atau saran",
      "• Dokumentasi KKN: Informasi tentang kegiatan KKN di desa",
      "",
      "Dasbor Admin (Backend):",
      "• Dashboard: Ringkasan statistik dan akses cepat ke fitur-fitur",
      "• Manajemen Berita: Menambah, mengedit, dan menghapus berita",
      "• Manajemen Pengaduan: Mengelola laporan dan keluhan warga",
      "• Manajemen Statistik: Mengupdate data statistik desa",
      "• Manajemen Prasarana: Mengelola informasi fasilitas desa"
    ];
    
    yPosition = 35;
    komponen.forEach(line => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 20, yPosition);
      yPosition += 7;
    });
    
    // Page 7 - BAB III
    doc.addPage();
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("BAB III. METODOLOGI", 20, 20);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("3.1. Kebutuhan Perangkat", 20, 35);
    doc.setFont("helvetica", "normal");
    
    const kebutuhan = [
      "Perangkat Keras:",
      "• Komputer/Laptop dengan spesifikasi minimal Intel Core i3",
      "• RAM: 4GB (minimal)",
      "• Storage: 100GB ruang kosong",
      "• Monitor: Resolusi 1366x768 atau lebih tinggi",
      "• Koneksi Internet: Stabil dengan kecepatan minimal 1 Mbps",
      "",
      "Perangkat Lunak:",
      "• Web Browser: Google Chrome (direkomendasikan), Mozilla Firefox",
      "• Aplikasi Pendukung: Adobe Reader, Paint, Microsoft Word"
    ];
    
    yPosition = 50;
    kebutuhan.forEach(line => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 20, yPosition);
      yPosition += 7;
    });
    
    // Page 8 - BAB III continued
    doc.addPage();
    doc.setFont("helvetica", "bold");
    doc.text("3.2. Akun dan Akses", 20, 20);
    doc.setFont("helvetica", "normal");
    
    const akun = [
      "Informasi Login:",
      "• URL Halaman Login: https://moncongloebulu.com/admin",
      "• Username: Akan diberikan secara terpisah",
      "• Password: Akan diberikan secara terpisah",
      "",
      "Keamanan Akun:",
      "• Kerahasiaan: Username dan password tidak boleh dibagikan",
      "• Perubahan Password: Disarankan untuk mengganti password berkala",
      "• Logout: Selalu logout setelah selesai menggunakan sistem",
      "• Perangkat Pribadi: Gunakan perangkat yang aman"
    ];
    
    yPosition = 35;
    akun.forEach(line => {
      doc.text(line, 20, yPosition);
      yPosition += 7;
    });
    
    // Page 9 - BAB IV
    doc.addPage();
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("BAB IV. LANGKAH-LANGKAH PENGELOLAAN", 20, 20);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("4.1. Mengakses Dasbor Admin (Login)", 20, 35);
    doc.setFont("helvetica", "normal");
    
    const login = [
      "Langkah-langkah login:",
      "1. Buka web browser (Google Chrome direkomendasikan)",
      "2. Ketik URL: https://moncongloebulu.com/admin",
      "3. Masukkan username dan password",
      "4. Klik tombol \"Login\"",
      "",
      "Catatan: Jika login gagal 3 kali berturut-turut, sistem akan mengunci akun selama 15 menit untuk keamanan."
    ];
    
    yPosition = 50;
    login.forEach(line => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 20, yPosition);
      yPosition += 7;
    });
    
    // Page 10 - BAB IV continued
    doc.addPage();
    doc.setFont("helvetica", "bold");
    doc.text("4.2. Mengenal Tampilan Dasbor", 20, 20);
    doc.setFont("helvetica", "normal");
    
    const dashboard = [
      "Menu Navigasi (Sidebar):",
      "• Dashboard: Halaman utama dengan ringkasan statistik",
      "• Kelola Berita: Mengelola berita dan pengumuman",
      "• Edit Statistik: Mengupdate data statistik desa",
      "• Edit Prasarana: Mengelola informasi fasilitas desa",
      "• Laporan Pengaduan: Mengelola keluhan dan saran warga",
      "• Panduan Admin: Akses ke panduan lengkap ini",
      "",
      "Statistik Dashboard:",
      "• Total Berita: Jumlah berita yang telah dipublikasikan",
      "• Total Laporan: Jumlah pengaduan yang masuk",
      "• Data Statistik: Jumlah data statistik yang tersedia",
      "• Website Status: Status online/offline website"
    ];
    
    yPosition = 35;
    dashboard.forEach(line => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 20, yPosition);
      yPosition += 7;
    });
    
    // Page 11 - BAB IV continued
    doc.addPage();
    doc.setFont("helvetica", "bold");
    doc.text("4.3. Manajemen Berita: Menambah Berita Baru", 20, 20);
    doc.setFont("helvetica", "normal");
    
    const tambahBerita = [
      "Langkah-langkah:",
      "1. Dari Dashboard, klik tombol \"Tambah Berita\" di bagian Aksi Cepat",
      "2. Isi judul berita yang jelas dan menarik (maksimal 100 karakter)",
      "3. Pilih kategori yang sesuai (Pengumuman Resmi, Berita Desa, dll)",
      "4. Upload gambar berita dengan format JPG, PNG, atau JPEG (maksimal 2MB)",
      "5. Tulis konten berita dengan format yang baik",
      "6. Klik \"Simpan Berita\" untuk menyimpan",
      "7. Berita akan langsung muncul di halaman publik website"
    ];
    
    yPosition = 35;
    tambahBerita.forEach(line => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 20, yPosition);
      yPosition += 7;
    });
    
    // Page 12 - BAB IV continued
    doc.addPage();
    doc.setFont("helvetica", "bold");
    doc.text("4.4. Manajemen Berita: Mengedit dan Menghapus", 20, 20);
    doc.setFont("helvetica", "normal");
    
    const editBerita = [
      "Mengedit Berita:",
      "1. Buka menu \"Kelola Berita\" di sidebar",
      "2. Klik tombol \"Edit\" pada berita yang ingin diubah",
      "3. Ubah judul, kategori, atau konten sesuai kebutuhan",
      "4. Upload gambar baru jika diperlukan",
      "5. Klik \"Update Berita\" untuk menyimpan perubahan",
      "",
      "Menghapus Berita:",
      "1. Buka menu \"Kelola Berita\" di sidebar",
      "2. Klik tombol \"Hapus\" pada berita yang ingin dihapus",
      "3. Konfirmasi penghapusan",
      "4. Berita akan dihapus secara permanen"
    ];
    
    yPosition = 35;
    editBerita.forEach(line => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 20, yPosition);
      yPosition += 7;
    });
    
    // Page 13 - BAB IV continued
    doc.addPage();
    doc.setFont("helvetica", "bold");
    doc.text("4.5. Manajemen Pengaduan", 20, 20);
    doc.setFont("helvetica", "normal");
    
    const pengaduan = [
      "Cara Mengelola Pengaduan:",
      "1. Klik menu \"Laporan Pengaduan\" di sidebar",
      "2. Lihat daftar semua pengaduan yang masuk",
      "3. Klik pada pengaduan untuk melihat detail lengkap",
      "4. Update status pengaduan sesuai progress penanganan",
      "5. Tambahkan catatan atau respon untuk pengadu",
      "",
      "Status Pengaduan:",
      "• Pending: Pengaduan baru yang belum diproses",
      "• Proses: Pengaduan sedang dalam penanganan",
      "• Selesai: Pengaduan telah selesai ditangani"
    ];
    
    yPosition = 35;
    pengaduan.forEach(line => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 20, yPosition);
      yPosition += 7;
    });
    
    // Page 14 - BAB IV continued
    doc.addPage();
    doc.setFont("helvetica", "bold");
    doc.text("4.6. Manajemen Statistik", 20, 20);
    doc.setFont("helvetica", "normal");
    
    const statistik = [
      "Cara Mengupdate Statistik:",
      "1. Klik menu \"Edit Statistik\" di sidebar",
      "2. Pilih kategori statistik yang ingin diupdate",
      "3. Masukkan data terbaru sesuai dengan kategori",
      "4. Klik \"Simpan\" untuk menyimpan perubahan",
      "5. Data akan langsung terupdate di halaman statistik",
      "",
      "Kategori Statistik yang Tersedia:",
      "• Data Kependudukan (jumlah penduduk, KK, dll)",
      "• Data Ekonomi (UMKM, lapangan kerja, dll)",
      "• Data Pendidikan (jumlah sekolah, siswa, dll)",
      "• Data Kesehatan (fasilitas kesehatan, dll)",
      "• Data Infrastruktur (jalan, listrik, air, dll)"
    ];
    
    yPosition = 35;
    statistik.forEach(line => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 20, yPosition);
      yPosition += 7;
    });
    
    // Page 15 - BAB IV continued
    doc.addPage();
    doc.setFont("helvetica", "bold");
    doc.text("4.7. Manajemen Prasarana", 20, 20);
    doc.setFont("helvetica", "normal");
    
    const prasarana = [
      "Cara Mengupdate Data Prasarana:",
      "1. Klik menu \"Edit Prasarana\" di sidebar",
      "2. Pilih jenis prasarana yang ingin diupdate",
      "3. Masukkan data terbaru (nama, lokasi, kondisi, dll)",
      "4. Upload foto prasarana jika diperlukan",
      "5. Klik \"Simpan\" untuk menyimpan perubahan",
      "",
      "Jenis Prasarana yang Dikelola:",
      "• Fasilitas Pendidikan (SD, SMP, SMA, dll)",
      "• Fasilitas Kesehatan (Puskesmas, Posyandu, dll)",
      "• Fasilitas Umum (Balai Desa, Masjid, dll)",
      "• Infrastruktur (Jalan, Jembatan, dll)",
      "• Fasilitas Ekonomi (Pasar, Warung, dll)"
    ];
    
    yPosition = 35;
    prasarana.forEach(line => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 20, yPosition);
      yPosition += 7;
    });
    
    // Page 16 - BAB V
    doc.addPage();
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("BAB V. STUDI KASUS", 20, 20);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("5.1. Studi Kasus: Mempublikasikan Pengumuman Kerja Bakti", 20, 35);
    doc.setFont("helvetica", "normal");
    
    const studiKasus = [
      "Langkah-langkah praktis:",
      "1. Login ke sistem admin",
      "2. Klik tombol \"Tambah Berita\" di dashboard",
      "3. Isi judul: \"PENGUMUMAN KERJA BAKTI DESA MONCONGLOE BULU\"",
      "4. Pilih kategori \"Pengumuman Resmi\"",
      "5. Upload gambar kegiatan (format JPG/PNG, maksimal 2MB)",
      "6. Tulis konten pengumuman lengkap",
      "7. Klik \"Simpan Berita\"",
      "8. Verifikasi publikasi di halaman utama website"
    ];
    
    yPosition = 50;
    studiKasus.forEach(line => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 20, yPosition);
      yPosition += 7;
    });
    
    // Page 17 - BAB V continued
    doc.addPage();
    doc.setFont("helvetica", "bold");
    doc.text("5.2. Studi Kasus: Mengelola Pengaduan Warga", 20, 20);
    doc.setFont("helvetica", "normal");
    
    const studiPengaduan = [
      "Langkah-langkah penanganan:",
      "1. Login ke sistem admin",
      "2. Klik menu \"Laporan Pengaduan\" di sidebar",
      "3. Lihat daftar pengaduan yang masuk",
      "4. Klik pada pengaduan untuk melihat detail lengkap",
      "5. Ubah status dari \"Pending\" menjadi \"Proses\"",
      "6. Tambahkan catatan tindak lanjut",
      "7. Setelah selesai, ubah status menjadi \"Selesai\"",
      "8. Tambahkan catatan hasil penanganan"
    ];
    
    yPosition = 35;
    studiPengaduan.forEach(line => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 20, yPosition);
      yPosition += 7;
    });
    
    // Page 18 - BAB V continued
    doc.addPage();
    doc.setFont("helvetica", "bold");
    doc.text("5.3. Studi Kasus: Mengupdate Data Statistik", 20, 20);
    doc.setFont("helvetica", "normal");
    
    const studiStatistik = [
      "Langkah-langkah update:",
      "1. Login ke sistem admin",
      "2. Klik menu \"Edit Statistik\" di sidebar",
      "3. Pilih kategori \"Data Kependudukan\"",
      "4. Masukkan data terbaru:",
      "   - Jumlah Penduduk: 2,450 jiwa",
      "   - Jumlah KK: 650 KK",
      "   - Laki-laki: 1,220 jiwa",
      "   - Perempuan: 1,230 jiwa",
      "5. Klik \"Simpan\" untuk menyimpan perubahan",
      "6. Verifikasi update di halaman Profil Desa"
    ];
    
    yPosition = 35;
    studiStatistik.forEach(line => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 20, yPosition);
      yPosition += 7;
    });
    
    // Page 19 - BAB VI
    doc.addPage();
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("BAB VI. PENUTUP", 20, 20);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("6.1. Kesimpulan", 20, 35);
    doc.setFont("helvetica", "normal");
    
    const kesimpulan = [
      "Portal PANDORA telah berhasil diimplementasikan sebagai solusi digital untuk mengatasi tantangan komunikasi di Desa Moncongloe Bulu. Dengan mengikuti panduan ini, admin dapat mengelola website secara mandiri dan efektif.",
      "",
      "Keunggulan sistem PANDORA meliputi:",
      "• Aksesibilitas: Dapat diakses 24/7 oleh semua warga",
      "• Efisiensi: Mengurangi waktu dan biaya penyebaran informasi",
      "• Transparansi: Meningkatkan keterbukaan informasi publik",
      "• Interaktivitas: Memungkinkan warga berpartisipasi aktif"
    ];
    
    yPosition = 50;
    kesimpulan.forEach(line => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 20, yPosition);
      yPosition += 7;
    });
    
    // Page 20 - BAB VI continued
    doc.addPage();
    doc.setFont("helvetica", "bold");
    doc.text("6.2. Saran", 20, 20);
    doc.setFont("helvetica", "normal");
    
    const saran = [
      "Konsistensi dalam Pengelolaan:",
      "• Update konten secara berkala minimal 2-3 kali seminggu",
      "• Pastikan setiap informasi yang dipublikasikan akurat dan relevan",
      "• Tanggapi pengaduan warga dengan cepat untuk meningkatkan kepercayaan",
      "",
      "Keamanan Sistem:",
      "• Gunakan password yang kuat dan ganti secara berkala",
      "• Selalu logout setelah selesai menggunakan sistem",
      "• Lakukan backup data penting secara berkala",
      "• Periksa aktivitas login secara berkala",
      "",
      "Pengembangan Masa Depan:",
      "• Pertimbangkan penambahan fitur seperti live streaming untuk rapat desa",
      "• Hubungkan dengan akun media sosial resmi desa",
      "• Kembangkan aplikasi mobile untuk akses yang lebih mudah",
      "• Lakukan pelatihan berkala untuk admin baru"
    ];
    
    yPosition = 35;
    saran.forEach(line => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 20, yPosition);
      yPosition += 7;
    });
    
    // Page 21 - LAMPIRAN
    doc.addPage();
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("LAMPIRAN", 20, 20);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Lampiran A: Glosarium Istilah Teknis", 20, 35);
    doc.setFont("helvetica", "normal");
    
    const glosarium = [
      "Admin: Pengguna yang memiliki akses penuh untuk mengelola website",
      "Backend: Bagian website yang hanya dapat diakses admin",
      "Browser: Aplikasi untuk mengakses internet (Chrome, Firefox, dll)",
      "CMS: Content Management System, sistem untuk mengelola konten website",
      "Dashboard: Halaman utama admin dengan ringkasan statistik",
      "Domain: Alamat website (contoh: moncongloebulu.com)",
      "Frontend: Bagian website yang dapat diakses publik",
      "Hosting: Layanan penyimpanan website di internet",
      "Login: Proses masuk ke sistem dengan username dan password",
      "Logout: Proses keluar dari sistem",
      "Password: Kata sandi untuk mengamankan akun",
      "URL: Alamat lengkap halaman website",
      "Username: Nama pengguna untuk login ke sistem",
      "WYSIWYG: What You See Is What You Get, tampilan yang sama dengan hasil akhir"
    ];
    
    yPosition = 50;
    glosarium.forEach(line => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 20, yPosition);
      yPosition += 7;
    });
    
    // Page 22 - LAMPIRAN continued
    doc.addPage();
    doc.setFont("helvetica", "bold");
    doc.text("Lampiran B: Tanya Jawab Umum (FAQ)", 20, 20);
    doc.setFont("helvetica", "normal");
    
    const faq = [
      "Q: Bagaimana jika saya lupa password?",
      "A: Hubungi tim teknis untuk reset password. Jangan bagikan password dengan siapapun.",
      "",
      "Q: Mengapa gambar gagal diunggah?",
      "A: Pastikan format file JPG/PNG dan ukuran maksimal 2MB. Cek koneksi internet.",
      "",
      "Q: Berita tidak muncul di halaman utama?",
      "A: Pastikan sudah klik \"Simpan Berita\" dan cek status publikasi.",
      "",
      "Q: Bagaimana mengatasi pengaduan yang banyak?",
      "A: Prioritaskan berdasarkan urgensi dan update status secara berkala.",
      "",
      "Q: Website tidak bisa diakses?",
      "A: Cek koneksi internet dan hubungi tim teknis jika masalah berlanjut.",
      "",
      "Q: Bagaimana menjaga keamanan akun?",
      "A: Gunakan password kuat, logout rutin, dan jangan bagikan kredensial."
    ];
    
    yPosition = 35;
    faq.forEach(line => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 20, yPosition);
      yPosition += 7;
    });
    
    // Page 23 - LAMPIRAN continued
    doc.addPage();
    doc.setFont("helvetica", "bold");
    doc.text("Lampiran C: Kontak Bantuan Teknis", 20, 20);
    doc.setFont("helvetica", "normal");
    
    const kontak = [
      "Tim KKNT 114 Moncongloe Bulu",
      "Email: kknt114.moncongloe@gmail.com",
      "WhatsApp: +62 812-3456-7890",
      "Telepon: (0411) 123456",
      "Jam Kerja: Senin - Jumat, 08:00 - 17:00 WITA",
      "",
      "Pemerintah Desa Moncongloe Bulu",
      "Alamat: Tamalate, Jalan Poros Moncongloe Bulu - Daya Makassar",
      "Email: moncongloebulu.desa@gmail.com",
      "Telepon: (0411) 987654",
      "",
      "Universitas Hasanuddin",
      "Alamat: Jl. Perintis Kemerdekaan Km. 10, Makassar",
      "Website: www.unhas.ac.id",
      "Email: humas@unhas.ac.id"
    ];
    
    yPosition = 35;
    kontak.forEach(line => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 20, yPosition);
      yPosition += 7;
    });
    
    // Page 24 - Footer
    doc.addPage();
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Dokumen ini disusun sebagai bagian dari Program Kerja KKN Individu Universitas Hasanuddin di Desa Moncongloe Bulu, Kabupaten Maros, Sulawesi Selatan.", 20, 20);
    
    doc.setFont("helvetica", "bold");
    doc.text("Tim Penyusun:", 20, 40);
    doc.setFont("helvetica", "normal");
    doc.text("• KKNT 114 Moncongloe Bulu", 20, 50);
    doc.text("• Universitas Hasanuddin", 20, 57);
    doc.text("• Pemerintah Desa Moncongloe Bulu", 20, 64);
    
    doc.setFont("helvetica", "bold");
    doc.text("Tahun: 2025", 20, 80);
    
    // Save the PDF
    doc.save("Panduan_PANDORA_Admin.pdf");
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-secondary mb-2">Panduan Admin PANDORA</h1>
              <p className="text-gray-600">Tata cara pengelolaan website Desa Moncongloe Bulu</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleDownloadPDF}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Download PDF
              </button>
              <Link 
                to="/admin/dashboard" 
                className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Kembali ke Dashboard
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Pengelolaan Berita */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-neutral/50 p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-secondary">Pengelolaan Berita</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Cara Menambah Berita Baru:</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Klik tombol "Tambah Berita" di dashboard atau menu "Kelola Berita"</li>
                  <li>Isi semua field yang diperlukan (judul, konten, kategori, gambar)</li>
                  <li>Upload gambar berita dengan format JPG, PNG, atau JPEG (maksimal 2MB)</li>
                  <li>Klik "Simpan Berita" untuk menyimpan</li>
                  <li>Berita akan langsung muncul di halaman utama website</li>
                </ol>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Cara Mengedit Berita:</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Buka menu "Kelola Berita"</li>
                  <li>Klik tombol "Edit" pada berita yang ingin diubah</li>
                  <li>Ubah konten yang diperlukan</li>
                  <li>Klik "Update Berita" untuk menyimpan perubahan</li>
                </ol>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Cara Menghapus Berita:</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Buka menu "Kelola Berita"</li>
                  <li>Klik tombol "Hapus" pada berita yang ingin dihapus</li>
                  <li>Konfirmasi penghapusan</li>
                  <li>Berita akan dihapus secara permanen</li>
                </ol>
              </div>
            </div>
          </motion.div>

          {/* Pengelolaan Pengaduan */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-neutral/50 p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4a2 2 0 00-1.81 1.81V19a2 2 0 002 2h12a2 2 0 002-2V5.81A2 2 0 0019.81 4H4.19zM16 2v4M8 2v4M3 10h18"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-secondary">Pengelolaan Pengaduan</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Cara Mengelola Pengaduan:</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Buka menu "Kelola Pengaduan" di dashboard</li>
                  <li>Lihat daftar semua pengaduan yang masuk</li>
                  <li>Klik pada pengaduan untuk melihat detail lengkap</li>
                  <li>Update status pengaduan sesuai progress penanganan</li>
                  <li>Tambahkan catatan atau respon untuk pengadu</li>
                </ol>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Status Pengaduan:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li><span className="font-medium text-yellow-600">Pending:</span> Pengaduan baru yang belum diproses</li>
                  <li><span className="font-medium text-blue-600">Proses:</span> Pengaduan sedang dalam penanganan</li>
                  <li><span className="font-medium text-green-600">Selesai:</span> Pengaduan telah selesai ditangani</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Pengelolaan Statistik */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-neutral/50 p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-100 rounded-lg mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-secondary">Pengelolaan Data Statistik</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Cara Mengupdate Statistik:</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Klik tombol "Edit Statistik" di dashboard</li>
                  <li>Pilih kategori statistik yang ingin diupdate</li>
                  <li>Masukkan data terbaru sesuai dengan kategori</li>
                  <li>Klik "Simpan" untuk menyimpan perubahan</li>
                  <li>Data akan langsung terupdate di halaman statistik</li>
                </ol>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Kategori Statistik yang Tersedia:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
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
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-neutral/50 p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-orange-100 rounded-lg mr-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-secondary">Pengelolaan Data Prasarana</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Cara Mengupdate Data Prasarana:</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Klik tombol "Edit Prasarana" di dashboard</li>
                  <li>Pilih jenis prasarana yang ingin diupdate</li>
                  <li>Masukkan data terbaru (nama, lokasi, kondisi, dll)</li>
                  <li>Upload foto prasarana jika diperlukan</li>
                  <li>Klik "Simpan" untuk menyimpan perubahan</li>
                </ol>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Jenis Prasarana yang Dikelola:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Fasilitas Pendidikan (SD, SMP, SMA, dll)</li>
                  <li>Fasilitas Kesehatan (Puskesmas, Posyandu, dll)</li>
                  <li>Fasilitas Umum (Balai Desa, Masjid, dll)</li>
                  <li>Infrastruktur (Jalan, Jembatan, dll)</li>
                  <li>Fasilitas Ekonomi (Pasar, Warung, dll)</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Tips Umum */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-neutral/50 p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-red-100 rounded-lg mr-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-secondary">Tips dan Best Practices</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Keamanan Akun:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Gunakan password yang kuat dan unik</li>
                  <li>Jangan bagikan kredensial login dengan siapapun</li>
                  <li>Logout setelah selesai menggunakan sistem</li>
                  <li>Periksa aktivitas login secara berkala</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Konten Berkualitas:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Pastikan konten berita akurat dan informatif</li>
                  <li>Gunakan gambar berkualitas tinggi</li>
                  <li>Update informasi secara berkala</li>
                  <li>Respon cepat terhadap pengaduan warga</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Kontak Support */}
          <motion.div variants={itemVariants} className="bg-gradient-to-r from-primary to-secondary rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-white/20 rounded-lg mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold">Butuh Bantuan?</h2>
            </div>
            <div className="space-y-2">
              <p>Jika Anda mengalami kesulitan dalam menggunakan sistem admin PANDORA, silakan hubungi:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Tim Pengembang: kwanj22h@student.unhas.ac.id</li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PanduanAdmin; 
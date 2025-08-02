import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePengaduan } from '../context/PengaduanContext';
import CustomNotification from '../components/CustomNotification';

// Header component for the form page
const FormulirHeader = () => (
    <div className="w-full bg-primary text-white p-4 shadow-lg sticky top-0 z-10">
        <div className="relative max-w-7xl mx-auto flex items-center justify-between h-16">
            {/* Tombol back di kiri, Logo SUARAKU di kanan */}
            <div className="flex items-center gap-4">
                <Link
                    to="/pengaduan"
                    className="p-2 rounded-full text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    aria-label="Kembali ke Halaman Pengaduan"
                >
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                
                <img 
                    src="/images/logos/suaraku.png" 
                    alt="Logo SUARAKU" 
                    className="h-80 object-contain" 
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        // Fallback ke teks jika gambar tidak ada
                        e.target.nextSibling.style.display = 'block';
                    }}
                />
                <h1 className="text-xl font-bold" style={{display: 'none'}}>Suaraku</h1>
            </div>
        </div>
    </div>
);

const FormulirPengaduan = () => {
    const { addPengaduan } = usePengaduan();
    const [klasifikasi, setKlasifikasi] = useState('pengaduan');
    const [isAnonim, setIsAnonim] = useState(false);
    const [lampiran, setLampiran] = useState(null);
    const [lampiranDataUrl, setLampiranDataUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [deviceInfo, setDeviceInfo] = useState({});
    const [captchaQuestion, setCaptchaQuestion] = useState({ question: '', answer: '' });
    const navigate = useNavigate();

    // Fungsi untuk generate captcha dinamis
    const generateCaptcha = () => {
        const questions = [
            { question: "Berapa hasil dari 5 + 3?", answer: "8" },
            { question: "Berapa hasil dari 10 - 4?", answer: "6" },
            { question: "Berapa hasil dari 2 x 6?", answer: "12" },
            { question: "Berapa hasil dari 15 ÷ 3?", answer: "5" },
            { question: "Berapa hasil dari 7 + 5?", answer: "12" },
            { question: "Berapa hasil dari 20 - 8?", answer: "12" },
            { question: "Berapa hasil dari 3 x 4?", answer: "12" },
            { question: "Berapa hasil dari 18 ÷ 2?", answer: "9" },
            { question: "Berapa hasil dari 6 + 9?", answer: "15" },
            { question: "Berapa hasil dari 25 - 7?", answer: "18" }
        ];
        
        const randomIndex = Math.floor(Math.random() * questions.length);
        setCaptchaQuestion(questions[randomIndex]);
    };

    // Fungsi untuk mendapatkan informasi device
    const getDeviceInfo = () => {
        const info = {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screenResolution: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timestamp: new Date().toISOString(),
            referrer: document.referrer,
            url: window.location.href
        };
        setDeviceInfo(info);
        return info;
    };

    // Fungsi untuk mendapatkan IP address (akan dihandle di backend)
    const getClientIP = async () => {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error('Error getting IP:', error);
            return 'unknown';
        }
    };

    const showNotification = (type, message) => {
        setNotification({ show: true, type, message });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            // Validasi form
            if (!data.nama && !isAnonim) {
                showNotification('error', 'Nama harus diisi atau pilih anonim!');
                return;
            }

            if (!data.judul) {
                showNotification('error', 'Judul laporan harus diisi!');
                return;
            }

            if (!data.isi) {
                showNotification('error', 'Isi laporan harus diisi!');
                return;
            }

            if (!data.kategori) {
                showNotification('error', 'Kategori laporan harus dipilih!');
                return;
            }

            // Validasi kontak minimal
            if (!data.email && !data.whatsapp && !isAnonim) {
                showNotification('error', 'Untuk laporan non-anonim, harap isi email ATAU nomor WhatsApp untuk verifikasi!');
                return;
            }

            if (!agreedToTerms) {
                showNotification('error', 'Anda harus menyetujui Syarat dan Ketentuan terlebih dahulu!');
                return;
            }

            // Validasi captcha
            if (data.captcha !== captchaQuestion.answer) {
                showNotification('error', 'Jawaban captcha salah! Silakan coba lagi.');
                generateCaptcha(); // Generate captcha baru
                return;
            }

            // Tambahan tracking untuk deteksi laporan fiktif
            const trackingData = {
                deviceInfo: {
                    userAgent: navigator.userAgent.substring(0, 200), // Limit length
                    language: navigator.language,
                    platform: navigator.platform,
                    screenResolution: `${screen.width}x${screen.height}`,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                },
                clientIP: await getClientIP(),
                sessionId: sessionStorage.getItem('sessionId') || Date.now().toString(),
                formSubmissionTime: new Date().toISOString(),
                formFillingDuration: Date.now() - (window.formStartTime || Date.now()),
                captchaQuestion: captchaQuestion.question,
                hasContactInfo: !!(data.email || data.whatsapp)
            };

            const pengaduanData = {
                nama: isAnonim ? 'Anonim' : data.nama,
                email: data.email || null,
                whatsapp: data.whatsapp || null,
                klasifikasi: data.klasifikasi,
                judul: data.judul,
                isi: data.isi,
                tanggal_kejadian: data.tanggal || null,
                kategori: data.kategori,
                lampiran_info: lampiran ? lampiran.name : null,
                lampiran_data_url: lampiranDataUrl ? lampiranDataUrl.substring(0, 1000) : null, // Limit size
                status: 'pending',
                // Tracking data untuk deteksi laporan fiktif
                tracking: trackingData
            };

            await addPengaduan(pengaduanData);
            showNotification('success', 'Laporan berhasil dikirim! Terima kasih atas laporan Anda.');
            
            // Reset form
            e.target.reset();
            setIsAnonim(false);
            setKlasifikasi('pengaduan');
            setLampiran(null);
            setLampiranDataUrl('');
            setAgreedToTerms(false);
            generateCaptcha(); // Generate captcha baru untuk next submission
            
            // Navigate back after delay
            setTimeout(() => {
                navigate('/pengaduan');
            }, 2000);

        } catch (error) {
            console.error("Error submitting pengaduan:", error);
            showNotification('error', 'Terjadi kesalahan saat mengirim laporan. Silakan coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validasi ukuran file (max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                showNotification('error', 'Ukuran file terlalu besar. Maksimal 5MB.');
                e.target.value = '';
                return;
            }

            // Validasi tipe file
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                showNotification('error', 'Tipe file tidak didukung. Gunakan JPG, PNG, atau GIF.');
                e.target.value = '';
                return;
            }

            setLampiran(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                // Kompresi gambar jika terlalu besar
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Resize jika terlalu besar
                    let { width, height } = img;
                    const maxDimension = 800;
                    
                    if (width > maxDimension || height > maxDimension) {
                        if (width > height) {
                            height = (height * maxDimension) / width;
                            width = maxDimension;
                        } else {
                            width = (width * maxDimension) / height;
                            height = maxDimension;
                        }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Kompresi dengan kualitas 0.7
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    setLampiranDataUrl(compressedDataUrl);
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const kategoriLaporan = [
        "Infrastruktur (Jalan, Jembatan, dll.)",
        "Pelayanan Publik (Kantor Desa, Administrasi)",
        "Lingkungan (Sampah, Kebersihan)",
        "Keamanan dan Ketertiban",
        "Bantuan Sosial",
        "Lainnya"
    ];

    // Set session ID dan start time saat komponen mount
    React.useEffect(() => {
        if (!sessionStorage.getItem('sessionId')) {
            sessionStorage.setItem('sessionId', Date.now().toString());
        }
        window.formStartTime = Date.now();
        generateCaptcha(); // Generate captcha saat komponen mount
    }, []);

    return (
        // GANTI: Menggunakan latar 'bg-neutral' yang bersih
        <div className="min-h-screen bg-neutral">
            <FormulirHeader />
            <main className="py-6 px-4 sm:px-6 pb-24">
                <div className="max-w-xl mx-auto">
                {/* GANTI: Kartu form dengan border neutral */}
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-neutral/50">
                    <h2 className="text-2xl sm:text-3xl font-bold text-secondary mb-6 text-center">
                        Sampaikan Laporan Anda!
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Section 1: Informasi Pelapor */}
                        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-primary">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Informasi Pelapor
                            </h3>
                            
                            {/* Checkbox Anonim */}
                            <div className="relative flex items-start mb-4">
                                <div className="flex h-5 items-center">
                                    <input
                                        id="anonim"
                                        name="anonim"
                                        type="checkbox"
                                        checked={isAnonim}
                                        onChange={(e) => setIsAnonim(e.target.checked)}
                                        className="h-4 w-4 rounded border-neutral text-primary focus:ring-primary"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="anonim" className="font-medium text-text-main">
                                        Kirim sebagai Anonim
                                    </label>
                                    <p className="text-text-secondary">
                                        Jika tidak dicentang, nama Anda akan dilampirkan.
                                    </p>
                                </div>
                            </div>

                            {/* Nama (jika tidak anonim) */}
                            {!isAnonim && (
                                <div className="mb-4">
                                    <label htmlFor="nama" className="block text-sm font-medium text-text-main">
                                        Nama Anda <span className="text-red-500">*</span>
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="nama"
                                            id="nama"
                                            className="block w-full rounded-md border-neutral px-3 py-2 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
                                            placeholder="Masukkan nama lengkap Anda"
                                            required={!isAnonim}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Email dan WhatsApp */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-text-main">
                                        Email {!isAnonim && <span className="text-red-500">*</span>}
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            className="block w-full rounded-md border-neutral px-3 py-2 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
                                            placeholder="contoh@email.com"
                                            required={!isAnonim}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {isAnonim ? 'Opsional untuk follow-up' : 'Pilih salah satu: Email ATAU WhatsApp'}
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="whatsapp" className="block text-sm font-medium text-text-main flex items-center">
                                        <svg className="w-4 h-4 mr-1 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                                        </svg>
                                        Nomor WhatsApp {!isAnonim && <span className="text-red-500">*</span>}
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="tel"
                                            name="whatsapp"
                                            id="whatsapp"
                                            className="block w-full rounded-md border-neutral px-3 py-2 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
                                            placeholder="081234567890"
                                            required={!isAnonim}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {isAnonim ? 'Opsional untuk follow-up' : 'Pilih salah satu: Email ATAU WhatsApp'}
                                    </p>
                                </div>
                            </div>

                            {/* Verifikasi Kontak */}
                            <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="text-sm text-blue-800">
                                        <p className="font-medium mb-1">Verifikasi Laporan</p>
                                        <p className="text-xs">
                                            {isAnonim 
                                                ? 'Untuk laporan anonim, informasi kontak bersifat opsional dan hanya digunakan untuk follow-up jika diperlukan.'
                                                : 'Untuk laporan non-anonim, Anda dapat memilih mengisi Email ATAU nomor WhatsApp untuk verifikasi. Keduanya tidak wajib diisi bersamaan.'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Detail Laporan */}
                        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-secondary">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Detail Laporan
                            </h3>

                            {/* Klasifikasi Laporan */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-text-main mb-2">Klasifikasi Laporan</label>
                                <div className="flex items-center gap-x-6">
                                    <div className="flex items-center">
                                        <input
                                            id="pengaduan"
                                            name="klasifikasi"
                                            type="radio"
                                            value="pengaduan"
                                            checked={klasifikasi === 'pengaduan'}
                                            onChange={(e) => setKlasifikasi(e.target.value)}
                                            className="h-4 w-4 text-primary border-neutral focus:ring-primary"
                                        />
                                        <label htmlFor="pengaduan" className="ml-3 block text-sm text-text-main">
                                            Pengaduan
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            id="aspirasi"
                                            name="klasifikasi"
                                            type="radio"
                                            value="aspirasi"
                                            checked={klasifikasi === 'aspirasi'}
                                            onChange={(e) => setKlasifikasi(e.target.value)}
                                            className="h-4 w-4 text-primary border-neutral focus:ring-primary"
                                        />
                                        <label htmlFor="aspirasi" className="ml-3 block text-sm text-text-main">
                                            Aspirasi
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Judul Laporan */}
                            <div className="mb-4">
                                <label htmlFor="judul" className="block text-sm font-medium text-text-main">
                                    Judul Laporan <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="judul"
                                        id="judul"
                                        className="block w-full rounded-md border-neutral px-3 py-2 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
                                        placeholder="Ketikkan judul laporan Anda"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Isi Laporan */}
                            <div className="mb-4">
                                <label htmlFor="isi" className="block text-sm font-medium text-text-main">
                                    Isi Laporan <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-1">
                                    <textarea
                                        id="isi"
                                        name="isi"
                                        rows={5}
                                        className="block w-full rounded-md border-neutral px-3 py-2 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
                                        placeholder="Uraikan laporan Anda secara detail dan lengkap..."
                                        required
                                    />
                                </div>
                            </div>

                            {/* Tanggal Kejadian (hanya untuk pengaduan) */}
                            {klasifikasi === 'pengaduan' && (
                                <div className="mb-4">
                                    <label htmlFor="tanggal" className="block text-sm font-medium text-text-main">
                                        Tanggal Kejadian
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="date"
                                            name="tanggal"
                                            id="tanggal"
                                            className="block w-full rounded-md border-neutral px-3 py-2 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Kategori Laporan */}
                            <div className="mb-4">
                                <label htmlFor="kategori" className="block text-sm font-medium text-text-main">
                                    Kategori Laporan <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="kategori"
                                    name="kategori"
                                    className="mt-1 block w-full rounded-md border-neutral py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                                    defaultValue=""
                                    required
                                >
                                    <option value="" disabled>Pilih kategori...</option>
                                    {kategoriLaporan.map(kat => (
                                        <option key={kat} value={kat}>{kat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Section 3: Lampiran */}
                        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-accent">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                </svg>
                                Lampiran (Opsional)
                            </h3>
                            
                            <div>
                                <label className="block text-sm font-medium text-text-main mb-2">Upload Lampiran (Gambar)</label>
                                <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-neutral px-6 pt-5 pb-6 hover:border-primary transition-colors duration-200">
                                    <div className="space-y-1 text-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div className="flex text-sm text-text-secondary">
                                            <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-accent transition-colors duration-200">
                                                <span>Unggah file</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                                            </label>
                                            <p className="pl-1">atau seret dan lepas</p>
                                        </div>
                                        <p className="text-xs text-text-secondary">PNG, JPG, GIF hingga 5MB</p>
                                    </div>
                                </div>
                                {lampiran && (
                                    <div className="mt-2 text-sm text-text-secondary flex items-center justify-between bg-white p-3 rounded-md border border-green-200">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div>
                                                <p className="truncate pr-2">File: <span className="font-semibold text-text-main">{lampiran.name}</span></p>
                                                <p className="text-xs text-gray-500">Ukuran: {(lampiran.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => { setLampiran(null); setLampiranDataUrl(''); }} 
                                            className="text-red-500 hover:text-red-700 font-bold text-lg leading-none p-1 rounded-full hover:bg-red-50 transition-colors duration-200"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Section 3.5: Verifikasi Manusia */}
                        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-purple-500">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                Verifikasi Keamanan
                            </h3>
                            
                            <div className="bg-white p-4 rounded-md border border-purple-200">
                                <p className="text-sm text-gray-700 mb-3">
                                    Untuk memastikan Anda adalah manusia, silakan jawab pertanyaan berikut:
                                </p>
                                
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            {captchaQuestion.question} <span className="text-red-500">*</span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={generateCaptcha}
                                            className="text-purple-600 hover:text-purple-800 p-1 rounded-full hover:bg-purple-50 transition-colors duration-200"
                                            title="Ganti pertanyaan"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                        </button>
                                    </div>
                                    <input
                                        type="number"
                                        name="captcha"
                                        className="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 sm:text-sm"
                                        placeholder="Masukkan jawaban"
                                        required
                                        min="0"
                                        max="50"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Pertanyaan matematika sederhana untuk mencegah spam dan laporan otomatis
                                    </p>
                                </div>

                                <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                                    <div className="flex items-start">
                                        <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                        <div className="text-sm text-yellow-800">
                                            <p className="font-medium mb-1">Mengapa Verifikasi Ini Diperlukan?</p>
                                            <p className="text-xs">
                                                Verifikasi ini membantu kami mencegah laporan palsu dan spam yang dapat mengganggu proses penanganan laporan yang sah. 
                                                Setiap laporan yang masuk akan diproses dengan serius.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Syarat dan Ketentuan */}
                        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-yellow-500">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                Syarat dan Ketentuan
                            </h3>
                            
                            <div className="relative flex items-start">
                                <div className="flex h-5 items-center">
                                    <input
                                        id="terms"
                                        name="terms"
                                        type="checkbox"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                        className="h-4 w-4 rounded border-neutral text-primary focus:ring-primary"
                                        required
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="terms" className="font-medium text-text-main">
                                        Saya menyetujui <span className="text-red-500">*</span>
                                    </label>
                                    <p className="text-text-secondary">
                                        Dengan mengirimkan laporan ini, saya menyetujui bahwa informasi yang saya berikan adalah benar dan akurat. 
                                        <button
                                            type="button"
                                            onClick={() => setShowTermsModal(true)}
                                            className="text-primary hover:text-secondary underline ml-1"
                                        >
                                            Baca selengkapnya
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Tombol Kirim */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting || !agreedToTerms}
                                className="flex w-full justify-center rounded-md border border-transparent bg-gradient-to-r from-primary to-secondary py-3 px-4 text-sm font-medium text-white shadow-lg hover:from-secondary hover:to-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Mengirim...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                        Kirim Laporan
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>

        {/* Modal Terms and Conditions */}
        {showTermsModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-800">Syarat dan Ketentuan</h3>
                            <button
                                onClick={() => setShowTermsModal(false)}
                                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                            >
                                &times;
                            </button>
                        </div>
                        
                        <div className="text-sm text-gray-700 space-y-4">
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">1. Kebenaran Informasi</h4>
                                <p className="mb-3">
                                    Saya menyatakan bahwa semua informasi yang saya berikan dalam laporan ini adalah benar, akurat, dan lengkap sesuai dengan pengetahuan saya. Saya bertanggung jawab penuh atas kebenaran informasi yang disampaikan.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">2. Penggunaan Data</h4>
                                <p className="mb-3">
                                    Data yang saya berikan akan digunakan oleh Pemerintah Desa Moncongloe Bulu untuk keperluan penanganan laporan dan peningkatan pelayanan publik. Data akan dijaga kerahasiaannya sesuai dengan ketentuan yang berlaku.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">3. Kerahasiaan</h4>
                                <p className="mb-3">
                                    Jika saya memilih untuk tidak anonim, saya memahami bahwa nama dan informasi kontak saya dapat digunakan untuk keperluan follow-up laporan. Jika saya memilih anonim, identitas saya akan dijaga kerahasiaannya.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">4. Lampiran</h4>
                                <p className="mb-3">
                                    Jika saya melampirkan file gambar, saya menyatakan bahwa file tersebut adalah milik saya atau saya memiliki izin untuk menggunakannya. File yang diupload tidak mengandung konten yang melanggar hukum atau hak orang lain.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">5. Penanganan Laporan</h4>
                                <p className="mb-3">
                                    Saya memahami bahwa laporan ini akan ditangani sesuai dengan prioritas dan kapasitas Pemerintah Desa. Tidak ada jaminan waktu penanganan yang spesifik, namun setiap laporan akan diproses dengan serius.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">6. Larangan</h4>
                                <p className="mb-3">
                                    Saya tidak akan menggunakan sistem ini untuk:
                                </p>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    <li>Menyampaikan informasi palsu atau menyesatkan</li>
                                    <li>Melakukan spam atau pengiriman laporan berulang tanpa alasan yang valid</li>
                                    <li>Menyalahgunakan sistem untuk tujuan komersial atau politik</li>
                                    <li>Melanggar hak privasi atau reputasi orang lain</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">7. Tanggung Jawab</h4>
                                <p className="mb-3">
                                    Saya bertanggung jawab penuh atas isi laporan yang saya sampaikan. Pemerintah Desa tidak bertanggung jawab atas konsekuensi hukum yang timbul dari laporan palsu atau menyesatkan.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">8. Perubahan Ketentuan</h4>
                                <p className="mb-3">
                                    Pemerintah Desa berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan diumumkan melalui website resmi desa.
                                </p>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-blue-800 text-sm">
                                    <strong>Catatan:</strong> Dengan mencentang kotak persetujuan, Anda menyatakan telah membaca, memahami, dan menyetujui semua syarat dan ketentuan di atas.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setShowTermsModal(false)}
                                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors duration-200"
                            >
                                Saya Mengerti
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        <CustomNotification notification={notification} setNotification={setNotification} />
    </div>
    );
};

export default FormulirPengaduan;
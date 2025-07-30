    import React, { useState } from 'react';
    import { Link, useNavigate } from 'react-router-dom';

    // Header component for the form page
    const FormulirHeader = () => (
    <header className="w-full bg-primary text-white p-4 shadow-lg sticky top-0 z-20">
        <div className="relative max-w-xl mx-auto flex items-center justify-center h-16">
        <div className="absolute inset-y-0 left-0 flex items-center">
            <Link
            to="/pengaduan"
            className="p-2 rounded-full text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            aria-label="Kembali ke Halaman Pengaduan"
            >
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            </Link>
        </div>
        <div className="flex-1 flex items-center justify-center">
            <h1 className="text-xl font-bold">Suaraku</h1>
        </div>
        </div>
    </header>
    );

    const FormulirPengaduan = () => {
    const [klasifikasi, setKlasifikasi] = useState('pengaduan');
    const [isAnonim, setIsAnonim] = useState(false);
    const [lampiran, setLampiran] = useState(null);
    const [lampiranDataUrl, setLampiranDataUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
        // Karena tidak ada database, kita akan menyimpan data ke localStorage
        // sebagai contoh. Ini hanya akan tersimpan di browser pengguna.

        const laporanData = {
            id: Date.now(), // Gunakan timestamp sebagai ID unik sederhana
            klasifikasi: data.klasifikasi,
            judul: data.judul,
            isi: data.isi,
            tanggalKejadian: data.tanggal || '',
            kategori: data.kategori,
            lampiranInfo: lampiran ? lampiran.name : '', // Simpan nama file untuk info
            lampiranDataUrl, // Simpan data URL gambar
            nama: isAnonim ? 'Anonim' : data.nama,
            tanggalLaporan: new Date().toISOString(), // Simpan tanggal sebagai string ISO
        };

        // Ambil data lama dari localStorage, atau mulai dengan array kosong
        const existingLaporan = JSON.parse(localStorage.getItem('pengaduan')) || [];
        // Tambahkan laporan baru
        const updatedLaporan = [...existingLaporan, laporanData];
        // Simpan kembali ke localStorage
        localStorage.setItem('pengaduan', JSON.stringify(updatedLaporan));

        alert('Laporan berhasil dikirim!');
        navigate('/pengaduan');

        } catch (error) {
        console.error("Error saving report to localStorage: ", error);
        alert('Terjadi kesalahan saat menyimpan laporan. Silakan coba lagi.');
        } finally {
        setIsSubmitting(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
        setLampiran(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setLampiranDataUrl(reader.result);
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

    return (
        <div className="min-h-screen bg-gray-100">
        <FormulirHeader />
        <main className="max-w-xl mx-auto p-4 sm:p-6 pb-24">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-6 text-center">
                Sampaikan Laporan Anda!
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Klasifikasi Laporan */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Klasifikasi Laporan</label>
                <div className="flex items-center gap-x-6">
                    <div className="flex items-center">
                    <input
                        id="pengaduan"
                        name="klasifikasi"
                        type="radio"
                        value="pengaduan"
                        checked={klasifikasi === 'pengaduan'}
                        onChange={(e) => setKlasifikasi(e.target.value)}
                        className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                    />
                    <label htmlFor="pengaduan" className="ml-3 block text-sm text-gray-900">
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
                        className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                    />
                    <label htmlFor="aspirasi" className="ml-3 block text-sm text-gray-900">
                        Aspirasi
                    </label>
                    </div>
                </div>
                </div>

                {/* Judul Laporan */}
                <div>
                <label htmlFor="judul" className="block text-sm font-medium text-gray-700">
                    Judul Laporan
                </label>
                <div className="mt-1">
                    <input
                    type="text"
                    name="judul"
                    id="judul"
                    className="block w-full rounded-md border-gray-300 px-3 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    placeholder="Ketikkan judul laporan Anda"
                    required
                    />
                </div>
                </div>

                {/* Isi Laporan */}
                <div>
                <label htmlFor="isi" className="block text-sm font-medium text-gray-700">
                    Isi Laporan
                </label>
                <div className="mt-1">
                    <textarea
                    id="isi"
                    name="isi"
                    rows={5}
                    className="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    placeholder="Uraikan laporan Anda secara detail"
                    required
                    />
                </div>
                </div>

                {/* Tanggal Kejadian (Conditional) */}
                {klasifikasi === 'pengaduan' && (
                <div>
                    <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700">
                    Tanggal Kejadian
                    </label>
                    <div className="mt-1">
                    <input
                        type="date"
                        name="tanggal"
                        id="tanggal"
                        className="block w-full rounded-md border-gray-300 px-3 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                    </div>
                </div>
                )}

                {/* Kategori Laporan */}
                <div>
                <label htmlFor="kategori" className="block text-sm font-medium text-gray-700">
                    Kategori Laporan
                </label>
                <select
                    id="kategori"
                    name="kategori"
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    defaultValue=""
                >
                    <option value="" disabled>Pilih kategori...</option>
                    {kategoriLaporan.map(kat => (
                    <option key={kat} value={kat}>{kat}</option>
                    ))}
                </select>
                </div>

                {/* Upload Lampiran */}
                <div>
                <label className="block text-sm font-medium text-gray-700">Upload Lampiran (Gambar)</label>
                <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                    <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-accent">
                        <span>Unggah file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                        </label>
                        <p className="pl-1">atau seret dan lepas</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF hingga 10MB</p>
                    </div>
                </div>
                {lampiran && (
                    <div className="mt-2 text-sm text-gray-600 flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <p className="truncate pr-2">File: <span className="font-semibold">{lampiran.name}</span></p>
                    <button type="button" onClick={() => { setLampiran(null); setLampiranDataUrl(''); }} className="text-red-600 hover:text-red-800 font-bold text-lg leading-none">&times;</button>
                    </div>
                )}
                </div>

                {/* Checkbox Anonim */}
                <div className="relative flex items-start">
                <div className="flex h-5 items-center">
                    <input
                    id="anonim"
                    aria-describedby="anonim-description"
                    name="anonim"
                    type="checkbox"
                    checked={isAnonim}
                    onChange={(e) => setIsAnonim(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor="anonim" className="font-medium text-gray-700">
                    Kirim sebagai Anonim
                    </label>
                    <p id="anonim-description" className="text-gray-500">
                    Jika tidak dicentang, nama Anda akan dilampirkan.
                    </p>
                </div>
                </div>

                {/* Nama (Conditional) */}
                {!isAnonim && (
                <div>
                    <label htmlFor="nama" className="block text-sm font-medium text-gray-700">
                    Nama Anda
                    </label>
                    <div className="mt-1">
                    <input
                        type="text"
                        name="nama"
                        id="nama"
                        className="block w-full rounded-md border-gray-300 px-3 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        placeholder="Masukkan nama lengkap Anda"
                        required={!isAnonim}
                    />
                    </div>
                </div>
                )}

                {/* Tombol Kirim */}
                <div className="pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full justify-center rounded-md border border-transparent bg-primary py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Mengirim...' : 'Lapor!'}
                </button>
                </div>
            </form>
            </div>
        </main>
        </div>
    );
    };

    export default FormulirPengaduan;
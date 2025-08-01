import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
            const laporanData = {
                id: Date.now(),
                klasifikasi: data.klasifikasi,
                judul: data.judul,
                isi: data.isi,
                tanggalKejadian: data.tanggal || '',
                kategori: data.kategori,
                lampiranInfo: lampiran ? lampiran.name : '',
                lampiranDataUrl,
                nama: isAnonim ? 'Anonim' : data.nama,
                tanggalLaporan: new Date().toISOString(),
            };

            const existingLaporan = JSON.parse(localStorage.getItem('pengaduan')) || [];
            const updatedLaporan = [...existingLaporan, laporanData];
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
                        {/* Klasifikasi Laporan */}
                        <div>
                            {/* GANTI: Warna teks label */}
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

                        {/* Input Fields */}
                        {/* GANTI: Menyeragamkan gaya input, label, dan focus ring */}
                        <div>
                            <label htmlFor="judul" className="block text-sm font-medium text-text-main">
                                Judul Laporan
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

                        <div>
                            <label htmlFor="isi" className="block text-sm font-medium text-text-main">
                                Isi Laporan
                            </label>
                            <div className="mt-1">
                                <textarea
                                    id="isi"
                                    name="isi"
                                    rows={5}
                                    className="block w-full rounded-md border-neutral px-3 py-2 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
                                    placeholder="Uraikan laporan Anda secara detail"
                                    required
                                />
                            </div>
                        </div>

                        {klasifikasi === 'pengaduan' && (
                            <div>
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

                        <div>
                            <label htmlFor="kategori" className="block text-sm font-medium text-text-main">
                                Kategori Laporan
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

                        {/* Upload Lampiran */}
                        <div>
                            <label className="block text-sm font-medium text-text-main">Upload Lampiran (Gambar)</label>
                             {/* GANTI: File upload dengan gaya baru */}
                            <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-neutral px-6 pt-5 pb-6 hover:border-primary transition">
                                <div className="space-y-1 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <div className="flex text-sm text-text-secondary">
                                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-accent">
                                            <span>Unggah file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                                        </label>
                                        <p className="pl-1">atau seret dan lepas</p>
                                    </div>
                                    <p className="text-xs text-text-secondary">PNG, JPG, GIF hingga 10MB</p>
                                </div>
                            </div>
                            {lampiran && (
                                <div className="mt-2 text-sm text-text-secondary flex items-center justify-between bg-neutral/50 p-2 rounded-md">
                                    <p className="truncate pr-2">File: <span className="font-semibold text-text-main">{lampiran.name}</span></p>
                                    <button type="button" onClick={() => { setLampiran(null); setLampiranDataUrl(''); }} className="text-primary hover:text-secondary font-bold text-lg leading-none">&times;</button>
                                </div>
                            )}
                        </div>

                        {/* Checkbox Anonim */}
                        <div className="relative flex items-start">
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

                        {!isAnonim && (
                            <div>
                                <label htmlFor="nama" className="block text-sm font-medium text-text-main">
                                    Nama Anda
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

                        {/* Tombol Kirim */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex w-full justify-center rounded-md border border-transparent bg-primary py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                            >
                                {isSubmitting ? 'Mengirim...' : 'Lapor!'}
                            </button>
                        </div>
                    </form>
                </div>
                </div>
            </main>
        </div>
    );
};

export default FormulirPengaduan;
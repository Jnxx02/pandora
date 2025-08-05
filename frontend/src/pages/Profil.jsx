import React, { useState, useEffect } from 'react';
import { useDesa } from '../context/DesaContext';
import { useStatistik } from '../context/StatistikContext';
import { usePrasarana } from '../context/PrasaranaContext';
import BareVideoPlayer from '../components/BareVideoPlayer';

// Add lazy loading for images
const LazyImage = ({ src, alt, className, onError, ...props }) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [imageRef, setImageRef] = useState();

  useEffect(() => {
    let observer;
    let didCancel = false;

    if (imageRef && imageSrc) {
      if (IntersectionObserver) {
        observer = new IntersectionObserver(
          entries => {
            entries.forEach(entry => {
              if (
                !didCancel &&
                (entry.intersectionRatio > 0 || entry.isIntersecting)
              ) {
                setImageSrc(src);
                observer.unobserve(imageRef);
              }
            });
          },
          {
            threshold: 0.01,
            rootMargin: '75%',
          }
        );
        observer.observe(imageRef);
      } else {
        // Fallback for older browsers
        setImageSrc(src);
      }
    }
    return () => {
      didCancel = true;
      if (observer && observer.unobserve) {
        observer.unobserve(imageRef);
      }
    };
  }, [src, imageRef]);

  return (
    <img
      ref={setImageRef}
      src={imageSrc}
      alt={alt}
      className={className}
      onError={onError}
      loading="lazy"
      {...props}
    />
  );
};

// Data ini bisa dipindahkan ke context atau file data terpusat jika diperlukan di halaman lain
const batasWilayah = [
  { arah: 'Utara', wilayah: 'Desa Bonto Bunga (Kec. Mongcongloe, Kab. Maros)' },
  { arah: 'Selatan', wilayah: 'Desa Paccellekang (Kec. Pattallassang, Kab. Gowa)' },
  { arah: 'Barat', wilayah: 'Desa Moncongloe Lappara dan Desa Moncongloe (Kec. Moncongloe, Kab. Maros)' },
  { arah: 'Timur', wilayah: 'Desa Purnakarya (Kec. Tanralili, Kab. Maros)' },
];

const orbitrasi = [
  { nama: 'Pusat Pemerintahan Kecamatan (Moncongloe)', jarak: '0,5 km' },
  { nama: 'Pusat Pemerintahan Kabupaten (Turikale)', jarak: '27 km' },
  { nama: 'Pusat Pemerintahan Provinsi (Makassar)', jarak: '19 km' },
];

const wilayahAdministrasi = [
  { nama: 'Diccekang' },
  { nama: 'Tamalate' },
  { nama: 'Tammu-Tammu' },
  { nama: 'Tompo Balang' },
  { nama: 'Moncongloe Bulu' },
];



const organisasi = [
  {
    nama: 'LPM (Lembaga Pemberdayaan Masyarakat)',
    deskripsi: 'Lembaga yang menjadi mitra pemerintah desa dalam menampung dan mewujudkan aspirasi masyarakat di bidang pembangunan.',
  },
  {
    nama: 'Lembaga Adat',
    deskripsi: 'Organisasi yang menjaga dan melestarikan nilai-nilai adat serta budaya lokal di tengah masyarakat.',
  },
  {
    nama: 'PKK (Pemberdayaan Kesejahteraan Keluarga)',
    deskripsi: 'Organisasi yang berfokus pada pemberdayaan perempuan dan peningkatan kesejahteraan keluarga di tingkat desa.',
  },
  {
    nama: 'BUMDES (Badan Usaha Milik Desa)',
    deskripsi: 'Badan usaha yang dikelola oleh pemerintah desa dan masyarakat untuk memperkuat perekonomian desa.',
  },
  {
    nama: 'Karang Taruna',
    deskripsi: 'Wadah pengembangan generasi muda yang tumbuh dan berkembang atas dasar kesadaran dan tanggung jawab sosial.',
  },
  {
    nama: 'Kopdes (Koperasi Merah Putih)',
    deskripsi: 'Koperasi desa yang bertujuan untuk meningkatkan kesejahteraan anggota dan masyarakat melalui usaha bersama.',
  },
];

const visi = "Terwujudnya Desa Moncongloe Bulu yang Maju, Mandiri, Sejahtera, dan Berakhlak Mulia melalui Peningkatan Kualitas Sumber Daya Manusia dan Pemanfaatan Potensi Lokal.";

const misi = [
  "Meningkatkan kualitas penyelenggaraan pemerintahan desa yang transparan, akuntabel, dan partisipatif.",
  "Mengembangkan perekonomian desa melalui BUMDes, UMKM, dan potensi pertanian lokal.",
  "Meningkatkan kualitas infrastruktur dasar yang merata dan berkeadilan.",
  "Meningkatkan kualitas sumber daya manusia melalui program pendidikan dan kesehatan.",
  "Menciptakan lingkungan masyarakat yang aman, tertib, dan rukun dalam kehidupan bermasyarakat.",
];



const Profil = () => {
  const { profil } = useDesa();
  const [isVisiOpen, setVisiOpen] = useState(false);
  const [isMisiOpen, setMisiOpen] = useState(false);
  const [isPetaOpen, setPetaOpen] = useState(false);
  const [isTopografiOpen, setTopografiOpen] = useState(false);
  const [isOrbitrasiOpen, setOrbitrasiOpen] = useState(false);
  const [isBatasOpen, setBatasOpen] = useState(false);
  const [openOrganisasi, setOpenOrganisasi] = useState({});
  const [sotkStaffOpen, setSotkStaffOpen] = useState(false);
  const [sotkDusunOpen, setSotkDusunOpen] = useState(false);

  const { statistik } = useStatistik();
  const { prasarana } = usePrasarana();



  const toggleOrganisasi = (nama) => {
    setOpenOrganisasi(prev => ({ ...prev, [nama]: !prev[nama] }));
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary mb-2">PROFIL DESA MONCONGLOE BULU</h1>
          <p className="text-lg text-secondary">Kecamatan {profil.kecamatan}, Kabupaten {profil.kabupaten}</p>
        </div>

        {/* Video Dokumenter */}
        <section className="w-full mb-16">
          <BareVideoPlayer
            youtubeUrl="https://youtu.be/j0fxF3xriEA" // Ganti dengan URL YouTube yang sesuai
            title="Video Dokumenter Desa Moncongloe Bulu"
            className="mb-4"
          />
          <p className="text-center text-primary italic">
            Video perkenalan singkat mengenai Desa Moncongloe Bulu, meliputi potensi, kegiatan, dan kehidupan masyarakatnya.
          </p>
        </section>

        {/* Visi dan Misi */}
        <section className="w-full mb-16">
          <h2 className="text-xl sm:text-4xl font-bold text-primary mb-8">Visi dan Misi Desa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <img 
              src="https://upload.wikimedia.org/wikipedia/id/thumb/f/fe/Desa_Moncongloe_Bulu.jpg/500px-Desa_Moncongloe_Bulu.jpg" // Pastikan gambar ada di folder `public/images`
              alt="Ilustrasi Visi dan Misi Desa"
              className="w-full h-64 md:h-auto object-cover rounded-xl shadow-lg"
            />
            <div className="space-y-4">
              {/* Visi Accordion */}
              <div className="border-b border-gray-200 pb-4">
                <button 
                  onClick={() => setVisiOpen(!isVisiOpen)}
                  className="w-full flex justify-between items-center text-left font-semibold text-lg text-secondary focus:outline-none"
                >
                  <span>Visi</span>
                  <span className={`transform transition-transform duration-300 ${isVisiOpen ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isVisiOpen ? 'max-h-96 mt-3' : 'max-h-0'}`}>
                  <p className="italic text-primary pt-2">"{visi}"</p>
                </div>
              </div>
              {/* Misi Accordion */}
              <div>
                <button 
                  onClick={() => setMisiOpen(!isMisiOpen)}
                  className="w-full flex justify-between items-center text-left font-semibold text-lg text-secondary focus:outline-none"
                >
                  <span>Misi</span>
                  <span className={`transform transition-transform duration-300 ${isMisiOpen ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isMisiOpen ? 'max-h-[32rem] mt-3' : 'max-h-0'}`}>
                  <ul className="list-decimal list-inside space-y-2 text-primary pt-2">
                    {misi.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>


          {/* SOTK Pemerintah Desa */}
          <section className="w-full mb-16">
            <div className="mb-12">
            <h2 className="text-xl sm:text-4xl font-bold text-primary mb-8">SOTK Pemerintah Desa</h2>
          
          {/* Staff Kantor Desa */}
          <div className="mb-8">
            <h3 className="text-lg sm:text-2xl font-bold text-secondary mb-6 text-center">Staff Kantor Desa</h3>
            
            {/* Layout untuk 3 staff dengan posisi yang seimbang */}
            <div className="flex flex-col lg:flex-row justify-center items-center gap-8 mb-6">
              {/* Kepala Desa - Posisi Tengah */}
              <div className="order-2 lg:order-1 bg-white rounded-xl shadow-lg p-6 border border-gray-200/80 hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full max-w-sm">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-red-200 shadow-lg">
                    <LazyImage 
                      src="https://moncongloebulu.vercel.app/images/team/muhammad%20tahir.jpeg" 
                      alt="Kepala Desa Muhammad Tahir"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center" style={{display: 'none'}}>
                      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">Kepala Desa</h3>
                  <p className="text-secondary text-base mb-3 font-medium">Muhammad Tahir</p>
                  <div className="inline-flex items-center gap-2 text-sm text-gray-600 bg-red-50 px-4 py-2 rounded-full border border-red-200">
                    <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    Periode 2019-2027
                  </div>
                </div>
              </div>

              {/* Sekretaris Desa - Posisi Kiri */}
              <div className="order-1 lg:order-2 bg-white rounded-xl shadow-lg p-6 border border-gray-200/80 hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full max-w-sm">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-blue-200 shadow-lg">
                    <LazyImage 
                      src="https://moncongloebulu.vercel.app/images/team/sekdes%20mbulu.jpg" 
                      alt="Sekretaris Desa Abd Rasyid"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center" style={{display: 'none'}}>
                      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">Sekretaris Desa</h3>
                  <p className="text-secondary text-base mb-3 font-medium">Abd Rasyid, S.Pd</p>
                  <div className="inline-flex items-center gap-2 text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    Non-PNS
                  </div>
                </div>
              </div>

              {/* Kaur Keuangan - Posisi Kanan */}
              <div className="order-3 lg:order-3 bg-white rounded-xl shadow-lg p-6 border border-gray-200/80 hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full max-w-sm">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-teal-200 shadow-lg">
                    <LazyImage 
                      src="https://moncongloebulu.vercel.app/images/team/Pak%20Bahar.jpg" 
                      alt="Kaur Keuangan"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center" style={{display: 'none'}}>
                      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">Kaur Keuangan</h3>
                  <p className="text-secondary text-base mb-3 font-medium">Baharuddin, S.Pd</p>
                  <div className="inline-flex items-center gap-2 text-sm text-gray-600 bg-teal-50 px-4 py-2 rounded-full border border-teal-200">
                    <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    Non-PNS
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Staff Members */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {/* Sertu Eko Kustriyanto - Babinsa */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200/80 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-green-200 shadow-lg">
                    <LazyImage 
                      src="/images/pengurus/babinsa.jpg" 
                      alt="Babinsa Sertu Eko Kustriyanto"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center" style={{display: 'none'}}>
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">Babinsa</h3>
                  <p className="text-secondary text-base mb-3 font-medium">Sertu Eko Kustriyanto</p>
                  <div className="inline-flex items-center gap-2 text-xs text-gray-600 bg-green-50 px-3 py-2 rounded-full border border-green-200">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    TNI AD
                  </div>
                </div>
              </div>

              {/* Aiptu Abdul Kadir - Binmas */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200/80 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-purple-200 shadow-lg">
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">Binmas</h3>
                  <p className="text-secondary text-base mb-3 font-medium">Aiptu Abdul Kadir</p>
                  <div className="inline-flex items-center gap-2 text-xs text-gray-600 bg-purple-50 px-3 py-2 rounded-full border border-purple-200">
                    <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    POLRI
                  </div>
                </div>
              </div>

              {/* Ketua TP. PKK Desa */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200/80 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-pink-200 shadow-lg">
                    <div className="w-full h-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">Ketua TP. PKK Desa</h3>
                  <p className="text-secondary text-base mb-3 font-medium">Hanik, S.Pd</p>
                  <div className="inline-flex items-center gap-2 text-xs text-gray-600 bg-pink-50 px-3 py-2 rounded-full border border-pink-200">
                    <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    PKK Desa
                  </div>
                </div>
              </div>
            </div>

            {/* Button Lihat Selengkapnya */}
            <div className="text-center mt-8">
              <button 
                onClick={() => setSotkStaffOpen(!sotkStaffOpen)}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Lihat Struktur Lengkap
              </button>
            </div>

            {/* Struktur Lengkap (Hidden by default) */}
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${sotkStaffOpen ? 'max-h-[50rem] mt-6' : 'max-h-0'}`}>
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200/80">
                <h4 className="text-lg font-bold text-primary mb-4 text-center">Struktur Organisasi Lengkap</h4>
                <img 
                  src="https://upload.wikimedia.org/wikipedia/id/thumb/f/fe/Desa_Moncongloe_Bulu.jpg/500px-Desa_Moncongloe_Bulu.jpg" 
                  alt="Struktur Organisasi Desa Moncongloe Bulu"
                  className="w-full h-auto rounded-lg shadow-md border"
                />
                <p className="text-sm text-gray-600 mt-3 text-center">
                  Struktur Organisasi Tata Kerja Pemerintah Desa Moncongloe Bulu
                </p>
              </div>
            </div>
          </div>

          {/* Kepala Dusun */}
          <div className="mb-8">
            <h3 className="text-lg sm:text-2xl font-bold text-secondary mb-6 text-center">Kepala Dusun & Jadwal Piket</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* Dusun Diccekang */}
                <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200/80 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-yellow-200 shadow-lg">
                      <LazyImage 
                        src="https://moncongloebulu.vercel.app/images/team/Dusun%20diccekang.jpg" 
                        alt="Kepala Dusun Diccekang Burhanuddin"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center" style={{display: 'none'}}>
                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-primary mb-2">Dusun Diccekang</h3>
                    <p className="text-secondary text-sm mb-3 font-medium">Burhanuddin</p>
                    <div className="inline-flex items-center gap-2 text-xs text-gray-600 bg-yellow-50 px-3 py-2 rounded-full border border-yellow-200">
                      <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      Senin
                    </div>
                  </div>
                </div>

                {/* Dusun Tamalate */}
                <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200/80 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-yellow-200 shadow-lg">
                      <LazyImage 
                        src="/images/pengurus/kepala-dusun-tamalate.jpg" 
                        alt="Kepala Dusun Tamalate Syaripuddin"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center" style={{display: 'none'}}>
                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-primary mb-2">Dusun Tamalate</h3>
                    <p className="text-secondary text-sm mb-3 font-medium">Syaripuddin</p>
                    <div className="inline-flex items-center gap-2 text-xs text-gray-600 bg-yellow-50 px-3 py-2 rounded-full border border-yellow-200">
                      <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      Selasa
                    </div>
                  </div>
                </div>

                {/* Dusun Moncongloe Bulu */}
                <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200/80 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-yellow-200 shadow-lg">
                      <LazyImage 
                        src="https://moncongloebulu.vercel.app/images/team/dusun%20mbulu.png" 
                        alt="Kepala Dusun M. Loe Bulu Rahman"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center" style={{display: 'none'}}>
                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-primary mb-2">Dusun Moncongloe Bulu</h3>
                    <p className="text-secondary text-sm mb-3 font-medium">Rahman</p>
                    <div className="inline-flex items-center gap-2 text-xs text-gray-600 bg-yellow-50 px-3 py-2 rounded-full border border-yellow-200">
                      <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      Rabu
                    </div>
                  </div>
                </div>

                {/* Dusun Tammu-Tammu */}
                <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200/80 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-yellow-200 shadow-lg">
                      <LazyImage 
                        src="/images/pengurus/kepala-dusun-tammu-tammu.jpg" 
                        alt="Kepala Dusun Tammu-Tammu Fery Andayani"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center" style={{display: 'none'}}>
                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-primary mb-2">Dusun Tammu-Tammu</h3>
                    <p className="text-secondary text-sm mb-3 font-medium">Fery Andayani</p>
                    <div className="inline-flex items-center gap-2 text-xs text-gray-600 bg-yellow-50 px-3 py-2 rounded-full border border-yellow-200">
                      <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      Kamis
                    </div>
                  </div>
                </div>

                {/* Dusun Tompo Balang */}
                <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200/80 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-yellow-200 shadow-lg">
                      <LazyImage 
                        src="https://moncongloebulu.vercel.app/images/team/Dusun%20Hasbi.jpg" 
                        alt="Kepala Dusun Tompo Balang Hasbi"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center" style={{display: 'none'}}>
                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-primary mb-2">Dusun Tompo Balang</h3>
                    <p className="text-secondary text-sm mb-3 font-medium">Hasbi</p>
                    <div className="inline-flex items-center gap-2 text-xs text-gray-600 bg-yellow-50 px-3 py-2 rounded-full border border-yellow-200">
                      <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      Jum'at
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Download Button */}
          <div className="text-center">
            <a 
              href="/dokumen/sotk-desa-moncongloe-bulu.pdf" // Pastikan file ada di folder `public/dokumen`
              download="SOTK Desa Moncongloe Bulu.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Unduh SOTK (PDF)
            </a>
            <p className="text-sm text-gray-500 mt-3">
              Struktur Organisasi Tata Kerja Pemerintah Desa Moncongloe Bulu
            </p>
          </div>
        </section>

        {/* Kondisi Geografis */}
        <section className="w-full mb-16">
          <h2 className="text-xl sm:text-4xl font-bold text-primary mb-8">Kondisi Geografis</h2>
          <div className="space-y-4">
            {/* Peta Accordion */}
            <div className="border-b border-gray-200 pb-4">
              <button onClick={() => setPetaOpen(!isPetaOpen)} className="w-full flex justify-between items-center text-left font-semibold text-lg text-secondary focus:outline-none">
                <span>Peta Wilayah</span>
                <span className={`transform transition-transform duration-300 ${isPetaOpen ? 'rotate-180' : ''}`}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></span>
              </button>
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isPetaOpen ? 'max-h-[30rem] mt-4' : 'max-h-0'}`}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31787.95859943921!2d119.5353578991339!3d-5.101038111959704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbe33251033253b%3A0x5030bfbcaf775d0!2sMoncongloe%20Bulu%2C%2C%2C%20Kec.%20Moncongloe%2C%20Kabupaten%20Maros%2C%20Sulawesi%20Selatan!5e0!3m2!1sid!2sid!4v1693928994523!5m2!1sid!2sid"
                  className="w-full h-80 rounded-xl shadow-lg border-2 border-white"
                  allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade">
                </iframe>
              </div>
            </div>
            {/* Topografi Accordion */}
            <div className="border-b border-gray-200 pb-4">
              <button onClick={() => setTopografiOpen(!isTopografiOpen)} className="w-full flex justify-between items-center text-left font-semibold text-lg text-secondary focus:outline-none">
                <span>Topografi</span>
                <span className={`transform transition-transform duration-300 ${isTopografiOpen ? 'rotate-180' : ''}`}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></span>
              </button>
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isTopografiOpen ? 'max-h-96 mt-3' : 'max-h-0'}`}>
                <p className="text-primary pt-2">Wilayah Desa Moncongloe Bulu masuk dalam kategori dataran rendah dengan ketinggian rata-rata <strong>50 meter</strong> di atas permukaan laut.</p>
              </div>
            </div>
            {/* Orbitrasi Accordion */}
            <div className="border-b border-gray-200 pb-4">
              <button onClick={() => setOrbitrasiOpen(!isOrbitrasiOpen)} className="w-full flex justify-between items-center text-left font-semibold text-lg text-secondary focus:outline-none">
                <span>Jarak Orbitrasi</span>
                <span className={`transform transition-transform duration-300 ${isOrbitrasiOpen ? 'rotate-180' : ''}`}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></span>
              </button>
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOrbitrasiOpen ? 'max-h-96 mt-3' : 'max-h-0'}`}>
                <ul className="list-disc list-inside text-primary space-y-1 pt-2">
                  {orbitrasi.map(o => (
                    <li key={o.nama}>
                      <span>{o.nama}: </span>
                      <span className="font-semibold">{o.jarak}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Batas Wilayah Accordion */}
            <div>
              <button onClick={() => setBatasOpen(!isBatasOpen)} className="w-full flex justify-between items-center text-left font-semibold text-lg text-secondary focus:outline-none">
                <span>Batas Wilayah</span>
                <span className={`transform transition-transform duration-300 ${isBatasOpen ? 'rotate-180' : ''}`}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></span>
              </button>
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isBatasOpen ? 'max-h-[32rem] mt-3' : 'max-h-0'}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {batasWilayah.map((item) => (
                    <div key={item.arah} className="bg-red-50/50 rounded-lg p-4 border border-red-200">
                      <div className="font-bold text-secondary mb-1">Batas {item.arah}</div>
                      <p className="text-primary text-sm">{item.wilayah}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Wilayah Administrasi */}
        <section className="w-full mb-16">
          <h2 className="text-xl sm:text-4xl font-bold text-primary mb-8">Wilayah Administrasi</h2>
          <p className="text-primary mb-8 max-w-2xl">
            Secara administratif, wilayah Desa Moncongloe Bulu terbagi menjadi <strong>5 dusun</strong> dan <strong>19 Rukun Tetangga (RT)</strong>. Berikut adalah nama-nama dusun yang ada di desa kami:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
            {wilayahAdministrasi.map((dusun) => (
              <div key={dusun.nama} className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md border border-gray-200/80">
                <div className="font-semibold text-secondary">{dusun.nama}</div>
              </div>
            ))}
          </div>
        </section>


        {/* Statistik Penduduk */}
        <section className="w-full mb-16">
          <h2 className="text-xl sm:text-4xl font-bold text-primary mb-8">Statistik Penduduk</h2>
          
          <div className="flex justify-center gap-8 mb-10">
            <div className="text-center p-4">
              <div className="text-4xl font-extrabold text-primary">
                {statistik.find(s => s.label === 'Penduduk')?.value || '3.820'}
              </div>
              <div className="text-secondary font-semibold mt-1">Total Penduduk</div>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl font-extrabold text-primary">
                {statistik.find(s => s.label === 'Kepala Keluarga')?.value || '1.245'}
              </div>
              <div className="text-secondary font-semibold mt-1">Kepala Keluarga</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Berdasarkan Jenis Kelamin */}
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-200">
              <h3 className="font-bold text-lg text-secondary mb-4 text-center">Berdasarkan Jenis Kelamin</h3>
              <div className="space-y-3">
                {statistik.filter(s => s.label === 'Laki-Laki' || s.label === 'Perempuan').map(item => (
                  <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-primary">{item.label}</span>
                    </div>
                    <span className="font-bold text-lg text-red-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Berdasarkan Dusun */}
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-200">
              <h3 className="font-bold text-lg text-secondary mb-4 text-center">Berdasarkan Dusun</h3>
              <div className="space-y-3">
                {statistik.filter(s => ['Diccekang', 'Tompo Balang', 'Tamalate', 'Tammu-Tammu', 'Moncongloe Bulu'].includes(s.label)).map(item => (
                  <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-primary">{item.label}</span>
                    </div>
                    <span className="font-bold text-lg text-red-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Infrastruktur */}
        <section className="w-full mb-16">
          <h2 className="text-xl sm:text-4xl font-bold text-primary mb-8">Infrastruktur & Sarana</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prasarana.map((item) => (
              <div key={item.kategori} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200/80 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  {/* Icon berdasarkan kategori */}
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    {item.kategori === 'Pendidikan' && (
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                      </svg>
                    )}
                    {item.kategori === 'Kesehatan' && (
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                      </svg>
                    )}
                    {item.kategori === 'Ibadah' && (
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    )}
                    {item.kategori === 'Umum' && (
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                      </svg>
                    )}
                  </div>
                  <h3 className="font-bold text-xl text-secondary">{item.kategori}</h3>
                </div>
                
                <div className="space-y-2">
                  {item.list.map((fasilitas, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-primary text-sm leading-relaxed">{fasilitas}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {item.list.length} Fasilitas
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Ringkasan Statistik */}
          <div className="mt-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 border border-primary/20">
            <h3 className="text-lg font-bold text-primary mb-4 text-center">Ringkasan Infrastruktur</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {prasarana.reduce((total, item) => total + item.list.length, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Fasilitas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">
                  {prasarana.length}
                </div>
                <div className="text-sm text-gray-600">Kategori</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {prasarana.find(item => item.kategori === 'Pendidikan')?.list.length || 0}
                </div>
                <div className="text-sm text-gray-600">Fasilitas Pendidikan</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {prasarana.find(item => item.kategori === 'Kesehatan')?.list.length || 0}
                </div>
                <div className="text-sm text-gray-600">Fasilitas Kesehatan</div>
              </div>
            </div>
          </div>
        </section>

        {/* Organisasi Kemasyarakatan */}
        <section className="w-full mb-16">
          <h2 className="text-xl sm:text-4xl font-bold text-primary mb-8">Organisasi Kemasyarakatan</h2>
          <div className="space-y-4">
            {organisasi.map((item) => (
              <div key={item.nama} className="border-b border-gray-200 pb-4">
                <button 
                  onClick={() => toggleOrganisasi(item.nama)}
                  className="w-full flex justify-between items-center text-left font-semibold text-lg text-secondary focus:outline-none"
                >
                  <span className="flex items-center gap-3">
                    <span>{item.nama}</span>
                  </span>
                  <span className={`transform transition-transform duration-300 ${openOrganisasi[item.nama] ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openOrganisasi[item.nama] ? 'max-h-96 mt-3' : 'max-h-0'}`}>
                  <p className="text-primary pt-2 pl-10">
                    {item.deskripsi}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery Desa */}
        <section className="w-full mb-16">
          <h2 className="text-xl sm:text-4xl font-bold text-primary mb-8">Galeri Desa</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Gallery Item 1 */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <LazyImage
                src="/images/gallery/pemandangan-alam.JPG"
                alt="Pemandangan Desa"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-semibold text-lg">Pemandangan Desa</h3>
                  <p className="text-sm opacity-90">Keindahan alam dan pemandangan desa yang asri</p>
                </div>
              </div>
            </div>

            {/* Gallery Item 2 */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <LazyImage
                src="/images/gallery/pemandangan-alam.JPG"
                alt="Kegiatan Masyarakat"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-semibold text-lg">Kegiatan Masyarakat</h3>
                  <p className="text-sm opacity-90">Aktivitas dan gotong royong warga desa</p>
                </div>
              </div>
            </div>

            {/* Gallery Item 3 */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <LazyImage
                src="/images/gallery/pemandangan-alam.JPG"
                alt="Potensi Pertanian"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-semibold text-lg">Potensi Pertanian</h3>
                  <p className="text-sm opacity-90">Lahan pertanian yang subur dan produktif</p>
                </div>
              </div>
            </div>

            {/* Gallery Item 4 */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <LazyImage
                src="/images/gallery/pemandangan-alam.JPG"
                alt="Infrastruktur Desa"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-semibold text-lg">Infrastruktur Desa</h3>
                  <p className="text-sm opacity-90">Fasilitas dan sarana prasarana desa</p>
                </div>
              </div>
            </div>

            {/* Gallery Item 5 */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <LazyImage
                src="/images/gallery/pemandangan-alam.JPG"
                alt="Budaya dan Tradisi"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-semibold text-lg">Budaya dan Tradisi</h3>
                  <p className="text-sm opacity-90">Kearifan lokal dan adat istiadat desa</p>
                </div>
              </div>
            </div>

            {/* Gallery Item 6 */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <LazyImage
                src="/images/gallery/pemandangan-alam.JPG"
                alt="Kehidupan Sehari-hari"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-semibold text-lg">Kehidupan Sehari-hari</h3>
                  <p className="text-sm opacity-90">Rutinitas dan aktivitas warga desa</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Profil;
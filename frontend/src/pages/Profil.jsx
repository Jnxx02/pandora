import React, { useState, useEffect } from 'react';
import { useDesa } from '../context/DesaContext';
import { useStatistik } from '../context/StatistikContext';
import { usePrasarana } from '../context/PrasaranaContext';
import BareVideoPlayer from '../components/BareVideoPlayer';

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

const initialPrasarana = [
  {
    kategori: 'Pendidikan',
    list: ['TK/PAUD (4 Unit)', 'SD Negeri (3 Unit)', 'SMP Negeri (1 Unit)'],
  },
  {
    kategori: 'Kesehatan',
    list: ['Puskesmas Pembantu (1 Unit)', 'Poskesdes (1 Unit)', 'Posyandu (5 Unit)'],
  },
  {
    kategori: 'Ibadah',
    list: ['Masjid (8 Unit)', 'Gereja (1 Unit)'],
  },
  {
    kategori: 'Umum',
    list: ['Kantor Desa (1 Unit)', 'Pasar Desa (1 Unit)', 'Lapangan Olahraga (2 Unit)'],
  },
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

const Section = ({ title, children, className }) => (
  <section className={`w-full bg-white rounded-2xl shadow p-6 sm:p-8 border border-gray-200/80 mb-8 ${className}`}>
    <h2 className="text-xl sm:text-2xl font-bold text-primary mb-6 text-center">{title}</h2>
    {children}
  </section>
);

const Profil = () => {
  const { profil } = useDesa();
  const [isVisiOpen, setVisiOpen] = useState(false);
  const [isMisiOpen, setMisiOpen] = useState(false);
  const [isPetaOpen, setPetaOpen] = useState(false);
  const [isTopografiOpen, setTopografiOpen] = useState(false);
  const [isOrbitrasiOpen, setOrbitrasiOpen] = useState(false);
  const [isBatasOpen, setBatasOpen] = useState(false);
  const [openOrganisasi, setOpenOrganisasi] = useState({});

  const { statistik } = useStatistik();
  const { prasarana, setPrasarana } = usePrasarana();

  useEffect(() => {
    // Data prasarana sudah di-context, jadi tidak perlu load dari localStorage lagi
    // Namun, jika ada kebutuhan untuk mengubah data prasarana dari context,
    // Anda bisa menambahkan logika di sini.
  }, []);

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


        {/* Struktur Organisasi */}
        <section className="w-full mb-16">
          <h2 className="text-xl sm:text-4xl font-bold text-primary mb-8">SOTK Pemerintah Desa</h2>
          <img 
            src="https://upload.wikimedia.org/wikipedia/id/thumb/f/fe/Desa_Moncongloe_Bulu.jpg/500px-Desa_Moncongloe_Bulu.jpg" // Pastikan gambar ada di folder `public/images`
            alt="Struktur Organisasi Desa Moncongloe Bulu" 
            className="w-full h-auto rounded-lg shadow-md border"
          />
          <div className="text-center mt-4">
            <a 
              href="/dokumen/struktur-organisasi.pdf" // Pastikan file ada di folder `public/dokumen`
              download="Struktur Organisasi Desa Moncongloe Bulu.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-red-700 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Unduh Struktur (PDF)
            </a>
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

      </div>
    </div>
  );
};

export default Profil; 
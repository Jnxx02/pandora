import React, { useState, useEffect } from 'react';
import { useDesa } from '../context/DesaContext';
import { useStatistik } from '../context/StatistikContext';

// Data statis dapat disimpan di sini atau di file terpisah
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
    icon: '🎓',
    list: ['TK/PAUD (4 Unit)', 'SD Negeri (3 Unit)', 'SMP Negeri (1 Unit)'],
  },
  {
    kategori: 'Kesehatan',
    icon: '🏥',
    list: ['Puskesmas Pembantu (1 Unit)', 'Poskesdes (1 Unit)', 'Posyandu (5 Unit)'],
  },
  {
    kategori: 'Ibadah',
    icon: '🕌',
    list: ['Masjid (8 Unit)', 'Gereja (1 Unit)'],
  },
  {
    kategori: 'Umum',
    icon: '🏛️',
    list: ['Kantor Desa (1 Unit)', 'Pasar Desa (1 Unit)', 'Lapangan Olahraga (2 Unit)'],
  },
];

const organisasi = [
    {
    nama: 'LPM (Lembaga Pemberdayaan Masyarakat)',
    icon: '🏘️',
    deskripsi: 'Lembaga yang menjadi mitra pemerintah desa dalam menampung dan mewujudkan aspirasi masyarakat di bidang pembangunan.',
    },
    {
    nama: 'Lembaga Adat',
    icon: '📜',
    deskripsi: 'Organisasi yang menjaga dan melestarikan nilai-nilai adat serta budaya lokal di tengah masyarakat.',
    },
    {
    nama: 'PKK (Pemberdayaan Kesejahteraan Keluarga)',
    icon: '👩‍👩‍👧‍👦',
    deskripsi: 'Organisasi yang berfokus pada pemberdayaan perempuan dan peningkatan kesejahteraan keluarga di tingkat desa.',
    },
    {
    nama: 'BUMDES (Badan Usaha Milik Desa)',
    icon: '📈',
    deskripsi: 'Badan usaha yang dikelola oleh pemerintah desa dan masyarakat untuk memperkuat perekonomian desa.',
    },
    {
    nama: 'Karang Taruna',
    icon: '🧑‍🤝‍🧑',
    deskripsi: 'Wadah pengembangan generasi muda yang tumbuh dan berkembang atas dasar kesadaran dan tanggung jawab sosial.',
    },
    {
    nama: 'Kopdes (Koperasi Merah Putih)',
    icon: '🤝',
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

  const { statistik } = useStatistik();
  const [prasarana, setPrasarana] = useState(initialPrasarana);

  useEffect(() => {
    const loadPrasarana = () => {
      try {
        const storedPrasarana = localStorage.getItem('prasarana');
        if (storedPrasarana) {
          setPrasarana(JSON.parse(storedPrasarana));
        } else {
          localStorage.setItem('prasarana', JSON.stringify(initialPrasarana));
          setPrasarana(initialPrasarana);
        }
      } catch (error) {
        console.error("Gagal memuat prasarana dari localStorage:", error);
        setPrasarana(initialPrasarana);
      }
    };

    loadPrasarana();
    window.addEventListener('storage', loadPrasarana);
    return () => window.removeEventListener('storage', loadPrasarana);
  }, []);

  const toggleOrganisasi = (nama) => {
    setOpenOrganisasi(prev => ({ ...prev, [nama]: !prev[nama] }));
  };

  return (
    // GANTI: Menggunakan latar belakang solid 'bg-background'
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary mb-2">PROFIL DESA MONCONGLOE BULU</h1>
          {/* GANTI: Menggunakan warna 'text-secondary' */}
          <p className="text-lg text-secondary">Kecamatan {profil.kecamatan}, Kabupaten {profil.kabupaten}</p>
        </div>

        {/* Video Dokumenter */}
        <section className="w-full mb-16">
          <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-lg mb-4 border-2 border-neutral">
            <iframe
              src="https://www.youtube.com/embed/videoseries?list=PL..._YOUR_PLAYLIST_ID"
              title="Video Dokumenter Desa Moncongloe Bulu"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
          {/* GANTI: Menggunakan 'text-text-secondary' */}
          <p className="text-center text-text-secondary italic">
            Video perkenalan singkat mengenai Desa Moncongloe Bulu, meliputi potensi, kegiatan, dan kehidupan masyarakatnya.
          </p>
        </section>

        {/* Visi dan Misi */}
        <section className="w-full mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-8 text-center">Visi dan Misi Desa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <img 
              src="https://upload.wikimedia.org/wikipedia/id/thumb/f/fe/Desa_Moncongloe_Bulu.jpg/500px-Desa_Moncongloe_Bulu.jpg"
              alt="Ilustrasi Visi dan Misi Desa"
              className="w-full h-64 md:h-auto object-cover rounded-xl shadow-lg"
            />
            <div className="space-y-4">
              {/* Visi Accordion */}
              <div className="border-b border-neutral pb-4">
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
                  {/* GANTI: Menggunakan 'text-text-main' */}
                  <p className="italic text-text-main pt-2">"{visi}"</p>
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
                   {/* GANTI: Menggunakan 'text-text-main' */}
                  <ul className="list-decimal list-inside space-y-2 text-text-main pt-2">
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
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-8 text-center">SOTK Pemerintah Desa</h2>
          <img 
            src="https://upload.wikimedia.org/wikipedia/id/thumb/f/fe/Desa_Moncongloe_Bulu.jpg/500px-Desa_Moncongloe_Bulu.jpg"
            alt="Struktur Organisasi Desa Moncongloe Bulu" 
            className="w-full h-auto rounded-lg shadow-md border border-neutral"
          />
          <div className="text-center mt-4">
             {/* GANTI: Tombol menggunakan warna palet */}
            <a 
              href="/dokumen/struktur-organisasi.pdf"
              download="Struktur Organisasi Desa Moncongloe Bulu.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-secondary transition"
            >
              <span>📄</span> Unduh Struktur (PDF)
            </a>
          </div>
        </section>

        {/* Kondisi Geografis */}
        <section className="w-full mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-8 text-center">Kondisi Geografis</h2>
          <div className="space-y-4 bg-white p-6 rounded-2xl shadow border border-neutral/50">
            {/* Peta Accordion */}
            <div className="border-b border-neutral pb-4">
              <button onClick={() => setPetaOpen(!isPetaOpen)} className="w-full flex justify-between items-center text-left font-semibold text-lg text-secondary focus:outline-none">
                <span>Peta Wilayah</span>
                <span className={`transform transition-transform duration-300 ${isPetaOpen ? 'rotate-180' : ''}`}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></span>
              </button>
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isPetaOpen ? 'max-h-[30rem] mt-4' : 'max-h-0'}`}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31787.95859943921!2d119.5353578991339!3d-5.101038111959704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbe33251033253b%3A0x5030bfbcaf775d0!2sMoncongloe%20Bulu%2C%2C%2C%20Kec.%20Moncongloe%2C%20Kabupaten%20Maros%2C%20Sulawesi%20Selatan!5e0!3m2!1sid!2sid!4v1693928994523!5m2!1sid!2sid"
                  className="w-full h-80 rounded-xl shadow-lg border-2 border-neutral"
                  allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade">
                </iframe>
              </div>
            </div>
            {/* Topografi Accordion */}
            <div className="border-b border-neutral pb-4">
              <button onClick={() => setTopografiOpen(!isTopografiOpen)} className="w-full flex justify-between items-center text-left font-semibold text-lg text-secondary focus:outline-none">
                <span>Topografi</span>
                <span className={`transform transition-transform duration-300 ${isTopografiOpen ? 'rotate-180' : ''}`}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></span>
              </button>
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isTopografiOpen ? 'max-h-96 mt-3' : 'max-h-0'}`}>
                <p className="text-text-main pt-2">Wilayah Desa Moncongloe Bulu masuk dalam kategori dataran rendah dengan ketinggian rata-rata <strong>50 meter</strong> di atas permukaan laut.</p>
              </div>
            </div>
            {/* Orbitrasi Accordion */}
            <div className="border-b border-neutral pb-4">
                <button onClick={() => setOrbitrasiOpen(!isOrbitrasiOpen)} className="w-full flex justify-between items-center text-left font-semibold text-lg text-secondary focus:outline-none">
                <span>Jarak Orbitrasi</span>
                <span className={`transform transition-transform duration-300 ${isOrbitrasiOpen ? 'rotate-180' : ''}`}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></span>
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOrbitrasiOpen ? 'max-h-96 mt-3' : 'max-h-0'}`}>
                    <ul className="list-disc list-inside text-text-main space-y-1 pt-2">
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
                    <div key={item.arah} className="bg-neutral/50 rounded-lg p-4 border border-neutral">
                      <div className="font-bold text-secondary mb-1">Batas {item.arah}</div>
                      <p className="text-text-main text-sm">{item.wilayah}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Wilayah Administrasi */}
        <section className="w-full mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-8 text-center">Wilayah Administrasi</h2>
          <p className="text-text-main mb-8 text-center max-w-2xl mx-auto">
            Secara administratif, wilayah Desa Moncongloe Bulu terbagi menjadi <strong>5 dusun</strong> dan <strong>19 Rukun Tetangga (RT)</strong>. Berikut adalah nama-nama dusun yang ada di desa kami:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
            {wilayahAdministrasi.map((dusun) => (
              <div key={dusun.nama} className="bg-white p-4 rounded-xl shadow border border-neutral">
                <div className="font-semibold text-secondary">{dusun.nama}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Statistik Penduduk */}
        <section className="w-full mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-8 text-center">Statistik Penduduk</h2>
            <div className="bg-white p-6 rounded-2xl shadow border border-neutral/50">
                <div className="flex justify-center gap-8 mb-10 border-b border-neutral pb-8">
                    <div className="text-center p-4">
                        <div className="text-4xl font-extrabold text-primary">{statistik.find(s => s.label === 'Penduduk')?.value}</div>
                        <div className="text-secondary font-semibold mt-1">Total Penduduk</div>
                    </div>
                    <div className="text-center p-4">
                        <div className="text-4xl font-extrabold text-primary">{statistik.find(s => s.label === 'Kepala Keluarga')?.value}</div>
                        <div className="text-secondary font-semibold mt-1">Kepala Keluarga</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Berdasarkan Jenis Kelamin */}
                    <div>
                        <h3 className="font-bold text-lg text-secondary mb-4 text-center">Berdasarkan Jenis Kelamin</h3>
                        <div className="space-y-3">
                            {statistik.filter(s => s.label === 'Laki-Laki' || s.label === 'Perempuan').map(item => (
                            <div key={item.label} className="flex items-center justify-between p-3 bg-neutral/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                <span className="text-2xl">{item.icon}</span>
                                <span className="font-medium text-text-main">{item.label}</span>
                                </div>
                                <span className="font-bold text-lg text-secondary">{item.value}</span>
                            </div>
                            ))}
                        </div>
                    </div>

                    {/* Berdasarkan Dusun */}
                    <div>
                        <h3 className="font-bold text-lg text-secondary mb-4 text-center">Berdasarkan Dusun</h3>
                        <div className="space-y-3">
                            {statistik.filter(s => ['Diccekang', 'Tompo Balang', 'Tamalate', 'Tammu-Tammu', 'Moncongloe Bulu'].includes(s.label)).map(item => (
                            <div key={item.label} className="flex items-center justify-between p-3 bg-neutral/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                <span className="text-2xl">{item.icon}</span>
                                <span className="font-medium text-text-main">{item.label}</span>
                                </div>
                                <span className="font-bold text-lg text-secondary">{item.value}</span>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Infrastruktur */}
        <section className="w-full mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-8 text-center">Infrastruktur & Sarana</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {prasarana.map((item) => (
              <div key={item.kategori} className="bg-white rounded-xl shadow-lg p-6 border border-neutral/50 flex flex-col items-center text-center">
                <span className="text-4xl mb-3">{item.icon}</span>
                <h3 className="font-bold text-lg text-secondary mb-3">{item.kategori}</h3>
                <ul className="space-y-1 text-text-main text-sm">
                  {item.list.map(fasilitas => (
                    <li key={fasilitas}>{fasilitas}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Organisasi Kemasyarakatan */}
        <section className="w-full mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-8 text-center">Organisasi Kemasyarakatan</h2>
          <div className="space-y-4 bg-white p-6 rounded-2xl shadow border border-neutral/50">
            {organisasi.map((item) => (
              <div key={item.nama} className="border-b border-neutral pb-4 last:border-b-0">
                <button 
                  onClick={() => toggleOrganisasi(item.nama)}
                  className="w-full flex justify-between items-center text-left font-semibold text-lg text-secondary focus:outline-none"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span>{item.nama}</span>
                  </span>
                  <span className={`transform transition-transform duration-300 ${openOrganisasi[item.nama] ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openOrganisasi[item.nama] ? 'max-h-96 mt-3' : 'max-h-0'}`}>
                  <p className="text-text-main pt-2 pl-10">
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
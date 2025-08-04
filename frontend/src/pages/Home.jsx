import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStatistik } from '../context/StatistikContext';
import { useBerita } from '../context/BeritaContext';

// Standardized icons for statistics
const getStatistikIcon = (label) => {
  const iconMap = {
    'Penduduk': (
      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    'Laki-Laki': (
      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    'Perempuan': (
      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    'Kepala Keluarga': (
      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    'Diccekang': (
      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    'Tamalate': (
      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    'Tammu-Tammu': (
      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    'Tompo Balang': (
      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    'Moncongloe Bulu': (
      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  };
  
  return iconMap[label] || null;
};

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

const Home = () => {
  const [beritaIdx, setBeritaIdx] = useState(0);
  const { statistik } = useStatistik();
  const { berita } = useBerita();

  // Get recent berita (first 5)
  const recentBerita = berita.slice(0, 5);

  useEffect(() => {
    if (recentBerita.length === 0) return;
    
    const interval = setInterval(() => {
      setBeritaIdx(idx => (idx + 1) % recentBerita.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [recentBerita.length]); // Only depend on length, not the entire array

  const formatDate = (dateString) => {
    if (!dateString) return 'Tanggal tidak tersedia';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Tanggal tidak tersedia';
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 flex flex-col items-center">
      {/* Info Singkat Desa */}
      <section className="w-full max-w-4xl flex flex-col my-8 sm:my-12">
        <div className="w-full max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary mb-2">DESA MONCONGLOE BULU</h1>
          <div className="text-base sm:text-lg text-secondary mb-3">Kec. Moncongloe, Kab. Maros</div>
          <p className="text-text-main text-sm sm:text-base leading-relaxed text-justify">
            Moncongloe Bulu (Ejaan Van Ophuijsen: Montjongloe Boeloe; Lontara Bugis: ᨆᨚᨉᨚᨂᨒᨚᨅᨘᨒᨘ ; Lontara Makassar: ᨆᨚᨉᨚᨂᨒᨚᨅᨘᨒᨘ ) adalah salah satu dari 5 desa di Kecamatan Moncongloe, Kabupaten Maros, Provinsi Sulawesi Selatan, Indonesia. Desa ini berstatus sebagai desa definitif dan tergolong pula sebagai desa swasembada. Desa ini memiliki luas wilayah 12,76 km² dan jumlah penduduk sebanyak 3.820 jiwa dengan tingkat kepadatan penduduk sebanyak 299,37 jiwa/km² pada tahun 2017. Pusat pemerintahan desa ini berada di Dusun Tamalate.
          </p>
        </div>
      </section>
      {/* Lokasi & Geografi */}
      <section className="w-full max-w-4xl flex flex-col my-8 sm:my-12">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary mb-6">LOKASI & KONDISI GEOGRAFIS</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="font-bold text-lg text-secondary mb-2">Topografi</h2>
            <p className="text-text-main">
              Wilayah Desa Moncongloe Bulu masuk dalam kategori dataran rendah dengan ketinggian rata-rata <strong>50 meter</strong> di atas permukaan laut.
            </p>
          </div>
          <div>
            <h2 className="font-bold text-lg text-secondary mb-2">Jarak Orbitrasi</h2>
            <ul className="list-disc list-inside text-text-main space-y-1">
              {orbitrasi.map(o => (
                <li key={o.nama}>
                  <span>{o.nama}: </span>
                  <span className="font-semibold">{o.jarak}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="w-full mb-8">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31787.95859943921!2d119.5353578991339!3d-5.101038111959704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbe33251033253b%3A0x5030bfbcaf775d0!2sMoncongloe%20Bulu%2C%2C%2C%20Kec.%20Moncongloe%2C%20Kabupaten%20Maros%2C%20Sulawesi%20Selatan!5e0!3m2!1sid!2sid!4v1693928994523!5m2!1sid!2sid"
            className="w-full h-64 rounded-xl shadow-lg border-2 border-neutral"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {batasWilayah.map((item) => (
            <div key={item.arah} className="bg-white rounded-xl p-4 shadow-md border border-neutral">
              <div className="font-bold text-lg text-secondary mb-1">Batas {item.arah}</div>
              <p className="text-text-main">{item.wilayah}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Statistik Penduduk */}
      <section className="w-full max-w-4xl flex flex-col my-8 sm:my-12">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary mb-4">STATISTIK PENDUDUK</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4 justify-center">
          {(() => {
            // Urutan tampilan yang diinginkan
            const orderMap = {
              'Penduduk': 1,
              'Laki-Laki': 2,
              'Perempuan': 3,
              'Kepala Keluarga': 4,
              'Diccekang': 5,
              'Tamalate': 6,
              'Tammu-Tammu': 7,
              'Tompo Balang': 8,
              'Moncongloe Bulu': 9
            };
            
            // Urutkan statistik sesuai urutan yang diinginkan
            const sortedStatistik = [...statistik].sort((a, b) => {
              const orderA = orderMap[a.label] || 999;
              const orderB = orderMap[b.label] || 999;
              return orderA - orderB;
            });
            
            return sortedStatistik.map((item) => (
              <div key={item.label} className="flex flex-col items-center bg-white rounded-xl p-3 sm:p-4 shadow-md hover:shadow-lg transition-shadow duration-300 border border-neutral">
                <div className="mb-1">
                  {getStatistikIcon(item.label) || (
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  )}
                </div>
                <span className="font-bold text-base sm:text-lg text-secondary">
                  {item.value}
                </span>
                <span className="text-xs text-primary mt-0.5">{item.label}</span>
              </div>
            ));
          })()}
        </div>
      </section>
      {/* Preview Berita Terbaru */}
      <section className="w-full max-w-4xl flex flex-col my-8 sm:my-12">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary mb-4">BERITA TERKINI</h1>
        {recentBerita.length > 0 ? (
          <div className="relative flex flex-col">
            <Link to={`/berita/${recentBerita[beritaIdx].id}`} className="block w-full">
              <img 
                src={recentBerita[beritaIdx].gambar || 'https://via.placeholder.com/800x400'} 
                alt={recentBerita[beritaIdx].judul} 
                className="w-full h-40 sm:h-48 object-cover rounded-xl mb-4" 
              />
            </Link>
            <Link to={`/berita/${recentBerita[beritaIdx].id}`}>
              <h3 className="text-lg sm:text-xl font-semibold text-secondary mb-1 hover:underline">
                {recentBerita[beritaIdx].judul}
              </h3>
            </Link>
            <div className="text-xs text-primary mb-2">
              {formatDate(recentBerita[beritaIdx].tanggal_publikasi)}
            </div>
            <p className="text-text-secondary mb-4 text-left text-sm sm:text-base">
              {recentBerita[beritaIdx].konten ? 
                recentBerita[beritaIdx].konten.substring(0, 150) + (recentBerita[beritaIdx].konten.length > 150 ? '...' : '') : 
                'Tidak ada ringkasan berita.'
              }
            </p>
            <Link to="/berita" className="inline-block bg-primary text-white px-3 sm:px-4 py-2 rounded hover:bg-secondary transition text-xs sm:text-sm self-start">
              Lihat Seluruh Berita
            </Link>
            <div className="flex gap-2 mt-4 self-center">
              {recentBerita.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setBeritaIdx(i)}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 ${i === beritaIdx ? 'bg-primary border-primary' : 'bg-transparent border-secondary'}`}
                  aria-label={`Pilih berita ${i + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-text-secondary py-8">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
            </svg>
            <p className="text-gray-500 mb-4">Belum ada berita yang dipublikasikan</p>
            <Link 
              to="/berita" 
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Tambah Berita Pertama
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home; 
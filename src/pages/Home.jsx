import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const statistik = [
  { icon: '👥', label: 'Penduduk', value: '6.564' },
  { icon: '👨', label: 'Laki-laki', value: '3.323' },
  { icon: '👩', label: 'Perempuan', value: '3.241' },
  { icon: '🏠', label: 'Kepala Keluarga', value: '2.022' },
  { icon: '🕌', label: 'Islam', value: '6.126' },
  { icon: '✝️', label: 'Kristen', value: '305' },
  { icon: '🕉️', label: 'Hindu', value: '603' },
  { icon: '📖', label: 'Katolik', value: '107' },
  { icon: '🌸', label: 'Buddha', value: '301' },
];

const batasWilayah = [
  { arah: 'Utara', wilayah: 'Desa Bonto Bunga' },
  { arah: 'Selatan', wilayah: 'Desa Paccellekang (Kec. Pattallassang, Kab. Gowa)' },
  { arah: 'Barat', wilayah: 'Desa Paccellekang, Desa Moncongloe Lappara, dan Desa Moncongloe' },
  { arah: 'Timur', wilayah: 'Desa Paccellekang (Kab. Gowa) dan Desa Purnakarya (Kec. Tanralili)' },
];

const orbitrasi = [
  { nama: 'Pusat Pemerintahan Kecamatan (Moncongloe)', jarak: '0,7 km' },
  { nama: 'Pusat Pemerintahan Kabupaten (Turikale)', jarak: '26,5 km' },
  { nama: 'Pusat Pemerintahan Provinsi (Makassar)', jarak: '3,5 km' },
];

const Home = () => {
  const [berita, setBerita] = useState([]);
  const [beritaIdx, setBeritaIdx] = useState(0);

  useEffect(() => {
    try {
      const storedBerita = localStorage.getItem('berita');
      const dataBerita = storedBerita ? JSON.parse(storedBerita) : [];
      
      // Urutkan berita dari yang terbaru
      dataBerita.sort((a, b) => new Date(b.tanggalDibuat || 0) - new Date(a.tanggalDibuat || 0));

      // Ambil 5 berita terbaru saja untuk ditampilkan di beranda
      setBerita(dataBerita.slice(0, 5));
    } catch (error) {
      console.error("Gagal memuat berita dari localStorage:", error);
      setBerita([]);
    }
  }, []);

  useEffect(() => {
    if (berita.length === 0) return;
    const interval = setInterval(() => {
      setBeritaIdx(idx => (idx + 1) % berita.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [berita]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-white py-6 px-1 sm:px-2 flex flex-col items-center">
      {/* Info Singkat Desa */}
      <section className="w-full max-w-4xl flex flex-col my-8 sm:my-12">
        <div className="w-full max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary mb-2">DESA MONCONGLOE BULU</h1>
          <div className="text-base sm:text-lg text-secondary mb-3">Kec. Moncongloe, Kab. Maros</div>
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed text-justify">
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
            <p className="text-primary">
              Wilayah Desa Moncongloe Bulu masuk dalam kategori dataran rendah dengan ketinggian rata-rata <strong>50 meter</strong> di atas permukaan laut.
            </p>
          </div>
          <div>
            <h2 className="font-bold text-lg text-secondary mb-2">Jarak Orbitrasi</h2>
            <ul className="list-disc list-inside text-primary space-y-1">
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
            className="w-full h-64 rounded-xl shadow-lg border-2 border-white"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {batasWilayah.map((item) => (
            <div key={item.arah} className="bg-white rounded-xl p-4 shadow-md border border-green-100/80">
              <div className="font-bold text-lg text-secondary mb-1">Batas {item.arah}</div>
              <p className="text-primary">{item.wilayah}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Statistik Penduduk */}
      <section className="w-full max-w-4xl flex flex-col my-8 sm:my-12">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary mb-4">STATISTIK PENDUDUK</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4 justify-center">
          {statistik.map((item) => (
            <div key={item.label} className="flex flex-col items-center bg-white rounded-xl p-3 sm:p-4 shadow-md hover:shadow-lg transition-shadow duration-300 border border-green-100/80">
              <span className="text-xl sm:text-2xl mb-1">{item.icon}</span>
              <span className="font-bold text-base sm:text-lg text-green-800">
                {item.value}
              </span>
              <span className="text-xs text-green-700 mt-0.5">{item.label}</span>
            </div>
          ))}
        </div>
      </section>
      {/* Preview Berita Terbaru */}
      <section className="w-full max-w-4xl flex flex-col my-8 sm:my-12">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary mb-4">BERITA TERKINI</h1>
        {berita.length > 0 ? (
          <div className="relative flex flex-col">
            <Link to={`/berita/${berita[beritaIdx].id}`} className="block w-full">
              <img src={berita[beritaIdx].gambar} alt={berita[beritaIdx].judul} className="w-full h-40 sm:h-48 object-cover rounded-xl mb-4" />
            </Link>
            <Link to={`/berita/${berita[beritaIdx].id}`}>
              <h3 className="text-lg sm:text-xl font-semibold text-green-900 mb-1 hover:underline">{berita[beritaIdx].judul}</h3>
            </Link>
            <div className="text-xs text-green-600 mb-2">
              {new Date(berita[beritaIdx].tanggal).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </div>
            <p className="text-gray-700 mb-4 text-left text-sm sm:text-base">{berita[beritaIdx].ringkasan}</p>
            <Link to="/berita" className="inline-block bg-green-600 text-white px-3 sm:px-4 py-2 rounded hover:bg-green-700 transition text-xs sm:text-sm self-start">Lihat Seluruh Berita</Link>
            <div className="flex gap-2 mt-4 self-center">
              {berita.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setBeritaIdx(i)}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 ${i === beritaIdx ? 'bg-green-600 border-green-600' : 'bg-green-200 border-green-400'}`}
                  aria-label={`Pilih berita ${i + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p>Belum ada berita untuk ditampilkan.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home; 
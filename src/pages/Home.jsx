import React, { useState } from 'react';
import { useDesa } from '../context/DesaContext';

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

const Home = () => {
  const { berita } = useDesa();
  const [beritaIdx, setBeritaIdx] = useState(0);

  React.useEffect(() => {
    if (berita.length === 0) return;
    const interval = setInterval(() => {
      setBeritaIdx(idx => (idx + 1) % berita.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [berita]);

  if (berita.length === 0) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-white py-6 px-1 sm:px-2 flex flex-col items-center">
      {/* Info Singkat Desa */}
      <section className="w-full flex flex-col items-center justify-center text-center bg-background py-8 sm:py-12">
        <div className="w-full max-w-4xl mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-accent mb-2">DESA MONCONGLOE BULU</h1>
          <div className="text-base sm:text-lg text-secondary mb-3">Kec. Moncongloe, Kab. Maros</div>
          <p className="text-accent text-sm sm:text-base leading-relaxed">
            Moncongloe Bulu (Ejaan Van Ophuijsen: Montjongloe Boeloe; Lontara Bugis: ᨆᨚᨉᨚᨂᨒᨚᨅᨘᨒᨘ ; Lontara Makassar: ᨆᨚᨉᨚᨂᨒᨚᨅᨘᨒᨘ ) adalah salah satu dari 5 desa di Kecamatan Moncongloe, Kabupaten Maros, Provinsi Sulawesi Selatan, Indonesia. Desa ini berstatus sebagai desa definitif dan tergolong pula sebagai desa swasembada. Desa ini memiliki luas wilayah 12,76 km² dan jumlah penduduk sebanyak 3.820 jiwa dengan tingkat kepadatan penduduk sebanyak 299,37 jiwa/km² pada tahun 2017. Pusat pemerintahan desa ini berada di Dusun Tamalate.
          </p>
        </div>
      </section>
      {/* Statistik Penduduk */}
      <section className="w-full max-w-4xl flex flex-col items-center justify-center bg-background py-8 sm:py-12">
        <h2 className="text-lg sm:text-xl font-bold text-green-800 mb-4 text-center">Statistik Penduduk</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4 justify-center">
          {statistik.map((item) => (
            <div key={item.label} className="flex flex-col items-center bg-green-50 rounded-xl p-3 sm:p-4 shadow-sm">
              <span className="text-xl sm:text-2xl mb-1">{item.icon}</span>
              <span className="font-bold text-base sm:text-lg text-green-800">{item.value}</span>
              <span className="text-xs text-green-700">{item.label}</span>
            </div>
          ))}
        </div>
      </section>
      {/* Preview Berita Terbaru */}
      <section className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center bg-background py-8 sm:py-12">
        <h2 className="text-lg sm:text-xl font-bold text-green-800 mb-4 text-center">Berita Terbaru</h2>
        <div className="relative flex flex-col items-center">
          <img src={berita[beritaIdx].gambar} alt={berita[beritaIdx].judul} className="w-full h-40 sm:h-48 object-cover rounded-xl mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-green-900 mb-1">{berita[beritaIdx].judul}</h3>
          <div className="text-xs text-green-600 mb-2">{berita[beritaIdx].tanggal}</div>
          <p className="text-gray-700 mb-3 text-center text-xs sm:text-base">{berita[beritaIdx].ringkasan}</p>
          <a href="#" className="inline-block bg-green-600 text-white px-3 sm:px-4 py-2 rounded hover:bg-green-700 transition text-xs sm:text-sm">Lihat Selengkapnya</a>
          <div className="flex gap-2 mt-4">
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
      </section>
      {/* Lokasi & Geografi */}
      <section className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center text-center bg-background py-8 sm:py-12">
        <h2 className="text-lg sm:text-xl font-bold text-green-800 mb-2 text-center">Lokasi & Geografi</h2>
        <p className="text-gray-600 mb-2 text-center text-xs sm:text-base">Desa Moncongloe Bulu memiliki batas wilayah strategis:</p>
        <ul className="text-green-800 text-xs sm:text-sm flex flex-wrap justify-center gap-2 sm:gap-4 mb-2">
          <li>Utara: Desa Bonto Bunga</li>
          <li>Timur: Desa Moncongloe</li>
          <li>Selatan: Desa Moncongloe Lappara</li>
          <li>Barat: Kota Makassar</li>
        </ul>
        <div className="text-center text-green-700 text-xs sm:text-base">Alamat: Jalan Poros Pamanjengan, Desa Moncongloe Bulu, Kec. Moncongloe, Kab. Maros, Sulawesi Selatan 90564</div>
      </section>
    </div>
  );
};

export default Home; 
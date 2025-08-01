import React from 'react';

const Sejarah = () => (
  <div className="min-h-screen bg-background py-8 px-4">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <svg className="w-16 h-16 sm:w-20 sm:h-20 text-primary mb-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-accent mb-2">Sejarah Desa Moncongloe Bulu</h1>
        <p className="text-neutral text-base sm:text-lg">Narasi tentang asal-usul dan perkembangan desa.</p>
      </div>

      <div className="space-y-8 text-primary text-justify leading-relaxed text-base">
        <section>
          <h2 className="text-xl font-bold text-secondary mb-3">Asal-Usul Nama</h2>
          <p>
            Setiap nama membawa cerita, begitu pula dengan Desa Moncongloe Bulu. Nama ini berakar dari Bahasa Makassar, di mana "Moncong" berarti bukit atau dataran tinggi, "Loe" berarti luas, dan "Bulu" berarti gunung. Secara harfiah, Moncongloe Bulu adalah gambaran sebuah dataran tinggi yang luas di mana terdapat gunung, sesuai dengan kondisi geografis wilayahnya yang subur dan berbukit.
          </p>
          <p className="mt-4">
            Perjalanan Desa Moncongloe Bulu sebagai wilayah administrasi yang mandiri adalah cerminan dari semangat pertumbuhan dan perkembangan masyarakatnya.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-secondary mb-3">Masa-Masa Awal: Desa Persiapan (1989 - 1991)</h2>
          <p>
            Kisah Desa Moncongloe Bulu dimulai pada tahun 1989, ketika desa ini resmi berdiri sebagai desa persiapan. Pada masa itu, desa ini merupakan hasil pemekaran dari desa induknya, Desa Moncongloe, dan secara administratif berada di bawah naungan Kecamatan Mandai, Kabupaten Maros. Wilayah awalnya terdiri dari tiga dusun, yaitu:
          </p>
          <ul className="list-disc list-inside mt-3 pl-4 space-y-1">
            <li>Dusun Diccekang</li>
            <li>Dusun Moncongloe Bulu</li>
            <li>Dusun Tammu-Tammu</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-secondary mb-3">Era Baru: Desa Definitif dan Perkembangan (1991 - Sekarang)</h2>
          <p>
            Tonggak sejarah penting berikutnya terjadi pada tahun 1991, saat Desa Moncongloe Bulu mendapatkan status penuh sebagai desa definitif.
          </p>
          <p className="mt-4">
            Perkembangan signifikan kembali terjadi pada 3 Agustus 2001. Berdasarkan Peraturan Daerah (Perda) Kabupaten Maros No. 17 Tahun 2001, dibentuklah kecamatan baru. Sejak saat itu, Desa Moncongloe Bulu beralih dari Kecamatan Mandai dan menjadi bagian dari Kecamatan Moncongloe hingga saat ini.
          </p>
          <p className="mt-4">
            Seiring dengan pertumbuhan penduduk dan kebutuhan pelayanan, wilayah desa pun dimekarkan dari tiga menjadi lima dusun. Dua dusun baru terbentuk, yaitu Dusun Tamalate (pemekaran dari Dusun Diccekang) dan Dusun Tompo Balang (pemekaran dari Dusun Tammu-Tammu).
          </p>
          <p className="mt-4">
            Kini, pusat pemerintahan Desa Moncongloe Bulu berlokasi di Dusun Tamalate, berdampingan dengan pusat kegiatan ekonomi masyarakat, yaitu Pasar Diccekang.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-secondary mb-3">Kepemimpinan Desa dari Masa ke Masa</h2>
          <p>
            Sejak awal berdirinya, Desa Moncongloe Bulu telah dipimpin oleh putra-putra terbaiknya yang berdedikasi:
          </p>
          <ul className="list-disc list-inside mt-3 pl-4 space-y-1">
            <li>1989 - 2006: Abd. Rauf Faewah, S.Sos</li>
            <li>2006 - 2011: Muh. Asap Usman, S.Pd</li>
            <li>2012 – 2018: Kaharuddin</li>
            <li>2019 – Sekarang: Muhammad Tahir</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-secondary mb-3">Catatan dalam Sejarah Nasional</h2>
          <p>
            Di luar sejarah administratifnya, wilayah Desa Moncongloe Bulu juga tercatat dalam sejarah nasional Indonesia. Pada masa Orde Baru, lokasi ini pernah menjadi tempat kamp pengasingan bagi para tahanan politik (tapol) yang terduga terlibat dalam peristiwa Gerakan 30 September.
          </p>
        </section>

        <section>
          <p className="mt-6 italic text-center text-secondary">
            Kini, Desa Moncongloe Bulu terus bergerak maju, membangun, dan berbenah untuk menjadi desa yang mandiri, transparan, dan sejahtera bagi seluruh warganya.
          </p>
        </section>
      </div>
    </div>
  </div>
);

export default Sejarah; 
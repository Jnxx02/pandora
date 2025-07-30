import { Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Profil from './pages/Profil'
import Berita from './pages/Berita'
import Sejarah from './pages/Sejarah'
import Login from './pages/admin/Login'
import Pengaduan from './pages/Pengaduan'
import FormulirPengaduan from './pages/FormulirPengaduan'
import React, { useState, useEffect } from 'react';
import Dashboard from './pages/admin/Dashboard'
import LaporanPengaduan from './pages/admin/LaporanPengaduan'
import TambahEditBerita from './pages/admin/TambahEditBerita'
import EditStatistik from './pages/admin/EditStatistik'
import EditPrasarana from './pages/admin/EditPrasarana'
import DetailBerita from './pages/DetailBerita'
import { DesaProvider } from './context/DesaContext';
import { StatistikProvider } from './context/StatistikContext';

// Komponen placeholder untuk halaman modul
const ModulPage = ({ title }) => (
  <div className="container mx-auto p-8 pt-12">
    <h1 className="text-4xl font-bold text-primary mb-4">{title}</h1>
    <p className="text-lg text-gray-700">Konten untuk modul ini akan segera ditambahkan oleh tim KKNT 114 Moncongloe Bulu.</p>
  </div>
);

// Komponen untuk proteksi route admin
function RequireAdmin({ children }) {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const location = useLocation();
  if (!isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return children;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isTop, setIsTop] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    setIsAdmin(localStorage.getItem('isAdmin') === 'true');
  }, [location]);
  useEffect(() => {
    const onScroll = () => setIsTop(window.scrollY === 0);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (location.pathname.startsWith('/pengaduan')) {
    return null;
  }

  const isTransparent = isTop && isHomePage;

  const navLinks = [
    { to: '/', label: 'Beranda' },
    { to: '/profil', label: 'Profil Desa' },
    { to: '/sejarah', label: 'Sejarah' },
    { to: '/berita', label: 'Berita' },
    { to: '/pengaduan', label: 'Pengaduan' },
    {
      label: 'Modul',
      subLinks: [
        { to: '/modul/contoh-1', label: 'Modul Contoh 1' },
        { to: '/modul/contoh-2', label: 'Modul Contoh 2' },
      ]
    },
  ];
  return (
    <header className={`w-full shadow-md sticky top-0 z-20 transition-all duration-300 ${isTransparent ? 'bg-primary/50 backdrop-blur text-white' : 'bg-primary text-white'}`}>
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 relative">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 font-bold text-xl">
          <img src="https://desamoncongloe.com/img/logo.png" alt="Logo Desa" className="w-12 h-12 object-contain" />
          <div className="leading-tight">
            <div>Moncongloe Bulu</div>
            <div className={`text-xs md:text-sm font-normal ${isTransparent ? 'opacity-100' : 'opacity-80'}`}>Kabupaten Maros</div>
          </div>
        </Link>
        {/* Hamburger (mobile) */}
        <button
          className="md:hidden ml-auto text-2xl focus:outline-none"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <span>&#10005;</span> : <span>&#9776;</span>}
        </button>
        {/* Desktop Menu + Login/Logout (right aligned) */}
        <div className="hidden md:flex flex-row flex-grow justify-end items-center gap-4">
          <nav className="flex flex-row gap-6 text-base font-medium">
            {navLinks.map(link => link.subLinks ? (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button className={`transition flex items-center gap-1 hover:text-accent ${location.pathname.startsWith('/modul') ? `font-bold text-accent` : ''}`}>
                  {link.label}
                  <span className={`text-xs transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
                    {link.subLinks.map(subLink => (
                      <Link
                        key={subLink.to}
                        to={subLink.to}
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-primary hover:bg-gray-100"
                      >
                        {subLink.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={link.to} to={link.to} className={`transition hover:text-accent ${location.pathname === link.to ? `font-bold underline underline-offset-4 text-accent` : ''}`}>
                {link.label}
              </Link>
            ))}
          </nav>
          {isAdmin ? (
            <button
              onClick={() => {
                localStorage.removeItem('isAdmin');
                setIsAdmin(false);
                navigate('/');
              }}
              className="ml-2 bg-red-600 text-white px-3 py-1 rounded font-semibold shadow hover:bg-red-700 transition text-sm"
            >
              <span className="inline-block align-middle mr-1">🚪</span> Logout
            </button>
          ) : (
            <Link
              to="/admin/login"
              className="ml-2 bg-white text-primary px-3 py-1 rounded font-semibold shadow hover:bg-accent transition text-sm"
            >
              <span className="inline-block align-middle mr-1">🔑</span> Login
            </Link>
          )}
        </div>
        {/* Mobile Sidebar Menu */}
        {open && (
          <>
            <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setOpen(false)} />
            <aside className="fixed top-0 right-0 w-4/5 max-w-xs h-full bg-primary z-50 flex flex-col p-6 shadow-lg transition-transform duration-300 animate-slide-in">
              <button
                onClick={() => setOpen(false)}
                className="self-end text-3xl text-white mb-6 focus:outline-none"
                aria-label="Tutup menu"
              >
                &times;
              </button>
              <nav className="flex flex-col gap-6 text-white text-lg font-bold items-start w-full">
                {navLinks.map(link => link.subLinks ? (
                  <div key={link.label} className="w-full">
                    <button
                      onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)} className={`w-full text-left hover:text-accent transition flex justify-between items-center ${location.pathname.startsWith('/modul') ? 'font-bold text-secondary' : ''}`}
                    >
                      <span>{link.label}</span>
                      <span className={`text-sm transition-transform duration-300 ${mobileDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                    </button>
                    {mobileDropdownOpen && (
                      <div className="pl-4 mt-2 flex flex-col gap-4 border-l-2 border-white/20">
                        {link.subLinks.map(subLink => (
                          <Link
                            key={subLink.to}
                            to={subLink.to}
                            className="w-full text-left text-base font-medium hover:text-accent transition"
                            onClick={() => setOpen(false)}
                          >
                            {subLink.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link key={link.to} to={link.to} className={`w-full text-left hover:text-accent transition ${location.pathname === link.to ? 'font-bold text-secondary underline underline-offset-4' : ''}`} onClick={() => setOpen(false)}>
                    {link.label}
                  </Link>
                ))}
              </nav>
              {isAdmin ? (
                <button
                  onClick={() => {
                    localStorage.removeItem('isAdmin');
                    setIsAdmin(false);
                    setOpen(false);
                    navigate('/');
                  }}
                  className="mt-8 bg-red-600 text-white px-5 py-2 rounded font-semibold shadow hover:bg-red-700 transition text-base w-full text-center"
                >
                  <span className="inline-block align-middle mr-1">🚪</span> Logout
                </button>
              ) : (
                <Link
                  to="/admin/login"
                  className="mt-8 bg-white text-primary px-5 py-2 rounded font-semibold shadow hover:bg-accent transition text-base w-full text-center"
                  onClick={() => setOpen(false)}
                >
                  <span className="inline-block align-middle mr-1">🔑</span> Login
                </Link>
              )}
            </aside>
          </>
        )}
      </div>
    </header>
  );
}

function HeroSection() {
  const location = useLocation();
  if (location.pathname !== "/") return null;
  return (
    <section
      className="w-full min-h-screen flex flex-col items-center justify-center relative"
      style={{
        backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/id/f/fe/Desa_Moncongloe_Bulu.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#222', // fallback jika gambar gagal
        aspectRatio: 'auto',
        width: '100vw',
        minHeight: '100vh',
        maxWidth: '100vw',
        overflow: 'hidden',
      }}
    >
      <div className="absolute inset-0 bg-black/50 z-0" />
      <div className="max-w-2xl mx-auto text-center px-4 relative z-10 flex flex-col items-center justify-center h-full">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 drop-shadow">PANDORA - Pusat Akses Informasi dan Dokumentasi Desa</h1>
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 drop-shadow">Website Resmi Desa Moncongloe Bulu</h2>
        <p className="text-white mb-2">Satu pintu informasi, satu desa berjuta cerita.</p>
        <p className="text-white mb-6">Sumber informasi resmi untuk warga Desa Moncongloe Bulu.</p>
      </div>
      {/* Panah animasi scroll */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10">
        <span className="animate-bounce text-white text-3xl opacity-80">↓</span>
      </div>
    </section>
  );
}

function SambutanKepalaDesa() {
  const location = useLocation();
  if (location.pathname !== "/") return null;
  return (
    <section className="w-full bg-secondary py-10 md:py-16 flex justify-center px-4 sm:px-8 lg:px-16 font-serif">
      <div className="flex flex-col md:flex-row items-center gap-8 w-full">
        <img
          src="https://moncongloebulu.vercel.app/images/team/muhammad%20tahir.jpeg"
          alt="Kepala Desa Muhammad Tahir"
          className="w-36 h-36 md:w-48 md:h-48 rounded-full object-cover border-4 border-accent mb-6 md:mb-0 shadow-none"
        />
        <div className="flex-1 text-center md:text-left">
          <div className="font-bold text-accent text-2xl md:text-3xl mb-2">Sambutan Kepala Desa</div>
          <div className="font-semibold text-accent text-xl md:text-2xl mb-1">MUHAMMAD TAHIR</div>
          <div className="text-accent text-base md:text-lg mb-4">Kepala Desa Moncongloe Bulu</div>
          <p className="text-accent text-sm md:text-base text-justify">Selamat datang di PANDORA (Pusat Akses Informasi dan Dokumentasi Resmi Desa), portal berita resmi Pemerintah Desa Moncongloe Bulu. Portal ini kami hadirkan sebagai langkah nyata kami dalam memanfaatkan teknologi digital untuk melayani dan lebih dekat dengan seluruh masyarakat.
Melalui PANDORA, semua pengumuman, berita kegiatan, dan informasi penting kini dapat diakses dengan cepat dan mudah langsung dari genggaman Anda. Dengan adanya satu sumber informasi terpercaya ini, kami berharap kita dapat bersama-sama melawan berita bohong (hoax) dan membangun komunikasi yang lebih terbuka.
Mari manfaatkan platform ini sebagai jendela informasi untuk mewujudkan Desa Moncongloe Bulu yang lebih maju dan transparan.</p>
        </div>
      </div>
    </section>
  );
}

function FooterInfo() {
  const location = useLocation();
  if (location.pathname.startsWith('/pengaduan')) {
    return null;
  }

  const isAdmin = typeof window !== 'undefined' && localStorage.getItem('isAdmin') === 'true';
  return (
    <footer className="w-full bg-primary text-white pt-10 pb-4 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-white/30 pb-6">
        {/* Kolom 1: Logo, nama, kecamatan, kabupaten, deskripsi */}
        <div>
          <img src="https://desamoncongloe.com/img/logo.png" alt="Logo Desa" className="w-16 h-16 object-contain mb-3" />
          <div className="font-bold text-lg mb-1">Desa Moncongloe Bulu</div>
          <div className="text-white/80 mb-1">Kecamatan Moncongloe</div>
          <div className="text-white/80 mb-2">Kabupaten Maros</div>
        </div>
        {/* Kolom 2: Kontak */}
        <div>
          <div className="font-bold text-lg mb-2">Kontak</div>
          <div className="flex items-center gap-2 mb-2"><span>✉️</span> <a href="mailto:moncongloebulu16@gmail.com" className="underline hover:text-accent transition">moncongloebulu16@gmail.com</a></div>
          <div className="flex items-center gap-2 mb-2"><span>👩‍💻</span> <Link to="/admin/dashboard" className="underline hover:text-accent transition">Developer Desa</Link></div>
        </div>
        {/* Kolom 3: Telepon Penting */}
        <div>
          <div className="font-bold text-lg mb-2">Telepon Penting</div>
          <div className="flex items-center gap-2 mb-2"><span>📞</span> Kantor Desa: 0812-0979-1290</div>
          <div className="flex items-center gap-2 mb-2"><span>🚨</span> Darurat: 112</div>
        </div>
        {/* Kolom 4: Alamat */}
        <div>
          <div className="font-bold text-lg mb-2">Alamat</div>
          <div className="flex items-start gap-2"><span>📍</span>
            <span>Jalan Poros Pamanjengan, Desa Moncongloe Bulu, Kec. Moncongloe, Kab. Maros, Sulawesi Selatan 90564</span>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-1 pt-4 text-sm text-white/80">
        <div className="w-full text-center">© {new Date().getFullYear()} Desa Moncongloe Bulu. All rights reserved.</div>
        <div className="w-full text-center">Powered by KKN-T 114 Moncongloe Bulu Universitas Hasanuddin</div>
      </div>
    </footer>
  );
}

function ScrollToTopButton() {
  const [showScroll, setShowScroll] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScroll && window.pageYOffset > 400) {
        setShowScroll(true);
      } else if (showScroll && window.pageYOffset <= 400) {
        setShowScroll(false);
      }
    };
    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, [showScroll]);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (location.pathname.startsWith('/pengaduan')) {
    return null;
  }

  return (
    <button onClick={scrollTop} className={`fixed bottom-6 right-6 bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-secondary transition-all duration-300 z-30 ${showScroll ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`} aria-label="Kembali ke atas">
      <span className="text-2xl">↑</span>
    </button>
  );
}

function App() {
  // Auto refresh on beranda if admin login and sessionStorage flag set
  React.useEffect(() => {
    if (
      window.location.pathname === '/' &&
      localStorage.getItem('isAdmin') === 'true' &&
      sessionStorage.getItem('adminNeedsRefresh') === 'true'
    ) {
      sessionStorage.removeItem('adminNeedsRefresh');
      window.location.reload();
    }
  }, []);
  return (
    <DesaProvider>
      <StatistikProvider>
        <div className="flex flex-col min-h-screen bg-background font-sans">
        <Header />
        <HeroSection />
        <SambutanKepalaDesa />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/berita" element={<Berita />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/pengaduan" element={<Pengaduan />} />
            <Route path="/pengaduan/formulir" element={<FormulirPengaduan />} />
            <Route path="/sejarah" element={<Sejarah />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/dashboard" element={
              <RequireAdmin>
                <Dashboard />
              </RequireAdmin>
            } />
            <Route path="/admin/tambah-edit-berita" element={
              <RequireAdmin>
                <TambahEditBerita />
              </RequireAdmin>
            } />
            <Route path="/admin/laporan-pengaduan" element={
              <RequireAdmin>
                <LaporanPengaduan />
              </RequireAdmin>
            } />
            <Route path="/admin/edit-statistik" element={
              <RequireAdmin>
                <EditStatistik />
              </RequireAdmin>
            } />
            <Route path="/admin/edit-prasarana" element={
              <RequireAdmin>
                <EditPrasarana />
              </RequireAdmin>
            } />
            <Route path="/berita/:id" element={<DetailBerita />} />
            <Route path="/modul/contoh-1" element={<ModulPage title="Modul Contoh 1" />} />
            <Route path="/modul/contoh-2" element={<ModulPage title="Modul Contoh 2" />} />
          </Routes>
        </main>
        <FooterInfo />
        <ScrollToTopButton />
      </div>
      </StatistikProvider>
    </DesaProvider>
  )
}

export default App
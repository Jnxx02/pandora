import { Routes, Route, Link, useLocation, useNavigate, Navigate, HashRouter } from 'react-router-dom'
import React, { useState, useEffect, createContext, useContext, Suspense, lazy } from 'react';
import ScrollToTop from './components/ScrollToTop'
import { DesaProvider } from './context/DesaContext';
import { StatistikProvider } from './context/StatistikContext';
import { PrasaranaProvider } from './context/PrasaranaContext';
import { BeritaProvider } from './context/BeritaContext';
import { PengaduanProvider } from './context/PengaduanContext';
import { DokumentasiKKNProvider } from './context/DokumentasiKKNContext';
import SessionTimeout from './components/SessionTimeout';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load components for better performance
const Home = lazy(() => import('./pages/Home'));
const Profil = lazy(() => import('./pages/Profil'));
const Berita = lazy(() => import('./pages/Berita'));
const Sejarah = lazy(() => import('./pages/Sejarah'));
const Login = lazy(() => import('./pages/admin/Login'));
const Pengaduan = lazy(() => import('./pages/Pengaduan'));
const FormulirPengaduan = lazy(() => import('./pages/FormulirPengaduan'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const LaporanPengaduan = lazy(() => import('./pages/admin/LaporanPengaduan'));
const TambahEditBerita = lazy(() => import('./pages/admin/TambahEditBerita'));
const DaftarBerita = lazy(() => import('./pages/admin/DaftarBerita'));
const EditStatistik = lazy(() => import('./pages/admin/EditStatistik'));
const EditPrasarana = lazy(() => import('./pages/admin/EditPrasarana'));
const DetailBerita = lazy(() => import('./pages/DetailBerita'));
const DokumentasiKKN = lazy(() => import('./pages/DokumentasiKKN'));
const TambahDokumentasi = lazy(() => import('./pages/admin/TambahDokumentasi'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="text-text-secondary">Memuat...</p>
    </div>
  </div>
);

// Context untuk sidebar state
const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

// Komponen placeholder untuk halaman modul
const ModulPage = ({ title }) => (
  <div className="container mx-auto p-8 pt-12">
    <h1 className="text-4xl font-bold text-primary mb-4">{title}</h1>
    <p className="text-lg text-gray-700">Konten untuk modul ini akan segera ditambahkan oleh tim KKNT 114 Moncongloe Bulu.</p>
  </div>
);

// Komponen untuk proteksi route admin
function RequireAdmin({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check for valid session
  const checkAdminSession = () => {
    const session = sessionStorage.getItem('adminSession');
    const lastLogin = localStorage.getItem('adminLastLogin');
    const sessionId = localStorage.getItem('adminSessionId');
    
    if (!session || !lastLogin || !sessionId) {
      return false;
    }
    
    try {
      const sessionData = JSON.parse(session);
      
      // Validate session data
      if (!sessionData.isAdmin || !sessionData.sessionId || !sessionData.lastActivity) {
        return false;
      }
      
      // Check if session ID matches
      if (sessionData.sessionId !== sessionId) {
        return false;
      }
      
      // Check session timeout (30 minutes)
      const timeSinceActivity = Date.now() - sessionData.lastActivity;
      const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
      
      if (timeSinceActivity > SESSION_TIMEOUT) {
        // Session expired, clear all data
        sessionStorage.removeItem('adminSession');
        localStorage.removeItem('adminLastLogin');
        localStorage.removeItem('adminSessionId');
        return false;
      }
      
      // Update last activity
      sessionData.lastActivity = Date.now();
      sessionStorage.setItem('adminSession', JSON.stringify(sessionData));
      
      return true;
    } catch (error) {
      console.error('Error validating admin session:', error);
      return false;
    }
  };
  
  const isAdmin = checkAdminSession();
  
  if (!isAdmin) {
    // Clear any existing session data
    sessionStorage.removeItem('adminSession');
    localStorage.removeItem('adminLastLogin');
    localStorage.removeItem('adminSessionId');
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  
  return children;
}

function AdminHeader({ sidebarOpen, setSidebarOpen, sidebarCollapsed, setSidebarCollapsed }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all session data
    sessionStorage.removeItem('adminSession');
    localStorage.removeItem('adminLastLogin');
    localStorage.removeItem('adminSessionId');
    localStorage.removeItem('adminLoginAttempts');
    localStorage.removeItem('adminLockoutTime');
    
    // Remove activity monitoring event listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.removeEventListener(event, () => {}, true);
    });
    
    navigate('/admin/login');
  };

  // Auto logout on tab close/refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('adminSession');
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const adminNavLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
      </svg>
    )},
    { to: '/admin/berita', label: 'Kelola Berita', icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
      </svg>
    )},
    { to: '/admin/statistik', label: 'Edit Statistik', icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
      </svg>
    )},
    { to: '/admin/prasarana', label: 'Edit Prasarana', icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
      </svg>
    )},
    { to: '/admin/pengaduan', label: 'Laporan Pengaduan', icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
    )}
  ];

  return (
    <SidebarContext.Provider value={{ sidebarCollapsed, setSidebarCollapsed }}>
      <>
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`fixed top-0 left-0 h-full bg-primary text-white shadow-xl z-50 transform transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:fixed lg:z-50 ${sidebarCollapsed ? 'lg:w-16' : 'w-64'}`}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-white/20">
              <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'lg:justify-center' : ''}`}>
                <img src="https://desamoncongloe.com/img/logo.png" alt="Logo Desa" className="w-8 h-8 object-contain" />
                {!sidebarCollapsed && (
                  <div className="leading-tight">
                    <div className="font-bold text-lg">Desa Moncongloe Bulu</div>
                    <div className="text-xs font-normal opacity-80">Kabupaten Maros</div>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {adminNavLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                    location.pathname === link.to
                      ? 'bg-gray-700 text-white shadow-sm border-l-4 border-secondary'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  } ${sidebarCollapsed ? 'lg:justify-center lg:px-2' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                  title={sidebarCollapsed ? link.label : ''}
                >
                  <div className={`${sidebarCollapsed ? 'lg:w-6 lg:h-6' : 'w-5 h-5'}`}>
                    {link.icon}
                  </div>
                  {!sidebarCollapsed && <span className="font-medium">{link.label}</span>}
                </Link>
              ))}
              
              {/* Kembali ke Website Button */}
              <div className="pt-4 border-t border-white/20">
                <Link
                  to="/"
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-gray-300 hover:bg-gray-800 hover:text-white ${sidebarCollapsed ? 'lg:justify-center lg:px-2' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                  title={sidebarCollapsed ? 'Kembali ke Website' : ''}
                >
                  <div className={`${sidebarCollapsed ? 'lg:w-6 lg:h-6' : 'w-5 h-5'}`}>
                    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                  </div>
                  {!sidebarCollapsed && <span className="font-medium">Lihat Website</span>}
                </Link>
              </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/20">
              <button
                onClick={handleLogout}
                className={`flex items-center gap-3 w-full bg-red-600 hover:bg-red-700 text-white px-3 py-3 rounded-lg transition-colors font-semibold ${sidebarCollapsed ? 'lg:justify-center lg:px-2' : ''}`}
                title={sidebarCollapsed ? 'Logout' : ''}
              >
                <div className={`${sidebarCollapsed ? 'lg:w-6 lg:h-6' : 'w-5 h-5'}`}>
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                </div>
                {!sidebarCollapsed && <span>Logout</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Top Bar */}
        <div className={`fixed top-0 left-0 right-0 bg-primary text-white shadow-lg z-30 lg:transition-all lg:duration-300 ${
          sidebarCollapsed ? 'lg:left-16' : 'lg:left-64'
        } lg:right-0`}>
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">
              {/* Hamburger Menu - Both Mobile and Desktop */}
              <button
                className="text-white hover:text-secondary transition-colors"
                onClick={() => {
                  if (window.innerWidth < 1024) { // Mobile breakpoint
                    setSidebarOpen(!sidebarOpen);
                  } else { // Desktop
                    setSidebarCollapsed(!sidebarCollapsed);
                  }
                }}
                title="Toggle Menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
              
              <div className="flex items-center gap-3 font-bold text-lg">
                <img src="https://images.icon-icons.com/1715/PNG/512/2730367-box-inkcontober-pandora-shattered-square_112695.png" alt="PANDORA Logo" className="w-8 h-8 object-contain" />
                <div className="leading-tight">
                  <div>PANDORA Panel</div>
                  <div className="text-xs font-normal opacity-80">Admin Dashboard</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </SidebarContext.Provider>
  );
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
    // Check for valid admin session
    const session = sessionStorage.getItem('adminSession');
    const lastLogin = localStorage.getItem('adminLastLogin');
    const sessionId = localStorage.getItem('adminSessionId');
    
    if (session && lastLogin && sessionId) {
      try {
        const sessionData = JSON.parse(session);
        const timeSinceActivity = Date.now() - sessionData.lastActivity;
        const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
        
        if (sessionData.isAdmin && sessionData.sessionId === sessionId && timeSinceActivity <= SESSION_TIMEOUT) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
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
    { to: '/dokumentasi-kkn', label: 'Dokumentasi' },
  ];
  return (
    <header className={`w-full shadow-md sticky top-0 z-20 transition-all duration-300 ${isTransparent ? 'bg-primary/20 backdrop-blur-sm text-white' : 'bg-primary text-white'}`}>
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 relative">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 font-bold text-xl hover:text-secondary transition-colors">
          <img src="https://desamoncongloe.com/img/logo.png" alt="Logo Desa" className="w-12 h-12 object-contain" />
          <div className="leading-tight">
            <div>Moncongloe Bulu</div>
            <div className={`text-xs md:text-sm font-normal ${isTransparent ? 'opacity-100' : 'opacity-80'}`}>Kabupaten Maros</div>
          </div>
        </Link>
        {/* Hamburger (mobile) */}
        <button
          className="md:hidden ml-auto text-2xl focus:outline-none hover:text-secondary transition-colors"
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
                <button className={`flex items-center gap-1 py-2 px-3 rounded transition-colors ${
                  isTransparent 
                    ? 'hover:text-secondary' 
                    : 'hover:text-secondary'
                }`}>
                  {link.label}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-white text-primary shadow-lg rounded-lg py-2 min-w-48 z-10">
                    {link.subLinks.map(subLink => (
                      <Link
                        key={subLink.to}
                        to={subLink.to}
                        className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                      >
                        {subLink.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                className={`py-2 px-3 rounded transition-colors ${
                  location.pathname === link.to
                    ? isTransparent
                      ? 'font-bold text-white bg-black/20 border border-black/30 px-3 py-1 rounded'
                      : 'font-bold text-secondary bg-white/10 px-3 py-1 rounded'
                    : isTransparent
                      ? 'hover:text-secondary'
                      : 'hover:text-secondary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          {isAdmin ? (
            <Link
              to="/admin/dashboard"
              className="bg-secondary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary transition-colors"
            >
              Dashboard Admin
            </Link>
          ) : (
            <Link
              to="/admin/login"
              className="bg-white text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-secondary hover:text-white transition-colors"
            >
              Login Admin
            </Link>
          )}
        </div>
        {/* Mobile Menu */}
        {open && (
          <div className="absolute top-full left-0 right-0 bg-primary shadow-lg md:hidden">
            <nav className="flex flex-col p-4 space-y-2">
              {navLinks.map(link => link.subLinks ? (
                <div key={link.label}>
                  <button
                    className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-white/10 rounded-lg transition-colors"
                    onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                  >
                    <span>{link.label}</span>
                    <svg className={`w-4 h-4 transition-transform ${mobileDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {mobileDropdownOpen && (
                    <div className="pl-4 space-y-1">
                      {link.subLinks.map(subLink => (
                        <Link
                          key={subLink.to}
                          to={subLink.to}
                          className="block px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          {subLink.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === link.to
                      ? 'font-bold text-secondary bg-white/10'
                      : 'hover:bg-white/10 hover:text-secondary'
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin ? (
                <Link
                  to="/admin/dashboard"
                  className="block px-4 py-3 bg-secondary text-white rounded-lg font-semibold hover:bg-primary transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Dashboard Admin
                </Link>
              ) : (
                <Link
                  to="/admin/login"
                  className="block px-4 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-secondary hover:text-white transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Login Admin
                </Link>
              )}
            </nav>
          </div>
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

  const isAdmin = (() => {
    if (typeof window === 'undefined') return false;
    
    const session = sessionStorage.getItem('adminSession');
    const lastLogin = localStorage.getItem('adminLastLogin');
    const sessionId = localStorage.getItem('adminSessionId');
    
    if (!session || !lastLogin || !sessionId) return false;
    
    try {
      const sessionData = JSON.parse(session);
      const timeSinceActivity = Date.now() - sessionData.lastActivity;
      const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
      
      return sessionData.isAdmin && sessionData.sessionId === sessionId && timeSinceActivity <= SESSION_TIMEOUT;
    } catch (error) {
      return false;
    }
  })();
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
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <a href="mailto:moncongloebulu16@gmail.com" className="underline hover:text-secondary transition-colors">moncongloebulu16@gmail.com</a>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <Link to="/admin/dashboard" className="underline hover:text-secondary transition-colors">Developer Desa</Link>
          </div>
        </div>
        {/* Kolom 3: Telepon Penting */}
        <div>
          <div className="font-bold text-lg mb-2">Telepon Penting</div>
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            Kantor Desa: 0812-0979-1290
          </div>
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            Darurat: 112
          </div>
        </div>
        {/* Kolom 4: Alamat */}
        <div>
          <div className="font-bold text-lg mb-2">Alamat</div>
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
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
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
      </svg>
    </button>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Load sidebar state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setSidebarCollapsed(JSON.parse(savedState));
    }
  }, []);

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);
  
  // Auto refresh on beranda if admin login and sessionStorage flag set
  React.useEffect(() => {
    if (
      window.location.pathname === '/' &&
      sessionStorage.getItem('adminSession') &&
      sessionStorage.getItem('adminNeedsRefresh') === 'true'
    ) {
      sessionStorage.removeItem('adminNeedsRefresh');
      window.location.reload();
    }
  }, []);

  // Update document title based on route
  useEffect(() => {
    const routeTitles = {
      '/': 'Beranda - Desa Moncongloe Bulu',
      '/berita': 'Berita - Desa Moncongloe Bulu',
      '/profil': 'Profil Desa - Desa Moncongloe Bulu',
      '/pengaduan': 'Pengaduan - Desa Moncongloe Bulu',
      '/sejarah': 'Sejarah - Desa Moncongloe Bulu',
      '/admin/login': 'Login Admin - Desa Moncongloe Bulu',
      '/admin/dashboard': 'Dashboard Admin - Desa Moncongloe Bulu',
    };
    
    const title = routeTitles[location.pathname] || 'Desa Moncongloe Bulu';
    document.title = title;
  }, [location.pathname]);
  
  return (
    <PrasaranaProvider>
      <DesaProvider>
        <StatistikProvider>
          <BeritaProvider>
            <PengaduanProvider>
              <DokumentasiKKNProvider>
                <ErrorBoundary>
                <div className={`min-h-screen bg-background font-sans ${isAdminRoute ? 'lg:flex' : 'flex flex-col'}`}>
                  <ScrollToTop />
                  {isAdminRoute ? (
                    <AdminHeader 
                      sidebarOpen={sidebarOpen}
                      setSidebarOpen={setSidebarOpen}
                      sidebarCollapsed={sidebarCollapsed}
                      setSidebarCollapsed={setSidebarCollapsed}
                    />
                  ) : <Header />}
                  {!isAdminRoute && (
                    <>
                      <HeroSection />
                      <SambutanKepalaDesa />
                    </>
                  )}
                  <main className={`flex-1 ${isAdminRoute ? `pt-16 lg:pt-16 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}` : ''}`} role="main">
                    <Suspense fallback={<LoadingSpinner />}>
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
                        <Route path="/admin/berita" element={
                          <RequireAdmin>
                            <DaftarBerita />
                          </RequireAdmin>
                        } />
                        <Route path="/admin/berita/tambah" element={
                          <RequireAdmin>
                            <TambahEditBerita />
                          </RequireAdmin>
                        } />
                        <Route path="/admin/berita/edit/:id" element={
                          <RequireAdmin>
                            <TambahEditBerita />
                          </RequireAdmin>
                        } />
                        <Route path="/admin/pengaduan" element={
                          <RequireAdmin>
                            <LaporanPengaduan />
                          </RequireAdmin>
                        } />
                        <Route path="/admin/statistik" element={
                          <RequireAdmin>
                            <EditStatistik />
                          </RequireAdmin>
                        } />
                        <Route path="/admin/prasarana" element={
                          <RequireAdmin>
                            <EditPrasarana />
                          </RequireAdmin>
                        } />
                        <Route path="/admin/dokumentasi/tambah" element={
                          <RequireAdmin>
                            <TambahDokumentasi />
                          </RequireAdmin>
                        } />
                        <Route path="/berita/:id" element={<DetailBerita />} />
                        <Route path="/dokumentasi-kkn" element={<DokumentasiKKN />} />
                        <Route path="/modul/contoh-1" element={<ModulPage title="Modul Contoh 1" />} />
                        <Route path="/modul/contoh-2" element={<ModulPage title="Modul Contoh 2" />} />
                      </Routes>
                    </Suspense>
                  </main>
                  {!isAdminRoute && <FooterInfo />}
                  <ScrollToTopButton />
                  {isAdminRoute && <SessionTimeout />}
                </div>
              </ErrorBoundary>
                </DokumentasiKKNProvider>
            </PengaduanProvider>
          </BeritaProvider>
        </StatistikProvider>
      </DesaProvider>
    </PrasaranaProvider>
  )
}

export default App
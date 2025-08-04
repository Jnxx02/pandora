import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const USERNAME = 'admin';
const PASSWORD = 'admin123';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 menit
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 menit

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);
  const navigate = useNavigate();

  // Check for existing lockout on component mount
  useEffect(() => {
    const storedLockoutTime = localStorage.getItem('adminLockoutTime');
    const storedAttempts = localStorage.getItem('adminLoginAttempts');
    
    if (storedLockoutTime && storedAttempts) {
      const lockoutEnd = parseInt(storedLockoutTime);
      const attempts = parseInt(storedAttempts);
      
      if (Date.now() < lockoutEnd) {
        setIsLocked(true);
        setLockoutTime(lockoutEnd);
        setLoginAttempts(attempts);
      } else {
        // Clear expired lockout
        localStorage.removeItem('adminLockoutTime');
        localStorage.removeItem('adminLoginAttempts');
      }
    }
  }, []);

  // Update lockout timer
  useEffect(() => {
    if (isLocked) {
      const timer = setInterval(() => {
        const remaining = lockoutTime - Date.now();
        if (remaining <= 0) {
          setIsLocked(false);
          setLoginAttempts(0);
          localStorage.removeItem('adminLockoutTime');
          localStorage.removeItem('adminLoginAttempts');
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isLocked, lockoutTime]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const createSecureSession = () => {
    const sessionData = {
      isAdmin: true,
      loginTime: Date.now(),
      sessionId: Math.random().toString(36).substr(2, 9),
      lastActivity: Date.now()
    };
    
    // Store in sessionStorage for session-based storage
    sessionStorage.setItem('adminSession', JSON.stringify(sessionData));
    
    // Store minimal data in localStorage for persistence check
    localStorage.setItem('adminLastLogin', Date.now().toString());
    localStorage.setItem('adminSessionId', sessionData.sessionId);
  };

  const handleSubmit = async (e => {
    e.preventDefault();
    
    if (isLocked) {
      const remaining = Math.ceil((lockoutTime - Date.now()) / 1000 / 60);
      setError(`Akun terkunci. Coba lagi dalam ${remaining} menit.`);
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate network delay for security
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (form.username === USERNAME && form.password === PASSWORD) {
      // Reset login attempts on successful login
      setLoginAttempts(0);
      localStorage.removeItem('adminLoginAttempts');
      localStorage.removeItem('adminLockoutTime');
      
      // Create secure session
      createSecureSession();
      
      // Set up activity monitoring
      setupActivityMonitoring();
      
      navigate('/admin/dashboard');
    } else {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      localStorage.setItem('adminLoginAttempts', newAttempts.toString());
      
      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        const lockoutEnd = Date.now() + LOCKOUT_DURATION;
        setIsLocked(true);
        setLockoutTime(lockoutEnd);
        localStorage.setItem('adminLockoutTime', lockoutEnd.toString());
        setError(`Terlalu banyak percobaan login. Akun terkunci selama 15 menit.`);
      } else {
        setError(`Username atau password salah! (${MAX_LOGIN_ATTEMPTS - newAttempts} percobaan tersisa)`);
      }
    }
    
    setIsLoading(false);
  });

  const setupActivityMonitoring = () => {
    // Update last activity on user interaction
    const updateActivity = () => {
      const session = sessionStorage.getItem('adminSession');
      if (session) {
        const sessionData = JSON.parse(session);
        sessionData.lastActivity = Date.now();
        sessionStorage.setItem('adminSession', JSON.stringify(sessionData));
      }
    };

    // Add event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    // Check session timeout every minute
    const sessionCheck = setInterval(() => {
      const session = sessionStorage.getItem('adminSession');
      if (session) {
        const sessionData = JSON.parse(session);
        const timeSinceActivity = Date.now() - sessionData.lastActivity;
        
        if (timeSinceActivity > SESSION_TIMEOUT) {
          // Session expired, logout
          sessionStorage.removeItem('adminSession');
          localStorage.removeItem('adminLastLogin');
          localStorage.removeItem('adminSessionId');
          
          // Remove event listeners
          events.forEach(event => {
            document.removeEventListener(event, updateActivity, true);
          });
          
          clearInterval(sessionCheck);
          navigate('/admin/login');
        }
      } else {
        clearInterval(sessionCheck);
      }
    }, 60000); // Check every minute

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
      clearInterval(sessionCheck);
    });
  };

  const getLockoutMessage = () => {
    if (!isLocked) return '';
    const remaining = Math.ceil((lockoutTime - Date.now()) / 1000 / 60);
    return `Akun terkunci. Coba lagi dalam ${remaining} menit.`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral px-1 sm:px-4 py-6">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-4 sm:p-8 text-center border border-neutral">
        <span className="text-3xl sm:text-4xl mb-4 inline-block">🔑</span>
        <h1 className="text-lg sm:text-xl font-bold mb-6 text-secondary">Login Admin</h1>
        
        {isLocked && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-red-600 text-sm font-semibold">
              {getLockoutMessage()}
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <label className="block text-left text-xs sm:text-sm font-medium text-text-main mb-1">Username</label>
            <input 
              type="text" 
              name="username" 
              value={form.username} 
              onChange={handleChange} 
              disabled={isLocked || isLoading}
              className="w-full px-2 sm:px-3 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-text-main text-xs sm:text-base transition disabled:opacity-50 disabled:cursor-not-allowed" 
            />
          </div>
          <div>
            <label className="block text-left text-xs sm:text-sm font-medium text-text-main mb-1">Password</label>
            <input 
              type="password" 
              name="password" 
              value={form.password} 
              onChange={handleChange} 
              disabled={isLocked || isLoading}
              className="w-full px-2 sm:px-3 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-text-main text-xs sm:text-base transition disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          
          {error && (
            <div className="text-primary text-sm font-semibold p-2 bg-red-50 border border-red-200 rounded">
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={isLocked || isLoading}
            className="w-full bg-secondary text-white py-2 rounded-lg hover:bg-primary transition text-sm sm:text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memverifikasi...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
        
        <div className="mt-4 text-xs text-gray-500">
          <p>• Session akan berakhir setelah 30 menit tidak aktif</p>
          <p>• Maksimal 5 percobaan login</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
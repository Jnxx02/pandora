import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      setError('Token reset password tidak ditemukan');
      return;
    }
    setToken(tokenFromUrl);
  }, [searchParams]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password minimal 8 karakter';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password harus mengandung huruf kecil';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password harus mengandung huruf besar';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password harus mengandung angka';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi password
    const passwordError = validatePassword(form.newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('Konfirmasi password tidak cocok');
      return;
    }

    if (!token) {
      setError('Token tidak valid');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token: token,
          newPassword: form.newPassword 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        // Redirect ke login setelah 3 detik
        setTimeout(() => {
          navigate('/admin/login');
        }, 3000);
      } else {
        setError(data.error || 'Terjadi kesalahan');
      }
    } catch (err) {
      setError('Gagal terhubung ke server. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral px-1 sm:px-4 py-6">
        <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-4 sm:p-8 text-center border border-neutral">
          <span className="text-3xl sm:text-4xl mb-4 inline-block">❌</span>
          <h1 className="text-lg sm:text-xl font-bold mb-2 text-red-600">Token Tidak Valid</h1>
          <p className="text-sm text-gray-600 mb-6">Token reset password tidak ditemukan atau sudah kadaluarsa</p>
          
          <button 
            onClick={() => navigate('/admin/forgot-password')}
            className="w-full bg-secondary text-white py-2 rounded-lg hover:bg-primary transition text-sm sm:text-base font-semibold"
          >
            Minta Reset Password Baru
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral px-1 sm:px-4 py-6">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-4 sm:p-8 text-center border border-neutral">
        <span className="text-3xl sm:text-4xl mb-4 inline-block">🔐</span>
        <h1 className="text-lg sm:text-xl font-bold mb-2 text-secondary">Reset Password</h1>
        <p className="text-sm text-gray-600 mb-6">Masukkan password baru untuk akun admin</p>
        
        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-green-600 text-sm font-semibold">
              {message}
            </div>
            <p className="text-xs text-green-500 mt-1">
              Redirecting ke halaman login...
            </p>
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-red-600 text-sm font-semibold">
              {error}
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <label className="block text-left text-xs sm:text-sm font-medium text-text-main mb-1">
              Password Baru
            </label>
            <input 
              type="password" 
              name="newPassword"
              value={form.newPassword} 
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Masukkan password baru"
              className="w-full px-2 sm:px-3 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-text-main text-xs sm:text-base transition disabled:opacity-50 disabled:cursor-not-allowed" 
            />
          </div>
          
          <div>
            <label className="block text-left text-xs sm:text-sm font-medium text-text-main mb-1">
              Konfirmasi Password
            </label>
            <input 
              type="password" 
              name="confirmPassword"
              value={form.confirmPassword} 
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Konfirmasi password baru"
              className="w-full px-2 sm:px-3 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-text-main text-xs sm:text-base transition disabled:opacity-50 disabled:cursor-not-allowed" 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-secondary text-white py-2 rounded-lg hover:bg-primary transition text-sm sm:text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
        
        <div className="mt-4 text-xs text-gray-500">
          <p>• Password minimal 8 karakter</p>
          <p>• Harus mengandung huruf besar, kecil, dan angka</p>
          <p>• Password lama tidak akan berlaku lagi</p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

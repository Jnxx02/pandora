import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const USERNAME = 'admin';
const PASSWORD = 'admin123';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (form.username === USERNAME && form.password === PASSWORD) {
      localStorage.setItem('isAdmin', 'true');
      sessionStorage.setItem('adminNeedsRefresh', 'true');
      setError('');
      navigate('/admin/dashboard');
    } else {
      setError('Username atau password salah!');
    }
  };

  return (
    // GANTI: Latar menggunakan 'bg-neutral' yang konsisten untuk admin
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral px-1 sm:px-4 py-6">
      {/* GANTI: Kartu login dengan border neutral */}
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-4 sm:p-8 text-center border border-neutral">
        <span className="text-3xl sm:text-4xl mb-4 inline-block">🔑</span>
        {/* GANTI: Judul dengan warna 'secondary' yang lebih tegas */}
        <h1 className="text-lg sm:text-xl font-bold mb-6 text-secondary">Login Admin</h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            {/* GANTI: Label dengan warna 'text-main' */}
            <label className="block text-left text-xs sm:text-sm font-medium text-text-main mb-1">Username</label>
            {/* GANTI: Input field dengan gaya baru */}
            <input 
              type="text" 
              name="username" 
              value={form.username} 
              onChange={handleChange} 
              className="w-full px-2 sm:px-3 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-text-main text-xs sm:text-base transition" 
            />
          </div>
          <div>
            <label className="block text-left text-xs sm:text-sm font-medium text-text-main mb-1">Password</label>
            <input 
              type="password" 
              name="password" 
              value={form.password} 
              onChange={handleChange} 
              className="w-full px-2 sm:px-3 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-text-main text-xs sm:text-base transition"
            />
          </div>
          {/* GANTI: Pesan error dengan warna 'primary' */}
          {error && <div className="text-primary text-sm font-semibold">{error}</div>}
          {/* Tombol login sudah menggunakan warna yang sesuai */}
          <button 
            type="submit" 
            className="w-full bg-secondary text-white py-2 rounded-lg hover:bg-primary transition text-sm sm:text-base font-semibold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
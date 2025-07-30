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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-1 sm:px-4 py-6">
      <div className="w-full max-w-sm bg-white rounded-xl shadow p-4 sm:p-8 text-center border border-accent">
        <span className="text-3xl sm:text-4xl mb-4 inline-block">🔑</span>
        <h1 className="text-lg sm:text-xl font-bold mb-6 text-primary">Login Admin</h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <label className="block text-left text-xs sm:text-sm font-medium text-secondary mb-1">Username</label>
            <input type="text" name="username" value={form.username} onChange={handleChange} className="w-full px-2 sm:px-3 py-2 border border-accent rounded focus:outline-none focus:ring-2 focus:ring-secondary text-xs sm:text-base" />
          </div>
          <div>
            <label className="block text-left text-xs sm:text-sm font-medium text-secondary mb-1">Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full px-2 sm:px-3 py-2 border border-accent rounded focus:outline-none focus:ring-2 focus:ring-secondary text-xs sm:text-base" />
          </div>
          {error && <div className="text-red-600 text-sm font-semibold">{error}</div>}
          <button type="submit" className="w-full bg-secondary text-white py-2 rounded hover:bg-primary transition text-xs sm:text-base">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login; 
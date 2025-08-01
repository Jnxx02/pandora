import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const TambahEditBerita = () => {
  const [berita, setBerita] = useState([]);
  const [form, setForm] = useState({ judul: '', gambar: '', tanggal: '', ringkasan: '', isi: '' });
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  const fetchBerita = () => {
    try {
      const storedBerita = localStorage.getItem('berita');
      const dataBerita = storedBerita ? JSON.parse(storedBerita) : [];
      dataBerita.sort((a, b) => {
        const dateA = new Date(a.tanggalDibuat || 0);
        const dateB = new Date(b.tanggalDibuat || 0);
        return dateB - dateA;
      });
      setBerita(dataBerita);
    } catch (error) {
      console.error("Gagal memuat berita dari localStorage:", error);
      setBerita([]);
    }
  };

  useEffect(() => {
    fetchBerita();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.judul || !form.gambar || !form.tanggal || !form.ringkasan || !form.isi) {
        alert("Semua kolom harus diisi!");
        return;
    };

    try {
      const storedBerita = localStorage.getItem('berita');
      let dataBerita = storedBerita ? JSON.parse(storedBerita) : [];

      if (editId) {
        const originalBerita = dataBerita.find(b => b.id === editId);
        dataBerita = dataBerita.map(b => b.id === editId ? { ...originalBerita, ...form, id: editId } : b);
      } else {
        const newBerita = { ...form, id: Date.now(), tanggalDibuat: new Date().toISOString() };
        dataBerita.push(newBerita);
      }
      localStorage.setItem('berita', JSON.stringify(dataBerita));
      fetchBerita();
    } catch (error) {
      console.error("Gagal menyimpan berita:", error);
      alert("Gagal menyimpan berita.");
    }

    setForm({ judul: '', gambar: '', tanggal: '', ringkasan: '', isi: '' });
    setEditId(null);
  };

  const handleEdit = b => {
    setForm({ judul: b.judul, gambar: b.gambar, tanggal: b.tanggal, ringkasan: b.ringkasan, isi: b.isi || '' });
    setEditId(b.id);
    window.scrollTo(0, 0);
  };

  const handleDelete = id => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus berita ini?')) return;
    try {
      const storedBerita = localStorage.getItem('berita');
      let dataBerita = storedBerita ? JSON.parse(storedBerita) : [];
      const updatedBerita = dataBerita.filter(b => b.id !== id);
      localStorage.setItem('berita', JSON.stringify(updatedBerita));
      fetchBerita();
    } catch (error) {
      console.error("Gagal menghapus berita:", error);
      alert("Gagal menghapus berita.");
    }
  };

  return (
    <div className="py-10 max-w-4xl mx-auto bg-neutral min-h-screen px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-secondary">{editId ? 'Edit Berita' : 'Tambah Berita Baru'}</h2>
        <button onClick={() => navigate('/admin/dashboard')} className="bg-white text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-background transition-colors border border-neutral">
          ← Kembali ke Dashboard
        </button>
      </div>
      
      <div className="space-y-6">
        {/* Form Section */}
        <div className="bg-white rounded-xl shadow p-6 border border-neutral/50">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">Judul</label>
              <input name="judul" value={form.judul} onChange={handleChange} className="w-full px-3 py-2 border border-neutral rounded bg-white text-text-main focus:ring-1 focus:ring-primary focus:border-primary transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">Ringkasan</label>
              <textarea name="ringkasan" value={form.ringkasan} onChange={handleChange} className="w-full px-3 py-2 border border-neutral rounded bg-white text-text-main focus:ring-1 focus:ring-primary focus:border-primary transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">Tanggal</label>
              <input type="date" name="tanggal" value={form.tanggal} onChange={handleChange} className="w-full px-3 py-2 border border-neutral rounded bg-white text-text-main focus:ring-1 focus:ring-primary focus:border-primary transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">Isi Berita</label>
              <textarea name="isi" value={form.isi} onChange={handleChange} rows={6} className="w-full px-3 py-2 border border-neutral rounded bg-white text-text-main focus:ring-1 focus:ring-primary focus:border-primary transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">Gambar Utama (URL)</label>
              <input name="gambar" value={form.gambar} onChange={handleChange} className="w-full px-3 py-2 border border-neutral rounded bg-white text-text-main focus:ring-1 focus:ring-primary focus:border-primary transition" />
            </div>
            <div className="flex gap-4 mt-2">
                <button type="submit" className="flex-1 bg-secondary text-white px-4 py-2 rounded-md hover:bg-primary transition font-semibold">{editId ? 'Simpan Perubahan' : 'Publikasikan'}</button>
                {editId && (
                    <button type="button" onClick={() => { setEditId(null); setForm({ judul: '', gambar: '', tanggal: '', ringkasan: '', isi: '' }); }} className="flex-1 bg-white text-primary border-2 border-primary px-4 py-2 rounded-md hover:bg-primary hover:text-white transition font-semibold">Batal Edit</button>
                )}
            </div>
          </form>
        </div>
        
        {/* Table Section */}
        <div className="bg-white rounded-xl shadow p-6 border border-neutral/50">
          <h3 className="text-lg font-bold text-secondary mb-4">Daftar Berita</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left mb-4">
              <thead className="bg-neutral/60">
                <tr>
                  <th className="px-4 py-2 text-secondary font-semibold">Judul</th>
                  <th className="px-4 py-2 text-secondary font-semibold">Tanggal</th>
                  <th className="px-4 py-2 text-secondary font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {berita.map(b => (
                  <tr key={b.id} className="border-b border-neutral">
                    <td className="px-4 py-2 text-text-main font-medium">{b.judul}</td>
                    <td className="px-4 py-2 text-text-secondary">
                      {b.tanggal ? new Date(b.tanggal).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      }) : '-'}
                    </td>
                    <td className="px-4 py-2 flex gap-3 justify-center">
                      <button className="text-sm text-primary font-semibold hover:underline" onClick={() => handleEdit(b)}>Edit</button>
                      <button className="text-sm text-secondary font-semibold hover:underline" onClick={() => handleDelete(b.id)}>Hapus</button>
                      <Link to={`/berita/${b.id}`} className="text-sm text-blue-600 font-semibold hover:underline">Lihat</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TambahEditBerita;
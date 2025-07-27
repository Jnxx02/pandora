import React, { useState } from 'react';
import { useDesa } from '../../context/DesaContext';
import { Link, useNavigate } from 'react-router-dom';

const TambahEditBerita = () => {
  const { berita, addBerita, deleteBerita } = useDesa();
  const [form, setForm] = useState({ judul: '', gambar: '', tanggal: '', ringkasan: '', isi: '' });
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.judul || !form.gambar || !form.tanggal || !form.ringkasan || !form.isi) return;
    if (editId) {
      deleteBerita(editId);
    }
    addBerita(form);
    setForm({ judul: '', gambar: '', tanggal: '', ringkasan: '', isi: '' });
    setEditId(null);
  };

  const handleEdit = b => {
    setForm({ judul: b.judul, gambar: b.gambar, tanggal: b.tanggal, ringkasan: b.ringkasan, isi: b.isi || '' });
    setEditId(b.id);
  };

  return (
    <div className="py-10 max-w-2xl mx-auto bg-background min-h-screen">
      <div className="flex flex-col space-y-6">
        {/* Tombol kembali ke dashboard */}
        <button onClick={() => navigate('/admin/dashboard')} className="mb-2 w-fit bg-accent text-primary px-4 py-2 rounded hover:bg-secondary hover:text-white transition font-semibold border border-accent">&larr; Kembali ke Dashboard</button>
        <h2 className="text-2xl font-bold text-primary mb-2 text-center">Tambah / Edit Berita</h2>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-4 border border-accent flex flex-col gap-4">
          <div>
            <label className="text-secondary">Judul</label>
            <input name="judul" value={form.judul} onChange={handleChange} className="w-full px-3 py-2 border border-accent rounded bg-background text-primary" />
          </div>
          <div>
            <label className="text-secondary">Ringkasan</label>
            <textarea name="ringkasan" value={form.ringkasan} onChange={handleChange} className="w-full px-3 py-2 border border-accent rounded bg-background text-primary" />
          </div>
          <div>
            <label className="text-secondary">Tanggal</label>
            <input name="tanggal" value={form.tanggal} onChange={handleChange} className="w-full px-3 py-2 border border-accent rounded bg-background text-primary" placeholder="Tanggal (misal: 10 Juli 2024)" />
          </div>
          <div>
            <label className="text-secondary">Isi Berita</label>
            <textarea name="isi" value={form.isi} onChange={handleChange} rows={6} className="w-full px-3 py-2 border border-accent rounded bg-background text-primary" />
          </div>
          <div>
            <label className="text-secondary">Gambar Utama (URL)</label>
            <input name="gambar" value={form.gambar} onChange={handleChange} className="w-full px-3 py-2 border border-accent rounded bg-background text-primary" />
          </div>
          <button type="submit" className="bg-secondary text-white px-4 py-2 rounded-md w-full hover:bg-primary transition font-semibold">{editId ? 'Simpan Perubahan' : 'Publikasikan'}</button>
          {editId && (
            <button type="button" onClick={() => { setEditId(null); setForm({ judul: '', gambar: '', tanggal: '', ringkasan: '', isi: '' }); }} className="bg-accent text-primary px-4 py-2 rounded-md w-full hover:bg-secondary hover:text-white transition font-semibold mt-2">Batal Edit</button>
          )}
        </form>
        <div className="bg-white rounded-xl shadow p-4 border border-accent">
          <h3 className="text-lg font-bold text-primary mb-4">Daftar Berita</h3>
          <table className="w-full text-sm text-left mb-4">
            <thead className="bg-accent">
              <tr>
                <th className="px-4 py-2 text-primary">Judul</th>
                <th className="px-4 py-2 text-primary">Tanggal</th>
                <th className="px-4 py-2 text-primary">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {berita.map(b => (
                <tr key={b.id} className="border-b border-accent">
                  <td className="px-4 py-2 text-primary">{b.judul}</td>
                  <td className="px-4 py-2 text-primary">{b.tanggal}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button className="text-sm text-secondary hover:text-primary" onClick={() => handleEdit(b)}>Edit</button>
                    <button className="text-sm text-red-600 hover:text-primary" onClick={() => deleteBerita(b.id)}>Hapus</button>
                    <Link to={`/berita/${b.id}`} className="text-sm text-primary hover:text-secondary underline">Lihat Detail</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TambahEditBerita; 
# 🚀 Setup Email Notifikasi Pengaduan PANDORA

## 📋 Overview
Sistem PANDORA sudah diimplementasikan dengan fitur notifikasi email otomatis untuk setiap pengaduan yang dikirimkan. Setiap kali ada pengaduan baru, sistem akan mengirim email notifikasi ke alamat email yang dikonfigurasi.

## ⚙️ Konfigurasi Email

### 1. Buat File .env
Buat file `.env` di folder `backend/` dengan konfigurasi berikut:

```env
# Email Configuration
EMAIL_USER=desa.moncongloebulu@gmail.com
EMAIL_PASSWORD=your-app-password-here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false

# Email Recipients untuk Notifikasi Pengaduan
DESA_EMAIL_RECIPIENTS=desa.moncongloebulu@gmail.com,kepaladesa@example.com,sekretaris@example.com

# Supabase Configuration (jika menggunakan Supabase)
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key

# Server Configuration
PORT=3001
NODE_ENV=development
```

### 2. Setup Gmail App Password
Untuk menggunakan Gmail sebagai SMTP server:

1. **Aktifkan 2-Factor Authentication** pada akun Gmail
2. **Buat App Password**:
   - Buka [Google Account Settings](https://myaccount.google.com/)
   - Pilih "Security" → "2-Step Verification"
   - Scroll ke bawah, pilih "App passwords"
   - Generate password untuk "Mail"
   - Gunakan password yang dihasilkan di `EMAIL_PASSWORD`

### 3. Konfigurasi Email Recipients
Tambahkan alamat email yang akan menerima notifikasi pengaduan di `DESA_EMAIL_RECIPIENTS`:

```env
DESA_EMAIL_RECIPIENTS=desa.moncongloebulu@gmail.com,kepaladesa@example.com,sekretaris@example.com
```

## 🧪 Testing Email System

### 1. Test Email Configuration
Jalankan script test untuk memverifikasi konfigurasi email:

```bash
cd backend
node test-email.js
```

### 2. Test dengan Email Custom
```bash
node test-email.js your-email@example.com
```

### 3. Test dari Frontend
1. Jalankan backend server: `npm run dev`
2. Buka frontend dan kirim pengaduan test
3. Cek email inbox (dan spam folder)

## 📧 Format Email Notifikasi

Setiap email notifikasi akan berisi:

- **Subject**: 🚨 PENGADUAN BARU: [Judul Pengaduan]
- **Header**: Logo dan nama desa
- **Detail Pengaduan**:
  - Judul dan klasifikasi
  - Kategori dan isi
  - Tanggal kejadian (jika ada)
  - Tanggal pengaduan
  - Informasi kontak pelapor
  - Lampiran (jika ada)
- **Footer**: Instruksi tindak lanjut

## 🔧 Troubleshooting

### Email Tidak Terkirim
1. **Cek .env file**: Pastikan semua variabel terisi dengan benar
2. **Cek credentials**: Verifikasi email dan password
3. **Cek Gmail settings**: Pastikan App Password digunakan, bukan password biasa
4. **Cek firewall**: Pastikan port 587 tidak diblokir

### Email Masuk Spam
1. **Tambahkan sender email ke contacts**
2. **Setup SPF/DKIM records** (untuk production)
3. **Gunakan email domain resmi** (bukan Gmail)

### Error Logs
Cek console backend untuk error messages:
```bash
cd backend
npm run dev
```

## 📱 Fitur yang Sudah Diimplementasi

✅ **Notifikasi Otomatis**: Setiap pengaduan baru
✅ **Multiple Recipients**: Bisa kirim ke beberapa email sekaligus
✅ **HTML Email**: Format email yang menarik dan informatif
✅ **Fallback Handling**: Email gagal tidak mengganggu pengaduan
✅ **Error Logging**: Log detail untuk troubleshooting
✅ **Test Script**: Script untuk verifikasi konfigurasi

## 🚀 Deployment

### Production Environment
1. **Gunakan environment variables** yang aman
2. **Setup SMTP server** yang reliable
3. **Monitor email delivery** dan bounce rates
4. **Setup email templates** yang sesuai brand desa

### Environment Variables
```bash
# Production
NODE_ENV=production
EMAIL_USER=official@desamoncongloebulu.com
EMAIL_PASSWORD=secure-app-password
DESA_EMAIL_RECIPIENTS=official@desamoncongloebulu.com,admin@desamoncongloebulu.com
```

## 📞 Support

Jika mengalami masalah dengan setup email:

1. **Cek logs** di console backend
2. **Test dengan script** `test-email.js`
3. **Verifikasi konfigurasi** Gmail/SMTP
4. **Cek network connectivity** dan firewall settings

---

**🎯 Goal**: Setiap pengaduan yang dikirimkan akan otomatis masuk notifikasi email ke tim desa untuk tindak lanjut cepat!

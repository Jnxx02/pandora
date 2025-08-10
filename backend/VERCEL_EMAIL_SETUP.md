# 📧 Email Setup untuk Vercel Deployment

## 🚨 Masalah yang Sering Terjadi

Error yang Anda alami:
```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```

Ini terjadi karena:
1. **Environment Variables tidak terbaca** di Vercel
2. **App Password tidak dikonfigurasi** dengan benar
3. **Gmail security settings** yang berbeda di production

## 🔧 Solusi Lengkap

### 1. **Setup Gmail App Password**

#### Langkah 1: Aktifkan 2-Step Verification
1. Buka [Google Account Settings](https://myaccount.google.com/)
2. Pilih **Security** → **2-Step Verification**
3. Aktifkan 2-Step Verification

#### Langkah 2: Buat App Password
1. Buka [App Passwords](https://myaccount.google.com/apppasswords)
2. Pilih **Mail** dan **Other (Custom name)**
3. Beri nama: `PANDORA-Vercel`
4. Copy App Password yang dihasilkan

### 2. **Konfigurasi Environment Variables di Vercel**

#### Langkah 1: Buka Vercel Dashboard
1. Login ke [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih project PANDORA

#### Langkah 2: Tambah Environment Variables
1. Pilih **Settings** → **Environment Variables**
2. Tambah variable berikut:

```
EMAIL_USER=desa.moncongloebulu@gmail.com
EMAIL_PASSWORD=your-16-digit-app-password
DESA_EMAIL_RECIPIENTS=moncongloebulu.desa@gmail.com,admin@example.com
NODE_ENV=production
```

#### Langkah 3: Redeploy
1. Setelah menambah environment variables
2. Klik **Redeploy** di project

### 3. **Verifikasi Konfigurasi**

#### Test Email Configuration
```bash
# Di local (untuk verifikasi)
npm run test:email:simple

# Di Vercel (melalui logs)
# Cek Vercel Function Logs untuk melihat debug info
```

## 🔍 Debugging di Vercel

### 1. **Cek Environment Variables**
Log akan menampilkan:
```
🔧 Email Configuration Debug:
  - EMAIL_USER: ✅ Set
  - EMAIL_PASSWORD: ✅ Set
  - EMAIL_HOST: Not set (using Gmail)
  - NODE_ENV: production
```

### 2. **Cek Error Details**
Jika masih error, log akan menampilkan:
```
❌ Error mengirim email notifikasi ke multiple recipients:
  - Error Code: EAUTH
  - Response: 535-5.7.8 Username and Password not accepted
  - Response Code: 535
  - Command: AUTH PLAIN
```

## 🚀 Alternatif Solusi

### 1. **Gunakan SMTP Custom (Jika Gmail masih bermasalah)**
```bash
# Environment Variables tambahan
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

### 2. **Gunakan Email Service Lain**
- **SendGrid** (free tier: 100 emails/day)
- **Mailgun** (free tier: 5,000 emails/month)
- **Resend** (free tier: 3,000 emails/month)

## 📋 Checklist Verifikasi

- [ ] 2-Step Verification aktif di Gmail
- [ ] App Password dibuat dengan nama `PANDORA-Vercel`
- [ ] Environment Variables ditambahkan di Vercel:
  - [ ] `EMAIL_USER`
  - [ ] `EMAIL_PASSWORD`
  - [ ] `DESA_EMAIL_RECIPIENTS`
  - [ ] `NODE_ENV=production`
- [ ] Project di-redeploy setelah menambah environment variables
- [ ] Test email berhasil di local
- [ ] Logs di Vercel menunjukkan environment variables terbaca

## 🆘 Jika Masih Bermasalah

### 1. **Cek Vercel Function Logs**
1. Buka Vercel Dashboard
2. Pilih **Functions** → **View Function Logs**
3. Cari error yang berhubungan dengan email

### 2. **Test Environment Variables**
Tambahkan log ini di `emailConfig.js`:
```javascript
console.log('🔍 All Environment Variables:', {
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? '***SET***' : 'NOT SET',
  NODE_ENV: process.env.NODE_ENV,
  VERCEL: process.env.VERCEL,
  VERCEL_ENV: process.env.VERCEL_ENV
});
```

### 3. **Contact Support**
Jika semua sudah benar tapi masih error:
1. Cek [Gmail Security Settings](https://support.google.com/mail/?p=BadCredentials)
2. Coba buat App Password baru
3. Pastikan tidak ada pembatasan keamanan Google

## 📋 File .env Example

Buat file `.env` di folder `backend/` dengan isi:

```bash
# 📧 Email Configuration
EMAIL_USER=desa.moncongloebulu@gmail.com
EMAIL_PASSWORD=your-16-digit-app-password
DESA_EMAIL_RECIPIENTS=moncongloebulu.desa@gmail.com,admin@example.com

# Environment
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key

# Server Configuration
PORT=3001
```

## 🚀 Quick Fix untuk Vercel

Jika masih error setelah setup environment variables:

1. **Force Redeploy**: Di Vercel Dashboard → Deployments → ⋮ → Redeploy
2. **Clear Cache**: Di Vercel Dashboard → Settings → General → Clear Build Cache
3. **Check Function Logs**: Di Vercel Dashboard → Functions → View Function Logs

## 📚 Referensi

- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Nodemailer Gmail Setup](https://nodemailer.com/usage/using-gmail/)
- [Vercel Function Logs](https://vercel.com/docs/concepts/functions/function-logs)

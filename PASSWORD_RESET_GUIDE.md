# 🔐 Sistem Reset Password Admin - PANDORA Desa Moncongloe Bulu

## 📋 Overview

Sistem ini memungkinkan admin untuk mereset password mereka melalui konfirmasi email. Sistem ini dirancang dengan keamanan tinggi dan menggunakan token yang kadaluarsa untuk memastikan keamanan.

## 🏗️ Arsitektur Sistem

### Backend Components
- **`passwordResetStore.js`** - Temporary storage untuk token reset password
- **`emailTemplates.js`** - Template email untuk reset password dan konfirmasi
- **`emailConfig.js`** - Konfigurasi email dan fungsi pengiriman
- **`server.js`** - API endpoints untuk reset password

### Frontend Components
- **`ForgotPassword.jsx`** - Halaman untuk meminta reset password
- **`ResetPassword.jsx`** - Halaman untuk reset password dengan token
- **`Login.jsx`** - Updated dengan link ke forgot password

## 🔧 API Endpoints

### 1. Request Password Reset
```
POST /api/admin/request-password-reset
```
**Body:**
```json
{
  "email": "admin@desa.com"
}
```

**Response Success:**
```json
{
  "message": "Email reset password telah dikirim. Silakan cek inbox Anda.",
  "token": "abc123..." // Hanya untuk development
}
```

### 2. Reset Password with Token
```
POST /api/admin/reset-password
```
**Body:**
```json
{
  "token": "abc123...",
  "newPassword": "NewPassword123"
}
```

**Response Success:**
```json
{
  "message": "Password berhasil diubah! Silakan login dengan password baru.",
  "newPassword": "NewPassword123" // Hanya untuk development
}
```

### 3. View Active Reset Tokens (Debug)
```
GET /api/admin/reset-tokens
```

**Response:**
```json
{
  "activeTokens": [
    {
      "token": "abc123...",
      "adminUsername": "admin",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "expiresAt": "2024-01-01T00:15:00.000Z",
      "isExpired": false
    }
  ],
  "totalTokens": 1
}
```

## 🔒 Fitur Keamanan

### 1. Email Validation
- Hanya email yang diizinkan yang dapat meminta reset password
- Email yang diizinkan: `desa.moncongloebulu@gmail.com`, `admin@pandora-desa.com`

### 2. Token Security
- Token dibuat dengan kombinasi random string + timestamp + random string
- Token kadaluarsa dalam 15 menit
- Token dihapus setelah digunakan
- Auto-cleanup untuk token yang expired

### 3. Password Requirements
- Minimal 8 karakter
- Harus mengandung huruf besar
- Harus mengandung huruf kecil
- Harus mengandung angka

### 4. Rate Limiting
- Sistem lockout setelah 5 percobaan login gagal
- Lockout selama 15 menit

## 📧 Email Templates

### 1. Password Reset Request
- Subject: "🔐 Reset Password Admin - Sistem PANDORA Desa Moncongloe Bulu"
- Berisi link reset password dengan token
- Peringatan keamanan
- Informasi penting tentang reset password

### 2. Password Change Confirmation
- Subject: "✅ Password Admin Berhasil Diubah - Sistem PANDORA Desa Moncongloe Bulu"
- Konfirmasi perubahan password berhasil
- Instruksi keamanan
- Waktu perubahan password

## 🚀 Cara Penggunaan

### Untuk Admin:
1. **Lupa Password:**
   - Klik "Lupa Password?" di halaman login
   - Masukkan email admin yang diizinkan
   - Klik "Kirim Email Reset"

2. **Reset Password:**
   - Cek email untuk link reset password
   - Klik link atau copy-paste ke browser
   - Masukkan password baru
   - Konfirmasi password
   - Klik "Reset Password"

### Untuk Developer:
1. **Testing:**
   ```bash
   cd backend
   node test-password-reset.js
   ```

2. **Debug Token:**
   ```bash
   curl http://localhost:3001/api/admin/reset-tokens
   ```

## ⚙️ Konfigurasi

### Environment Variables
```bash
# Email Configuration
EMAIL_USER=desa.moncongloebulu@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false

# Frontend URL (untuk link reset password)
FRONTEND_URL=http://localhost:5173
```

### Allowed Admin Emails
Edit di `server.js`:
```javascript
const allowedAdminEmails = [
  'desa.moncongloebulu@gmail.com',
  'admin@pandora-desa.com'
];
```

## 🔄 Flow Diagram

```
Admin Lupa Password
        ↓
   Input Email Admin
        ↓
   Validasi Email
        ↓
   Generate Reset Token
        ↓
   Store Token (15 menit)
        ↓
   Kirim Email Reset
        ↓
   Admin Cek Email
        ↓
   Klik Link Reset
        ↓
   Input Password Baru
        ↓
   Validasi Password
        ↓
   Update Password
        ↓
   Hapus Token
        ↓
   Kirim Email Konfirmasi
        ↓
   Redirect ke Login
```

## 🧪 Testing

### Manual Testing
1. **Request Reset:**
   - Buka `/admin/forgot-password`
   - Input email yang diizinkan
   - Cek response API

2. **Reset Password:**
   - Copy token dari response API
   - Buka `/admin/reset-password?token=TOKEN`
   - Input password baru
   - Cek response API

3. **Email Testing:**
   - Cek inbox email
   - Verifikasi template email
   - Test link reset password

### Automated Testing
```bash
# Test semua fitur reset password
node test-password-reset.js

# Test email templates
node -e "
const { createPasswordResetTemplate } = require('./emailTemplates');
console.log(createPasswordResetTemplate('test123', 'admin'));
"
```

## 🚨 Troubleshooting

### Common Issues

1. **Email tidak terkirim:**
   - Cek konfigurasi email di `.env`
   - Verifikasi EMAIL_USER dan EMAIL_PASSWORD
   - Cek log server untuk error

2. **Token tidak valid:**
   - Token mungkin sudah expired (15 menit)
   - Token sudah digunakan
   - Cek log server untuk debugging

3. **Password tidak terupdate:**
   - Sistem ini masih development mode
   - Password disimpan di constant `PASSWORD` di `Login.jsx`
   - Untuk production, perlu integrasi dengan database

### Debug Commands
```bash
# Cek status server
curl http://localhost:3001/api/health

# Cek active tokens
curl http://localhost:3001/api/admin/reset-tokens

# Test email reset
curl -X POST http://localhost:3001/api/admin/request-password-reset \
  -H "Content-Type: application/json" \
  -d '{"email":"desa.moncongloebulu@gmail.com"}'
```

## 🔮 Future Improvements

### 1. Database Integration
- Simpan password hash di database
- Log history reset password
- Audit trail untuk keamanan

### 2. Enhanced Security
- Two-factor authentication
- IP-based restrictions
- Advanced rate limiting

### 3. User Management
- Multiple admin accounts
- Role-based permissions
- Password policies

### 4. Monitoring
- Email delivery tracking
- Failed reset attempts logging
- Security alerts

## 📚 References

- [Nodemailer Documentation](https://nodemailer.com/)
- [React Router v6](https://reactrouter.com/)
- [Express.js Security](https://expressjs.com/en/advanced/best-practices-security.html)
- [Email Security Best Practices](https://www.emailsecurity.com/)

## 👥 Support

Untuk bantuan teknis atau pertanyaan tentang sistem ini, silakan hubungi:
- **Tim IT Desa Moncongloe Bulu**
- **Email:** desa.moncongloebulu@gmail.com
- **WhatsApp:** [Nomor WhatsApp Tim IT]

---

**⚠️ Peringatan:** Sistem ini masih dalam tahap development. Untuk production use, pastikan semua fitur keamanan sudah diimplementasi dengan benar.

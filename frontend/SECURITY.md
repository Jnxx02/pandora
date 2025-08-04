# Sistem Keamanan Admin - Desa Moncongloe Bulu

## Fitur Keamanan yang Diimplementasikan

### 1. **Session Management yang Aman**
- **Session Storage**: Data session disimpan di `sessionStorage` yang akan terhapus saat tab ditutup
- **Session ID**: Setiap login menghasilkan session ID unik untuk validasi
- **Activity Tracking**: Sistem melacak aktivitas terakhir user untuk timeout
- **Auto Logout**: Session otomatis berakhir setelah 30 menit tidak aktif

### 2. **Rate Limiting & Brute Force Protection**
- **Maksimal 5 Percobaan Login**: Setelah 5 kali gagal, akun terkunci
- **Lockout Duration**: Akun terkunci selama 15 menit setelah melebihi batas
- **Persistent Lockout**: Status lockout disimpan di localStorage
- **Progressive Delay**: Semakin banyak percobaan, semakin lama delay

### 3. **Session Timeout & Auto Logout**
- **30 Menit Timeout**: Session berakhir setelah 30 menit tidak aktif
- **5 Menit Warning**: Peringatan muncul 5 menit sebelum timeout
- **Activity Monitoring**: Melacak mouse, keyboard, scroll, dan touch events
- **Auto Logout**: Logout otomatis saat tab ditutup atau refresh

### 4. **Validasi Session yang Ketat**
- **Multi-layer Validation**: 
  - Session data di sessionStorage
  - Session ID di localStorage
  - Timestamp validasi
- **Cross-tab Protection**: Session tidak bisa digunakan di tab lain
- **Tamper Detection**: Deteksi manipulasi data session

### 5. **UI/UX Security Features**
- **Loading States**: Indikator loading saat login untuk mencegah spam
- **Error Messages**: Pesan error yang informatif tanpa membocorkan informasi
- **Disabled States**: Form dinonaktifkan saat lockout atau loading
- **Visual Feedback**: Indikator visual untuk status keamanan

## Konfigurasi Keamanan

### Timeout Settings
```javascript
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 menit
const WARNING_TIME = 5 * 60 * 1000; // 5 menit warning
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 menit
```

### Session Data Structure
```javascript
{
  isAdmin: true,
  loginTime: Date.now(),
  sessionId: "unique_session_id",
  lastActivity: Date.now()
}
```

## Cara Kerja Sistem

### 1. **Login Process**
1. User memasukkan username/password
2. Sistem mengecek lockout status
3. Jika tidak terkunci, validasi credentials
4. Jika berhasil, buat session baru
5. Jika gagal, increment attempt counter
6. Jika mencapai limit, aktifkan lockout

### 2. **Session Validation**
1. Cek keberadaan session data
2. Validasi session ID
3. Cek timeout berdasarkan last activity
4. Update last activity jika valid
5. Redirect ke login jika invalid

### 3. **Activity Monitoring**
1. Event listeners untuk user activity
2. Update last activity timestamp
3. Periodic check setiap menit
4. Auto logout jika timeout
5. Cleanup listeners saat logout

## Best Practices yang Diimplementasikan

### 1. **Security Headers**
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options

### 2. **Input Validation**
- Client-side validation
- Server-side validation (jika ada backend)
- Sanitasi input

### 3. **Session Security**
- Tidak menyimpan password di storage
- Session ID yang unik
- Timeout yang reasonable
- Cross-tab protection

### 4. **Error Handling**
- Generic error messages
- Logging untuk debugging
- Graceful degradation

## Monitoring & Logging

### Events yang Dilacak
- Login attempts (success/failure)
- Session creation/destruction
- Timeout events
- Lockout activations

### Data yang Disimpan
- Login attempts count
- Lockout timestamps
- Session creation time
- Last activity time

## Rekomendasi Tambahan

### 1. **Backend Integration**
- Implementasi JWT tokens
- Server-side session validation
- Database logging

### 2. **Advanced Security**
- Two-factor authentication (2FA)
- IP-based restrictions
- Device fingerprinting
- Audit logging

### 3. **Monitoring**
- Real-time security alerts
- Failed login notifications
- Session analytics
- Security dashboard

## Troubleshooting

### Common Issues
1. **Session expired unexpectedly**
   - Cek browser activity
   - Verifikasi timeout settings
   - Clear browser cache

2. **Lockout not working**
   - Cek localStorage data
   - Verify lockout duration
   - Clear browser data

3. **Activity not detected**
   - Cek event listeners
   - Verify browser compatibility
   - Test with different browsers

## Maintenance

### Regular Tasks
- Monitor login attempts
- Review security logs
- Update timeout settings
- Test security features
- Backup security configurations

### Updates
- Keep dependencies updated
- Review security best practices
- Test new security features
- Document changes

---

**Dibuat oleh:** KKN-T 114 Moncongloe Bulu  
**Tanggal:** 2024  
**Versi:** 1.0 
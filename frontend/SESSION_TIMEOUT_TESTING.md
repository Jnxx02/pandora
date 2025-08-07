# 🧪 Session Timeout Testing Guide

## Cara Mengetes Session Timeout

### 1. **Mode Testing Manual**

Untuk mengetes session timeout dengan cepat:

1. **Buka file** `frontend/src/components/SessionTimeout.jsx`
2. **Ubah baris 8** dari:
   ```javascript
   const TESTING_MODE = false; // Set ke true untuk testing
   ```
   menjadi:
   ```javascript
   const TESTING_MODE = true; // Set ke true untuk testing
   ```

3. **Login sebagai admin** di `/admin/login`
4. **Tunggu 2 detik** - warning akan muncul otomatis
5. **Test button**:
   - Klik "Lanjutkan Session" - modal harus hilang
   - Klik "Logout" - harus redirect ke login page

### 2. **Mode Testing Real**

Untuk mengetes session timeout yang sebenarnya:

1. **Set TESTING_MODE = false**
2. **Login sebagai admin**
3. **Tunggu 25 menit** (atau ubah WARNING_TIME di baris 9)
4. **Warning akan muncul** setelah 25 menit tidak aktif
5. **Test button** seperti di atas

### 3. **Debug Console**

Buka **Developer Tools** (F12) dan lihat **Console** untuk debug info:

```
🔍 SessionTimeout Debug: {
  timeSinceActivity: "25 minutes",
  remainingTime: "5 minutes", 
  showWarning: true,
  remainingTime <= WARNING_TIME && remainingTime > 0: true,
  testingMode: false
}
```

### 4. **Cara Mempercepat Testing**

Untuk testing yang lebih cepat, ubah nilai di `SessionTimeout.jsx`:

```javascript
// Ubah ini untuk testing lebih cepat
const TEST_WARNING_TIME = 10 * 1000; // 10 detik
const SESSION_TIMEOUT = 30 * 1000; // 30 detik (untuk testing)
const WARNING_TIME = 5 * 1000; // 5 detik warning
```

### 5. **Troubleshooting**

**Masalah: Button tidak berfungsi**
- ✅ Perbaikan: Ditambahkan `focus:outline-none focus:ring-2`
- ✅ Perbaikan: Ditambahkan console.log untuk debugging
- ✅ Perbaikan: State management yang lebih baik

**Masalah: Modal tidak hilang**
- ✅ Perbaikan: `setShowWarning(false)` di `extendSession()`
- ✅ Perbaikan: Dependency array `[navigate, showWarning]`

**Masalah: Session tidak ter-extend**
- ✅ Perbaikan: Update `lastActivity` dengan `Date.now()`
- ✅ Perbaikan: Error handling yang lebih baik

### 6. **Expected Behavior**

✅ **Warning muncul** setelah 25 menit tidak aktif
✅ **Button "Lanjutkan Session"** - modal hilang, session ter-extend
✅ **Button "Logout"** - redirect ke login, clear session
✅ **Auto logout** setelah 30 menit tidak aktif
✅ **Console debug** menampilkan info session

### 7. **Testing Checklist**

- [ ] Login sebagai admin
- [ ] Tunggu warning muncul (2 detik di testing mode)
- [ ] Klik "Lanjutkan Session" - modal hilang
- [ ] Klik "Logout" - redirect ke login
- [ ] Check console untuk debug info
- [ ] Test auto logout setelah timeout

### 8. **Reset Session untuk Testing**

Untuk reset session dan test ulang:

```javascript
// Di browser console
sessionStorage.removeItem('adminSession');
localStorage.removeItem('adminLastLogin');
localStorage.removeItem('adminSessionId');
window.location.reload();
```

### 9. **Production Mode**

Setelah testing selesai, pastikan:

```javascript
const TESTING_MODE = false; // Set ke false untuk production
```

Dan nilai timeout kembali normal:
- SESSION_TIMEOUT: 30 menit
- WARNING_TIME: 5 menit sebelum timeout 
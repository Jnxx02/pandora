# Database Improvements untuk Tabel Pengaduan

## 📋 Overview

Dokumen ini menjelaskan perbaikan yang telah diterapkan pada tabel `pengaduan` di Supabase untuk mengoptimalkan penyimpanan dan pengelolaan data laporan warga.

## 🗄️ Struktur Tabel yang Diperbaiki

### Kolom Baru untuk Optimasi Gambar

```sql
-- Kolom baru untuk optimasi gambar
lampiran_size INTEGER, -- Ukuran file dalam bytes
lampiran_type TEXT, -- MIME type (image/jpeg, image/png, dll)
lampiran_compressed BOOLEAN DEFAULT false, -- Apakah gambar sudah dikompresi
lampiran_thumbnail_url TEXT, -- URL thumbnail untuk preview cepat
```

### Kolom Tracking untuk Deteksi Spam

```sql
-- Tracking fields untuk deteksi laporan fiktif
client_ip TEXT,
user_agent TEXT,
device_info JSONB,
session_id TEXT,
form_submission_time TIMESTAMP WITH TIME ZONE,
form_filling_duration INTEGER, -- dalam milidetik
verification_status TEXT DEFAULT 'unverified',
verification_notes TEXT,
risk_score INTEGER DEFAULT 0, -- 0-100, semakin tinggi semakin berisiko fiktif
```

## 🔧 Constraints dan Validasi

### Constraints Baru

```sql
-- Validasi ukuran lampiran
ALTER TABLE pengaduan 
ADD CONSTRAINT check_lampiran_size 
CHECK (lampiran_size IS NULL OR lampiran_size >= 0);

-- Validasi risk score
ALTER TABLE pengaduan 
ADD CONSTRAINT check_risk_score 
CHECK (risk_score >= 0 AND risk_score <= 100);

-- Validasi form filling duration
ALTER TABLE pengaduan 
ADD CONSTRAINT check_form_filling_duration 
CHECK (form_filling_duration IS NULL OR form_filling_duration >= 0);
```

## 📊 Index untuk Performance

### Index Baru

```sql
-- Index untuk optimasi gambar
CREATE INDEX idx_pengaduan_lampiran_size ON pengaduan(lampiran_size);
CREATE INDEX idx_pengaduan_lampiran_compressed ON pengaduan(lampiran_compressed);

-- Index untuk query yang sering digunakan
CREATE INDEX idx_pengaduan_risk_score ON pengaduan(risk_score);
CREATE INDEX idx_pengaduan_verification_status ON pengaduan(verification_status);
CREATE INDEX idx_pengaduan_tanggal_kejadian ON pengaduan(tanggal_kejadian);
CREATE INDEX idx_pengaduan_whatsapp ON pengaduan(whatsapp);
```

## 🎯 Functions untuk Analytics

### 1. Statistik Lampiran
```sql
CREATE OR REPLACE FUNCTION get_lampiran_stats()
RETURNS TABLE (
  total_pengaduan BIGINT,
  with_lampiran BIGINT,
  without_lampiran BIGINT,
  avg_size NUMERIC,
  max_size BIGINT,
  compressed_count BIGINT,
  uncompressed_count BIGINT
)
```

### 2. Pengaduan Berisiko Tinggi
```sql
CREATE OR REPLACE FUNCTION get_high_risk_pengaduan(threshold INTEGER DEFAULT 50)
RETURNS TABLE (
  id UUID,
  nama TEXT,
  judul TEXT,
  risk_score INTEGER,
  verification_status TEXT,
  created_at TIMESTAMP WITH TIME ZONE
)
```

### 3. Statistik Berdasarkan Periode
```sql
CREATE OR REPLACE FUNCTION get_pengaduan_stats_by_period(
  start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  total_pengaduan BIGINT,
  pengaduan_count BIGINT,
  aspirasi_count BIGINT,
  pending_count BIGINT,
  proses_count BIGINT,
  selesai_count BIGINT,
  with_lampiran BIGINT,
  avg_risk_score NUMERIC
)
```

### 4. Export Data
```sql
CREATE OR REPLACE FUNCTION export_pengaduan_data(
  start_date DATE DEFAULT NULL,
  end_date DATE DEFAULT NULL,
  status_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
  id TEXT,
  nama TEXT,
  email TEXT,
  whatsapp TEXT,
  klasifikasi TEXT,
  judul TEXT,
  kategori TEXT,
  status TEXT,
  tanggal_pengaduan TEXT,
  tanggal_ditangani TEXT,
  risk_score INTEGER,
  verification_status TEXT,
  lampiran_info TEXT,
  lampiran_size INTEGER
)
```

### 5. Rekomendasi Aksi
```sql
CREATE OR REPLACE FUNCTION get_action_recommendation(pengaduan_id UUID)
RETURNS TEXT
```

## 🔄 Triggers untuk Auto-Update

### Auto-Update Verification Status
```sql
CREATE OR REPLACE FUNCTION update_verification_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-verify jika ada kontak info dan bukan anonim
  IF NEW.email IS NOT NULL OR NEW.whatsapp IS NOT NULL THEN
    IF NEW.nama != 'Anonim' THEN
      NEW.verification_status = 'verified';
    END IF;
  END IF;
  
  -- Auto-verify jika risk score rendah
  IF NEW.risk_score < 20 THEN
    NEW.verification_status = 'verified';
  END IF;
  
  -- Mark as failed jika risk score sangat tinggi
  IF NEW.risk_score > 80 THEN
    NEW.verification_status = 'failed';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## 📈 Views untuk Dashboard

### View Dashboard Admin
```sql
CREATE OR REPLACE VIEW pengaduan_dashboard AS
SELECT 
  p.*,
  CASE 
    WHEN p.risk_score >= 70 THEN 'Sangat Tinggi'
    WHEN p.risk_score >= 50 THEN 'Tinggi'
    WHEN p.risk_score >= 30 THEN 'Sedang'
    WHEN p.risk_score >= 10 THEN 'Rendah'
    ELSE 'Sangat Rendah'
  END as risk_level,
  CASE 
    WHEN p.lampiran_size IS NULL THEN 'Tidak ada'
    WHEN p.lampiran_size < 1024 THEN 'Kecil (< 1KB)'
    WHEN p.lampiran_size < 10240 THEN 'Sedang (1-10KB)'
    WHEN p.lampiran_size < 102400 THEN 'Besar (10-100KB)'
    ELSE 'Sangat Besar (> 100KB)'
  END as attachment_size_category,
  EXTRACT(DAYS FROM CURRENT_DATE - p.tanggal_pengaduan::DATE) as days_since_submission
FROM pengaduan p;
```

## 🚀 API Endpoints Baru

### 1. High Risk Pengaduan
```
GET /api/pengaduan/high-risk?threshold=50
```

### 2. Statistik Periode
```
GET /api/pengaduan/stats/period?start_date=2024-01-01&end_date=2024-01-31
```

### 3. Rekomendasi Aksi
```
GET /api/pengaduan/:id/recommendation
```

### 4. Export Data
```
GET /api/pengaduan/export?start_date=2024-01-01&end_date=2024-01-31&status_filter=pending
```

## 🔧 Cara Menerapkan Perubahan

### 1. Jalankan Migration Script
```bash
# Buka Supabase SQL Editor
# Jalankan script dari file pengaduan_table.sql
```

### 2. Verifikasi Perubahan
```sql
-- Cek struktur tabel
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'pengaduan' 
ORDER BY ordinal_position;

-- Cek functions yang dibuat
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name LIKE '%pengaduan%';

-- Cek views
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public';
```

### 3. Test Functions
```sql
-- Test statistik lampiran
SELECT * FROM get_lampiran_stats();

-- Test pengaduan berisiko tinggi
SELECT * FROM get_high_risk_pengaduan(50);

-- Test statistik periode
SELECT * FROM get_pengaduan_stats_by_period();

-- Test export data
SELECT * FROM export_pengaduan_data();
```

## 📊 Manfaat Perbaikan

### 1. Performance
- **Index yang optimal** untuk query yang sering digunakan
- **Constraint validation** untuk data integrity
- **Efficient queries** dengan functions yang dioptimasi

### 2. Security
- **Risk scoring** untuk deteksi spam
- **Verification status** otomatis
- **Data validation** yang ketat

### 3. Analytics
- **Comprehensive statistics** untuk monitoring
- **Period-based analysis** untuk trend
- **Export capabilities** untuk reporting

### 4. User Experience
- **Better image handling** dengan metadata
- **Auto-compression** tracking
- **Smart recommendations** untuk admin

## ⚠️ Catatan Penting

1. **Backup Data** sebelum menjalankan migration
2. **Test di Environment Development** terlebih dahulu
3. **Monitor Performance** setelah perubahan
4. **Update Frontend** untuk menggunakan endpoint baru
5. **Documentation** untuk tim development

## 🔄 Rollback Plan

Jika perlu rollback, gunakan script berikut:

```sql
-- Hapus functions
DROP FUNCTION IF EXISTS get_lampiran_stats();
DROP FUNCTION IF EXISTS get_high_risk_pengaduan(INTEGER);
DROP FUNCTION IF EXISTS get_pengaduan_stats_by_period(DATE, DATE);
DROP FUNCTION IF EXISTS export_pengaduan_data(DATE, DATE, TEXT);
DROP FUNCTION IF EXISTS get_action_recommendation(UUID);
DROP FUNCTION IF EXISTS update_verification_status();

-- Hapus views
DROP VIEW IF EXISTS pengaduan_dashboard;
DROP VIEW IF EXISTS pengaduan_with_image_info;

-- Hapus triggers
DROP TRIGGER IF EXISTS trigger_update_verification_status ON pengaduan;

-- Hapus constraints
ALTER TABLE pengaduan DROP CONSTRAINT IF EXISTS check_lampiran_size;
ALTER TABLE pengaduan DROP CONSTRAINT IF EXISTS check_risk_score;
ALTER TABLE pengaduan DROP CONSTRAINT IF EXISTS check_form_filling_duration;

-- Hapus indexes
DROP INDEX IF EXISTS idx_pengaduan_lampiran_size;
DROP INDEX IF EXISTS idx_pengaduan_lampiran_compressed;
DROP INDEX IF EXISTS idx_pengaduan_risk_score;
DROP INDEX IF EXISTS idx_pengaduan_verification_status;
DROP INDEX IF EXISTS idx_pengaduan_tanggal_kejadian;
DROP INDEX IF EXISTS idx_pengaduan_whatsapp;
``` 
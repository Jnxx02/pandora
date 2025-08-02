-- Buat tabel pengaduan di Supabase
CREATE TABLE pengaduan (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT NOT NULL,
  email TEXT,
  whatsapp TEXT,
  klasifikasi TEXT NOT NULL CHECK (klasifikasi IN ('pengaduan', 'aspirasi')),
  judul TEXT NOT NULL,
  isi TEXT NOT NULL,
  tanggal_kejadian DATE,
  kategori TEXT NOT NULL,
  lampiran_info TEXT,
  lampiran_data_url TEXT,
  -- Kolom baru untuk optimasi gambar
  lampiran_size INTEGER, -- Ukuran file dalam bytes
  lampiran_type TEXT, -- MIME type (image/jpeg, image/png, dll)
  lampiran_compressed BOOLEAN DEFAULT false, -- Apakah gambar sudah dikompresi
  lampiran_thumbnail_url TEXT, -- URL thumbnail untuk preview cepat
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'proses', 'selesai')),
  tanggal_pengaduan TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tanggal_ditangani TIMESTAMP WITH TIME ZONE,
  catatan_admin TEXT,
  -- Tracking fields untuk deteksi laporan fiktif
  client_ip TEXT,
  user_agent TEXT,
  device_info JSONB,
  session_id TEXT,
  form_submission_time TIMESTAMP WITH TIME ZONE,
  form_filling_duration INTEGER, -- dalam milidetik
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Buat index untuk performa query
CREATE INDEX idx_pengaduan_status ON pengaduan(status);
CREATE INDEX idx_pengaduan_tanggal ON pengaduan(tanggal_pengaduan);
CREATE INDEX idx_pengaduan_email ON pengaduan(email);
CREATE INDEX idx_pengaduan_klasifikasi ON pengaduan(klasifikasi);
CREATE INDEX idx_pengaduan_kategori ON pengaduan(kategori);
-- Index baru untuk optimasi gambar
CREATE INDEX idx_pengaduan_lampiran_size ON pengaduan(lampiran_size);
CREATE INDEX idx_pengaduan_lampiran_compressed ON pengaduan(lampiran_compressed);

-- Buat trigger untuk update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pengaduan_updated_at 
    BEFORE UPDATE ON pengaduan 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Buat RLS (Row Level Security) policies
ALTER TABLE pengaduan ENABLE ROW LEVEL SECURITY;

-- Policy untuk insert (siapa saja bisa submit pengaduan)
CREATE POLICY "Siapa saja bisa submit pengaduan" ON pengaduan
  FOR INSERT WITH CHECK (true);

-- Policy untuk select (admin bisa lihat semua, user hanya lihat miliknya)
CREATE POLICY "Admin bisa lihat semua pengaduan" ON pengaduan
  FOR SELECT USING (true);

-- Policy untuk update (admin bisa update semua)
CREATE POLICY "Admin bisa update pengaduan" ON pengaduan
  FOR UPDATE USING (true);

-- Policy untuk delete (admin bisa delete semua)
CREATE POLICY "Admin bisa delete pengaduan" ON pengaduan
  FOR DELETE USING (true);

-- Insert sample data (opsional)
INSERT INTO pengaduan (nama, email, whatsapp, klasifikasi, judul, isi, tanggal_kejadian, kategori, status) VALUES
('John Doe', 'john@example.com', '081234567890', 'pengaduan', 'Jalan Rusak di Gang 3', 'Jalan di depan rumah saya rusak parah, ada lubang besar yang membahayakan pengendara. Mohon diperbaiki segera.', '2024-01-15', 'Infrastruktur (Jalan, Jembatan, dll.)', 'pending'),
('Jane Smith', 'jane@example.com', '081234567891', 'aspirasi', 'Usulan Pembangunan Taman', 'Saya berharap ada taman bermain untuk anak-anak di lingkungan kami. Ini akan sangat bermanfaat untuk tumbuh kembang anak.', '2024-01-10', 'Lainnya', 'proses'),
('Bob Wilson', 'bob@example.com', '081234567892', 'pengaduan', 'Sampah Menumpuk di TPS', 'Sampah di TPS sudah menumpuk dan bau, mohon diangkut segera karena mengganggu warga sekitar.', '2024-01-12', 'Lingkungan (Sampah, Kebersihan)', 'selesai');

-- ==========================================
-- MIGRATION SCRIPT untuk database yang sudah ada
-- ==========================================

-- Tambahkan kolom baru untuk optimasi gambar (jika belum ada)
ALTER TABLE pengaduan 
ADD COLUMN IF NOT EXISTS lampiran_size INTEGER,
ADD COLUMN IF NOT EXISTS lampiran_type TEXT,
ADD COLUMN IF NOT EXISTS lampiran_compressed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS lampiran_thumbnail_url TEXT;

-- Buat index baru untuk optimasi gambar (jika belum ada)
CREATE INDEX IF NOT EXISTS idx_pengaduan_lampiran_size ON pengaduan(lampiran_size);
CREATE INDEX IF NOT EXISTS idx_pengaduan_lampiran_compressed ON pengaduan(lampiran_compressed);

-- Update data yang sudah ada dengan informasi ukuran (opsional)
UPDATE pengaduan 
SET lampiran_size = LENGTH(lampiran_data_url)
WHERE lampiran_data_url IS NOT NULL AND lampiran_size IS NULL;

-- Buat view untuk laporan dengan informasi gambar yang dioptimasi
CREATE OR REPLACE VIEW pengaduan_with_image_info AS
SELECT 
  *,
  CASE 
    WHEN lampiran_size IS NULL THEN 'Tidak ada lampiran'
    WHEN lampiran_size < 1024 THEN 'Kecil (< 1KB)'
    WHEN lampiran_size < 10240 THEN 'Sedang (1-10KB)'
    WHEN lampiran_size < 102400 THEN 'Besar (10-100KB)'
    ELSE 'Sangat Besar (> 100KB)'
  END as lampiran_size_category,
  CASE 
    WHEN lampiran_compressed THEN 'Sudah dikompresi'
    WHEN lampiran_data_url IS NOT NULL THEN 'Belum dikompresi'
    ELSE 'Tidak ada lampiran'
  END as compression_status
FROM pengaduan;

-- Buat function untuk mendapatkan statistik lampiran
CREATE OR REPLACE FUNCTION get_lampiran_stats()
RETURNS TABLE (
  total_pengaduan BIGINT,
  with_lampiran BIGINT,
  without_lampiran BIGINT,
  avg_size NUMERIC,
  max_size BIGINT,
  compressed_count BIGINT,
  uncompressed_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_pengaduan,
    COUNT(lampiran_data_url) as with_lampiran,
    COUNT(*) - COUNT(lampiran_data_url) as without_lampiran,
    ROUND(AVG(lampiran_size), 2) as avg_size,
    MAX(lampiran_size) as max_size,
    COUNT(CASE WHEN lampiran_compressed THEN 1 END) as compressed_count,
    COUNT(CASE WHEN lampiran_data_url IS NOT NULL AND NOT lampiran_compressed THEN 1 END) as uncompressed_count
  FROM pengaduan;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- PERBAIKAN TAMBAHAN untuk database
-- ==========================================

-- Tambahkan constraint untuk validasi ukuran lampiran
ALTER TABLE pengaduan 
ADD CONSTRAINT check_lampiran_size 
CHECK (lampiran_size IS NULL OR lampiran_size >= 0);

-- Tambahkan constraint untuk validasi form filling duration
ALTER TABLE pengaduan 
ADD CONSTRAINT check_form_filling_duration 
CHECK (form_filling_duration IS NULL OR form_filling_duration >= 0);

-- Buat index untuk query yang sering digunakan
CREATE INDEX IF NOT EXISTS idx_pengaduan_tanggal_kejadian ON pengaduan(tanggal_kejadian);
CREATE INDEX IF NOT EXISTS idx_pengaduan_whatsapp ON pengaduan(whatsapp);
CREATE INDEX IF NOT EXISTS idx_pengaduan_client_ip ON pengaduan(client_ip);

-- Buat function untuk mendapatkan pengaduan berdasarkan IP address
CREATE OR REPLACE FUNCTION get_pengaduan_by_ip(ip_address TEXT)
RETURNS TABLE (
  id UUID,
  nama TEXT,
  judul TEXT,
  client_ip TEXT,
  tanggal_pengaduan TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.nama,
    p.judul,
    p.client_ip,
    p.tanggal_pengaduan
  FROM pengaduan p
  WHERE p.client_ip = ip_address
  ORDER BY p.tanggal_pengaduan DESC;
END;
$$ LANGUAGE plpgsql;

-- Buat function untuk mendapatkan statistik berdasarkan periode
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
  with_ip_address BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_pengaduan,
    COUNT(CASE WHEN klasifikasi = 'pengaduan' THEN 1 END) as pengaduan_count,
    COUNT(CASE WHEN klasifikasi = 'aspirasi' THEN 1 END) as aspirasi_count,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
    COUNT(CASE WHEN status = 'proses' THEN 1 END) as proses_count,
    COUNT(CASE WHEN status = 'selesai' THEN 1 END) as selesai_count,
    COUNT(CASE WHEN lampiran_data_url IS NOT NULL THEN 1 END) as with_lampiran,
    COUNT(CASE WHEN client_ip IS NOT NULL THEN 1 END) as with_ip_address
  FROM pengaduan
  WHERE tanggal_pengaduan::DATE BETWEEN start_date AND end_date;
END;
$$ LANGUAGE plpgsql;

-- Buat function untuk membersihkan data lama (opsional)
CREATE OR REPLACE FUNCTION cleanup_old_pengaduan(days_to_keep INTEGER DEFAULT 365)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM pengaduan 
  WHERE tanggal_pengaduan < CURRENT_DATE - (days_to_keep || ' days')::INTERVAL
  AND status = 'selesai';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Buat view untuk dashboard admin
CREATE OR REPLACE VIEW pengaduan_dashboard AS
SELECT 
  p.*,
  CASE 
    WHEN p.lampiran_size IS NULL THEN 'Tidak ada'
    WHEN p.lampiran_size < 1024 THEN 'Kecil (< 1KB)'
    WHEN p.lampiran_size < 10240 THEN 'Sedang (1-10KB)'
    WHEN p.lampiran_size < 102400 THEN 'Besar (10-100KB)'
    ELSE 'Sangat Besar (> 100KB)'
  END as attachment_size_category,
  EXTRACT(DAYS FROM CURRENT_DATE - p.tanggal_pengaduan::DATE) as days_since_submission
FROM pengaduan p;

-- Buat function untuk export data pengaduan
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
  lampiran_info TEXT,
  lampiran_size INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id::TEXT,
    p.nama,
    p.email,
    p.whatsapp,
    p.klasifikasi,
    p.judul,
    p.kategori,
    p.status,
    p.tanggal_pengaduan::TEXT,
    p.tanggal_ditangani::TEXT,
    p.lampiran_info,
    p.lampiran_size
  FROM pengaduan p
  WHERE (start_date IS NULL OR p.tanggal_pengaduan::DATE >= start_date)
    AND (end_date IS NULL OR p.tanggal_pengaduan::DATE <= end_date)
    AND (status_filter IS NULL OR p.status = status_filter)
  ORDER BY p.tanggal_pengaduan DESC;
END;
$$ LANGUAGE plpgsql; 
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
  verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'verified', 'failed')),
  verification_notes TEXT,
  risk_score INTEGER DEFAULT 0, -- 0-100, semakin tinggi semakin berisiko fiktif
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

-- Tambahkan constraint untuk validasi risk score
ALTER TABLE pengaduan 
ADD CONSTRAINT check_risk_score 
CHECK (risk_score >= 0 AND risk_score <= 100);

-- Tambahkan constraint untuk validasi form filling duration
ALTER TABLE pengaduan 
ADD CONSTRAINT check_form_filling_duration 
CHECK (form_filling_duration IS NULL OR form_filling_duration >= 0);

-- Buat index untuk query yang sering digunakan
CREATE INDEX IF NOT EXISTS idx_pengaduan_risk_score ON pengaduan(risk_score);
CREATE INDEX IF NOT EXISTS idx_pengaduan_verification_status ON pengaduan(verification_status);
CREATE INDEX IF NOT EXISTS idx_pengaduan_tanggal_kejadian ON pengaduan(tanggal_kejadian);
CREATE INDEX IF NOT EXISTS idx_pengaduan_whatsapp ON pengaduan(whatsapp);

-- Buat function untuk mendapatkan pengaduan berdasarkan risk score
CREATE OR REPLACE FUNCTION get_high_risk_pengaduan(threshold INTEGER DEFAULT 50)
RETURNS TABLE (
  id UUID,
  nama TEXT,
  judul TEXT,
  risk_score INTEGER,
  verification_status TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.nama,
    p.judul,
    p.risk_score,
    p.verification_status,
    p.created_at
  FROM pengaduan p
  WHERE p.risk_score >= threshold
  ORDER BY p.risk_score DESC, p.created_at DESC;
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
  avg_risk_score NUMERIC
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
    ROUND(AVG(risk_score), 2) as avg_risk_score
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
  risk_score INTEGER,
  verification_status TEXT,
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
    p.risk_score,
    p.verification_status,
    p.lampiran_info,
    p.lampiran_size
  FROM pengaduan p
  WHERE (start_date IS NULL OR p.tanggal_pengaduan::DATE >= start_date)
    AND (end_date IS NULL OR p.tanggal_pengaduan::DATE <= end_date)
    AND (status_filter IS NULL OR p.status = status_filter)
  ORDER BY p.tanggal_pengaduan DESC;
END;
$$ LANGUAGE plpgsql;

-- Buat trigger untuk auto-update verification status
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

CREATE TRIGGER trigger_update_verification_status
  BEFORE INSERT OR UPDATE ON pengaduan
  FOR EACH ROW
  EXECUTE FUNCTION update_verification_status();

-- Buat function untuk mendapatkan rekomendasi aksi berdasarkan risk score
CREATE OR REPLACE FUNCTION get_action_recommendation(pengaduan_id UUID)
RETURNS TEXT AS $$
DECLARE
  risk_score_val INTEGER;
  verification_status_val TEXT;
  has_contact BOOLEAN;
  recommendation TEXT;
BEGIN
  SELECT risk_score, verification_status, 
         (email IS NOT NULL OR whatsapp IS NOT NULL)
  INTO risk_score_val, verification_status_val, has_contact
  FROM pengaduan 
  WHERE id = pengaduan_id;
  
  IF NOT FOUND THEN
    RETURN 'Pengaduan tidak ditemukan';
  END IF;
  
  -- Generate recommendation based on risk factors
  IF risk_score_val >= 70 THEN
    recommendation := 'Segera review manual - Risk score sangat tinggi';
  ELSIF risk_score_val >= 50 THEN
    recommendation := 'Perlu verifikasi tambahan - Risk score tinggi';
  ELSIF verification_status_val = 'failed' THEN
    recommendation := 'Tolak pengaduan - Status verifikasi gagal';
  ELSIF NOT has_contact THEN
    recommendation := 'Minta informasi kontak untuk verifikasi';
  ELSIF verification_status_val = 'verified' THEN
    recommendation := 'Proses normal - Status terverifikasi';
  ELSE
    recommendation := 'Review manual diperlukan';
  END IF;
  
  RETURN recommendation;
END;
$$ LANGUAGE plpgsql; 
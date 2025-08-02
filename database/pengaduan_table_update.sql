-- Update script untuk tabel pengaduan yang sudah ada
-- Jalankan script ini di Supabase SQL Editor

-- 1. Tambahkan kolom tracking yang belum ada
ALTER TABLE pengaduan 
ADD COLUMN IF NOT EXISTS client_ip TEXT,
ADD COLUMN IF NOT EXISTS user_agent TEXT,
ADD COLUMN IF NOT EXISTS device_info JSONB,
ADD COLUMN IF NOT EXISTS session_id TEXT,
ADD COLUMN IF NOT EXISTS form_submission_time TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS form_filling_duration INTEGER,
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'verified', 'failed')),
ADD COLUMN IF NOT EXISTS verification_notes TEXT,
ADD COLUMN IF NOT EXISTS risk_score INTEGER DEFAULT 0;

-- 2. Buat index untuk field tracking baru
CREATE INDEX IF NOT EXISTS idx_pengaduan_client_ip ON pengaduan(client_ip);
CREATE INDEX IF NOT EXISTS idx_pengaduan_session_id ON pengaduan(session_id);
CREATE INDEX IF NOT EXISTS idx_pengaduan_verification_status ON pengaduan(verification_status);
CREATE INDEX IF NOT EXISTS idx_pengaduan_risk_score ON pengaduan(risk_score);

-- 3. Update sample data untuk menggunakan field whatsapp
UPDATE pengaduan 
SET whatsapp = telepon 
WHERE telepon IS NOT NULL AND whatsapp IS NULL;

-- 4. Hapus kolom telepon jika sudah tidak digunakan (opsional)
-- ALTER TABLE pengaduan DROP COLUMN IF EXISTS telepon;

-- 5. Verifikasi struktur tabel
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'pengaduan' 
ORDER BY ordinal_position; 
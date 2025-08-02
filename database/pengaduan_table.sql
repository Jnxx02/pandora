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
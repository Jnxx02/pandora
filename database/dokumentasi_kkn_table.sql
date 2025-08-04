-- Tabel Dokumentasi KKN
-- Untuk menyimpan data modul, buku panduan, dan template spreadsheet

CREATE TABLE IF NOT EXISTS dokumentasi_kkn (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    author TEXT NOT NULL DEFAULT 'KKN-T 114 Moncongloe Bulu',
    category TEXT NOT NULL CHECK (category IN ('modul', 'buku_panduan', 'template')),
    file_size TEXT,
    downloads INTEGER DEFAULT 0,
    thumbnail_url TEXT,
    download_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index untuk optimasi query
CREATE INDEX IF NOT EXISTS idx_dokumentasi_kkn_category ON dokumentasi_kkn(category);
CREATE INDEX IF NOT EXISTS idx_dokumentasi_kkn_is_active ON dokumentasi_kkn(is_active);
CREATE INDEX IF NOT EXISTS idx_dokumentasi_kkn_created_at ON dokumentasi_kkn(created_at);
CREATE INDEX IF NOT EXISTS idx_dokumentasi_kkn_downloads ON dokumentasi_kkn(downloads);

-- Trigger untuk update updated_at
CREATE OR REPLACE FUNCTION update_dokumentasi_kkn_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_dokumentasi_kkn_updated_at
    BEFORE UPDATE ON dokumentasi_kkn
    FOR EACH ROW
    EXECUTE FUNCTION update_dokumentasi_kkn_updated_at();

-- Function untuk increment downloads
CREATE OR REPLACE FUNCTION increment_dokumentasi_downloads(doc_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE dokumentasi_kkn 
    SET downloads = downloads + 1 
    WHERE id = doc_id;
END;
$$ LANGUAGE plpgsql;

-- Insert data awal (Template BUMDes)
INSERT INTO dokumentasi_kkn (
    title,
    description,
    author,
    category,
    file_size,
    downloads,
    thumbnail_url,
    download_url
) VALUES (
    'Template BUMDes (Badan Usaha Milik Desa)',
    'Template spreadsheet untuk pengelolaan BUMDes yang lengkap dan terstruktur',
    'KKN-T 114 Moncongloe Bulu',
    'template',
    '1.2 MB',
    89,
    '/images/dokumentasi/template-bumdes.jpg',
    'https://docs.google.com/spreadsheets/d/1KvX4oxlQra7IURkn4V6L8GNskuMhJUk0KMQW12uyoK4/edit?gid=1160742352#gid=1160742352'
) ON CONFLICT (id) DO NOTHING;

-- RLS (Row Level Security) - jika diperlukan
-- ALTER TABLE dokumentasi_kkn ENABLE ROW LEVEL SECURITY;

-- Policy untuk read access (public)
-- CREATE POLICY "Allow public read access" ON dokumentasi_kkn
--     FOR SELECT USING (is_active = true);

-- Policy untuk admin access (jika diperlukan)
-- CREATE POLICY "Allow admin full access" ON dokumentasi_kkn
--     FOR ALL USING (auth.role() = 'admin'); 
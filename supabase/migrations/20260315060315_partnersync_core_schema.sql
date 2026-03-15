-- PartnerSync SIM Kerja Sama - Pelindo Regional 2
-- Migration: Core database schema for all modules
-- Timestamp: 20260315060315

-- ============================================================
-- STEP 1: ENUM TYPES
-- ============================================================

DROP TYPE IF EXISTS public.jenis_kontrak_type CASCADE;
CREATE TYPE public.jenis_kontrak_type AS ENUM (
  'MoU', 'PKS', 'Perjanjian Kerjasama', 'Addendum', 'TUKS', 'Pemanfaatan Lahan'
);

DROP TYPE IF EXISTS public.kontrak_status_type CASCADE;
CREATE TYPE public.kontrak_status_type AS ENUM (
  'Draft', 'Review Legal', 'Approval SM/ED', 'Aktif', 'Mendekati Akhir', 'Expired', 'Renewal'
);

DROP TYPE IF EXISTS public.partner_status_type CASCADE;
CREATE TYPE public.partner_status_type AS ENUM (
  'Lead', 'Pra-Kualifikasi', 'Negosiasi', 'Mitra Aktif', 'Evaluasi', 'Penutupan'
);

DROP TYPE IF EXISTS public.segmen_bisnis_type CASCADE;
CREATE TYPE public.segmen_bisnis_type AS ENUM (
  'Logistik', 'Migas', 'Perdagangan', 'Kepelabuhanan', 'Utilitas', 'Industri'
);

DROP TYPE IF EXISTS public.rating_k3_type CASCADE;
CREATE TYPE public.rating_k3_type AS ENUM ('A', 'B', 'C', 'D');

DROP TYPE IF EXISTS public.lead_status_type CASCADE;
CREATE TYPE public.lead_status_type AS ENUM (
  'Baru', 'Kualifikasi', 'Presentasi', 'Negosiasi', 'Menang', 'Kalah', 'Ditunda'
);

DROP TYPE IF EXISTS public.lead_source_type CASCADE;
CREATE TYPE public.lead_source_type AS ENUM (
  'Referral Internal', 'Pameran & Event', 'Inbound Website',
  'Cold Outreach', 'Tender Pemerintah', 'Rekomendasi Mitra'
);

DROP TYPE IF EXISTS public.lead_priority_type CASCADE;
CREATE TYPE public.lead_priority_type AS ENUM ('Tinggi', 'Sedang', 'Rendah');

DROP TYPE IF EXISTS public.negotiation_stage_type CASCADE;
CREATE TYPE public.negotiation_stage_type AS ENUM (
  'Proposal', 'Diskusi', 'Review Syarat', 'Persetujuan'
);

DROP TYPE IF EXISTS public.negotiation_status_type CASCADE;
CREATE TYPE public.negotiation_status_type AS ENUM (
  'Aktif', 'Ditunda', 'Selesai', 'Dibatalkan'
);

DROP TYPE IF EXISTS public.activity_type CASCADE;
CREATE TYPE public.activity_type AS ENUM (
  'upload', 'approval', 'alert', 'reminder', 'renewal', 'create', 'review'
);

-- ============================================================
-- STEP 2: CORE TABLES
-- ============================================================

-- Partners table
CREATE TABLE IF NOT EXISTS public.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_perusahaan TEXT NOT NULL,
  npwp TEXT,
  segmen_bisnis public.segmen_bisnis_type NOT NULL DEFAULT 'Logistik',
  pic_internal TEXT,
  kontrak_aktif INTEGER DEFAULT 0,
  total_nilai_kontrak BIGINT DEFAULT 0,
  compliance_score INTEGER DEFAULT 0,
  status public.partner_status_type NOT NULL DEFAULT 'Lead',
  skor_peluang INTEGER DEFAULT 0,
  region TEXT,
  kontak_utama TEXT,
  jabatan_kontak TEXT,
  email TEXT,
  telepon TEXT,
  alamat TEXT,
  bergabung_sejak DATE,
  last_interaction DATE,
  rating_k3 public.rating_k3_type DEFAULT 'B',
  total_kontrak INTEGER DEFAULT 0,
  renewal_rate NUMERIC(5,2) DEFAULT 0,
  catatan TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Contracts table
CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nomor_kontrak TEXT NOT NULL UNIQUE,
  mitra TEXT NOT NULL,
  mitra_id UUID REFERENCES public.partners(id) ON DELETE SET NULL,
  jenis_kontrak public.jenis_kontrak_type NOT NULL DEFAULT 'PKS',
  nilai_kontrak BIGINT DEFAULT 0,
  tanggal_mulai DATE,
  tanggal_akhir DATE,
  sisa_hari INTEGER DEFAULT 0,
  status public.kontrak_status_type NOT NULL DEFAULT 'Draft',
  compliance_score INTEGER DEFAULT 0,
  missing_clauses TEXT[] DEFAULT '{}',
  pic_internal TEXT,
  region TEXT,
  kategori TEXT,
  pnbp_value BIGINT DEFAULT 0,
  last_updated DATE,
  keterangan TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Leads table
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_perusahaan TEXT NOT NULL,
  kontak_utama TEXT,
  jabatan TEXT,
  email TEXT,
  telepon TEXT,
  segmen public.segmen_bisnis_type NOT NULL DEFAULT 'Logistik',
  region TEXT,
  source public.lead_source_type NOT NULL DEFAULT 'Cold Outreach',
  status public.lead_status_type NOT NULL DEFAULT 'Baru',
  priority public.lead_priority_type NOT NULL DEFAULT 'Sedang',
  skor_lead INTEGER DEFAULT 0,
  estimasi_nilai BIGINT DEFAULT 0,
  pic_internal TEXT,
  tanggal_masuk DATE,
  last_activity DATE,
  next_action TEXT,
  next_action_date DATE,
  catatan TEXT,
  jenis_kontrak_target TEXT,
  probabilitas INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Negotiations table
CREATE TABLE IF NOT EXISTS public.negotiations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judul TEXT NOT NULL,
  mitra TEXT NOT NULL,
  partner_id UUID REFERENCES public.partners(id) ON DELETE SET NULL,
  stage public.negotiation_stage_type NOT NULL DEFAULT 'Proposal',
  status public.negotiation_status_type NOT NULL DEFAULT 'Aktif',
  pic_internal TEXT,
  region TEXT,
  nilai_estimasi BIGINT DEFAULT 0,
  tanggal_mulai DATE,
  target_selesai DATE,
  progress INTEGER DEFAULT 0,
  catatan TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  activity_type public.activity_type NOT NULL DEFAULT 'create',
  title TEXT NOT NULL,
  description TEXT,
  user_name TEXT,
  kontrak_id UUID REFERENCES public.contracts(id) ON DELETE SET NULL,
  mitra_name TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- STEP 3: INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_contracts_mitra_id ON public.contracts(mitra_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON public.contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_tanggal_akhir ON public.contracts(tanggal_akhir);
CREATE INDEX IF NOT EXISTS idx_partners_status ON public.partners(status);
CREATE INDEX IF NOT EXISTS idx_partners_segmen ON public.partners(segmen_bisnis);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_priority ON public.leads(priority);
CREATE INDEX IF NOT EXISTS idx_negotiations_stage ON public.negotiations(stage);
CREATE INDEX IF NOT EXISTS idx_negotiations_partner_id ON public.negotiations(partner_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON public.activity_logs(timestamp DESC);

-- ============================================================
-- STEP 4: UPDATED_AT TRIGGER FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

-- ============================================================
-- STEP 5: ENABLE RLS
-- ============================================================

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.negotiations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- STEP 6: RLS POLICIES (open access for internal app)
-- ============================================================

DROP POLICY IF EXISTS "open_access_partners" ON public.partners;
CREATE POLICY "open_access_partners" ON public.partners FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "open_access_contracts" ON public.contracts;
CREATE POLICY "open_access_contracts" ON public.contracts FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "open_access_leads" ON public.leads;
CREATE POLICY "open_access_leads" ON public.leads FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "open_access_negotiations" ON public.negotiations;
CREATE POLICY "open_access_negotiations" ON public.negotiations FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "open_access_activity_logs" ON public.activity_logs;
CREATE POLICY "open_access_activity_logs" ON public.activity_logs FOR ALL TO public USING (true) WITH CHECK (true);

-- ============================================================
-- STEP 7: TRIGGERS
-- ============================================================

DROP TRIGGER IF EXISTS set_updated_at_partners ON public.partners;
CREATE TRIGGER set_updated_at_partners
  BEFORE UPDATE ON public.partners
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_contracts ON public.contracts;
CREATE TRIGGER set_updated_at_contracts
  BEFORE UPDATE ON public.contracts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_leads ON public.leads;
CREATE TRIGGER set_updated_at_leads
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_negotiations ON public.negotiations;
CREATE TRIGGER set_updated_at_negotiations
  BEFORE UPDATE ON public.negotiations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- STEP 8: MOCK DATA
-- ============================================================

DO $$
DECLARE
  p001 UUID := gen_random_uuid();
  p002 UUID := gen_random_uuid();
  p003 UUID := gen_random_uuid();
  p004 UUID := gen_random_uuid();
  p005 UUID := gen_random_uuid();
  c001 UUID := gen_random_uuid();
  c002 UUID := gen_random_uuid();
  c003 UUID := gen_random_uuid();
  c004 UUID := gen_random_uuid();
  c005 UUID := gen_random_uuid();
BEGIN
  -- Partners
  INSERT INTO public.partners (
    id, nama_perusahaan, npwp, segmen_bisnis, pic_internal, kontrak_aktif,
    total_nilai_kontrak, compliance_score, status, skor_peluang, region,
    kontak_utama, jabatan_kontak, email, telepon, alamat, bergabung_sejak,
    last_interaction, rating_k3, total_kontrak, renewal_rate, catatan
  ) VALUES
    (p001, 'PetroChina International Jabung Ltd.', '01.234.567.8-901.000',
     'Migas', 'Ahmad Fauzi', 2, 8750000000, 72, 'Mitra Aktif', 85,
     'Jambi', 'Mr. Zhang Wei', 'VP Operations', 'zhang.wei@petrochina.co.id',
     '+62 741 445500', 'Jl. Gatot Subroto No. 1, Jambi', '2020-03-01',
     '2026-03-10', 'B', 3, 80.0,
     'Mitra strategis layanan pemanduan kapal tanker. Kontrak mendekati akhir.'),
    (p002, 'PT Dok Usaha Sejahtera Bengkulu', '02.345.678.9-012.000',
     'Kepelabuhanan', 'Dewi Rahayu', 1, 2400000000, 85, 'Mitra Aktif', 70,
     'Bengkulu', 'Ir. Hasan Basri', 'Direktur Utama', 'hasan@dusb.co.id',
     '+62 736 21234', 'Jl. Pelabuhan No. 5, Bengkulu', '2021-01-15',
     '2026-03-12', 'A', 2, 100.0,
     'Mitra pemanfaatan fasilitas dermaga Bengkulu. Dasar hukum lengkap.'),
    (p003, 'PT Pertamina Trans Kontinental', '03.456.789.0-123.000',
     'Migas', 'Budi Santoso', 1, 15200000000, 96, 'Mitra Aktif', 95,
     'Palembang', 'Drs. Agus Purnomo', 'GM Logistics', 'agus.p@ptk.pertamina.com',
     '+62 711 445600', 'Jl. Merdeka No. 10, Palembang', '2019-07-01',
     '2026-02-28', 'A', 4, 100.0,
     'Mitra TUKS strategis. Semua klausul K3 dan GCG terpenuhi.'),
    (p004, 'PT Semen Baturaja (Persero) Tbk.', '04.567.890.1-234.000',
     'Industri', 'Siti Mardiyah', 1, 4600000000, 90, 'Mitra Aktif', 80,
     'Palembang', 'Ir. Bambang Sutrisno', 'VP Supply Chain', 'bambang@semenbaturaja.co.id',
     '+62 711 312000', 'Jl. Abikusno No. 2, Palembang', '2022-04-01',
     '2026-03-01', 'B', 2, 100.0,
     'Mitra pemanfaatan lahan terminal curah kering.'),
    (p005, 'PT Medco Energi Internasional', '05.678.901.2-345.000',
     'Migas', 'Ahmad Fauzi', 1, 6300000000, 61, 'Negosiasi', 60,
     'Palembang', 'Capt. Rudi Hartono', 'Marine Manager', 'rudi.h@medcoenergi.com',
     '+62 711 556677', 'Jl. Sudirman No. 15, Palembang', '2023-09-01',
     '2026-03-08', 'C', 1, 0.0,
     'KRITIS: 3 klausul K3 wajib belum ada. Risiko temuan BPK.')
  ON CONFLICT (id) DO NOTHING;

  -- Contracts
  INSERT INTO public.contracts (
    id, nomor_kontrak, mitra, mitra_id, jenis_kontrak, nilai_kontrak,
    tanggal_mulai, tanggal_akhir, sisa_hari, status, compliance_score,
    missing_clauses, pic_internal, region, kategori, pnbp_value,
    last_updated, keterangan
  ) VALUES
    (c001, 'HK.01/PKS/001/PLND-REG2/2024', 'PetroChina International Jabung Ltd.',
     p001, 'PKS', 8750000000, '2024-03-01', '2026-03-31', 16,
     'Mendekati Akhir', 72, ARRAY['Klausul CSMS', 'Program Fit to Work'],
     'Ahmad Fauzi', 'Jambi', 'Pemanduan & Penundaan Kapal', 1250000000,
     '2026-03-10', 'Kontrak layanan pemanduan kapal tanker. Perlu renewal segera.'),
    (c002, 'HK.01/MoU/002/PLND-REG2/2025', 'PT Dok Usaha Sejahtera Bengkulu',
     p002, 'MoU', 2400000000, '2025-01-15', '2026-04-30', 46,
     'Mendekati Akhir', 85, ARRAY['Klausul Audit BPK'],
     'Dewi Rahayu', 'Bengkulu', 'Pemanfaatan Fasilitas Pelabuhan', 380000000,
     '2026-03-12', 'Nota Kesepahaman pemanfaatan fasilitas dermaga Bengkulu.'),
    (c003, 'HK.01/PKS/003/PLND-REG2/2023', 'PT Pertamina Trans Kontinental',
     p003, 'PKS', 15200000000, '2023-07-01', '2026-06-30', 107,
     'Aktif', 96, ARRAY[]::TEXT[],
     'Budi Santoso', 'Palembang', 'TUKS (Terminal Untuk Kepentingan Sendiri)', 2850000000,
     '2026-02-28', 'PKS TUKS operasional terminal Pertamina. Semua klausul K3 dan GCG terpenuhi.'),
    (c004, 'HK.01/ADD/004/PLND-REG2/2025', 'PT Semen Baturaja (Persero) Tbk.',
     p004, 'Addendum', 4600000000, '2025-04-01', '2026-12-31', 291,
     'Aktif', 90, ARRAY[]::TEXT[],
     'Siti Mardiyah', 'Palembang', 'Pemanfaatan Lahan', 620000000,
     '2026-03-01', 'Addendum perpanjangan pemanfaatan lahan terminal curah kering.'),
    (c005, 'HK.01/PKS/005/PLND-REG2/2024', 'PT Medco Energi Internasional',
     p005, 'PKS', 6300000000, '2024-09-01', '2026-04-15', 31,
     'Mendekati Akhir', 61, ARRAY['Klausul K3 (SMK3)', 'Klausul HSSE Mitra', 'Audit K3 Berkala'],
     'Ahmad Fauzi', 'Palembang', 'Pemanduan & Penundaan Kapal', 890000000,
     '2026-03-08', 'PKS layanan tunda kapal. KRITIS: 3 klausul K3 wajib belum ada.')
  ON CONFLICT (id) DO NOTHING;

  -- Leads
  INSERT INTO public.leads (
    nama_perusahaan, kontak_utama, jabatan, email, telepon, segmen,
    region, source, status, priority, skor_lead, estimasi_nilai,
    pic_internal, tanggal_masuk, last_activity, next_action, next_action_date,
    catatan, jenis_kontrak_target, probabilitas
  ) VALUES
    ('PT Energi Mega Persada Tbk.', 'Ir. Darmawan Susilo', 'VP Marine Operations',
     'd.susilo@emp.co.id', '+62 711 445500', 'Migas', 'Palembang',
     'Tender Pemerintah', 'Negosiasi', 'Tinggi', 87, 12500000000,
     'Ahmad Fauzi', '2026-01-10', '2026-03-12', 'Presentasi proposal teknis',
     '2026-03-20', 'Peluang TUKS baru di Palembang. Sudah 2x pertemuan.',
     'TUKS', 75),
    ('PT Timah Tbk.', 'Drs. Hendra Wijaya', 'Direktur Logistik',
     'h.wijaya@timah.com', '+62 717 421234', 'Industri', 'Palembang',
     'Referral Internal', 'Presentasi', 'Tinggi', 79, 8200000000,
     'Budi Santoso', '2026-01-25', '2026-03-10', 'Kirim draft MoU untuk review',
     '2026-03-18', 'Referral dari Pusri. Butuh layanan pemanduan kapal timah.',
     'PKS', 65),
    ('PT Pelabuhan Tanjung Api-Api', 'Capt. Ridwan Hakim', 'Direktur Operasional',
     'ridwan@ptaa.co.id', '+62 711 334455', 'Kepelabuhanan', 'Palembang',
     'Pameran & Event', 'Kualifikasi', 'Sedang', 62, 5500000000,
     'Dewi Rahayu', '2026-02-01', '2026-03-05', 'Kunjungan lapangan ke dermaga',
     '2026-03-25', 'Bertemu di Maritime Expo 2026. Tertarik kerjasama TUKS.',
     'TUKS', 45)
  ON CONFLICT (id) DO NOTHING;

  -- Negotiations
  INSERT INTO public.negotiations (
    judul, mitra, partner_id, stage, status, pic_internal, region,
    nilai_estimasi, tanggal_mulai, target_selesai, progress, catatan
  ) VALUES
    ('Negosiasi PKS Pemanduan Kapal - PetroChina', 'PetroChina International Jabung Ltd.',
     p001, 'Review Syarat', 'Aktif', 'Ahmad Fauzi', 'Jambi',
     8750000000, '2026-02-01', '2026-04-15', 65,
     'Negosiasi renewal kontrak PKS. Fokus pada klausul CSMS dan K3.'),
    ('MoU Fasilitas Dermaga - Dok Usaha Sejahtera', 'PT Dok Usaha Sejahtera Bengkulu',
     p002, 'Persetujuan', 'Aktif', 'Dewi Rahayu', 'Bengkulu',
     2400000000, '2026-01-20', '2026-03-31', 85,
     'Hampir selesai. Menunggu tanda tangan Direktur.'),
    ('PKS TUKS Baru - Energi Mega Persada', 'PT Energi Mega Persada Tbk.',
     NULL, 'Diskusi', 'Aktif', 'Ahmad Fauzi', 'Palembang',
     12500000000, '2026-02-15', '2026-05-30', 35,
     'Diskusi awal syarat teknis dan komersial TUKS baru.')
  ON CONFLICT (id) DO NOTHING;

  -- Activity logs
  INSERT INTO public.activity_logs (
    timestamp, activity_type, title, description, user_name, mitra_name
  ) VALUES
    (NOW() - INTERVAL '2 hours', 'alert',
     'Peringatan Kontrak Mendekati Akhir',
     'Kontrak PKS PetroChina akan berakhir dalam 16 hari',
     'Sistem', 'PetroChina International Jabung Ltd.'),
    (NOW() - INTERVAL '5 hours', 'approval',
     'Approval Kontrak Disetujui',
     'Kontrak PKS Pertamina Trans Kontinental disetujui oleh ED',
     'Budi Santoso', 'PT Pertamina Trans Kontinental'),
    (NOW() - INTERVAL '1 day', 'create',
     'Kontrak Baru Dibuat',
     'Draft kontrak Addendum Semen Baturaja telah dibuat',
     'Siti Mardiyah', 'PT Semen Baturaja (Persero) Tbk.'),
    (NOW() - INTERVAL '2 days', 'review',
     'Review Legal Selesai',
     'Tim Legal telah menyelesaikan review kontrak MoU Bengkulu',
     'Tim Legal', 'PT Dok Usaha Sejahtera Bengkulu'),
    (NOW() - INTERVAL '3 days', 'renewal',
     'Proses Renewal Dimulai',
     'Proses renewal kontrak MoU PT Bukit Asam telah dimulai',
     'Dewi Rahayu', 'PT Bukit Asam Tbk.')
  ON CONFLICT (id) DO NOTHING;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Mock data insertion failed: %', SQLERRM;
END $$;

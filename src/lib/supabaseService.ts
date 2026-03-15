'use client';

import { createClient } from '@/lib/supabase/client';

function isSchemaError(error: any): boolean {
  if (!error) return false;
  if (error.code && typeof error.code === 'string') {
    const errorClass = error.code.substring(0, 2);
    if (errorClass === '42') return true;
    if (errorClass === '23') return false;
    if (errorClass === '08') return true;
  }
  if (error.message) {
    const schemaErrorPatterns = [
      /relation.*does not exist/i,
      /column.*does not exist/i,
      /function.*does not exist/i,
      /syntax error/i,
      /type.*does not exist/i,
    ];
    return schemaErrorPatterns.some((p) => p.test(error.message));
  }
  return false;
}

// ============================================================
// CONTRACTS SERVICE
// ============================================================

export const contractService = {
  async getAll() {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('*, partners(nama_perusahaan)')
        .order('tanggal_akhir', { ascending: true });
      if (error) {
        if (isSchemaError(error)) throw error;
        console.log('Contracts fetch error:', error.message);
        return [];
      }
      return (data || []).map((row) => ({
        id: row.id,
        nomorKontrak: row.nomor_kontrak,
        mitra: row.mitra,
        mitraId: row.mitra_id,
        jenisKontrak: row.jenis_kontrak,
        nilaiKontrak: row.nilai_kontrak,
        tanggalMulai: row.tanggal_mulai,
        tanggalAkhir: row.tanggal_akhir,
        sisaHari: row.sisa_hari,
        status: row.status,
        complianceScore: row.compliance_score,
        missingClauses: row.missing_clauses || [],
        picInternal: row.pic_internal,
        region: row.region,
        kategori: row.kategori,
        pnbpValue: row.pnbp_value,
        lastUpdated: row.last_updated,
        keterangan: row.keterangan,
      }));
    } catch (error: any) {
      console.log('Schema-related error:', error.message);
      throw error;
    }
  },

  async create(contract: any) {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('contracts')
        .insert({
          nomor_kontrak: contract.nomorKontrak,
          mitra: contract.mitra,
          mitra_id: contract.mitraId || null,
          jenis_kontrak: contract.jenisKontrak,
          nilai_kontrak: contract.nilaiKontrak,
          tanggal_mulai: contract.tanggalMulai,
          tanggal_akhir: contract.tanggalAkhir,
          sisa_hari: contract.sisaHari || 0,
          status: contract.status,
          compliance_score: contract.complianceScore || 0,
          missing_clauses: contract.missingClauses || [],
          pic_internal: contract.picInternal,
          region: contract.region,
          kategori: contract.kategori,
          pnbp_value: contract.pnbpValue || 0,
          last_updated: new Date().toISOString().split('T')[0],
          keterangan: contract.keterangan,
        })
        .select()
        .single();
      if (error) {
        if (isSchemaError(error)) throw error;
        console.log('Contract create error:', error.message);
        return null;
      }
      return data;
    } catch (error: any) {
      console.log('Schema-related error:', error.message);
      throw error;
    }
  },

  async update(id: string, updates: any) {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('contracts')
        .update({
          status: updates.status,
          compliance_score: updates.complianceScore,
          missing_clauses: updates.missingClauses,
          keterangan: updates.keterangan,
          last_updated: new Date().toISOString().split('T')[0],
        })
        .eq('id', id)
        .select()
        .single();
      if (error) {
        if (isSchemaError(error)) throw error;
        console.log('Contract update error:', error.message);
        return null;
      }
      return data;
    } catch (error: any) {
      console.log('Schema-related error:', error.message);
      throw error;
    }
  },
};

// ============================================================
// PARTNERS SERVICE
// ============================================================

export const partnerService = {
  async getAll() {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('nama_perusahaan', { ascending: true });
      if (error) {
        if (isSchemaError(error)) throw error;
        console.log('Partners fetch error:', error.message);
        return [];
      }
      return (data || []).map((row) => ({
        id: row.id,
        namaPerusahaan: row.nama_perusahaan,
        npwp: row.npwp,
        segmenBisnis: row.segmen_bisnis,
        picInternal: row.pic_internal,
        kontrakAktif: row.kontrak_aktif,
        totalNilaiKontrak: row.total_nilai_kontrak,
        complianceScore: row.compliance_score,
        status: row.status,
        skorPeluang: row.skor_peluang,
        region: row.region,
        kontakUtama: row.kontak_utama,
        jabatanKontak: row.jabatan_kontak,
        email: row.email,
        telepon: row.telepon,
        alamat: row.alamat,
        bergabungSejak: row.bergabung_sejak,
        lastInteraction: row.last_interaction,
        ratingK3: row.rating_k3,
        totalKontrak: row.total_kontrak,
        renewalRate: row.renewal_rate,
        catatan: row.catatan,
      }));
    } catch (error: any) {
      console.log('Schema-related error:', error.message);
      throw error;
    }
  },

  async create(partner: any) {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('partners')
        .insert({
          nama_perusahaan: partner.namaPerusahaan,
          npwp: partner.npwp,
          segmen_bisnis: partner.segmenBisnis,
          pic_internal: partner.picInternal,
          status: partner.status || 'Lead',
          region: partner.region,
          kontak_utama: partner.kontakUtama,
          jabatan_kontak: partner.jabatanKontak,
          email: partner.email,
          telepon: partner.telepon,
          alamat: partner.alamat,
          catatan: partner.catatan,
        })
        .select()
        .single();
      if (error) {
        if (isSchemaError(error)) throw error;
        console.log('Partner create error:', error.message);
        return null;
      }
      return data;
    } catch (error: any) {
      console.log('Schema-related error:', error.message);
      throw error;
    }
  },
};

// ============================================================
// LEADS SERVICE
// ============================================================

export const leadService = {
  async getAll() {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('tanggal_masuk', { ascending: false });
      if (error) {
        if (isSchemaError(error)) throw error;
        console.log('Leads fetch error:', error.message);
        return [];
      }
      return (data || []).map((row) => ({
        id: row.id,
        namaPerusahaan: row.nama_perusahaan,
        kontakUtama: row.kontak_utama,
        jabatan: row.jabatan,
        email: row.email,
        telepon: row.telepon,
        segmen: row.segmen,
        region: row.region,
        source: row.source,
        status: row.status,
        priority: row.priority,
        skorLead: row.skor_lead,
        estimasiNilai: row.estimasi_nilai,
        picInternal: row.pic_internal,
        tanggalMasuk: row.tanggal_masuk,
        lastActivity: row.last_activity,
        nextAction: row.next_action,
        nextActionDate: row.next_action_date,
        catatan: row.catatan,
        jenisKontrakTarget: row.jenis_kontrak_target,
        probabilitas: row.probabilitas,
      }));
    } catch (error: any) {
      console.log('Schema-related error:', error.message);
      throw error;
    }
  },

  async create(lead: any) {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert({
          nama_perusahaan: lead.namaPerusahaan,
          kontak_utama: lead.kontakUtama,
          jabatan: lead.jabatan,
          email: lead.email,
          telepon: lead.telepon,
          segmen: lead.segmen,
          region: lead.region,
          source: lead.source,
          status: lead.status || 'Baru',
          priority: lead.priority || 'Sedang',
          skor_lead: lead.skorLead || 0,
          estimasi_nilai: lead.estimasiNilai || 0,
          pic_internal: lead.picInternal,
          tanggal_masuk: new Date().toISOString().split('T')[0],
          catatan: lead.catatan,
          jenis_kontrak_target: lead.jenisKontrakTarget,
          probabilitas: lead.probabilitas || 0,
        })
        .select()
        .single();
      if (error) {
        if (isSchemaError(error)) throw error;
        console.log('Lead create error:', error.message);
        return null;
      }
      return data;
    } catch (error: any) {
      console.log('Schema-related error:', error.message);
      throw error;
    }
  },

  async update(id: string, updates: any) {
    const supabase = createClient();
    try {
      const dbUpdates: any = {};
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
      if (updates.skorLead !== undefined) dbUpdates.skor_lead = updates.skorLead;
      if (updates.nextAction !== undefined) dbUpdates.next_action = updates.nextAction;
      if (updates.nextActionDate !== undefined) dbUpdates.next_action_date = updates.nextActionDate;
      if (updates.catatan !== undefined) dbUpdates.catatan = updates.catatan;
      if (updates.probabilitas !== undefined) dbUpdates.probabilitas = updates.probabilitas;

      const { data, error } = await supabase
        .from('leads')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        if (isSchemaError(error)) throw error;
        console.log('Lead update error:', error.message);
        return null;
      }
      return data;
    } catch (error: any) {
      console.log('Schema-related error:', error.message);
      throw error;
    }
  },
};

// ============================================================
// NEGOTIATIONS SERVICE
// ============================================================

export const negotiationService = {
  async getAll() {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('negotiations')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        if (isSchemaError(error)) throw error;
        console.log('Negotiations fetch error:', error.message);
        return [];
      }
      return (data || []).map((row) => ({
        id: row.id,
        judul: row.judul,
        mitra: row.mitra,
        partnerId: row.partner_id,
        stage: row.stage,
        status: row.status,
        picInternal: row.pic_internal,
        region: row.region,
        nilaiEstimasi: row.nilai_estimasi,
        tanggalMulai: row.tanggal_mulai,
        targetSelesai: row.target_selesai,
        progress: row.progress,
        catatan: row.catatan,
      }));
    } catch (error: any) {
      console.log('Schema-related error:', error.message);
      throw error;
    }
  },
};

// ============================================================
// ACTIVITY LOGS SERVICE
// ============================================================

export const activityLogService = {
  async getRecent(limit = 10) {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);
      if (error) {
        if (isSchemaError(error)) throw error;
        console.log('Activity logs fetch error:', error.message);
        return [];
      }
      return (data || []).map((row) => ({
        id: row.id,
        timestamp: row.timestamp,
        type: row.activity_type,
        title: row.title,
        description: row.description,
        user: row.user_name,
        kontrakId: row.kontrak_id,
        mitraName: row.mitra_name,
      }));
    } catch (error: any) {
      console.log('Schema-related error:', error.message);
      throw error;
    }
  },

  async create(log: any) {
    const supabase = createClient();
    try {
      const { error } = await supabase.from('activity_logs').insert({
        activity_type: log.type,
        title: log.title,
        description: log.description,
        user_name: log.user,
        kontrak_id: log.kontrakId || null,
        mitra_name: log.mitraName || null,
      });
      if (error) {
        if (isSchemaError(error)) throw error;
        console.log('Activity log create error:', error.message);
      }
    } catch (error: any) {
      console.log('Schema-related error:', error.message);
    }
  },
};

// ============================================================
// DASHBOARD STATS SERVICE
// ============================================================

export const dashboardService = {
  async getStats() {
    const supabase = createClient();
    try {
      const [contractsRes, partnersRes, leadsRes] = await Promise.all([
        supabase.from('contracts').select('status, compliance_score, pnbp_value, sisa_hari, missing_clauses'),
        supabase.from('partners').select('status'),
        supabase.from('leads').select('status, estimasi_nilai, probabilitas'),
      ]);

      const contracts = contractsRes.data || [];
      const partners = partnersRes.data || [];
      const leads = leadsRes.data || [];

      const totalKontrakAktif = contracts.filter((c) => c.status === 'Aktif').length;
      const mendekatiAkhir = contracts.filter((c) => c.status === 'Mendekati Akhir').length;
      const avgCompliance =
        contracts.length > 0
          ? Math.round(contracts.reduce((sum, c) => sum + (c.compliance_score || 0), 0) / contracts.length)
          : 0;
      const totalPNBP = contracts.reduce((sum, c) => sum + (c.pnbp_value || 0), 0);
      const missingClausesCount = contracts.filter(
        (c) => c.missing_clauses && c.missing_clauses.length > 0
      ).length;
      const totalMitraAktif = partners.filter((p) => p.status === 'Mitra Aktif').length;
      const pipelineValue = leads.reduce(
        (sum, l) => sum + ((l.estimasi_nilai || 0) * (l.probabilitas || 0)) / 100,
        0
      );

      return {
        totalKontrakAktif,
        mendekatiAkhir,
        avgCompliance,
        totalPNBP,
        missingClausesCount,
        totalMitraAktif,
        pipelineValue,
      };
    } catch (error: any) {
      console.log('Dashboard stats error:', error.message);
      return null;
    }
  },
};

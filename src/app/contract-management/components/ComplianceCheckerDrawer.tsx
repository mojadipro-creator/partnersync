'use client';

import { X, ShieldCheck, AlertTriangle, CheckCircle, XCircle, Info, ExternalLink } from 'lucide-react';
import { Contract } from '@/lib/mockData';

interface ClauseItem {
  id: string;
  label: string;
  dasar: string;
  kategori: 'wajib' | 'direkomendasikan';
  present: boolean;
  keterangan?: string;
}

function buildClauseList(contract: Contract): ClauseItem[] {
  const missing = contract.missingClauses;
  const isOperasional = ['PKS', 'TUKS'].includes(contract.jenisKontrak);
  const isMigas = contract.kategori.toLowerCase().includes('pemaandu') || contract.kategori.toLowerCase().includes('tuks');

  const allClauses: ClauseItem[] = [
    { id: 'cl01', label: 'Definisi Pihak & Identitas', dasar: 'Perdir HK.01/29/12/1/KSJU', kategori: 'wajib', present: !missing.includes('Definisi Pihak') },
    { id: 'cl02', label: 'Maksud & Tujuan Kerjasama', dasar: 'Perdir Pelindo', kategori: 'wajib', present: !missing.includes('Maksud & Tujuan') },
    { id: 'cl03', label: 'Dasar Hukum (UU BUMN, UU Pelayaran, PP Kepelabuhanan)', dasar: 'UU No. 17/2008, PP No. 61/2009', kategori: 'wajib', present: !missing.includes('Dasar Hukum') },
    { id: 'cl04', label: 'Jangka Waktu & Masa Berlaku', dasar: 'Perdir Pelindo', kategori: 'wajib', present: !missing.includes('Jangka Waktu') },
    { id: 'cl05', label: 'Hak & Kewajiban Para Pihak', dasar: 'KUHPerdata Pasal 1313', kategori: 'wajib', present: !missing.includes('Hak-Kewajiban') },
    { id: 'cl06', label: 'PNBP & Mekanisme Pembayaran', dasar: 'UU No. 9/2018 tentang PNBP', kategori: 'wajib', present: !missing.includes('Klausul PNBP') },
    { id: 'cl07', label: 'Good Corporate Governance (GCG)', dasar: 'Peraturan Menteri BUMN No. PER-01/MBU/2011', kategori: 'wajib', present: !missing.includes('Klausul GCG') },
    { id: 'cl08', label: 'Force Majeure / Keadaan Kahar', dasar: 'KUHPerdata Pasal 1244', kategori: 'wajib', present: !missing.includes('Klausul Force Majeure') },
    { id: 'cl09', label: 'Penyelesaian Sengketa (Arbitrase/BANI)', dasar: 'UU No. 30/1999', kategori: 'wajib', present: !missing.includes('Penyelesaian Sengketa') },
    { id: 'cl10', label: 'Audit BPK Readiness', dasar: 'UU No. 15/2004 tentang BPK', kategori: 'wajib', present: !missing.includes('Audit BPK Readiness') },
    ...(isOperasional ? [
      { id: 'cl11', label: 'K3 — SMK3 (PP No. 50/2012)', dasar: 'PP No. 50/2012 tentang SMK3', kategori: 'wajib' as const, present: !missing.includes('Klausul K3 (SMK3)') },
      { id: 'cl12', label: 'K3 — Tanggung Jawab HSSE Mitra', dasar: 'Perdir Pelindo HSSE', kategori: 'wajib' as const, present: !missing.includes('Klausul HSSE Mitra') },
      { id: 'cl13', label: 'K3 — Audit K3 Berkala', dasar: 'ISO 45001:2018', kategori: 'wajib' as const, present: !missing.includes('Audit K3 Berkala') },
    ] : []),
    ...(isMigas ? [
      { id: 'cl14', label: 'CSMS (Contractor Safety Management System)', dasar: 'SKK Migas PTK 007 Rev. 3', kategori: 'wajib' as const, present: !missing.includes('Klausul CSMS') },
      { id: 'cl15', label: 'Program Fit to Work', dasar: 'Perdir HSSE Pelindo', kategori: 'wajib' as const, present: !missing.includes('Program Fit to Work') },
    ] : []),
    { id: 'cl16', label: 'Kerahasiaan Informasi', dasar: 'UU ITE No. 11/2008', kategori: 'direkomendasikan', present: !missing.includes('Kerahasiaan') },
    { id: 'cl17', label: 'Addendum & Perubahan Kontrak', dasar: 'KUHPerdata', kategori: 'direkomendasikan', present: !missing.includes('Addendum') },
    { id: 'cl18', label: 'Pengakhiran Kontrak & Konsekuensi', dasar: 'Perdir Pelindo', kategori: 'direkomendasikan', present: !missing.includes('Pengakhiran') },
  ];

  return allClauses;
}

interface ComplianceCheckerDrawerProps {
  contract: Contract | null;
  onClose: () => void;
}

export default function ComplianceCheckerDrawer({ contract, onClose }: ComplianceCheckerDrawerProps) {
  if (!contract) return null;

  const clauses = buildClauseList(contract);
  const wajib = clauses.filter((c) => c.kategori === 'wajib');
  const direkomendasikan = clauses.filter((c) => c.kategori === 'direkomendasikan');
  const missingWajib = wajib.filter((c) => !c.present);
  const presentWajib = wajib.filter((c) => c.present);

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="w-full max-w-[520px] bg-white h-full overflow-y-auto shadow-2xl animate-slide-in-right scrollbar-thin flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border px-5 py-4 z-10">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={16} className="text-primary flex-shrink-0" />
                <span className="text-xs font-600 text-primary uppercase tracking-wide">Compliance Checker</span>
              </div>
              <h2 className="text-sm font-700 text-foreground leading-snug truncate">{contract.mitra}</h2>
              <p className="text-xs font-mono text-muted-foreground mt-0.5 truncate">{contract.nomorKontrak}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex-shrink-0"
            >
              <X size={16} />
            </button>
          </div>

          {/* Score summary */}
          <div className="mt-3 flex items-center gap-4">
            <div className="flex-1 bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-700 ${contract.complianceScore >= 90 ? 'bg-emerald-500' : contract.complianceScore >= 70 ? 'bg-amber-500' : 'bg-red-500'}`}
                style={{ width: `${contract.complianceScore}%` }}
              />
            </div>
            <span className={`text-lg font-700 tabular-nums ${contract.complianceScore >= 90 ? 'text-emerald-700' : contract.complianceScore >= 70 ? 'text-amber-700' : 'text-red-700'}`}>
              {contract.complianceScore}%
            </span>
          </div>
          <div className="flex items-center gap-4 mt-1.5 text-xs text-muted-foreground">
            <span><span className="font-600 text-emerald-700">{presentWajib.length}</span> terpenuhi</span>
            <span><span className="font-600 text-red-600">{missingWajib.length}</span> kurang</span>
            <span>dari {wajib.length} klausul wajib</span>
          </div>
        </div>

        {/* Missing clauses alert */}
        {missingWajib.length > 0 && (
          <div className="mx-5 mt-4 p-3.5 rounded-lg bg-red-50 border border-red-200">
            <div className="flex items-start gap-2">
              <AlertTriangle size={15} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-600 text-red-800">
                  {missingWajib.length} Klausul Wajib Belum Ada
                </p>
                <p className="text-xs text-red-600 mt-0.5">
                  Kontrak ini berisiko temuan BPK. Lengkapi sebelum penandatanganan atau renewal.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Clauses list */}
        <div className="px-5 py-4 flex-1">
          {/* Wajib */}
          <h3 className="text-xs font-700 uppercase tracking-widest text-muted-foreground mb-3">
            Klausul Wajib ({wajib.length})
          </h3>
          <div className="space-y-2 mb-6">
            {wajib.map((clause) => (
              <div
                key={clause.id}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                  clause.present
                    ? 'bg-emerald-50/60 border-emerald-200' :'bg-red-50/60 border-red-200'
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {clause.present
                    ? <CheckCircle size={15} className="text-emerald-600" />
                    : <XCircle size={15} className="text-red-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-500 leading-snug ${clause.present ? 'text-emerald-900' : 'text-red-900'}`}>
                    {clause.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{clause.dasar}</p>
                  {!clause.present && (
                    <div className="mt-2 flex items-center gap-2">
                      <button className="text-[11px] font-600 text-primary hover:underline flex items-center gap-1">
                        <ExternalLink size={10} /> Tambah dari Template
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Direkomendasikan */}
          <h3 className="text-xs font-700 uppercase tracking-widest text-muted-foreground mb-3">
            Direkomendasikan ({direkomendasikan.length})
          </h3>
          <div className="space-y-2">
            {direkomendasikan.map((clause) => (
              <div
                key={clause.id}
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  clause.present ? 'bg-slate-50 border-slate-200' : 'bg-amber-50/60 border-amber-200'
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {clause.present
                    ? <CheckCircle size={15} className="text-slate-500" />
                    : <Info size={15} className="text-amber-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-500 leading-snug ${clause.present ? 'text-slate-700' : 'text-amber-900'}`}>
                    {clause.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{clause.dasar}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="sticky bottom-0 bg-white border-t border-border px-5 py-4 flex items-center gap-3">
          <button className="flex-1 px-4 py-2 rounded-lg border border-border text-sm font-600 text-foreground hover:bg-muted transition-all active:scale-95">
            Unduh Laporan
          </button>
          <button className="flex-1 px-4 py-2 rounded-lg bg-primary text-white text-sm font-600 hover:bg-primary/90 transition-all active:scale-95">
            Minta Perbaikan
          </button>
        </div>
      </div>
    </div>
  );
}
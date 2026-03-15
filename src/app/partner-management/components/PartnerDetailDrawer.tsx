'use client';

import { X, Building2, Phone, Mail, FileText, TrendingUp, Star, Calendar, ExternalLink, RefreshCw } from 'lucide-react';
import { Partner, contracts, formatRupiah } from '@/lib/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import { toast } from 'sonner';

const ratingK3Config: Record<string, { label: string; color: string; bg: string }> = {
  A: { label: 'Sangat Baik', color: 'text-emerald-700', bg: 'bg-emerald-50' },
  B: { label: 'Baik', color: 'text-blue-700', bg: 'bg-blue-50' },
  C: { label: 'Cukup', color: 'text-amber-700', bg: 'bg-amber-50' },
  D: { label: 'Perlu Perbaikan', color: 'text-red-700', bg: 'bg-red-50' },
};

const segmenConfig: Record<string, { color: string; bg: string }> = {
  Migas: { color: 'text-orange-700', bg: 'bg-orange-50' },
  Logistik: { color: 'text-blue-700', bg: 'bg-blue-50' },
  Industri: { color: 'text-slate-700', bg: 'bg-slate-100' },
  Kepelabuhanan: { color: 'text-cyan-700', bg: 'bg-cyan-50' },
  Perdagangan: { color: 'text-violet-700', bg: 'bg-violet-50' },
  Utilitas: { color: 'text-teal-700', bg: 'bg-teal-50' },
};

function SkorPeluangBar({ skor }: { skor: number }) {
  const color = skor >= 85 ? '#16a34a' : skor >= 65 ? '#d97706' : '#dc2626';
  const label = skor >= 85 ? 'Tinggi' : skor >= 65 ? 'Sedang' : 'Rendah';
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex-1 bg-muted rounded-full h-2">
        <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${skor}%`, backgroundColor: color }} />
      </div>
      <span className="font-mono text-sm font-700 tabular-nums" style={{ color }}>{skor}</span>
      <span className="text-xs font-500 px-1.5 py-0.5 rounded" style={{ color, backgroundColor: `${color}18` }}>{label}</span>
    </div>
  );
}

interface PartnerDetailDrawerProps {
  partner: Partner | null;
  onClose: () => void;
}

export default function PartnerDetailDrawer({ partner, onClose }: PartnerDetailDrawerProps) {
  if (!partner) return null;

  const partnerContracts = contracts.filter((c) => c.mitraId === partner.id);
  const k3 = ratingK3Config[partner.ratingK3];
  const segm = segmenConfig[partner.segmenBisnis] ?? { color: 'text-slate-700', bg: 'bg-slate-100' };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="w-full max-w-[560px] bg-white h-full overflow-y-auto shadow-2xl animate-slide-in-right scrollbar-thin flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border z-10">
          <div className="px-5 py-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Building2 size={22} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-700 text-foreground leading-snug">{partner.namaPerusahaan}</h2>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <StatusBadge status={partner.status} size="sm" dot />
                  <span className={`text-[11px] font-600 px-2 py-0.5 rounded-full ${segm.bg} ${segm.color}`}>
                    {partner.segmenBisnis}
                  </span>
                  <span className={`text-[11px] font-600 px-2 py-0.5 rounded-full ${k3.bg} ${k3.color}`}>
                    K3: {partner.ratingK3} — {k3.label}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex-shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-4 border-t border-border">
            {[
              { label: 'Kontrak Aktif', value: String(partner.kontrakAktif), unit: '' },
              { label: 'Total Kontrak', value: String(partner.totalKontrak), unit: '' },
              { label: 'Compliance', value: String(partner.complianceScore), unit: '%' },
              { label: 'Renewal Rate', value: String(partner.renewalRate), unit: '%' },
            ].map((kpi, i) => (
              <div key={i} className={`px-4 py-3 text-center ${i < 3 ? 'border-r border-border' : ''}`}>
                <p className="text-[10px] font-600 uppercase tracking-wide text-muted-foreground">{kpi.label}</p>
                <p className="text-lg font-700 tabular-nums text-foreground mt-0.5">
                  {kpi.value}<span className="text-sm text-muted-foreground">{kpi.unit}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 py-5 space-y-6 flex-1">
          {/* Skor Peluang */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={15} className="text-primary" />
              <h3 className="text-sm font-700 text-foreground">Skor Peluang Renewal / Upsell</h3>
            </div>
            <SkorPeluangBar skor={partner.skorPeluang} />
            {partner.skorPeluang >= 85 && (
              <p className="text-xs text-emerald-700 mt-2 bg-emerald-50 rounded-lg px-3 py-2 border border-emerald-200">
                ✓ Peluang renewal tinggi — rekomendasikan inisiasi kontak 60 hari sebelum kontrak berakhir
              </p>
            )}
            {partner.skorPeluang < 65 && (
              <p className="text-xs text-amber-700 mt-2 bg-amber-50 rounded-lg px-3 py-2 border border-amber-200">
                ⚠ Peluang rendah — tinjau isu compliance dan histori interaksi sebelum renewal
              </p>
            )}
          </div>

          {/* Info Perusahaan */}
          <div>
            <h3 className="text-sm font-700 text-foreground mb-3 flex items-center gap-2">
              <Building2 size={15} className="text-muted-foreground" /> Informasi Perusahaan
            </h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex gap-3">
                <span className="w-24 text-xs font-600 text-muted-foreground flex-shrink-0 pt-0.5">NPWP</span>
                <span className="font-mono text-xs text-foreground">{partner.npwp}</span>
              </div>
              <div className="flex gap-3">
                <span className="w-24 text-xs font-600 text-muted-foreground flex-shrink-0 pt-0.5">Region</span>
                <span className="text-sm text-foreground">{partner.region}</span>
              </div>
              <div className="flex gap-3">
                <span className="w-24 text-xs font-600 text-muted-foreground flex-shrink-0 pt-0.5">Alamat</span>
                <span className="text-sm text-foreground leading-snug">{partner.alamat}</span>
              </div>
              <div className="flex gap-3">
                <span className="w-24 text-xs font-600 text-muted-foreground flex-shrink-0 pt-0.5">PIC Internal</span>
                <span className="text-sm text-foreground">{partner.picInternal}</span>
              </div>
              <div className="flex gap-3">
                <span className="w-24 text-xs font-600 text-muted-foreground flex-shrink-0 pt-0.5">Bergabung</span>
                <span className="text-sm text-foreground">
                  {new Date(partner.bergabungSejak).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          {/* Kontak Utama */}
          <div>
            <h3 className="text-sm font-700 text-foreground mb-3 flex items-center gap-2">
              <Phone size={15} className="text-muted-foreground" /> Kontak Utama
            </h3>
            <div className="bg-muted/40 rounded-xl p-4 space-y-2">
              <p className="text-sm font-600 text-foreground">{partner.kontakUtama}</p>
              <p className="text-xs text-muted-foreground">{partner.jabatanKontak}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail size={12} />
                <a href={`mailto:${partner.email}`} className="hover:text-primary transition-colors">{partner.email}</a>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone size={12} />
                <span>{partner.telepon}</span>
              </div>
            </div>
          </div>

          {/* Nilai Total */}
          <div>
            <h3 className="text-sm font-700 text-foreground mb-3 flex items-center gap-2">
              <Star size={15} className="text-muted-foreground" /> Nilai Total Kerjasama
            </h3>
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
              <p className="text-2xl font-700 text-primary tabular-nums">
                {formatRupiah(partner.totalNilaiKontrak)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Akumulasi seluruh kontrak ({partner.totalKontrak} kontrak)</p>
            </div>
          </div>

          {/* Histori Kontrak */}
          <div>
            <h3 className="text-sm font-700 text-foreground mb-3 flex items-center gap-2">
              <FileText size={15} className="text-muted-foreground" /> Histori Kontrak
            </h3>
            {partnerContracts.length === 0 ? (
              <div className="text-center py-6 text-sm text-muted-foreground bg-muted/30 rounded-xl">
                Belum ada kontrak terdaftar untuk mitra ini
              </div>
            ) : (
              <div className="space-y-2.5">
                {partnerContracts.map((c) => (
                  <div key={c.id} className="flex items-start gap-3 p-3.5 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors group">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[11px] text-primary font-500 truncate">
                          {c.nomorKontrak.substring(0, 30)}…
                        </span>
                        <StatusBadge status={c.status} size="sm" />
                      </div>
                      <p className="text-xs text-foreground font-500">{c.jenisKontrak} — {c.kategori.split('(')[0].trim()}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="font-mono text-xs font-600 text-foreground">{formatRupiah(c.nilaiKontrak)}</span>
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(c.tanggalMulai).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })} —{' '}
                          {new Date(c.tanggalAkhir).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      {c.missingClauses.length > 0 && (
                        <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                          <span>⚠</span> {c.missingClauses.length} klausul kurang
                        </p>
                      )}
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary">
                      <ExternalLink size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Catatan */}
          {partner.catatan && (
            <div>
              <h3 className="text-sm font-700 text-foreground mb-2 flex items-center gap-2">
                <Calendar size={15} className="text-muted-foreground" /> Catatan Internal
              </h3>
              <p className="text-sm text-foreground bg-amber-50/70 border border-amber-200 rounded-xl px-4 py-3 leading-relaxed">
                {partner.catatan}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1.5">
                Terakhir diperbarui: {new Date(partner.lastInteraction).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-border px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => { toast.info('Membuka form edit mitra'); }}
            className="flex-1 px-4 py-2 rounded-lg border border-border text-sm font-600 text-foreground hover:bg-muted transition-all active:scale-95"
          >
            Edit Profil
          </button>
          <button
            onClick={() => { toast.success('Proses renewal dimulai'); }}
            className="flex-1 px-4 py-2 rounded-lg bg-primary text-white text-sm font-600 hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <RefreshCw size={14} /> Inisiasi Renewal
          </button>
        </div>
      </div>
    </div>
  );
}
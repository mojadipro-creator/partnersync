'use client';

import { Lead } from '@/lib/leadMockData';
import { X, Phone, Mail, MapPin, Calendar, Target, TrendingUp, FileText, User, Tag, DollarSign, Clock } from 'lucide-react';

interface LeadDetailDrawerProps {
  lead: Lead;
  onClose: () => void;
  onAddPartner: (lead: Lead) => void;
}

function formatRupiah(n: number) {
  return `Rp ${n.toLocaleString('id-ID')}`;
}

const STATUS_STYLES: Record<string, string> = {
  'Baru': 'bg-slate-100 text-slate-700',
  'Kualifikasi': 'bg-blue-50 text-blue-700',
  'Presentasi': 'bg-violet-50 text-violet-700',
  'Negosiasi': 'bg-amber-50 text-amber-700',
  'Menang': 'bg-emerald-50 text-emerald-700',
  'Kalah': 'bg-red-50 text-red-600',
  'Ditunda': 'bg-orange-50 text-orange-700',
};

export default function LeadDetailDrawer({ lead, onClose, onAddPartner }: LeadDetailDrawerProps) {
  const scoreColor = lead.skorLead >= 80 ? 'text-emerald-700' : lead.skorLead >= 60 ? 'text-amber-700' : 'text-red-600';
  const scoreBg = lead.skorLead >= 80 ? 'bg-emerald-50' : lead.skorLead >= 60 ? 'bg-amber-50' : 'bg-red-50';

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-foreground/20 backdrop-blur-[2px] z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-[480px] bg-white shadow-2xl z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-border bg-muted/30">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-600 ${STATUS_STYLES[lead.status] || ''}`}>
                {lead.status}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-600 border ${
                lead.priority === 'Tinggi' ? 'bg-red-50 text-red-700 border-red-200' :
                lead.priority === 'Sedang'? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}>
                {lead.priority}
              </span>
            </div>
            <h2 className="text-base font-700 text-foreground leading-tight">{lead.namaPerusahaan}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{lead.kontakUtama} · {lead.jabatan}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors flex-shrink-0">
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-5">
          {/* Score & Probability */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`rounded-xl p-4 ${scoreBg}`}>
              <div className="flex items-center gap-2 mb-1">
                <Target size={14} className={scoreColor} />
                <span className={`text-[11px] font-600 uppercase tracking-wide ${scoreColor}`}>Skor Lead</span>
              </div>
              <p className={`text-3xl font-700 tabular-nums ${scoreColor}`}>{lead.skorLead}<span className="text-sm font-400">/100</span></p>
              <div className="mt-2 h-1.5 bg-white/60 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${lead.skorLead >= 80 ? 'bg-emerald-500' : lead.skorLead >= 60 ? 'bg-amber-500' : 'bg-red-400'}`} style={{ width: `${lead.skorLead}%` }} />
              </div>
            </div>
            <div className="rounded-xl p-4 bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={14} className="text-primary" />
                <span className="text-[11px] font-600 uppercase tracking-wide text-primary">Probabilitas</span>
              </div>
              <p className="text-3xl font-700 tabular-nums text-primary">{lead.probabilitas}<span className="text-sm font-400">%</span></p>
              <div className="mt-2 h-1.5 bg-primary/10 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-primary" style={{ width: `${lead.probabilitas}%` }} />
              </div>
            </div>
          </div>

          {/* Financial */}
          <div className="bg-muted/40 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign size={14} className="text-muted-foreground" />
              <span className="text-xs font-700 uppercase tracking-wide text-muted-foreground">Estimasi Nilai</span>
            </div>
            <p className="text-xl font-700 text-foreground font-mono">{formatRupiah(lead.estimasiNilai)}</p>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1.5">
                <FileText size={12} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Target: <strong className="text-foreground">{lead.jenisKontrakTarget}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Tag size={12} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{lead.segmen}</span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xs font-700 uppercase tracking-wide text-muted-foreground mb-3">Informasi Kontak</h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <User size={13} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs font-600 text-foreground">{lead.kontakUtama}</p>
                  <p className="text-[11px] text-muted-foreground">{lead.jabatan}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <Mail size={13} className="text-muted-foreground" />
                </div>
                <a href={`mailto:${lead.email}`} className="text-xs text-primary hover:underline">{lead.email}</a>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <Phone size={13} className="text-muted-foreground" />
                </div>
                <span className="text-xs text-foreground">{lead.telepon}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <MapPin size={13} className="text-muted-foreground" />
                </div>
                <span className="text-xs text-foreground">{lead.region}</span>
              </div>
            </div>
          </div>

          {/* Pipeline Info */}
          <div>
            <h4 className="text-xs font-700 uppercase tracking-wide text-muted-foreground mb-3">Info Pipeline</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/40 rounded-lg p-3">
                <p className="text-[10px] text-muted-foreground mb-0.5">Sumber Lead</p>
                <p className="text-xs font-600 text-foreground">{lead.source}</p>
              </div>
              <div className="bg-muted/40 rounded-lg p-3">
                <p className="text-[10px] text-muted-foreground mb-0.5">PIC Internal</p>
                <p className="text-xs font-600 text-foreground">{lead.picInternal}</p>
              </div>
              <div className="bg-muted/40 rounded-lg p-3">
                <p className="text-[10px] text-muted-foreground mb-0.5">Tanggal Masuk</p>
                <p className="text-xs font-600 text-foreground">{lead.tanggalMasuk}</p>
              </div>
              <div className="bg-muted/40 rounded-lg p-3">
                <p className="text-[10px] text-muted-foreground mb-0.5">Aktivitas Terakhir</p>
                <p className="text-xs font-600 text-foreground">{lead.lastActivity}</p>
              </div>
            </div>
          </div>

          {/* Next Action */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={13} className="text-amber-700" />
              <span className="text-xs font-700 text-amber-700 uppercase tracking-wide">Tindakan Selanjutnya</span>
            </div>
            <p className="text-sm font-600 text-foreground">{lead.nextAction}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <Calendar size={11} className="text-amber-600" />
              <span className="text-xs text-amber-700 font-500">{lead.nextActionDate}</span>
            </div>
          </div>

          {/* Notes */}
          {lead.catatan && (
            <div>
              <h4 className="text-xs font-700 uppercase tracking-wide text-muted-foreground mb-2">Catatan</h4>
              <p className="text-xs text-foreground/80 leading-relaxed bg-muted/40 rounded-lg p-3">{lead.catatan}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-border p-4 flex items-center gap-3">
          {lead.status !== 'Kalah' && lead.status !== 'Menang' && (
            <button
              onClick={() => onAddPartner(lead)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-600 hover:bg-primary/90 transition-all active:scale-95 shadow-sm"
            >
              <User size={14} />
              Jadikan Mitra — Mulai Pre-Sales
            </button>
          )}
          {lead.status === 'Menang' && (
            <button
              onClick={() => onAddPartner(lead)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-600 hover:bg-emerald-700 transition-all active:scale-95 shadow-sm"
            >
              <User size={14} />
              Onboarding Mitra Baru
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg border border-border text-sm font-500 text-foreground hover:bg-muted transition-all"
          >
            Tutup
          </button>
        </div>
      </div>
    </>
  );
}

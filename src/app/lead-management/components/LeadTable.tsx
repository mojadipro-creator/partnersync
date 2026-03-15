'use client';

import { Lead } from '@/lib/leadMockData';
import { ChevronUp, ChevronDown, ChevronsUpDown, Calendar, MapPin, User, ExternalLink } from 'lucide-react';

interface LeadTableProps {
  leads: Lead[];
  loading: boolean;
  onOpenDetail: (lead: Lead) => void;
  sortKey: string;
  sortDir: 'asc' | 'desc';
  onSort: (key: string) => void;
}

function formatRupiah(n: number) {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)}M`;
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(0)}Jt`;
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

const PRIORITY_STYLES: Record<string, string> = {
  'Tinggi': 'bg-red-50 text-red-700 border border-red-200',
  'Sedang': 'bg-amber-50 text-amber-700 border border-amber-200',
  'Rendah': 'bg-slate-50 text-slate-600 border border-slate-200',
};

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-400';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-700 tabular-nums text-foreground w-6 text-right">{score}</span>
    </div>
  );
}

function SortIcon({ active, dir }: { active: boolean; dir: 'asc' | 'desc' }) {
  if (!active) return <ChevronsUpDown size={12} className="text-muted-foreground/50" />;
  return dir === 'asc' ? <ChevronUp size={12} className="text-primary" /> : <ChevronDown size={12} className="text-primary" />;
}

const COLS = [
  { key: 'namaPerusahaan', label: 'Perusahaan', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'priority', label: 'Prioritas', sortable: true },
  { key: 'skorLead', label: 'Skor Lead', sortable: true },
  { key: 'estimasiNilai', label: 'Est. Nilai', sortable: true },
  { key: 'probabilitas', label: 'Prob.', sortable: true },
  { key: 'source', label: 'Sumber', sortable: true },
  { key: 'picInternal', label: 'PIC', sortable: false },
  { key: 'nextActionDate', label: 'Next Action', sortable: true },
  { key: 'actions', label: '', sortable: false },
];

export default function LeadTable({ leads, loading, onOpenDetail, sortKey, sortDir, onSort }: LeadTableProps) {
  if (loading) {
    return (
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="p-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            Memuat data lead...
          </div>
        </div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white border border-border rounded-xl p-12 text-center">
        <p className="text-sm font-600 text-foreground mb-1">Tidak ada lead ditemukan</p>
        <p className="text-xs text-muted-foreground">Coba ubah filter atau tambah lead baru</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {COLS.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-[11px] font-700 uppercase tracking-wide text-muted-foreground whitespace-nowrap ${col.sortable ? 'cursor-pointer hover:text-foreground select-none' : ''}`}
                  onClick={() => col.sortable && onSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && <SortIcon active={sortKey === col.key} dir={sortDir} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="hover:bg-muted/30 transition-colors cursor-pointer group"
                onClick={() => onOpenDetail(lead)}
              >
                {/* Company */}
                <td className="px-4 py-3">
                  <div className="max-w-[200px]">
                    <p className="font-600 text-foreground text-sm truncate">{lead.namaPerusahaan}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{lead.kontakUtama} · {lead.jabatan}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin size={10} className="text-muted-foreground flex-shrink-0" />
                      <span className="text-[10px] text-muted-foreground">{lead.region}</span>
                      <span className="text-[10px] text-muted-foreground">· {lead.segmen}</span>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-600 ${STATUS_STYLES[lead.status] || 'bg-muted text-muted-foreground'}`}>
                    {lead.status}
                  </span>
                </td>

                {/* Priority */}
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-600 ${PRIORITY_STYLES[lead.priority] || ''}`}>
                    {lead.priority}
                  </span>
                </td>

                {/* Score */}
                <td className="px-4 py-3 min-w-[110px]">
                  <ScoreBar score={lead.skorLead} />
                </td>

                {/* Value */}
                <td className="px-4 py-3">
                  <span className="font-mono text-xs font-600 text-foreground">{formatRupiah(lead.estimasiNilai)}</span>
                  <p className="text-[10px] text-muted-foreground">{lead.jenisKontrakTarget}</p>
                </td>

                {/* Probability */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-700 tabular-nums"
                      style={{
                        background: `conic-gradient(${lead.probabilitas >= 70 ? '#22c55e' : lead.probabilitas >= 40 ? '#f59e0b' : '#ef4444'} ${lead.probabilitas * 3.6}deg, hsl(210 16% 93%) 0deg)`,
                      }}
                    >
                      <span className="bg-white rounded-full w-6 h-6 flex items-center justify-center text-[9px] font-700">
                        {lead.probabilitas}%
                      </span>
                    </div>
                  </div>
                </td>

                {/* Source */}
                <td className="px-4 py-3">
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full whitespace-nowrap">{lead.source}</span>
                </td>

                {/* PIC */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User size={11} className="text-primary" />
                    </div>
                    <span className="text-xs text-foreground whitespace-nowrap">{lead.picInternal.split(' ')[0]}</span>
                  </div>
                </td>

                {/* Next Action */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar size={11} className="flex-shrink-0" />
                    <span className="whitespace-nowrap">{lead.nextActionDate}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5 max-w-[130px] truncate">{lead.nextAction}</p>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); onOpenDetail(lead); }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-primary/10 text-primary"
                    title="Lihat detail"
                  >
                    <ExternalLink size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

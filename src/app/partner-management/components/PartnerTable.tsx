'use client';

import { useState } from 'react';
import {
  ChevronUp, ChevronDown, ChevronsUpDown,
  Eye, RefreshCw, MoreHorizontal, Building2, AlertTriangle,
} from 'lucide-react';
import { Partner, formatRupiah } from '@/lib/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import { toast } from 'sonner';

interface PartnerTableProps {
  partners: Partner[];
  loading: boolean;
  onOpenDetail: (partner: Partner) => void;
}

type SortKey = 'namaPerusahaan' | 'totalNilaiKontrak' | 'complianceScore' | 'skorPeluang' | 'kontrakAktif';
type SortDir = 'asc' | 'desc';

const segmenColors: Record<string, string> = {
  Migas: 'bg-orange-50 text-orange-700',
  Logistik: 'bg-blue-50 text-blue-700',
  Industri: 'bg-slate-100 text-slate-700',
  Kepelabuhanan: 'bg-cyan-50 text-cyan-700',
  Perdagangan: 'bg-violet-50 text-violet-700',
  Utilitas: 'bg-teal-50 text-teal-700',
};

const ratingColors: Record<string, string> = {
  A: 'bg-emerald-50 text-emerald-700',
  B: 'bg-blue-50 text-blue-700',
  C: 'bg-amber-50 text-amber-700',
  D: 'bg-red-50 text-red-700',
};

function SkorBar({ skor }: { skor: number }) {
  const color = skor >= 85 ? '#16a34a' : skor >= 65 ? '#d97706' : '#dc2626';
  return (
    <div className="flex items-center gap-2">
      <div className="w-14 bg-muted rounded-full h-1.5 flex-shrink-0">
        <div className="h-1.5 rounded-full" style={{ width: `${skor}%`, backgroundColor: color }} />
      </div>
      <span className="font-mono text-xs font-700 tabular-nums" style={{ color }}>{skor}</span>
    </div>
  );
}

function ComplianceBar({ score }: { score: number }) {
  const color = score >= 90 ? '#16a34a' : score >= 70 ? '#d97706' : '#dc2626';
  return (
    <div className="flex items-center gap-2">
      <div className="w-14 bg-muted rounded-full h-1.5 flex-shrink-0">
        <div className="h-1.5 rounded-full" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="font-mono text-xs font-600 tabular-nums" style={{ color }}>{score}%</span>
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 10 }).map((_, i) => (
        <td key={i} className="px-3 py-4">
          <div className="h-4 bg-muted rounded" style={{ width: i === 0 ? 180 : i === 2 ? 80 : 60 }} />
        </td>
      ))}
    </tr>
  );
}

export default function PartnerTable({ partners, loading, onOpenDetail }: PartnerTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('skorPeluang');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  const sorted = [...partners].sort((a, b) => {
    const av = a[sortKey] as number | string;
    const bv = b[sortKey] as number | string;
    if (typeof av === 'number' && typeof bv === 'number') {
      return sortDir === 'asc' ? av - bv : bv - av;
    }
    return sortDir === 'asc' ? String(av).localeCompare(String(bv),'id')
      : String(bv).localeCompare(String(av), 'id');
  });

  function SortIcon({ col }: { col: SortKey }) {
    if (col !== sortKey) return <ChevronsUpDown size={11} className="text-muted-foreground/50" />;
    return sortDir === 'asc' ? <ChevronUp size={11} className="text-primary" /> : <ChevronDown size={11} className="text-primary" />;
  }

  function thSort(key: SortKey, label: string, align: 'left' | 'right' = 'left') {
    return (
      <th
        className={`px-3 py-3 text-${align} text-[11px] font-600 uppercase tracking-wide cursor-pointer select-none whitespace-nowrap ${sortKey === key ? 'text-primary' : 'text-muted-foreground'}`}
        onClick={() => handleSort(key)}
      >
        <div className={`flex items-center gap-1.5 ${align === 'right' ? 'justify-end' : ''}`}>
          {label} <SortIcon col={key} />
        </div>
      </th>
    );
  }

  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 border-b border-border">
              {thSort('namaPerusahaan', 'Mitra / Perusahaan')}
              <th className="px-3 py-3 text-left text-[11px] font-600 uppercase tracking-wide text-muted-foreground whitespace-nowrap">Segmen</th>
              <th className="px-3 py-3 text-left text-[11px] font-600 uppercase tracking-wide text-muted-foreground whitespace-nowrap">PIC Internal</th>
              {thSort('kontrakAktif', 'K. Aktif')}
              {thSort('totalNilaiKontrak', 'Nilai Total', 'right')}
              {thSort('complianceScore', 'Compliance')}
              <th className="px-3 py-3 text-left text-[11px] font-600 uppercase tracking-wide text-muted-foreground whitespace-nowrap">Rating K3</th>
              <th className="px-3 py-3 text-left text-[11px] font-600 uppercase tracking-wide text-muted-foreground whitespace-nowrap">Status</th>
              {thSort('skorPeluang', 'Skor Peluang')}
              <th className="px-3 py-3 text-center text-[11px] font-600 uppercase tracking-wide text-muted-foreground">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
              : sorted.length === 0
              ? (
                <tr>
                  <td colSpan={10} className="py-16 text-center">
                    <Building2 size={36} className="mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-sm font-600 text-muted-foreground">Tidak ada mitra ditemukan</p>
                    <p className="text-xs text-muted-foreground mt-1">Coba ubah filter atau kata kunci pencarian</p>
                  </td>
                </tr>
              )
              : sorted.map((partner) => (
                <tr
                  key={partner.id}
                  className="group hover:bg-muted/30 transition-colors duration-100"
                >
                  <td className="px-3 py-3.5 min-w-[200px]">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[10px] font-700 text-primary">
                          {partner.namaPerusahaan.split(' ').filter(w => !['PT', 'Tbk.', 'Ltd.'].includes(w)).slice(0, 2).map(w => w[0]).join('')}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-600 text-foreground leading-snug truncate max-w-[200px]">{partner.namaPerusahaan}</p>
                        <p className="text-[11px] font-mono text-muted-foreground">{partner.npwp}</p>
                        <p className="text-[11px] text-muted-foreground">{partner.region}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3.5">
                    <span className={`text-[11px] font-600 px-2 py-0.5 rounded-full whitespace-nowrap ${segmenColors[partner.segmenBisnis] ?? 'bg-slate-100 text-slate-600'}`}>
                      {partner.segmenBisnis}
                    </span>
                  </td>
                  <td className="px-3 py-3.5">
                    <span className="text-xs text-foreground whitespace-nowrap">{partner.picInternal}</span>
                  </td>
                  <td className="px-3 py-3.5 text-center">
                    <span className={`font-mono text-sm font-700 tabular-nums ${partner.kontrakAktif === 0 ? 'text-red-500' : 'text-foreground'}`}>
                      {partner.kontrakAktif}
                    </span>
                    {partner.kontrakAktif === 0 && (
                      <AlertTriangle size={11} className="text-red-400 inline ml-1" />
                    )}
                  </td>
                  <td className="px-3 py-3.5 text-right">
                    <span className="font-mono text-xs font-600 text-foreground tabular-nums whitespace-nowrap">
                      {formatRupiah(partner.totalNilaiKontrak)}
                    </span>
                  </td>
                  <td className="px-3 py-3.5">
                    <ComplianceBar score={partner.complianceScore} />
                  </td>
                  <td className="px-3 py-3.5">
                    <span className={`text-xs font-700 px-2 py-0.5 rounded-full ${ratingColors[partner.ratingK3]}`}>
                      {partner.ratingK3}
                    </span>
                  </td>
                  <td className="px-3 py-3.5">
                    <StatusBadge status={partner.status} size="sm" dot />
                  </td>
                  <td className="px-3 py-3.5">
                    <SkorBar skor={partner.skorPeluang} />
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onOpenDetail(partner)}
                        title="Lihat Detail"
                        className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => toast.info(`Inisiasi renewal untuk ${partner.namaPerusahaan}`)}
                        title="Inisiasi Renewal"
                        className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-cyan-50 hover:text-cyan-700 transition-colors"
                      >
                        <RefreshCw size={14} />
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === partner.id ? null : partner.id)}
                          title="Lainnya"
                          className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                        >
                          <MoreHorizontal size={14} />
                        </button>
                        {openMenuId === partner.id && (
                          <div className="absolute right-0 top-8 w-44 bg-white border border-border rounded-lg shadow-lg z-20 py-1 animate-fade-in">
                            <button
                              onClick={() => { onOpenDetail(partner); setOpenMenuId(null); }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                            >
                              <Eye size={13} /> Profil Lengkap
                            </button>
                            <button
                              onClick={() => { toast.info('Membuka histori kontrak'); setOpenMenuId(null); }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                            >
                              <Building2 size={13} /> Histori Kontrak
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
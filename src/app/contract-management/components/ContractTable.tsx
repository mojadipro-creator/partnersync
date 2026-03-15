'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, Eye, ShieldCheck, RefreshCw, Trash2, MoreHorizontal, AlertTriangle, FileText,  } from 'lucide-react';
import { Contract } from '@/lib/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import { toast } from 'sonner';

interface ContractTableProps {
  contracts: Contract[];
  selectedIds: string[];
  onSelectAll: (ids: string[]) => void;
  onSelectOne: (id: string) => void;
  onOpenCompliance: (contract: Contract) => void;
  loading: boolean;
}

type SortKey = 'nomorKontrak' | 'mitra' | 'nilaiKontrak' | 'tanggalAkhir' | 'sisaHari' | 'complianceScore';
type SortDir = 'asc' | 'desc';

function formatRp(v: number) {
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)} M`;
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(0)} Jt`;
  return v.toLocaleString('id-ID');
}

function SisaHariCell({ hari }: { hari: number }) {
  if (hari < 0) return <span className="font-mono text-xs font-600 text-red-600">Expired</span>;
  if (hari <= 30) return (
    <span className="inline-flex items-center gap-1 text-xs font-600 text-red-600">
      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
      {hari}h
    </span>
  );
  if (hari <= 60) return <span className="font-mono text-xs font-600 text-orange-600">{hari}h</span>;
  if (hari <= 90) return <span className="font-mono text-xs font-600 text-amber-600">{hari}h</span>;
  return <span className="font-mono text-xs text-muted-foreground">{hari}h</span>;
}

function ComplianceCell({ score, missing }: { score: number; missing: string[] }) {
  const color = score >= 90 ? 'text-emerald-700' : score >= 70 ? 'text-amber-700' : 'text-red-700';
  const bg = score >= 90 ? 'bg-emerald-500' : score >= 70 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="w-12 bg-muted rounded-full h-1.5 flex-shrink-0">
        <div className={`h-1.5 rounded-full ${bg}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`font-mono text-xs font-600 tabular-nums ${color}`}>{score}%</span>
      {missing.length > 0 && (
        <span
          title={`${missing.length} klausul kurang: ${missing.join(', ')}`}
          className="cursor-help flex-shrink-0"
        >
          <AlertTriangle size={12} className="text-red-500" />
        </span>
      )}
    </div>
  );
}

function SortIcon({ column, sortKey, sortDir }: { column: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (column !== sortKey) return <ChevronsUpDown size={12} className="text-muted-foreground/50" />;
  return sortDir === 'asc'
    ? <ChevronUp size={12} className="text-primary" />
    : <ChevronDown size={12} className="text-primary" />;
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 11 }).map((_, i) => (
        <td key={i} className="px-3 py-3.5">
          <div className="h-4 bg-muted rounded" style={{ width: i === 0 ? 20 : i === 1 ? 120 : i === 2 ? 160 : 80 }} />
        </td>
      ))}
    </tr>
  );
}

export default function ContractTable({
  contracts,
  selectedIds,
  onSelectAll,
  onSelectOne,
  onOpenCompliance,
  loading,
}: ContractTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('sisaHari');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const sorted = [...contracts].sort((a, b) => {
    const av = a[sortKey] as number | string;
    const bv = b[sortKey] as number | string;
    if (typeof av === 'number' && typeof bv === 'number') {
      return sortDir === 'asc' ? av - bv : bv - av;
    }
    return sortDir === 'asc' ? String(av).localeCompare(String(bv),'id')
      : String(bv).localeCompare(String(av), 'id');
  });

  const allSelected = contracts.length > 0 && contracts.every((c) => selectedIds.includes(c.id));

  function thClass(key: SortKey) {
    return `px-3 py-3 text-left cursor-pointer select-none group whitespace-nowrap ${sortKey === key ? 'text-primary' : 'text-muted-foreground'}`;
  }

  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 border-b border-border">
              <th className="px-3 py-3 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => onSelectAll(allSelected ? [] : contracts.map((c) => c.id))}
                  className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
                  aria-label="Pilih semua"
                />
              </th>
              <th
                className={`${thClass('nomorKontrak')} text-[11px] font-600 uppercase tracking-wide`}
                onClick={() => handleSort('nomorKontrak')}
              >
                <div className="flex items-center gap-1.5">
                  No. Kontrak
                  <SortIcon column="nomorKontrak" sortKey={sortKey} sortDir={sortDir} />
                </div>
              </th>
              <th
                className={`${thClass('mitra')} text-[11px] font-600 uppercase tracking-wide`}
                onClick={() => handleSort('mitra')}
              >
                <div className="flex items-center gap-1.5">
                  Mitra
                  <SortIcon column="mitra" sortKey={sortKey} sortDir={sortDir} />
                </div>
              </th>
              <th className="px-3 py-3 text-left text-[11px] font-600 uppercase tracking-wide text-muted-foreground whitespace-nowrap">Jenis</th>
              <th
                className={`${thClass('nilaiKontrak')} text-[11px] font-600 uppercase tracking-wide text-right`}
                onClick={() => handleSort('nilaiKontrak')}
              >
                <div className="flex items-center justify-end gap-1.5">
                  Nilai (Rp)
                  <SortIcon column="nilaiKontrak" sortKey={sortKey} sortDir={sortDir} />
                </div>
              </th>
              <th className="px-3 py-3 text-left text-[11px] font-600 uppercase tracking-wide text-muted-foreground whitespace-nowrap">Tgl Mulai</th>
              <th
                className={`${thClass('tanggalAkhir')} text-[11px] font-600 uppercase tracking-wide`}
                onClick={() => handleSort('tanggalAkhir')}
              >
                <div className="flex items-center gap-1.5">
                  Tgl Akhir
                  <SortIcon column="tanggalAkhir" sortKey={sortKey} sortDir={sortDir} />
                </div>
              </th>
              <th
                className={`${thClass('sisaHari')} text-[11px] font-600 uppercase tracking-wide`}
                onClick={() => handleSort('sisaHari')}
              >
                <div className="flex items-center gap-1.5">
                  Sisa
                  <SortIcon column="sisaHari" sortKey={sortKey} sortDir={sortDir} />
                </div>
              </th>
              <th className="px-3 py-3 text-left text-[11px] font-600 uppercase tracking-wide text-muted-foreground whitespace-nowrap">Status</th>
              <th
                className={`${thClass('complianceScore')} text-[11px] font-600 uppercase tracking-wide`}
                onClick={() => handleSort('complianceScore')}
              >
                <div className="flex items-center gap-1.5">
                  Compliance
                  <SortIcon column="complianceScore" sortKey={sortKey} sortDir={sortDir} />
                </div>
              </th>
              <th className="px-3 py-3 text-left text-[11px] font-600 uppercase tracking-wide text-muted-foreground whitespace-nowrap">PIC</th>
              <th className="px-3 py-3 text-center text-[11px] font-600 uppercase tracking-wide text-muted-foreground">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
              : sorted.length === 0
              ? (
                <tr>
                  <td colSpan={12} className="py-16 text-center">
                    <FileText size={36} className="mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-sm font-600 text-muted-foreground">Tidak ada kontrak ditemukan</p>
                    <p className="text-xs text-muted-foreground mt-1">Coba ubah filter atau kata kunci pencarian</p>
                  </td>
                </tr>
              )
              : sorted.map((contract) => {
                  const isSelected = selectedIds.includes(contract.id);
                  return (
                    <tr
                      key={contract.id}
                      className={`
                        group transition-colors duration-100
                        ${isSelected ? 'bg-primary/5' : 'hover:bg-muted/30'}
                        ${contract.sisaHari <= 30 && contract.sisaHari >= 0 ? 'border-l-2 border-l-red-400' : ''}
                        ${contract.sisaHari < 0 ? 'border-l-2 border-l-red-600 opacity-75' : ''}
                      `}
                    >
                      <td className="px-3 py-3.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onSelectOne(contract.id)}
                          className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
                          aria-label={`Pilih ${contract.mitra}`}
                        />
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="font-mono text-[11px] font-500 text-primary whitespace-nowrap">
                          {contract.nomorKontrak.length > 28
                            ? contract.nomorKontrak.substring(0, 28) + '…'
                            : contract.nomorKontrak}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 min-w-[180px]">
                        <p className="text-sm font-500 text-foreground leading-snug">{contract.mitra}</p>
                        <p className="text-[11px] text-muted-foreground">{contract.region} · {contract.kategori.split('(')[0].trim()}</p>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="text-xs font-500 whitespace-nowrap text-foreground/80">{contract.jenisKontrak}</span>
                      </td>
                      <td className="px-3 py-3.5 text-right">
                        <span className="font-mono text-xs font-600 text-foreground tabular-nums whitespace-nowrap">
                          Rp {formatRp(contract.nilaiKontrak)}
                        </span>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(contract.tanggalMulai).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: '2-digit' })}
                        </span>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="font-mono text-xs text-foreground whitespace-nowrap">
                          {new Date(contract.tanggalAkhir).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: '2-digit' })}
                        </span>
                      </td>
                      <td className="px-3 py-3.5">
                        <SisaHariCell hari={contract.sisaHari} />
                      </td>
                      <td className="px-3 py-3.5">
                        <StatusBadge status={contract.status} size="sm" dot />
                      </td>
                      <td className="px-3 py-3.5">
                        <ComplianceCell score={contract.complianceScore} missing={contract.missingClauses} />
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{contract.picInternal}</span>
                      </td>
                      <td className="px-3 py-3.5">
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onOpenCompliance(contract)}
                            title="Cek Compliance"
                            className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                          >
                            <ShieldCheck size={14} />
                          </button>
                          <button
                            onClick={() => toast.info(`Memproses renewal: ${contract.nomorKontrak}`)}
                            title="Renewal"
                            className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-cyan-50 hover:text-cyan-700 transition-colors"
                          >
                            <RefreshCw size={14} />
                          </button>
                          <div className="relative">
                            <button
                              onClick={() => setOpenMenuId(openMenuId === contract.id ? null : contract.id)}
                              title="Lainnya"
                              className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                            >
                              <MoreHorizontal size={14} />
                            </button>
                            {openMenuId === contract.id && (
                              <div className="absolute right-0 top-8 w-44 bg-white border border-border rounded-lg shadow-lg z-20 py-1 animate-fade-in">
                                <button
                                  onClick={() => { toast.success('Membuka detail kontrak'); setOpenMenuId(null); }}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                                >
                                  <Eye size={13} /> Detail Kontrak
                                </button>
                                <button
                                  onClick={() => { toast.info('Mengunduh dokumen'); setOpenMenuId(null); }}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                                >
                                  <FileText size={13} /> Unduh Dokumen
                                </button>
                                <hr className="my-1 border-border" />
                                <button
                                  onClick={() => { toast.error('Kontrak dihapus'); setOpenMenuId(null); }}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-destructive/5 transition-colors"
                                >
                                  <Trash2 size={13} /> Hapus Kontrak
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
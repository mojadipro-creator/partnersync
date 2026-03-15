'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Clock, ArrowRight, RefreshCw } from 'lucide-react';
import { contracts } from '@/lib/mockData';


// Backend integration point: replace with GET /api/contracts?filter=expiring&limit=8
function useExpiringContracts() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const expiring = contracts
    .filter((c) => c.sisaHari <= 90)
    .sort((a, b) => a.sisaHari - b.sisaHari);

  return { loading, expiring };
}

function formatRp(v: number) {
  if (v >= 1_000_000_000) return `Rp ${(v / 1_000_000_000).toFixed(1)} M`;
  return `Rp ${(v / 1_000_000).toFixed(0)} Jt`;
}

function SisaHariBadge({ hari }: { hari: number }) {
  if (hari < 0) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-600 px-2 py-0.5 rounded-full bg-red-100 text-red-700">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
        Expired {Math.abs(hari)}h lalu
      </span>
    );
  }
  if (hari <= 30) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-600 px-2 py-0.5 rounded-full bg-red-100 text-red-700">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        {hari} hari
      </span>
    );
  }
  if (hari <= 60) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-600 px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
        {hari} hari
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-600 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
      {hari} hari
    </span>
  );
}

function ComplianceBar({ score, missing }: { score: number; missing: string[] }) {
  const color = score >= 90 ? '#16a34a' : score >= 75 ? '#d97706' : '#dc2626';
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 bg-muted rounded-full h-1.5">
        <div className="h-1.5 rounded-full transition-all" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-600 tabular-nums" style={{ color }}>{score}%</span>
      {missing.length > 0 && (
        <span title={`Missing: ${missing.join(', ')}`} className="cursor-help">
          <AlertTriangle size={12} className="text-red-500" />
        </span>
      )}
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-muted rounded w-full" />
        </td>
      ))}
    </tr>
  );
}

export default function ExpiringContractsTable() {
  const { loading, expiring } = useExpiringContracts();

  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
            <Clock size={16} className="text-amber-700" />
          </div>
          <div>
            <h3 className="text-sm font-600 text-foreground">Kontrak Prioritas — Mendekati/Sudah Akhir</h3>
            <p className="text-xs text-muted-foreground">Kontrak ≤90 hari tersisa, diurutkan berdasarkan urgensi</p>
          </div>
        </div>
        <Link
          href="/contract-management"
          className="flex items-center gap-1.5 text-xs font-600 text-primary hover:text-primary/80 transition-colors"
        >
          Lihat semua <ArrowRight size={13} />
        </Link>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/40">
              <th className="text-left px-4 py-3 text-[11px] font-600 uppercase tracking-wide text-muted-foreground whitespace-nowrap">No. Kontrak</th>
              <th className="text-left px-4 py-3 text-[11px] font-600 uppercase tracking-wide text-muted-foreground whitespace-nowrap">Mitra</th>
              <th className="text-left px-4 py-3 text-[11px] font-600 uppercase tracking-wide text-muted-foreground whitespace-nowrap">Jenis</th>
              <th className="text-right px-4 py-3 text-[11px] font-600 uppercase tracking-wide text-muted-foreground whitespace-nowrap">Nilai</th>
              <th className="text-left px-4 py-3 text-[11px] font-600 uppercase tracking-wide text-muted-foreground whitespace-nowrap">Tgl. Akhir</th>
              <th className="text-left px-4 py-3 text-[11px] font-600 uppercase tracking-wide text-muted-foreground whitespace-nowrap">Sisa Hari</th>
              <th className="text-left px-4 py-3 text-[11px] font-600 uppercase tracking-wide text-muted-foreground whitespace-nowrap">Compliance</th>
              <th className="text-left px-4 py-3 text-[11px] font-600 uppercase tracking-wide text-muted-foreground whitespace-nowrap">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              : expiring.map((contract) => (
                  <tr
                    key={contract.id}
                    className="hover:bg-muted/30 transition-colors duration-100 group"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-[11px] text-primary font-500 whitespace-nowrap">
                        {contract.nomorKontrak.split('/').slice(0, 3).join('/')}…
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-500 text-foreground">{contract.mitra}</span>
                      <p className="text-[11px] text-muted-foreground">{contract.region}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-500 text-foreground whitespace-nowrap">{contract.jenisKontrak}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-mono text-xs font-500 text-foreground whitespace-nowrap">
                        {formatRp(contract.nilaiKontrak)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-foreground font-mono whitespace-nowrap">
                        {new Date(contract.tanggalAkhir).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <SisaHariBadge hari={contract.sisaHari} />
                    </td>
                    <td className="px-4 py-3">
                      <ComplianceBar score={contract.complianceScore} missing={contract.missingClauses} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href="/contract-management"
                          className="flex items-center gap-1 text-[11px] font-600 text-primary hover:text-primary/80 px-2 py-1 rounded bg-primary/5 hover:bg-primary/10 transition-colors whitespace-nowrap"
                        >
                          <RefreshCw size={11} /> Renewal
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {!loading && expiring.length === 0 && (
        <div className="py-12 text-center">
          <Clock size={32} className="mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-sm font-500 text-muted-foreground">Tidak ada kontrak mendekati akhir</p>
          <p className="text-xs text-muted-foreground mt-1">Semua kontrak masih memiliki sisa waktu &gt;90 hari</p>
        </div>
      )}
    </div>
  );
}
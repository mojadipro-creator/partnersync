'use client';

import { useState, useEffect } from 'react';
import {
  FileText,
  Clock,
  ShieldCheck,
  Wallet,
  AlertTriangle,
  Users,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { contracts } from '@/lib/mockData';

// Backend integration point: replace with API call to GET /api/dashboard/kpi-summary
function useKPIData() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const aktif = contracts.filter((c) => c.status === 'Aktif').length;
  const mendekatiAkhir = contracts.filter((c) => c.status === 'Mendekati Akhir').length;
  const expired = contracts.filter((c) => c.status === 'Expired').length;
  const missingClauseCount = contracts.filter((c) => c.missingClauses.length > 0).length;
  const allActive = contracts.filter((c) => c.status === 'Aktif' || c.status === 'Mendekati Akhir');
  const totalNilai = allActive.reduce((s, c) => s + c.nilaiKontrak, 0);
  const avgCompliance = Math.round(contracts.reduce((s, c) => s + c.complianceScore, 0) / contracts.length);
  const totalPNBP = contracts.filter((c) => c.status === 'Aktif').reduce((s, c) => s + c.pnbpValue, 0);
  const mitraAktif = new Set(contracts.filter((c) => c.status === 'Aktif' || c.status === 'Mendekati Akhir').map((c) => c.mitraId)).size;
  const renewalRate = 82;

  return {
    loading,
    aktif,
    mendekatiAkhir,
    expired,
    missingClauseCount,
    totalNilai,
    avgCompliance,
    totalPNBP,
    mitraAktif,
    renewalRate,
  };
}

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-border p-5 animate-pulse ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-muted" />
        <div className="w-16 h-5 rounded-full bg-muted" />
      </div>
      <div className="w-24 h-8 bg-muted rounded mb-2" />
      <div className="w-32 h-4 bg-muted rounded" />
    </div>
  );
}

function formatRupiahShort(v: number) {
  if (v >= 1_000_000_000_000) return `Rp ${(v / 1_000_000_000_000).toFixed(1)} T`;
  if (v >= 1_000_000_000) return `Rp ${(v / 1_000_000_000).toFixed(1)} M`;
  if (v >= 1_000_000) return `Rp ${(v / 1_000_000).toFixed(0)} Jt`;
  return `Rp ${v.toLocaleString('id-ID')}`;
}

interface TrendPillProps {
  value: string;
  direction: 'up' | 'down' | 'flat';
  inverted?: boolean;
}

function TrendPill({ value, direction, inverted = false }: TrendPillProps) {
  const isGood = inverted ? direction === 'down' : direction === 'up';
  const isBad = inverted ? direction === 'up' : direction === 'down';
  return (
    <span className={`
      inline-flex items-center gap-1 text-[11px] font-600 px-2 py-0.5 rounded-full
      ${isGood ? 'bg-emerald-50 text-emerald-700' : isBad ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'}
    `}>
      {direction === 'up' && <TrendingUp size={10} />}
      {direction === 'down' && <TrendingDown size={10} />}
      {direction === 'flat' && <Minus size={10} />}
      {value}
    </span>
  );
}

export default function KPIBentoGrid() {
  const data = useKPIData();

  if (data.loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        <SkeletonCard className="lg:col-span-2" />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  // Grid plan: 7 cards
  // Row 1: hero (col-span-2) + 2 regular = 4 cols
  // Row 2: 4 regular = 4 cols
  // Total: 7 cards, no orphan — hero spans 2 cols

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
      {/* HERO: Total Kontrak Aktif — col-span-2 */}
      <div className="lg:col-span-2 bg-gradient-to-br from-primary to-[hsl(213,70%,22%)] rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white" />
          <div className="absolute -bottom-12 -left-4 w-32 h-32 rounded-full bg-white" />
        </div>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
              <FileText size={22} className="text-white" />
            </div>
            <TrendPill value="+2 bulan ini" direction="up" />
          </div>
          <p className="text-sm font-500 text-white/70 mb-1 tracking-wide">Total Kontrak Aktif</p>
          <p className="text-5xl font-700 tabular-nums mb-2">{data.aktif}</p>
          <div className="flex items-center gap-4 text-sm text-white/70">
            <span><span className="text-white font-600">{data.mendekatiAkhir}</span> mendekati akhir</span>
            <span>•</span>
            <span><span className="text-white font-600">{data.expired}</span> expired</span>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
            <span className="text-xs text-white/60">Diperbarui: 15 Mar 2026, 08:43 WIB</span>
            <span className="flex items-center gap-1 text-xs text-white/80">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>
        </div>
      </div>

      {/* Mendekati Akhir — warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 relative overflow-hidden">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <Clock size={18} className="text-amber-700" />
          </div>
          <TrendPill value="+1 minggu ini" direction="up" inverted />
        </div>
        <p className="text-xs font-600 uppercase tracking-wide text-amber-600 mb-1">Mendekati Akhir</p>
        <p className="text-4xl font-700 tabular-nums text-amber-800 mb-1">{data.mendekatiAkhir}</p>
        <p className="text-xs text-amber-600">kontrak ≤90 hari tersisa</p>
        <p className="text-[11px] text-amber-500 mt-2">Paling kritis: 16 hari (PetroChina)</p>
      </div>

      {/* Missing Clause Alerts — critical red */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-5 relative overflow-hidden">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <AlertTriangle size={18} className="text-red-700" />
          </div>
          <span className="text-[10px] font-700 px-2 py-0.5 rounded-full bg-red-200 text-red-800">KRITIS</span>
        </div>
        <p className="text-xs font-600 uppercase tracking-wide text-red-600 mb-1">Alert Klausul Kurang</p>
        <p className="text-4xl font-700 tabular-nums text-red-800 mb-1">{data.missingClauseCount}</p>
        <p className="text-xs text-red-600">kontrak dengan klausul wajib belum lengkap</p>
        <p className="text-[11px] text-red-400 mt-2">Termasuk K3, GCG, Force Majeure</p>
      </div>

      {/* Compliance Rate */}
      <div className="bg-white border border-border rounded-xl p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
            <ShieldCheck size={18} className="text-emerald-700" />
          </div>
          <TrendPill value="+2% vs Feb" direction="up" />
        </div>
        <p className="text-xs font-600 uppercase tracking-wide text-muted-foreground mb-1">Compliance Rate</p>
        <p className="text-4xl font-700 tabular-nums text-foreground mb-1">{data.avgCompliance}<span className="text-lg text-muted-foreground font-500">%</span></p>
        <div className="w-full bg-muted rounded-full h-1.5 mt-2">
          <div
            className="bg-emerald-500 h-1.5 rounded-full transition-all duration-700"
            style={{ width: `${data.avgCompliance}%` }}
          />
        </div>
        <p className="text-[11px] text-muted-foreground mt-1.5">Target: 90% — masih kurang {90 - data.avgCompliance}%</p>
      </div>

      {/* Nilai Portofolio */}
      <div className="bg-white border border-border rounded-xl p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Wallet size={18} className="text-primary" />
          </div>
          <TrendPill value="+12% YoY" direction="up" />
        </div>
        <p className="text-xs font-600 uppercase tracking-wide text-muted-foreground mb-1">Nilai Portofolio</p>
        <p className="text-2xl font-700 tabular-nums text-foreground mb-1 leading-tight">{formatRupiahShort(data.totalNilai)}</p>
        <p className="text-[11px] text-muted-foreground">Kontrak aktif & mendekati akhir</p>
      </div>

      {/* PNBP Terealisasi */}
      <div className="bg-white border border-border rounded-xl p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center">
            <TrendingUp size={18} className="text-cyan-700" />
          </div>
          <TrendPill value="+8% vs Q4" direction="up" />
        </div>
        <p className="text-xs font-600 uppercase tracking-wide text-muted-foreground mb-1">PNBP Terealisasi</p>
        <p className="text-2xl font-700 tabular-nums text-foreground mb-1 leading-tight">{formatRupiahShort(data.totalPNBP)}</p>
        <p className="text-[11px] text-muted-foreground">Penerimaan Negara Bukan Pajak Q1 2026</p>
      </div>

      {/* Mitra Aktif */}
      <div className="bg-white border border-border rounded-xl p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
            <Users size={18} className="text-violet-700" />
          </div>
          <TrendPill value="stabil" direction="flat" />
        </div>
        <p className="text-xs font-600 uppercase tracking-wide text-muted-foreground mb-1">Mitra Aktif</p>
        <p className="text-4xl font-700 tabular-nums text-foreground mb-1">{data.mitraAktif}</p>
        <p className="text-[11px] text-muted-foreground">dari 10 mitra terdaftar</p>
      </div>

      {/* Renewal Rate */}
      <div className="bg-white border border-border rounded-xl p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <RefreshCw size={18} className="text-accent" />
          </div>
          <TrendPill value="+5% vs 2025" direction="up" />
        </div>
        <p className="text-xs font-600 uppercase tracking-wide text-muted-foreground mb-1">Renewal Rate</p>
        <p className="text-4xl font-700 tabular-nums text-foreground mb-1">{data.renewalRate}<span className="text-lg text-muted-foreground font-500">%</span></p>
        <div className="w-full bg-muted rounded-full h-1.5 mt-2">
          <div
            className="bg-accent h-1.5 rounded-full"
            style={{ width: `${data.renewalRate}%` }}
          />
        </div>
        <p className="text-[11px] text-muted-foreground mt-1.5">Target: 85% — sudah tercapai</p>
      </div>
    </div>
  );
}
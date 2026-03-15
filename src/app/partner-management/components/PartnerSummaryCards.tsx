'use client';

import { Building2, TrendingUp, ShieldCheck, AlertTriangle } from 'lucide-react';
import { partners } from '@/lib/mockData';

export default function PartnerSummaryCards() {
  const mitraAktif = partners?.filter((p) => p?.status === 'Mitra Aktif')?.length;
  const totalMitra = partners?.length;
  const avgCompliance = Math.round(partners?.reduce((s, p) => s + p?.complianceScore, 0) / partners?.length);
  const avgSkorPeluang = Math.round(partners?.reduce((s, p) => s + p?.skorPeluang, 0) / partners?.length);
  const lowCompliance = partners?.filter((p) => p?.complianceScore < 70)?.length;
  const highOpportunity = partners?.filter((p) => p?.skorPeluang >= 85)?.length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4 mb-4">
      <div className="bg-white border border-border rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Building2 size={18} className="text-primary" />
        </div>
        <div>
          <p className="text-[11px] font-600 uppercase tracking-wide text-muted-foreground">Mitra Aktif</p>
          <p className="text-2xl font-700 text-foreground tabular-nums">{mitraAktif}<span className="text-sm text-muted-foreground font-400">/{totalMitra}</span></p>
        </div>
      </div>

      <div className="bg-white border border-border rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
          <ShieldCheck size={18} className="text-emerald-700" />
        </div>
        <div>
          <p className="text-[11px] font-600 uppercase tracking-wide text-muted-foreground">Avg. Compliance</p>
          <p className="text-2xl font-700 text-foreground tabular-nums">{avgCompliance}<span className="text-sm text-muted-foreground font-400">%</span></p>
        </div>
      </div>

      <div className={`border rounded-xl p-4 flex items-center gap-3 ${lowCompliance > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-border'}`}>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${lowCompliance > 0 ? 'bg-red-100' : 'bg-slate-50'}`}>
          <AlertTriangle size={18} className={lowCompliance > 0 ? 'text-red-700' : 'text-slate-500'} />
        </div>
        <div>
          <p className={`text-[11px] font-600 uppercase tracking-wide ${lowCompliance > 0 ? 'text-red-600' : 'text-muted-foreground'}`}>Compliance Rendah</p>
          <p className={`text-2xl font-700 tabular-nums ${lowCompliance > 0 ? 'text-red-800' : 'text-foreground'}`}>{lowCompliance}<span className="text-sm font-400 text-muted-foreground"> mitra</span></p>
        </div>
      </div>

      <div className="bg-white border border-border rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
          <TrendingUp size={18} className="text-accent" />
        </div>
        <div>
          <p className="text-[11px] font-600 uppercase tracking-wide text-muted-foreground">Peluang Tinggi</p>
          <p className="text-2xl font-700 text-foreground tabular-nums">{highOpportunity}<span className="text-sm text-muted-foreground font-400"> mitra</span></p>
        </div>
      </div>
    </div>
  );
}
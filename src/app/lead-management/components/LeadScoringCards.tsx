'use client';

import { leads } from '@/lib/leadMockData';
import { Target, TrendingUp, Award, AlertCircle, DollarSign, Percent } from 'lucide-react';

function formatRupiah(n: number) {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)}M`;
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(0)}Jt`;
  return `Rp ${n.toLocaleString('id-ID')}`;
}

export default function LeadScoringCards() {
  const totalLeads = leads.length;
  const activeLeads = leads.filter((l) => !['Menang', 'Kalah'].includes(l.status)).length;
  const wonLeads = leads.filter((l) => l.status === 'Menang').length;
  const highPriority = leads.filter((l) => l.priority === 'Tinggi' && !['Menang', 'Kalah'].includes(l.status)).length;
  const avgScore = Math.round(leads.filter((l) => !['Kalah'].includes(l.status)).reduce((s, l) => s + l.skorLead, 0) / leads.filter((l) => l.status !== 'Kalah').length);
  const totalPipeline = leads.filter((l) => !['Kalah'].includes(l.status)).reduce((s, l) => s + l.estimasiNilai, 0);
  const weightedPipeline = leads.filter((l) => !['Kalah'].includes(l.status)).reduce((s, l) => s + (l.estimasiNilai * l.probabilitas / 100), 0);
  const winRate = Math.round((wonLeads / totalLeads) * 100);

  const cards = [
    {
      label: 'Total Pipeline',
      value: formatRupiah(totalPipeline),
      sub: `${activeLeads} lead aktif`,
      icon: <DollarSign size={18} />,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      accent: false,
    },
    {
      label: 'Pipeline Tertimbang',
      value: formatRupiah(weightedPipeline),
      sub: 'Berdasarkan probabilitas',
      icon: <TrendingUp size={18} />,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-700',
      accent: false,
    },
    {
      label: 'Avg. Skor Lead',
      value: `${avgScore}`,
      sub: 'dari 100 poin',
      icon: <Target size={18} />,
      iconBg: avgScore >= 70 ? 'bg-blue-50' : 'bg-amber-50',
      iconColor: avgScore >= 70 ? 'text-blue-700' : 'text-amber-700',
      accent: false,
    },
    {
      label: 'Win Rate',
      value: `${winRate}%`,
      sub: `${wonLeads} dari ${totalLeads} lead`,
      icon: <Award size={18} />,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-700',
      accent: false,
    },
    {
      label: 'Prioritas Tinggi',
      value: `${highPriority}`,
      sub: 'Lead aktif prioritas tinggi',
      icon: <AlertCircle size={18} />,
      iconBg: highPriority > 0 ? 'bg-red-50' : 'bg-slate-50',
      iconColor: highPriority > 0 ? 'text-red-700' : 'text-slate-500',
      accent: highPriority > 0,
    },
    {
      label: 'Avg. Probabilitas',
      value: `${Math.round(leads.filter((l) => !['Kalah'].includes(l.status)).reduce((s, l) => s + l.probabilitas, 0) / leads.filter((l) => l.status !== 'Kalah').length)}%`,
      sub: 'Estimasi closing rate',
      icon: <Percent size={18} />,
      iconBg: 'bg-accent/10',
      iconColor: 'text-accent',
      accent: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`rounded-xl p-4 flex items-center gap-3 border ${card.accent ? 'bg-red-50 border-red-200' : 'bg-white border-border'}`}
        >
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${card.iconBg}`}>
            <span className={card.iconColor}>{card.icon}</span>
          </div>
          <div className="min-w-0">
            <p className={`text-[10px] font-600 uppercase tracking-wide truncate ${card.accent ? 'text-red-600' : 'text-muted-foreground'}`}>{card.label}</p>
            <p className={`text-xl font-700 tabular-nums leading-tight ${card.accent ? 'text-red-800' : 'text-foreground'}`}>{card.value}</p>
            <p className="text-[10px] text-muted-foreground truncate">{card.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

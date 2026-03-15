'use client';

import { leads, getLeadSourceStats } from '@/lib/leadMockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function formatRupiah(n: number) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}M`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}Jt`;
  return `${n.toLocaleString('id-ID')}`;
}

const FUNNEL_STAGES = [
  { status: 'Baru', label: 'Baru', color: '#94a3b8' },
  { status: 'Kualifikasi', label: 'Kualifikasi', color: '#60a5fa' },
  { status: 'Presentasi', label: 'Presentasi', color: '#818cf8' },
  { status: 'Negosiasi', label: 'Negosiasi', color: '#f59e0b' },
  { status: 'Menang', label: 'Menang', color: '#22c55e' },
];

export default function LeadSourceTracking() {
  const sourceStats = getLeadSourceStats();
  const totalLeads = leads.length;

  const funnelData = FUNNEL_STAGES.map((stage) => ({
    ...stage,
    count: leads.filter((l) => l.status === stage.status).length,
    nilai: leads.filter((l) => l.status === stage.status).reduce((s, l) => s + l.estimasiNilai, 0),
  }));

  const topSources = [...sourceStats].sort((a, b) => b.count - a.count).filter((s) => s.count > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
      {/* Source Tracking */}
      <div className="bg-white border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-700 text-foreground">Sumber Lead</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Distribusi & performa per channel</p>
          </div>
          <span className="text-xs font-600 text-muted-foreground bg-muted px-2.5 py-1 rounded-full">{totalLeads} total</span>
        </div>
        <div className="space-y-3">
          {topSources.map((src) => {
            const pct = Math.round((src.count / totalLeads) * 100);
            return (
              <div key={src.source}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: src.color }} />
                    <span className="text-xs font-500 text-foreground">{src.source}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-600 text-foreground">{src.count} lead</span>
                    <span className="text-emerald-600 font-600">{src.winRate}% win</span>
                    <span className="font-mono text-[11px]">Rp {formatRupiah(src.totalNilai)}</span>
                  </div>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: src.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sales Funnel */}
      <div className="bg-white border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-700 text-foreground">Sales Funnel</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Distribusi lead per tahap pipeline</p>
          </div>
        </div>
        <div className="h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={funnelData} barSize={28} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'hsl(215 15% 48%)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(215 15% 48%)' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid hsl(210 18% 88%)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                formatter={(value: number, name: string) => [value, 'Lead']}
                labelFormatter={(label) => `Tahap: ${label}`}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {funnelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Funnel legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
          {funnelData.map((stage) => (
            <div key={stage.status} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
              <span className="text-[11px] text-muted-foreground">{stage.label}: <strong className="text-foreground">{stage.count}</strong></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

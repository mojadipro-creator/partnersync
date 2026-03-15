'use client';

import { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,  } from 'recharts';
import { complianceTrendData, contractTypeData, statusDistributionData } from '@/lib/mockData';

function SkeletonChart({ height = 200 }: { height?: number }) {
  return (
    <div className="animate-pulse bg-muted rounded-lg" style={{ height }} />
  );
}

const COLORS_STATUS = ['#16a34a', '#d97706', '#dc2626', '#2563eb', '#0891b2'];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number | string; color?: string }>;
  label?: string;
}

function ComplianceTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border rounded-lg shadow-lg px-3 py-2.5 text-sm">
      <p className="font-600 text-foreground mb-1">{label} 2025–2026</p>
      {payload.map((p) => (
        <p key={p.name} className="text-muted-foreground">
          {p.name}: <span className="font-600 text-foreground">{p.value}{p.name === 'Compliance Rate' ? '%' : ''}</span>
        </p>
      ))}
    </div>
  );
}

function ContractTypeTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border rounded-lg shadow-lg px-3 py-2.5 text-sm">
      <p className="font-600 text-foreground mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-muted-foreground">
          {p.name}: <span className="font-600 text-foreground">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

export default function DashboardCharts() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
      {/* Compliance Trend — 2 cols */}
      <div className="lg:col-span-2 bg-white border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-600 text-foreground">Tren Compliance Rate</h3>
            <p className="text-xs text-muted-foreground mt-0.5">12 bulan terakhir (Apr 2025 – Mar 2026)</p>
          </div>
          <span className="text-xs font-500 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Rata-rata: 78%
          </span>
        </div>
        {loading ? (
          <SkeletonChart height={200} />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={complianceTrendData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="complianceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(213,80%,30%)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="hsl(213,80%,30%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,18%,92%)" />
              <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: 'hsl(215,15%,48%)' }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: 'hsl(215,15%,48%)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<ComplianceTooltip />} />
              <Area
                type="monotone"
                dataKey="rate"
                name="Compliance Rate"
                stroke="hsl(213,80%,30%)"
                strokeWidth={2.5}
                fill="url(#complianceGrad)"
                dot={{ r: 3, fill: 'hsl(213,80%,30%)', strokeWidth: 0 }}
                activeDot={{ r: 5, fill: 'hsl(213,80%,30%)' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
        <div className="mt-3 pt-3 border-t border-border flex items-center gap-6 text-xs text-muted-foreground">
          <span>Target BPK: <strong className="text-foreground">≥90%</strong></span>
          <span>Tertinggi: <strong className="text-emerald-700">83% (Mar)</strong></span>
          <span>Terendah: <strong className="text-red-600">69% (Jun)</strong></span>
        </div>
      </div>

      {/* Status Distribution — 1 col */}
      <div className="bg-white border border-border rounded-xl p-5">
        <div className="mb-4">
          <h3 className="text-sm font-600 text-foreground">Distribusi Status Kontrak</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Semua kontrak aktif</p>
        </div>
        {loading ? (
          <SkeletonChart height={160} />
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={statusDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={68}
                paddingAngle={3}
                dataKey="value"
              >
                {statusDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="bg-white border border-border rounded-lg shadow-lg px-3 py-2 text-xs">
                      <p className="font-600">{payload[0].name}</p>
                      <p className="text-muted-foreground">{payload[0].value} kontrak</p>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
        <div className="mt-2 space-y-1.5">
          {statusDistributionData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.fill }} />
                <span className="text-muted-foreground">{item.name}</span>
              </div>
              <span className="font-600 text-foreground tabular-nums">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Contract Type Distribution — full width */}
      <div className="lg:col-span-3 bg-white border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-600 text-foreground">Distribusi Kontrak per Jenis</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Jumlah kontrak berdasarkan jenis perjanjian</p>
          </div>
        </div>
        {loading ? (
          <SkeletonChart height={140} />
        ) : (
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={contractTypeData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,18%,92%)" vertical={false} />
              <XAxis dataKey="jenis" tick={{ fontSize: 12, fill: 'hsl(215,15%,48%)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(215,15%,48%)' }} axisLine={false} tickLine={false} domain={[0, 8]} />
              <Tooltip content={<ContractTypeTooltip />} />
              <Bar dataKey="jumlah" name="Jumlah Kontrak" radius={[4, 4, 0, 0]}>
                {contractTypeData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? 'hsl(213,80%,30%)' : index === 2 ? 'hsl(38,88%,52%)' : 'hsl(213,60%,65%)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
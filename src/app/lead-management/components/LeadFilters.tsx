'use client';

import { Search, X, SlidersHorizontal } from 'lucide-react';
import { LeadStatus, LeadSource, LeadSegmen, LeadPriority } from '@/lib/leadMockData';

interface LeadFilters {
  search: string;
  status: string;
  segmen: string;
  source: string;
  priority: string;
  region: string;
  picInternal: string;
}

interface LeadFiltersProps {
  filters: LeadFilters;
  onChange: (f: LeadFilters) => void;
  totalCount: number;
  filteredCount: number;
}

const statusOptions: LeadStatus[] = ['Baru', 'Kualifikasi', 'Presentasi', 'Negosiasi', 'Menang', 'Kalah', 'Ditunda'];
const sourceOptions: LeadSource[] = ['Referral Internal', 'Pameran & Event', 'Inbound Website', 'Cold Outreach', 'Tender Pemerintah', 'Rekomendasi Mitra'];
const segmenOptions: LeadSegmen[] = ['Logistik', 'Migas', 'Perdagangan', 'Kepelabuhanan', 'Utilitas', 'Industri'];
const priorityOptions: LeadPriority[] = ['Tinggi', 'Sedang', 'Rendah'];
const regionOptions = ['Palembang', 'Jambi', 'Bengkulu', 'Banten'];
const picOptions = ['Ahmad Fauzi', 'Budi Santoso', 'Dewi Rahayu', 'Siti Mardiyah', 'Reza Firmansyah'];

export default function LeadFilters({ filters, onChange, totalCount, filteredCount }: LeadFiltersProps) {
  const hasActive = filters.status || filters.segmen || filters.source || filters.priority || filters.region || filters.picInternal;

  function update(key: keyof LeadFilters, value: string) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="bg-white border border-border rounded-xl p-4 mb-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari nama perusahaan, kontak, email..."
            value={filters.search}
            onChange={(e) => update('search', e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-all placeholder:text-muted-foreground"
          />
          {filters.search && (
            <button onClick={() => update('search', '')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X size={13} />
            </button>
          )}
        </div>

        <select
          value={filters.status}
          onChange={(e) => update('status', e.target.value)}
          className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary text-foreground min-w-[140px]"
        >
          <option value="">Semua Status</option>
          {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <select
          value={filters.priority}
          onChange={(e) => update('priority', e.target.value)}
          className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary text-foreground min-w-[130px]"
        >
          <option value="">Semua Prioritas</option>
          {priorityOptions.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>

        <select
          value={filters.segmen}
          onChange={(e) => update('segmen', e.target.value)}
          className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary text-foreground min-w-[140px]"
        >
          <option value="">Semua Segmen</option>
          {segmenOptions.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <select
          value={filters.source}
          onChange={(e) => update('source', e.target.value)}
          className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary text-foreground min-w-[170px]"
        >
          <option value="">Semua Sumber</option>
          {sourceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <select
          value={filters.region}
          onChange={(e) => update('region', e.target.value)}
          className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary text-foreground min-w-[130px]"
        >
          <option value="">Semua Region</option>
          {regionOptions.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>

        <select
          value={filters.picInternal}
          onChange={(e) => update('picInternal', e.target.value)}
          className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary text-foreground min-w-[150px]"
        >
          <option value="">Semua PIC</option>
          {picOptions.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>

        {hasActive && (
          <button
            onClick={() => onChange({ search: filters.search, status: '', segmen: '', source: '', priority: '', region: '', picInternal: '' })}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-500 text-destructive hover:bg-destructive/5 rounded-lg transition-colors"
          >
            <X size={13} /> Hapus Filter
          </button>
        )}

        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <SlidersHorizontal size={13} />
          <span>
            {filteredCount === totalCount ? `${totalCount} lead` : `${filteredCount} dari ${totalCount} lead`}
          </span>
        </div>
      </div>
    </div>
  );
}

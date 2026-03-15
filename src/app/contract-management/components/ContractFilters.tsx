'use client';

import { Search, SlidersHorizontal, X } from 'lucide-react';

interface Filters {
  search: string;
  jenis: string;
  status: string;
  compliance: string;
  region: string;
}

interface ContractFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  totalCount: number;
  filteredCount: number;
}

export default function ContractFilters({ filters, onChange, totalCount, filteredCount }: ContractFiltersProps) {
  const hasActiveFilters = filters.jenis || filters.status || filters.compliance || filters.region;

  function update(key: keyof Filters, value: string) {
    onChange({ ...filters, [key]: value });
  }

  function clearAll() {
    onChange({ search: '', jenis: '', status: '', compliance: '', region: '' });
  }

  return (
    <div className="bg-white border border-border rounded-xl p-4 mb-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari nomor kontrak, mitra, kategori..."
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

        {/* Jenis */}
        <select
          value={filters.jenis}
          onChange={(e) => update('jenis', e.target.value)}
          className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-all text-foreground min-w-[140px]"
        >
          <option value="">Semua Jenis</option>
          <option value="PKS">PKS</option>
          <option value="MoU">MoU</option>
          <option value="TUKS">TUKS</option>
          <option value="Addendum">Addendum</option>
          <option value="Pemanfaatan Lahan">Pemanfaatan Lahan</option>
        </select>

        {/* Status */}
        <select
          value={filters.status}
          onChange={(e) => update('status', e.target.value)}
          className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-all text-foreground min-w-[160px]"
        >
          <option value="">Semua Status</option>
          <option value="Aktif">Aktif</option>
          <option value="Mendekati Akhir">Mendekati Akhir</option>
          <option value="Expired">Expired</option>
          <option value="Draft">Draft</option>
          <option value="Review Legal">Review Legal</option>
          <option value="Approval SM/ED">Approval SM/ED</option>
        </select>

        {/* Compliance */}
        <select
          value={filters.compliance}
          onChange={(e) => update('compliance', e.target.value)}
          className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-all text-foreground min-w-[180px]"
        >
          <option value="">Semua Compliance</option>
          <option value="complete">Lengkap (≥90%)</option>
          <option value="partial">Sebagian (70–89%)</option>
          <option value="incomplete">Tidak Lengkap (&lt;70%)</option>
        </select>

        {/* Region */}
        <select
          value={filters.region}
          onChange={(e) => update('region', e.target.value)}
          className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-all text-foreground min-w-[130px]"
        >
          <option value="">Semua Region</option>
          <option value="Palembang">Palembang</option>
          <option value="Jambi">Jambi</option>
          <option value="Bengkulu">Bengkulu</option>
          <option value="Banten">Banten</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-500 text-destructive hover:bg-destructive/5 rounded-lg transition-colors"
          >
            <X size={13} /> Hapus Filter
          </button>
        )}

        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <SlidersHorizontal size={13} />
          <span>
            {filteredCount === totalCount
              ? `${totalCount} kontrak`
              : `${filteredCount} dari ${totalCount} kontrak`}
          </span>
        </div>
      </div>
    </div>
  );
}
'use client';

import { Search, X, SlidersHorizontal } from 'lucide-react';

interface Filters {
  search: string;
  segmen: string;
  status: string;
  region: string;
  ratingK3: string;
}

interface PartnerFiltersProps {
  filters: Filters;
  onChange: (f: Filters) => void;
  totalCount: number;
  filteredCount: number;
}

export default function PartnerFilters({ filters, onChange, totalCount, filteredCount }: PartnerFiltersProps) {
  const hasActive = filters.segmen || filters.status || filters.region || filters.ratingK3;

  function update(key: keyof Filters, value: string) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="bg-white border border-border rounded-xl p-4 mb-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari nama perusahaan, NPWP, kontak..."
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
          value={filters.segmen}
          onChange={(e) => update('segmen', e.target.value)}
          className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary text-foreground min-w-[150px]"
        >
          <option value="">Semua Segmen</option>
          <option value="Logistik">Logistik</option>
          <option value="Migas">Migas</option>
          <option value="Perdagangan">Perdagangan</option>
          <option value="Kepelabuhanan">Kepelabuhanan</option>
          <option value="Utilitas">Utilitas</option>
          <option value="Industri">Industri</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => update('status', e.target.value)}
          className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary text-foreground min-w-[160px]"
        >
          <option value="">Semua Status</option>
          <option value="Mitra Aktif">Mitra Aktif</option>
          <option value="Lead">Lead</option>
          <option value="Negosiasi">Negosiasi</option>
          <option value="Evaluasi">Evaluasi</option>
          <option value="Pra-Kualifikasi">Pra-Kualifikasi</option>
          <option value="Penutupan">Penutupan</option>
        </select>

        <select
          value={filters.region}
          onChange={(e) => update('region', e.target.value)}
          className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary text-foreground min-w-[130px]"
        >
          <option value="">Semua Region</option>
          <option value="Palembang">Palembang</option>
          <option value="Jambi">Jambi</option>
          <option value="Bengkulu">Bengkulu</option>
          <option value="Banten">Banten</option>
        </select>

        <select
          value={filters.ratingK3}
          onChange={(e) => update('ratingK3', e.target.value)}
          className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary text-foreground min-w-[130px]"
        >
          <option value="">Rating K3</option>
          <option value="A">Rating A (Sangat Baik)</option>
          <option value="B">Rating B (Baik)</option>
          <option value="C">Rating C (Cukup)</option>
          <option value="D">Rating D (Perlu Perbaikan)</option>
        </select>

        {hasActive && (
          <button
            onClick={() => onChange({ search: filters.search, segmen: '', status: '', region: '', ratingK3: '' })}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-500 text-destructive hover:bg-destructive/5 rounded-lg transition-colors"
          >
            <X size={13} /> Hapus Filter
          </button>
        )}

        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <SlidersHorizontal size={13} />
          <span>
            {filteredCount === totalCount ? `${totalCount} mitra` : `${filteredCount} dari ${totalCount} mitra`}
          </span>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Download, UserPlus } from 'lucide-react';
import { Partner } from '@/lib/mockData';
import { partnerService } from '@/lib/supabaseService';
import { toast } from 'sonner';
import PartnerFilters from './PartnerFilters';
import PartnerTable from './PartnerTable';
import PartnerDetailDrawer from './PartnerDetailDrawer';
import PartnerSummaryCards from './PartnerSummaryCards';

// Backend integration point: replace allPartners with API call GET /api/partners
function usePartners() {
  const [loading, setLoading] = useState(true);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    partnerService
      .getAll()
      .then((data) => setPartners(data as Partner[]))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { loading, partners, error };
}

interface Filters {
  search: string;
  segmen: string;
  status: string;
  region: string;
  ratingK3: string;
}

export default function PartnerManagementClient() {
  const { loading, partners, error } = usePartners();
  const [filters, setFilters] = useState<Filters>({ search: '', segmen: '', status: '', region: '', ratingK3: '' });
  const [detailPartner, setDetailPartner] = useState<Partner | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const filtered = useMemo(() => {
    return partners.filter((p) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !p.namaPerusahaan.toLowerCase().includes(q) &&
          !p.npwp.toLowerCase().includes(q) &&
          !p.kontakUtama.toLowerCase().includes(q) &&
          !p.region.toLowerCase().includes(q)
        ) return false;
      }
      if (filters.segmen && p.segmenBisnis !== filters.segmen) return false;
      if (filters.status && p.status !== filters.status) return false;
      if (filters.region && p.region !== filters.region) return false;
      if (filters.ratingK3 && p.ratingK3 !== filters.ratingK3) return false;
      return true;
    });
  }, [partners, filters]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-12 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-700 text-foreground tracking-tight">Manajemen Mitra</h1>
          <p className="text-sm text-muted-foreground mt-1">
            360° view seluruh mitra kerjasama — profil, kontrak, performa, dan peluang renewal
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => toast.info('Mengunduh daftar mitra...')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-500 text-foreground hover:bg-muted transition-all active:scale-95"
          >
            <Download size={14} /> Ekspor
          </button>
          <button
            onClick={() => toast.success('Form tambah mitra baru dibuka')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-600 hover:bg-primary/90 transition-all active:scale-95 shadow-sm"
          >
            <UserPlus size={14} /> Tambah Mitra
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <PartnerSummaryCards />

      {/* Filters */}
      <PartnerFilters
        filters={filters}
        onChange={(f) => { setFilters(f); setCurrentPage(1); }}
        totalCount={partners.length}
        filteredCount={filtered.length}
      />

      {/* Table */}
      <PartnerTable
        partners={paginated}
        loading={loading}
        onOpenDetail={setDetailPartner}
      />

      {/* Pagination */}
      {!loading && filtered.length > 0 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Tampilkan</span>
            <select
              value={perPage}
              onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="px-2 py-1 border border-border rounded text-xs bg-background focus:outline-none focus:ring-2 focus:ring-ring/30"
            >
              {[10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <span>dari <strong>{filtered.length}</strong> mitra</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-xs font-500 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Sebelumnya
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 text-xs font-600 rounded-lg transition-colors ${
                  currentPage === page ? 'bg-primary text-white' : 'border border-border hover:bg-muted text-foreground'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-xs font-500 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}

      {/* Partner Detail Drawer */}
      {detailPartner && (
        <PartnerDetailDrawer
          partner={detailPartner}
          onClose={() => setDetailPartner(null)}
        />
      )}
    </div>
  );
}
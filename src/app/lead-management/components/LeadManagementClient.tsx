'use client';

import { useState, useMemo, useEffect } from 'react';
import { Download, UserPlus, Plus } from 'lucide-react';
import { Lead } from '@/lib/leadMockData';
import { leadService } from '@/lib/supabaseService';
import { toast } from 'sonner';
import LeadFilters from './LeadFilters';
import LeadTable from './LeadTable';
import LeadScoringCards from './LeadScoringCards';
import LeadSourceTracking from './LeadSourceTracking';
import LeadDetailDrawer from './LeadDetailDrawer';

interface Filters {
  search: string;
  status: string;
  segmen: string;
  source: string;
  priority: string;
  region: string;
  picInternal: string;
}

function useLeads() {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    leadService
      .getAll()
      .then((data) => setLeads(data as Lead[]))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { loading, leads, error };
}

export default function LeadManagementClient() {
  const { loading, leads, error } = useLeads();
  const [filters, setFilters] = useState<Filters>({ search: '', status: '', segmen: '', source: '', priority: '', region: '', picInternal: '' });
  const [detailLead, setDetailLead] = useState<Lead | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortKey, setSortKey] = useState('skorLead');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  const filtered = useMemo(() => {
    let result = leads.filter((l) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !l.namaPerusahaan.toLowerCase().includes(q) &&
          !l.kontakUtama.toLowerCase().includes(q) &&
          !l.email.toLowerCase().includes(q) &&
          !l.region.toLowerCase().includes(q)
        ) return false;
      }
      if (filters.status && l.status !== filters.status) return false;
      if (filters.segmen && l.segmen !== filters.segmen) return false;
      if (filters.source && l.source !== filters.source) return false;
      if (filters.priority && l.priority !== filters.priority) return false;
      if (filters.region && l.region !== filters.region) return false;
      if (filters.picInternal && l.picInternal !== filters.picInternal) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey];
      const bVal = (b as Record<string, unknown>)[sortKey];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const aStr = String(aVal ?? '');
      const bStr = String(bVal ?? '');
      return sortDir === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });

    return result;
  }, [leads, filters, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  function handleAddPartner(lead: Lead) {
    toast.success(`Workflow pre-sales dimulai untuk ${lead.namaPerusahaan}`, {
      description: 'Lead akan dikonversi menjadi mitra. Silakan lengkapi data pra-kualifikasi.',
      duration: 4000,
    });
    setDetailLead(null);
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-12 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-700 text-foreground tracking-tight">Manajemen Lead</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pipeline pre-sales — kelola prospek, skor peluang, dan inisiasi kerjasama baru
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => toast.info('Mengunduh daftar lead...')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-500 text-foreground hover:bg-muted transition-all active:scale-95"
          >
            <Download size={14} /> Ekspor
          </button>
          <button
            onClick={() => toast.success('Form tambah lead baru dibuka')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-600 hover:bg-primary/90 transition-all active:scale-95 shadow-sm"
          >
            <Plus size={14} /> Tambah Lead
          </button>
          <button
            onClick={() => toast.success('Quick-add mitra baru — mulai workflow pre-sales')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-600 hover:bg-accent/90 transition-all active:scale-95 shadow-sm"
          >
            <UserPlus size={14} /> Quick-Add Mitra
          </button>
        </div>
      </div>

      {/* Scoring Cards */}
      <LeadScoringCards />

      {/* Source Tracking & Funnel */}
      <LeadSourceTracking />

      {/* Filters */}
      <LeadFilters
        filters={filters}
        onChange={(f) => { setFilters(f); setCurrentPage(1); }}
        totalCount={leads.length}
        filteredCount={filtered.length}
      />

      {/* Table */}
      <LeadTable
        leads={paginated}
        loading={loading}
        onOpenDetail={setDetailLead}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
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
            <span>dari <strong>{filtered.length}</strong> lead</span>
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
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 text-xs font-500 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}

      {/* Detail Drawer */}
      {detailLead && (
        <LeadDetailDrawer
          lead={detailLead}
          onClose={() => setDetailLead(null)}
          onAddPartner={handleAddPartner}
        />
      )}
    </div>
  );
}

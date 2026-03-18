'use client';

import { useState, useEffect, useMemo } from 'react';
import { Plus, Download, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Contract } from '@/lib/mockData';
import { contractService } from '@/lib/supabaseService';
import { toast } from 'sonner';
import ContractFilters from './ContractFilters';
import ContractTable from './ContractTable';
import BulkActionBar from './BulkActionBar';
import ComplianceCheckerDrawer from './ComplianceCheckerDrawer';

// Backend integration point: replace allContracts with API call GET /api/contracts
function useContracts() {
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    contractService
      .getAll()
      .then((data) => setContracts(data as Contract[]))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { loading, contracts, error };
}

interface Filters {
  search: string;
  jenis: string;
  status: string;
  compliance: string;
  region: string;
}

export default function ContractManagementClient() {
  const { loading, contracts, error } = useContracts();
  const router = useRouter();
  const [filters, setFilters] = useState<Filters>({ search: '', jenis: '', status: '', compliance: '', region: '' });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [complianceContract, setComplianceContract] = useState<Contract | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const missingClauseContracts = contracts.filter((c) => c.missingClauses.length > 0);

  const filtered = useMemo(() => {
    return contracts.filter((c) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !c.nomorKontrak.toLowerCase().includes(q) &&
          !c.mitra.toLowerCase().includes(q) &&
          !c.kategori.toLowerCase().includes(q) &&
          !c.region.toLowerCase().includes(q)
        ) return false;
      }
      if (filters.jenis && c.jenisKontrak !== filters.jenis) return false;
      if (filters.status && c.status !== filters.status) return false;
      if (filters.region && c.region !== filters.region) return false;
      if (filters.compliance) {
        if (filters.compliance === 'complete' && c.complianceScore < 90) return false;
        if (filters.compliance === 'partial' && (c.complianceScore < 70 || c.complianceScore >= 90)) return false;
        if (filters.compliance === 'incomplete' && c.complianceScore >= 70) return false;
      }
      return true;
    });
  }, [contracts, filters]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  function handleSelectAll(ids: string[]) {
    setSelectedIds(ids);
  }

  function handleSelectOne(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-12 py-8">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-700 text-foreground tracking-tight">Manajemen Kontrak</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola seluruh kontrak kerjasama Pelindo Regional 2 — auto-check kepatuhan regulasi
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => toast.info('Mengunduh laporan kontrak...')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-500 text-foreground hover:bg-muted transition-all active:scale-95"
          >
            <Download size={14} /> Ekspor
          </button>
          <button
            onClick={() => router.push('/contract-creation')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-600 hover:bg-primary/90 transition-all active:scale-95 shadow-sm"
          >
            <Plus size={14} /> Buat Kontrak Baru
          </button>
        </div>
      </div>

      {/* Missing Clause Alert Banner */}
      {missingClauseContracts.length > 0 && (
        <div className="mb-4 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 animate-fade-in">
          <AlertTriangle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-700 text-red-800">
              {missingClauseContracts.length} Kontrak Memiliki Klausul Wajib yang Belum Lengkap
            </p>
            <p className="text-xs text-red-600 mt-0.5">
              Kontrak berikut berisiko temuan BPK:{' '}
              {missingClauseContracts.slice(0, 3).map((c) => c.mitra).join(', ')}
              {missingClauseContracts.length > 3 && ` dan ${missingClauseContracts.length - 3} lainnya`}.
              Klik kolom Compliance untuk melihat detail.
            </p>
          </div>
          <button
            onClick={() => setFilters((f) => ({ ...f, compliance: 'incomplete' }))}
            className="text-xs font-600 text-red-700 hover:text-red-900 whitespace-nowrap px-2 py-1 rounded bg-red-100 hover:bg-red-200 transition-colors"
          >
            Filter Sekarang
          </button>
        </div>
      )}

      {/* Filters */}
      <ContractFilters
        filters={filters}
        onChange={(f) => { setFilters(f); setCurrentPage(1); }}
        totalCount={contracts.length}
        filteredCount={filtered.length}
      />

      {/* Table */}
      <ContractTable
        contracts={paginated}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectOne={handleSelectOne}
        onOpenCompliance={setComplianceContract}
        loading={loading}
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
            <span>dari <strong>{filtered.length}</strong> kontrak</span>
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
                  currentPage === page
                    ? 'bg-primary text-white' :'border border-border hover:bg-muted text-foreground'
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

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedIds.length}
        onClear={() => setSelectedIds([])}
      />

      {/* Compliance Drawer */}
      {complianceContract && (
        <ComplianceCheckerDrawer
          contract={complianceContract}
          onClose={() => setComplianceContract(null)}
        />
      )}
    </div>
  );
}
'use client';

import Link from 'next/link';
import { Plus, RefreshCw, Users, Download } from 'lucide-react';

export default function DashboardHeader() {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-600 px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            Pelindo Regional 2
          </span>
          <span className="text-xs text-muted-foreground">Q1 2026</span>
        </div>
        <h1 className="text-2xl font-700 text-foreground tracking-tight">Dashboard Kerja Sama</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Ringkasan portofolio kerjasama — Minggu ke-2 Maret 2026
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-500 text-foreground hover:bg-muted transition-all duration-150 active:scale-95"
          title="Refresh data"
        >
          <RefreshCw size={14} />
          <span className="hidden sm:inline">Perbarui</span>
        </button>
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-500 text-foreground hover:bg-muted transition-all duration-150 active:scale-95"
        >
          <Download size={14} />
          <span className="hidden sm:inline">Ekspor</span>
        </button>
        <Link
          href="/partner-management"
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-500 text-foreground hover:bg-muted transition-all duration-150 active:scale-95"
        >
          <Users size={14} />
          <span className="hidden sm:inline">Tambah Mitra</span>
        </Link>
        <Link
          href="/contract-management"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-600 hover:bg-primary/90 transition-all duration-150 active:scale-95 shadow-sm"
        >
          <Plus size={14} />
          Buat Kontrak
        </Link>
      </div>
    </div>
  );
}
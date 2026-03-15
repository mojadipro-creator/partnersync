'use client';

import { X, Download, Bell, Eye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface BulkActionBarProps {
  selectedCount: number;
  onClear: () => void;
}

export default function BulkActionBar({ selectedCount, onClear }: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-slide-up">
      <div className="flex items-center gap-3 bg-foreground text-background px-5 py-3 rounded-xl shadow-2xl border border-foreground/20">
        <span className="text-sm font-600">
          {selectedCount} kontrak dipilih
        </span>
        <div className="w-px h-5 bg-background/20" />
        <button
          onClick={() => { toast.success(`${selectedCount} kontrak diekspor`); onClear(); }}
          className="flex items-center gap-2 text-sm font-500 text-background/80 hover:text-background transition-colors px-2 py-1 rounded-lg hover:bg-white/10"
        >
          <Download size={14} /> Ekspor
        </button>
        <button
          onClick={() => { toast.info(`Reminder dikirim untuk ${selectedCount} kontrak`); onClear(); }}
          className="flex items-center gap-2 text-sm font-500 text-background/80 hover:text-background transition-colors px-2 py-1 rounded-lg hover:bg-white/10"
        >
          <Bell size={14} /> Kirim Reminder
        </button>
        <button
          onClick={() => { toast.info(`${selectedCount} kontrak dikirim untuk review`); onClear(); }}
          className="flex items-center gap-2 text-sm font-500 text-background/80 hover:text-background transition-colors px-2 py-1 rounded-lg hover:bg-white/10"
        >
          <Eye size={14} /> Minta Review
        </button>
        <button
          onClick={() => { toast.error(`${selectedCount} kontrak dihapus`); onClear(); }}
          className="flex items-center gap-2 text-sm font-500 text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded-lg hover:bg-white/10"
        >
          <Trash2 size={14} /> Hapus
        </button>
        <div className="w-px h-5 bg-background/20" />
        <button
          onClick={onClear}
          className="text-background/60 hover:text-background transition-colors"
          aria-label="Batalkan pilihan"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
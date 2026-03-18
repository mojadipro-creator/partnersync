'use client';

import { FileText, Download, Calendar, Building2, Hash, BookOpen } from 'lucide-react';

const PDF_URL =
  'https://builtwithrocket.new/uploads/peraturan_n_tarif-1773809954024.pdf';

export default function PeraturanTarifClient() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-700 text-foreground">Peraturan &amp; Tarif</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Dokumen peraturan dan tarif resmi yang berlaku di lingkungan PT Pelabuhan Indonesia
        </p>
      </div>

      {/* Document Card */}
      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="flex items-center gap-3 px-6 py-4 bg-primary/5 border-b border-border">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FileText size={20} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-600 uppercase tracking-widest text-muted-foreground mb-0.5">
              Dokumen Resmi
            </p>
            <h2 className="text-sm font-700 text-foreground leading-snug">
              Peraturan Direksi PT Pelabuhan Indonesia
            </h2>
          </div>
        </div>

        {/* Document Info */}
        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Hash size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground font-500">Nomor Peraturan</p>
              <p className="text-sm font-600 text-foreground">
                HK.01/29/12/1/KSJU/UTMA/PLND-22
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Building2 size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground font-500">Penerbit</p>
              <p className="text-sm font-600 text-foreground">PT Pelabuhan Indonesia (Pelindo)</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <BookOpen size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground font-500">Jenis Dokumen</p>
              <p className="text-sm font-600 text-foreground">Peraturan Direksi</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground font-500">Format</p>
              <p className="text-sm font-600 text-foreground">PDF</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="px-6 pb-5">
          <p className="text-sm text-foreground/70 leading-relaxed">
            Dokumen ini memuat peraturan direksi PT Pelabuhan Indonesia mengenai tarif dan ketentuan
            kerja sama yang berlaku. Peraturan ini menjadi acuan dalam setiap perjanjian kerja sama,
            negosiasi tarif, dan pengelolaan kontrak di lingkungan Pelindo.
          </p>
        </div>

        {/* Download Action */}
        <div className="px-6 py-4 bg-muted/40 border-t border-border flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FileText size={14} />
            <span>peraturan_n_tarif-1773809954024.pdf</span>
          </div>
          <a
            href={PDF_URL}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-600 rounded-lg hover:bg-primary/90 transition-colors duration-150"
          >
            <Download size={15} />
            Unduh PDF
          </a>
        </div>
      </div>

      {/* Note */}
      <p className="mt-4 text-xs text-muted-foreground text-center">
        Dokumen ini bersifat resmi. Harap gunakan sesuai ketentuan yang berlaku.
      </p>
    </div>
  );
}

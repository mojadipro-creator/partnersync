'use client';

import { useState, useCallback } from 'react';
import { FileText, CheckCircle2, Circle, Clock, ChevronDown, ChevronUp, Download, Send, Edit3, Hash, Shield, PenTool, AlertCircle, Check, X, RefreshCw, Eye, Copy, Printer, ArrowLeft, ArrowRight, Sparkles, Building2, CalendarDays, DollarSign, FileCheck, Stamp,  } from 'lucide-react';
import { contractTemplates, approvalWorkflowTemplate, signaturePartiesTemplate, recentContracts, generateContractNumber, ContractTemplate, ApprovalStep, SignatureParty,  } from '@/lib/contractCreationData';

function formatCurrency(val: number) {
  if (val >= 1_000_000_000) return `Rp ${(val / 1_000_000_000).toFixed(2)} M`;
  if (val >= 1_000_000) return `Rp ${(val / 1_000_000).toFixed(0)} Jt`;
  return `Rp ${val.toLocaleString('id-ID')}`;
}

function formatDate(d: string) {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ─── Step Indicator ───────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Pilih Template', icon: <Sparkles size={16} /> },
  { id: 2, label: 'Detail Kontrak', icon: <Edit3 size={16} /> },
  { id: 3, label: 'Editor Kontrak', icon: <FileText size={16} /> },
  { id: 4, label: 'Alur Persetujuan', icon: <Shield size={16} /> },
  { id: 5, label: 'E-Signature', icon: <PenTool size={16} /> },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 w-full">
      {STEPS.map((step, idx) => {
        const done = current > step.id;
        const active = current === step.id;
        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5 min-w-[80px]">
              <div className={`
                w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-200
                ${done ? 'bg-primary border-primary text-white' : active ? 'bg-white border-primary text-primary' : 'bg-white border-border text-muted-foreground'}
              `}>
                {done ? <Check size={16} /> : step.icon}
              </div>
              <span className={`text-[11px] font-500 text-center leading-tight ${active ? 'text-primary' : done ? 'text-primary/70' : 'text-muted-foreground'}`}>
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mb-5 mx-1 transition-all duration-300 ${done ? 'bg-primary' : 'bg-border'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step 1: Template Selector ────────────────────────────────────────────────
function TemplateSelector({
  selected,
  onSelect,
}: {
  selected: ContractTemplate | null;
  onSelect: (t: ContractTemplate) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-700 text-foreground">Pilih Template Kontrak</h2>
        <p className="text-sm text-muted-foreground mt-1">Pilih jenis dokumen yang sesuai dengan kebutuhan kerja sama Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contractTemplates.map((tmpl) => {
          const isSelected = selected?.id === tmpl.id;
          return (
            <button
              key={tmpl.id}
              onClick={() => onSelect(tmpl)}
              className={`
                text-left p-5 rounded-xl border-2 transition-all duration-200 hover:shadow-md
                ${isSelected ? `${tmpl.borderColor} ${tmpl.bgColor} shadow-md` : 'border-border bg-card hover:border-primary/30'}
              `}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${tmpl.bgColor} border ${tmpl.borderColor}`}>
                  {tmpl.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-700 px-2 py-0.5 rounded-full ${tmpl.bgColor} ${tmpl.color} border ${tmpl.borderColor}`}>
                      {tmpl.type}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{tmpl.usageCount}x digunakan</span>
                  </div>
                  <h3 className="text-sm font-700 text-foreground mb-1">{tmpl.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{tmpl.description}</p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><CalendarDays size={11} /> Durasi: {tmpl.defaultDuration}</span>
                    <span className="flex items-center gap-1"><FileText size={11} /> {tmpl.clauses.length} pasal</span>
                  </div>
                </div>
                {isSelected && (
                  <div className="flex-shrink-0">
                    <CheckCircle2 size={20} className="text-primary" />
                  </div>
                )}
              </div>

              {isSelected && (
                <div className="mt-4 pt-4 border-t border-current/10">
                  <p className="text-xs font-600 text-foreground mb-2">Klausul yang disertakan:</p>
                  <div className="grid grid-cols-1 gap-1">
                    {tmpl.clauses.slice(0, 5).map((clause, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Check size={10} className="text-primary flex-shrink-0" />
                        {clause}
                      </div>
                    ))}
                    {tmpl.clauses.length > 5 && (
                      <div className="text-xs text-muted-foreground pl-4">+{tmpl.clauses.length - 5} klausul lainnya...</div>
                    )}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Recent Contracts */}
      <div>
        <h3 className="text-sm font-700 text-foreground mb-3">Kontrak Terbaru</h3>
        <div className="space-y-2">
          {recentContracts.map((c) => (
            <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText size={14} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-600 text-foreground truncate">{c.title}</p>
                <p className="text-[11px] text-muted-foreground">{c.contractNumber} · {c.mitra}</p>
              </div>
              <span className={`text-[10px] font-600 px-2 py-0.5 rounded-full border ${
                c.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                c.status === 'Approval'? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}>{c.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Step 2: Contract Details ─────────────────────────────────────────────────
interface ContractDetails {
  contractNumber: string;
  title: string;
  mitra: string;
  mitraAddress: string;
  mitraRepresentative: string;
  mitraRepresentativeTitle: string;
  value: string;
  startDate: string;
  endDate: string;
  notes: string;
}

function ContractDetailsForm({
  template,
  details,
  onChange,
}: {
  template: ContractTemplate;
  details: ContractDetails;
  onChange: (d: ContractDetails) => void;
}) {
  const update = (key: keyof ContractDetails, val: string) => onChange({ ...details, [key]: val });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-700 text-foreground">Detail Kontrak</h2>
        <p className="text-sm text-muted-foreground mt-1">Isi informasi dasar kontrak. Nomor kontrak dibuat otomatis.</p>
      </div>

      {/* Auto-number display */}
      <div className={`flex items-center gap-3 p-4 rounded-xl border-2 ${template.borderColor} ${template.bgColor}`}>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${template.bgColor} border ${template.borderColor}`}>
          <Hash size={18} className={template.color} />
        </div>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground font-500">Nomor Kontrak (Auto-Generated)</p>
          <p className={`text-base font-700 font-mono ${template.color}`}>{details.contractNumber}</p>
        </div>
        <button
          onClick={() => update('contractNumber', generateContractNumber(template.type))}
          className="flex items-center gap-1.5 text-xs font-600 text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg border border-border bg-white hover:bg-muted transition-colors"
        >
          <RefreshCw size={12} /> Regenerasi
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-600 text-foreground mb-1.5">Judul Kontrak <span className="text-destructive">*</span></label>
          <input
            type="text"
            value={details.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder={`Contoh: ${template.type} Kerja Sama dengan [Nama Mitra]`}
            className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-600 text-foreground mb-1.5">Nama Mitra <span className="text-destructive">*</span></label>
          <input
            type="text"
            value={details.mitra}
            onChange={(e) => update('mitra', e.target.value)}
            placeholder="PT / CV / Nama Perusahaan"
            className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-600 text-foreground mb-1.5">Perwakilan Mitra</label>
          <input
            type="text"
            value={details.mitraRepresentative}
            onChange={(e) => update('mitraRepresentative', e.target.value)}
            placeholder="Nama lengkap perwakilan"
            className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-600 text-foreground mb-1.5">Jabatan Perwakilan</label>
          <input
            type="text"
            value={details.mitraRepresentativeTitle}
            onChange={(e) => update('mitraRepresentativeTitle', e.target.value)}
            placeholder="Direktur Utama / CEO"
            className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-600 text-foreground mb-1.5">Alamat Mitra</label>
          <input
            type="text"
            value={details.mitraAddress}
            onChange={(e) => update('mitraAddress', e.target.value)}
            placeholder="Alamat lengkap perusahaan mitra"
            className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>

        {template.type !== 'MoU' && (
          <div>
            <label className="block text-xs font-600 text-foreground mb-1.5">Nilai Kontrak (Rp)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-500">Rp</span>
              <input
                type="number"
                value={details.value}
                onChange={(e) => update('value', e.target.value)}
                placeholder="0"
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
            </div>
            {details.value && Number(details.value) > 0 && (
              <p className="text-xs text-muted-foreground mt-1">{formatCurrency(Number(details.value))}</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-xs font-600 text-foreground mb-1.5">Tanggal Mulai <span className="text-destructive">*</span></label>
          <input
            type="date"
            value={details.startDate}
            onChange={(e) => update('startDate', e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-600 text-foreground mb-1.5">Tanggal Berakhir <span className="text-destructive">*</span></label>
          <input
            type="date"
            value={details.endDate}
            onChange={(e) => update('endDate', e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-600 text-foreground mb-1.5">Catatan / Keterangan</label>
          <textarea
            value={details.notes}
            onChange={(e) => update('notes', e.target.value)}
            rows={3}
            placeholder="Catatan tambahan mengenai kontrak ini..."
            className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Step 3: Contract Editor ──────────────────────────────────────────────────
function ContractEditor({
  template,
  details,
  content,
  onContentChange,
}: {
  template: ContractTemplate;
  details: ContractDetails;
  content: string;
  onContentChange: (c: string) => void;
}) {
  const [activeClause, setActiveClause] = useState<number | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const generatedContent = content || template.clauses.map((clause, i) => {
    const clauseNum = i + 1;
    return `${clause}\n\nPihak Pertama dan Pihak Kedua sepakat bahwa ${clause.toLowerCase().replace('pasal ' + clauseNum + ' – ', '')} diatur sebagaimana ketentuan berikut:\n\n1. [Isi ketentuan]\n2. [Isi ketentuan]\n3. [Isi ketentuan]\n`;
  }).join('\n---\n\n');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-700 text-foreground">Editor Kontrak</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Edit konten kontrak berdasarkan template yang dipilih.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-1.5 text-xs font-600 px-3 py-2 rounded-lg border transition-colors ${previewMode ? 'bg-primary text-white border-primary' : 'border-border text-muted-foreground hover:bg-muted'}`}
          >
            <Eye size={13} /> {previewMode ? 'Mode Edit' : 'Preview'}
          </button>
          <button className="flex items-center gap-1.5 text-xs font-600 px-3 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors">
            <Copy size={13} /> Salin
          </button>
          <button className="flex items-center gap-1.5 text-xs font-600 px-3 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors">
            <Printer size={13} /> Cetak
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Clause Navigator */}
        <div className="col-span-3">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-3 py-2.5 border-b border-border bg-muted/30">
              <p className="text-xs font-700 text-foreground">Daftar Pasal</p>
            </div>
            <div className="divide-y divide-border">
              {template.clauses.map((clause, i) => (
                <button
                  key={i}
                  onClick={() => setActiveClause(activeClause === i ? null : i)}
                  className={`w-full text-left px-3 py-2.5 text-xs transition-colors ${activeClause === i ? 'bg-primary/10 text-primary font-600' : 'text-muted-foreground hover:bg-muted/50'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-700 flex-shrink-0 ${activeClause === i ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                      {i + 1}
                    </span>
                    <span className="leading-tight line-clamp-2">{clause.replace(/Pasal \d+ – /, '')}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Contract Summary */}
          <div className="mt-3 bg-card border border-border rounded-xl p-3 space-y-2">
            <p className="text-xs font-700 text-foreground">Ringkasan</p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Nomor</span>
                <span className="font-600 font-mono text-primary text-[11px]">{details.contractNumber}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Jenis</span>
                <span className="font-600">{template.type}</span>
              </div>
              {details.mitra && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Mitra</span>
                  <span className="font-600 text-right max-w-[100px] truncate">{details.mitra}</span>
                </div>
              )}
              {details.startDate && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Mulai</span>
                  <span className="font-600">{formatDate(details.startDate)}</span>
                </div>
              )}
              {details.endDate && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Berakhir</span>
                  <span className="font-600">{formatDate(details.endDate)}</span>
                </div>
              )}
              {details.value && Number(details.value) > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Nilai</span>
                  <span className="font-600 text-emerald-700">{formatCurrency(Number(details.value))}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Editor / Preview */}
        <div className="col-span-9">
          {previewMode ? (
            <div className="bg-white border border-border rounded-xl p-8 min-h-[500px] shadow-sm">
              {/* Document Header */}
              <div className="text-center mb-8 pb-6 border-b-2 border-foreground">
                <p className="text-xs font-600 text-muted-foreground uppercase tracking-widest mb-2">PT PELINDO REGIONAL 2</p>
                <h1 className="text-xl font-700 text-foreground uppercase mb-1">{template.name.toUpperCase()}</h1>
                <p className="text-sm font-600 text-foreground">Nomor: {details.contractNumber}</p>
              </div>
              <div className="mb-6 text-sm text-foreground">
                <p className="font-600 mb-3">Pada hari ini, telah disepakati perjanjian antara:</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="font-700 text-xs text-muted-foreground uppercase mb-1">Pihak Pertama</p>
                    <p className="font-600">PT Pelindo Regional 2</p>
                    <p className="text-xs text-muted-foreground">Jl. Pasoso No. 1, Tanjung Priok, Jakarta Utara</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="font-700 text-xs text-muted-foreground uppercase mb-1">Pihak Kedua</p>
                    <p className="font-600">{details.mitra || '[Nama Mitra]'}</p>
                    <p className="text-xs text-muted-foreground">{details.mitraAddress || '[Alamat Mitra]'}</p>
                  </div>
                </div>
              </div>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm text-foreground leading-relaxed">
                  {content || generatedContent}
                </pre>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                <span className="text-[10px] text-muted-foreground bg-white/90 px-2 py-1 rounded border border-border">
                  {(content || generatedContent).length} karakter
                </span>
              </div>
              <textarea
                value={content || generatedContent}
                onChange={(e) => onContentChange(e.target.value)}
                className="w-full h-[500px] px-4 py-4 text-sm font-mono border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none leading-relaxed"
                placeholder="Konten kontrak akan muncul di sini..."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Step 4: Approval Workflow ────────────────────────────────────────────────
function ApprovalWorkflow({
  steps,
  onUpdateStep,
}: {
  steps: ApprovalStep[];
  onUpdateStep: (id: string, status: ApprovalStep['status'], comment?: string) => void;
}) {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const roleColors: Record<string, string> = {
    Legal: 'bg-blue-50 text-blue-700 border-blue-200',
    SM: 'bg-purple-50 text-purple-700 border-purple-200',
    ED: 'bg-amber-50 text-amber-700 border-amber-200',
  };

  const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    Pending: { color: 'text-amber-600', icon: <Clock size={16} className="text-amber-500" />, label: 'Menunggu Review' },
    Disetujui: { color: 'text-emerald-600', icon: <CheckCircle2 size={16} className="text-emerald-500" />, label: 'Disetujui' },
    Ditolak: { color: 'text-red-600', icon: <X size={16} className="text-red-500" />, label: 'Ditolak' },
    Menunggu: { color: 'text-slate-400', icon: <Circle size={16} className="text-slate-300" />, label: 'Belum Giliran' },
  };

  const currentActiveStep = steps.find((s) => s.status === 'Pending');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-700 text-foreground">Alur Persetujuan</h2>
        <p className="text-sm text-muted-foreground mt-1">Kontrak harus disetujui secara berurutan: Legal → Senior Manager → Executive Director.</p>
      </div>

      {/* Progress Bar */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-700 text-foreground">Progress Persetujuan</p>
          <p className="text-xs text-muted-foreground">
            {steps.filter((s) => s.status === 'Disetujui').length} / {steps.length} disetujui
          </p>
        </div>
        <div className="flex gap-2">
          {steps.map((step) => (
            <div key={step.id} className="flex-1">
              <div className={`h-2 rounded-full transition-all duration-300 ${
                step.status === 'Disetujui' ? 'bg-emerald-500' :
                step.status === 'Pending' ? 'bg-amber-400' :
                step.status === 'Ditolak' ? 'bg-red-500' : 'bg-border'
              }`} />
              <p className="text-[10px] text-muted-foreground mt-1 text-center">{step.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, idx) => {
          const cfg = statusConfig[step.status];
          const isExpanded = expandedStep === step.id;
          const isActive = step.status === 'Pending';
          const prevApproved = idx === 0 || steps[idx - 1].status === 'Disetujui';

          return (
            <div key={step.id} className={`border rounded-xl overflow-hidden transition-all duration-200 ${
              isActive ? 'border-amber-300 shadow-sm' :
              step.status === 'Disetujui' ? 'border-emerald-200' :
              step.status === 'Ditolak' ? 'border-red-200' : 'border-border'
            }`}>
              <button
                onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                className={`w-full flex items-center gap-4 p-4 text-left transition-colors ${
                  isActive ? 'bg-amber-50/50' :
                  step.status === 'Disetujui' ? 'bg-emerald-50/30' :
                  step.status === 'Ditolak' ? 'bg-red-50/30' : 'bg-card'
                }`}
              >
                {/* Step Number */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 flex-shrink-0 font-700 text-sm ${
                  step.status === 'Disetujui' ? 'bg-emerald-500 border-emerald-500 text-white' :
                  step.status === 'Ditolak'? 'bg-red-500 border-red-500 text-white' : isActive ?'bg-amber-400 border-amber-400 text-white' : 'bg-muted border-border text-muted-foreground'
                }`}>
                  {step.status === 'Disetujui' ? <Check size={16} /> : step.status === 'Ditolak' ? <X size={16} /> : step.order}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-xs font-700 px-2 py-0.5 rounded-full border ${roleColors[step.role]}`}>{step.role}</span>
                    <span className="text-sm font-600 text-foreground">{step.roleName}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{step.approver}</p>
                  {step.approvedAt && (
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {step.status === 'Disetujui' ? '✓ Disetujui' : '✗ Ditolak'} pada {formatDate(step.approvedAt)}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1.5">
                    {cfg.icon}
                    <span className={`text-xs font-600 ${cfg.color}`}>{cfg.label}</span>
                  </div>
                  {isExpanded ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-border bg-white">
                  <div className="pt-4 space-y-3">
                    {step.comment && (
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-xs font-600 text-foreground mb-1">Komentar:</p>
                        <p className="text-xs text-muted-foreground">{step.comment}</p>
                      </div>
                    )}

                    {isActive && prevApproved && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-600 text-foreground mb-1.5">Tambah Komentar (opsional)</label>
                          <textarea
                            value={commentInputs[step.id] || ''}
                            onChange={(e) => setCommentInputs({ ...commentInputs, [step.id]: e.target.value })}
                            rows={2}
                            placeholder="Catatan atau komentar untuk persetujuan ini..."
                            className="w-full px-3 py-2 text-xs border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => onUpdateStep(step.id, 'Disetujui', commentInputs[step.id])}
                            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-600 rounded-lg hover:bg-emerald-700 transition-colors"
                          >
                            <Check size={13} /> Setujui
                          </button>
                          <button
                            onClick={() => onUpdateStep(step.id, 'Ditolak', commentInputs[step.id])}
                            className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white text-xs font-600 rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <X size={13} /> Tolak
                          </button>
                        </div>
                      </div>
                    )}

                    {!isActive && step.status === 'Menunggu' && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <AlertCircle size={13} />
                        Menunggu persetujuan dari tahap sebelumnya.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {steps.every((s) => s.status === 'Disetujui') && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-700 text-emerald-800">Semua Persetujuan Selesai</p>
            <p className="text-xs text-emerald-700">Kontrak siap untuk proses penandatanganan.</p>
          </div>
        </div>
      )}

      {steps.some((s) => s.status === 'Ditolak') && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-700 text-red-800">Kontrak Ditolak</p>
            <p className="text-xs text-red-700">Silakan revisi kontrak dan ajukan ulang untuk persetujuan.</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Step 5: E-Signature ──────────────────────────────────────────────────────
function ESignaturePanel({
  signatures,
  details,
  contractNumber,
  onSign,
}: {
  signatures: SignatureParty[];
  details: ContractDetails;
  contractNumber: string;
  onSign: (id: string) => void;
}) {
  const [drawingId, setDrawingId] = useState<string | null>(null);
  const [signatureData, setSignatureData] = useState<Record<string, string>>({});

  const allSigned = signatures.every((s) => s.status === 'Sudah Ditandatangani');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-700 text-foreground">E-Signature</h2>
        <p className="text-sm text-muted-foreground mt-1">Tanda tangani kontrak secara digital. Semua pihak harus menandatangani untuk menyelesaikan proses.</p>
      </div>

      {/* Document Preview Banner */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-14 bg-white border border-border rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
            <FileText size={20} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-700 text-foreground">{details.title || 'Kontrak Baru'}</p>
            <p className="text-xs font-mono text-primary font-600 mt-0.5">{contractNumber}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Building2 size={11} /> {details.mitra || 'Mitra belum diisi'}</span>
              {details.startDate && <span className="flex items-center gap-1"><CalendarDays size={11} /> {formatDate(details.startDate)}</span>}
              {details.value && Number(details.value) > 0 && <span className="flex items-center gap-1"><DollarSign size={11} /> {formatCurrency(Number(details.value))}</span>}
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button className="flex items-center gap-1.5 text-xs font-600 px-3 py-2 rounded-lg border border-border bg-white hover:bg-muted transition-colors">
              <Eye size={13} /> Preview
            </button>
            <button className="flex items-center gap-1.5 text-xs font-600 px-3 py-2 rounded-lg border border-border bg-white hover:bg-muted transition-colors">
              <Download size={13} /> Unduh PDF
            </button>
          </div>
        </div>
      </div>

      {/* Signature Parties */}
      <div className="space-y-3">
        <h3 className="text-sm font-700 text-foreground">Pihak yang Menandatangani</h3>
        {signatures.map((sig, idx) => {
          const isDrawing = drawingId === sig.id;
          const isSigned = sig.status === 'Sudah Ditandatangani';

          return (
            <div key={sig.id} className={`border rounded-xl overflow-hidden transition-all ${isSigned ? 'border-emerald-200' : 'border-border'}`}>
              <div className={`flex items-center gap-4 p-4 ${isSigned ? 'bg-emerald-50/30' : 'bg-card'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-700 text-sm flex-shrink-0 ${
                  isSigned ? 'bg-emerald-500 text-white' : 'bg-primary/10 text-primary'
                }`}>
                  {isSigned ? <Check size={18} /> : (idx + 1)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-700 text-foreground">{sig.name}</p>
                  <p className="text-xs text-muted-foreground">{sig.role} · {sig.organization}</p>
                  <p className="text-[11px] text-muted-foreground">{sig.email}</p>
                  {sig.signedAt && (
                    <p className="text-[11px] text-emerald-700 mt-0.5">✓ Ditandatangani pada {formatDate(sig.signedAt)}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {isSigned ? (
                    <div className="flex items-center gap-1.5 text-xs font-600 text-emerald-700">
                      <Stamp size={14} /> Sudah Ditandatangani
                    </div>
                  ) : (
                    <button
                      onClick={() => setDrawingId(isDrawing ? null : sig.id)}
                      className="flex items-center gap-1.5 text-xs font-600 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <PenTool size={13} /> Tandatangani
                    </button>
                  )}
                </div>
              </div>

              {/* Signature Pad */}
              {isDrawing && !isSigned && (
                <div className="px-4 pb-4 border-t border-border bg-white">
                  <div className="pt-4 space-y-3">
                    <p className="text-xs font-600 text-foreground">Tanda Tangan Digital</p>
                    <div className="border-2 border-dashed border-border rounded-xl h-32 flex flex-col items-center justify-center gap-2 bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors"
                      onClick={() => setSignatureData({ ...signatureData, [sig.id]: 'signed' })}
                    >
                      {signatureData[sig.id] ? (
                        <div className="text-center">
                          <div className="text-2xl font-serif italic text-primary mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                            {sig.name.split(' ').slice(0, 2).join(' ')}
                          </div>
                          <p className="text-[10px] text-muted-foreground">Klik untuk mengubah</p>
                        </div>
                      ) : (
                        <>
                          <PenTool size={20} className="text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">Klik untuk membuat tanda tangan</p>
                        </>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (signatureData[sig.id]) {
                            onSign(sig.id);
                            setDrawingId(null);
                          }
                        }}
                        disabled={!signatureData[sig.id]}
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Check size={13} /> Konfirmasi Tanda Tangan
                      </button>
                      <button
                        onClick={() => { setDrawingId(null); setSignatureData({ ...signatureData, [sig.id]: '' }); }}
                        className="flex items-center gap-1.5 px-4 py-2 border border-border text-xs font-600 rounded-lg hover:bg-muted transition-colors"
                      >
                        <X size={13} /> Batal
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Completion */}
      {allSigned && (
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-300 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <FileCheck size={24} className="text-emerald-600" />
            <div>
              <p className="text-sm font-700 text-emerald-800">Kontrak Selesai Ditandatangani!</p>
              <p className="text-xs text-emerald-700">Semua pihak telah menandatangani. Kontrak kini resmi berlaku.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-600 rounded-lg hover:bg-emerald-700 transition-colors">
              <Download size={13} /> Unduh Kontrak Final
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 border border-emerald-300 text-emerald-700 text-xs font-600 rounded-lg hover:bg-emerald-50 transition-colors">
              <Send size={13} /> Kirim ke Semua Pihak
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────
export default function ContractCreationClient() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);
  const [contractDetails, setContractDetails] = useState<ContractDetails>({
    contractNumber: '',
    title: '',
    mitra: '',
    mitraAddress: '',
    mitraRepresentative: '',
    mitraRepresentativeTitle: '',
    value: '',
    startDate: '',
    endDate: '',
    notes: '',
  });
  const [contractContent, setContractContent] = useState('');
  const [approvalSteps, setApprovalSteps] = useState<ApprovalStep[]>(
    approvalWorkflowTemplate.map((s) => ({ ...s }))
  );
  const [signatures, setSignatures] = useState<SignatureParty[]>(
    signaturePartiesTemplate.map((s) => ({ ...s }))
  );
  const [saved, setSaved] = useState(false);

  const handleSelectTemplate = useCallback((tmpl: ContractTemplate) => {
    setSelectedTemplate(tmpl);
    setContractDetails((prev) => ({
      ...prev,
      contractNumber: generateContractNumber(tmpl.type),
    }));
  }, []);

  const handleUpdateApproval = useCallback((id: string, status: ApprovalStep['status'], comment?: string) => {
    setApprovalSteps((prev) => {
      const updated = prev.map((s) => {
        if (s.id === id) return { ...s, status, comment, approvedAt: new Date().toISOString().split('T')[0] };
        return s;
      });
      // Unlock next step if approved
      if (status === 'Disetujui') {
        const idx = updated.findIndex((s) => s.id === id);
        if (idx < updated.length - 1 && updated[idx + 1].status === 'Menunggu') {
          updated[idx + 1] = { ...updated[idx + 1], status: 'Pending' };
        }
      }
      return updated;
    });
  }, []);

  const handleSign = useCallback((id: string) => {
    setSignatures((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: 'Sudah Ditandatangani', signedAt: new Date().toISOString().split('T')[0] } : s
      )
    );
  }, []);

  const canProceed = () => {
    if (currentStep === 1) return selectedTemplate !== null;
    if (currentStep === 2) return contractDetails.title.trim() !== '' && contractDetails.mitra.trim() !== '' && contractDetails.startDate !== '' && contractDetails.endDate !== '';
    return true;
  };

  const handleSaveDraft = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-border bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-700 text-foreground">Pembuatan Kontrak</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Buat kontrak baru dengan template, editor, dan alur persetujuan terintegrasi.</p>
          </div>
          <div className="flex items-center gap-2">
            {saved && (
              <div className="flex items-center gap-1.5 text-xs font-600 text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                <Check size={12} /> Draft tersimpan
              </div>
            )}
            <button
              onClick={handleSaveDraft}
              className="flex items-center gap-1.5 text-xs font-600 px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <FileText size={13} /> Simpan Draft
            </button>
            <button className="flex items-center gap-1.5 text-xs font-600 px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
              <Download size={13} /> Ekspor
            </button>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex-shrink-0 px-6 py-5 border-b border-border bg-white">
        <StepIndicator current={currentStep} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-6">
          {currentStep === 1 && (
            <TemplateSelector selected={selectedTemplate} onSelect={handleSelectTemplate} />
          )}
          {currentStep === 2 && selectedTemplate && (
            <ContractDetailsForm
              template={selectedTemplate}
              details={contractDetails}
              onChange={setContractDetails}
            />
          )}
          {currentStep === 3 && selectedTemplate && (
            <ContractEditor
              template={selectedTemplate}
              details={contractDetails}
              content={contractContent}
              onContentChange={setContractContent}
            />
          )}
          {currentStep === 4 && (
            <ApprovalWorkflow steps={approvalSteps} onUpdateStep={handleUpdateApproval} />
          )}
          {currentStep === 5 && (
            <ESignaturePanel
              signatures={signatures}
              details={contractDetails}
              contractNumber={contractDetails.contractNumber}
              onSign={handleSign}
            />
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex-shrink-0 px-6 py-4 border-t border-border bg-white">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm font-600 text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={15} /> Sebelumnya
          </button>

          <div className="flex items-center gap-1.5">
            {STEPS.map((s) => (
              <div key={s.id} className={`w-2 h-2 rounded-full transition-all ${currentStep === s.id ? 'bg-primary w-5' : currentStep > s.id ? 'bg-primary/50' : 'bg-border'}`} />
            ))}
          </div>

          {currentStep < STEPS.length ? (
            <button
              onClick={() => setCurrentStep((s) => Math.min(STEPS.length, s + 1))}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-600 hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Selanjutnya <ArrowRight size={15} />
            </button>
          ) : (
            <button
              onClick={handleSaveDraft}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-600 hover:bg-emerald-700 transition-colors"
            >
              <FileCheck size={15} /> Selesaikan Kontrak
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

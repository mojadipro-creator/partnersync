'use client';

import { useState } from 'react';
import {
  ChevronRight,
  Calendar,
  AlertCircle,
  FileText,
  MessageSquare,
  Users,
  Clock,
  TrendingUp,
  Filter,
  Plus,
  Download,
  Search,
  ChevronDown,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Video,
  MapPin,
  Layers,
  Pin,
  X,
} from 'lucide-react';
import {
  negotiations,
  stageOrder,
  stageConfig,
  Negotiation,
  NegotiationStage,
  MeetingLog,
  NegotiationIssue,
  DraftVersion,
  CollaborationNote,
} from '@/lib/negotiationMockData';

function formatCurrency(val: number) {
  if (val >= 1_000_000_000) return `Rp ${(val / 1_000_000_000).toFixed(1)} M`;
  if (val >= 1_000_000) return `Rp ${(val / 1_000_000).toFixed(0)} Jt`;
  return `Rp ${val.toLocaleString('id-ID')}`;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, string> = {
    Tinggi: 'bg-red-50 text-red-700 border-red-200',
    Sedang: 'bg-amber-50 text-amber-700 border-amber-200',
    Rendah: 'bg-slate-50 text-slate-600 border-slate-200',
  };
  return (
    <span className={`text-[10px] font-600 px-2 py-0.5 rounded-full border ${map[priority] ?? 'bg-muted text-muted-foreground border-border'}`}>
      {priority}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Aktif: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Ditunda: 'bg-amber-50 text-amber-700 border-amber-200',
    Selesai: 'bg-blue-50 text-blue-700 border-blue-200',
    Dibatalkan: 'bg-red-50 text-red-700 border-red-200',
  };
  return (
    <span className={`text-[10px] font-600 px-2 py-0.5 rounded-full border ${map[status] ?? 'bg-muted text-muted-foreground border-border'}`}>
      {status}
    </span>
  );
}

// ─── Stage Pipeline ───────────────────────────────────────────────────────────
function StagePipeline({ negotiations: negs }: { negotiations: Negotiation[] }) {
  const stageCounts = stageOrder.map((stage) => ({
    stage,
    count: negs.filter((n) => n.stage === stage && n.status === 'Aktif').length,
    total: negs.filter((n) => n.stage === stage).length,
    value: negs.filter((n) => n.stage === stage).reduce((s, n) => s + n.nilaiEstimasi, 0),
  }));

  return (
    <div className="bg-white border border-border rounded-xl p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-700 text-foreground">Pipeline Negosiasi</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Distribusi negosiasi per tahap</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <TrendingUp size={13} />
          <span>{negs.filter((n) => n.status === 'Aktif').length} aktif dari {negs.length} total</span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {stageCounts.map((s, idx) => {
          const cfg = stageConfig[s.stage];
          return (
            <div key={s.stage} className="relative">
              {idx < stageCounts.length - 1 && (
                <div className="absolute top-6 -right-1.5 z-10 text-border">
                  <ChevronRight size={16} className="text-muted-foreground/40" />
                </div>
              )}
              <div className={`rounded-xl border ${cfg.border} ${cfg.bg} p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">{cfg.icon}</span>
                  <span className={`text-xl font-700 ${cfg.color}`}>{s.total}</span>
                </div>
                <p className={`text-xs font-700 ${cfg.color} mb-0.5`}>{s.stage}</p>
                <p className="text-[10px] text-muted-foreground mb-2">{cfg.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">{formatCurrency(s.value)}</span>
                  {s.count > 0 && (
                    <span className="text-[10px] font-600 text-emerald-600">{s.count} aktif</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Negotiation Card ─────────────────────────────────────────────────────────
function NegotiationCard({ neg, onSelect, selected }: { neg: Negotiation; onSelect: () => void; selected: boolean }) {
  const cfg = stageConfig[neg.stage];
  const openIssues = neg.issues.filter((i) => i.status !== 'Selesai').length;
  const daysLeft = Math.ceil((new Date(neg.targetDate).getTime() - Date.now()) / 86400000);

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-xl border transition-all duration-150 p-4 hover:shadow-md ${
        selected ? 'border-primary bg-primary/5 shadow-sm' : 'border-border bg-white hover:border-primary/30'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-xs font-600 text-foreground leading-snug line-clamp-2 flex-1">{neg.title}</p>
        <StatusBadge status={neg.status} />
      </div>
      <p className="text-[11px] text-muted-foreground mb-3">{neg.mitra}</p>

      {/* Stage pill */}
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-600 mb-3 ${cfg.bg} ${cfg.border} ${cfg.color}`}>
        <span>{cfg.icon}</span>
        <span>{neg.stage}</span>
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-muted-foreground">Progress</span>
          <span className="text-[10px] font-600 text-foreground">{neg.progress}%</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${neg.progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><Calendar size={10} />{formatDate(neg.targetDate)}</span>
          {openIssues > 0 && (
            <span className="flex items-center gap-1 text-red-500 font-600">
              <AlertCircle size={10} />{openIssues} isu
            </span>
          )}
        </div>
        <span className={`font-600 ${daysLeft < 14 ? 'text-red-500' : daysLeft < 30 ? 'text-amber-500' : 'text-muted-foreground'}`}>
          {daysLeft > 0 ? `${daysLeft}h lagi` : 'Lewat target'}
        </span>
      </div>
    </button>
  );
}

// ─── Meeting Log Tab ──────────────────────────────────────────────────────────
function MeetingLogTab({ meetings }: { meetings: MeetingLog[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const typeIcon = (t: string) => t === 'Online' ? <Video size={11} /> : t === 'Tatap Muka' ? <MapPin size={11} /> : <Layers size={11} />;
  const typeBg = (t: string) => t === 'Online' ? 'bg-blue-50 text-blue-700' : t === 'Tatap Muka' ? 'bg-emerald-50 text-emerald-700' : 'bg-purple-50 text-purple-700';

  if (meetings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Calendar size={32} className="text-muted-foreground/30 mb-3" />
        <p className="text-sm font-500 text-muted-foreground">Belum ada rapat tercatat</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {meetings.map((m) => (
        <div key={m.id} className="border border-border rounded-xl overflow-hidden">
          <button
            onClick={() => setExpanded(expanded === m.id ? null : m.id)}
            className="w-full flex items-start gap-3 p-4 hover:bg-muted/40 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Calendar size={16} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs font-600 text-foreground truncate">{m.title}</p>
                <span className={`flex items-center gap-1 text-[10px] font-500 px-1.5 py-0.5 rounded-full ${typeBg(m.type)}`}>
                  {typeIcon(m.type)} {m.type}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><Clock size={10} />{formatDate(m.date)} · {m.time}</span>
                <span className="flex items-center gap-1"><Users size={10} />{m.attendees.length} peserta</span>
              </div>
            </div>
            <ChevronDown size={14} className={`text-muted-foreground flex-shrink-0 transition-transform ${expanded === m.id ? 'rotate-180' : ''}`} />
          </button>
          {expanded === m.id && (
            <div className="px-4 pb-4 border-t border-border bg-muted/20 space-y-3 pt-3">
              <div>
                <p className="text-[10px] font-600 text-muted-foreground uppercase tracking-wide mb-1">Agenda</p>
                <p className="text-xs text-foreground">{m.agenda}</p>
              </div>
              <div>
                <p className="text-[10px] font-600 text-muted-foreground uppercase tracking-wide mb-1">Hasil Rapat</p>
                <p className="text-xs text-foreground">{m.outcome}</p>
              </div>
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                <AlertTriangle size={13} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-600 text-amber-700 mb-0.5">Tindak Lanjut</p>
                  <p className="text-xs text-amber-800">{m.nextAction}</p>
                  <p className="text-[10px] text-amber-600 mt-1">Due: {formatDate(m.nextActionDue)}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-600 text-muted-foreground uppercase tracking-wide mb-1">Peserta</p>
                <div className="flex flex-wrap gap-1.5">
                  {m.attendees.map((a) => (
                    <span key={a} className="text-[10px] px-2 py-0.5 bg-muted rounded-full text-foreground/70">{a}</span>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground">Dicatat oleh: {m.recordedBy}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Issue Tracker Tab ────────────────────────────────────────────────────────
function IssueTrackerTab({ issues }: { issues: NegotiationIssue[] }) {
  const priorityColor = (p: string) => p === 'Tinggi' ? 'text-red-600' : p === 'Sedang' ? 'text-amber-600' : 'text-slate-500';
  const statusIcon = (s: string) => s === 'Selesai' ? <CheckCircle2 size={14} className="text-emerald-500" /> : s === 'Dalam Proses' ? <Clock size={14} className="text-amber-500" /> : <Circle size={14} className="text-slate-400" />;
  const categoryBg: Record<string, string> = {
    Klausul: 'bg-purple-50 text-purple-700',
    Nilai: 'bg-red-50 text-red-700',
    Jadwal: 'bg-amber-50 text-amber-700',
    Teknis: 'bg-blue-50 text-blue-700',
    Legal: 'bg-indigo-50 text-indigo-700',
    Lainnya: 'bg-slate-50 text-slate-600',
  };

  if (issues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle2 size={32} className="text-emerald-400 mb-3" />
        <p className="text-sm font-500 text-muted-foreground">Tidak ada isu terbuka</p>
      </div>
    );
  }

  const open = issues.filter((i) => i.status !== 'Selesai');
  const closed = issues.filter((i) => i.status === 'Selesai');

  return (
    <div className="space-y-4">
      {open.length > 0 && (
        <div>
          <p className="text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-2">Isu Aktif ({open.length})</p>
          <div className="space-y-2">
            {open.map((issue) => (
              <div key={issue.id} className="border border-border rounded-xl p-4 bg-white">
                <div className="flex items-start gap-3">
                  {statusIcon(issue.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="text-xs font-600 text-foreground">{issue.title}</p>
                      <span className={`text-[10px] font-600 ${priorityColor(issue.priority)}`}>● {issue.priority}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${categoryBg[issue.category] ?? 'bg-muted text-muted-foreground'}`}>{issue.category}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mb-2">{issue.description}</p>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span>Diangkat: {formatDate(issue.raisedAt)}</span>
                      <span>Ditugaskan: <strong className="text-foreground">{issue.assignedTo}</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {closed.length > 0 && (
        <div>
          <p className="text-[10px] font-600 uppercase tracking-widest text-muted-foreground mb-2">Selesai ({closed.length})</p>
          <div className="space-y-2">
            {closed.map((issue) => (
              <div key={issue.id} className="border border-border rounded-xl p-4 bg-muted/30 opacity-70">
                <div className="flex items-start gap-3">
                  {statusIcon(issue.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-600 text-foreground line-through mb-1">{issue.title}</p>
                    {issue.resolution && (
                      <p className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1.5">
                        ✓ {issue.resolution}
                      </p>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-1">Diselesaikan: {issue.resolvedAt ? formatDate(issue.resolvedAt) : '—'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Version Control Tab ──────────────────────────────────────────────────────
function VersionControlTab({ drafts }: { drafts: DraftVersion[] }) {
  if (drafts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText size={32} className="text-muted-foreground/30 mb-3" />
        <p className="text-sm font-500 text-muted-foreground">Belum ada draft diunggah</p>
      </div>
    );
  }

  const statusStyle: Record<string, string> = {
    Aktif: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Arsip: 'bg-slate-50 text-slate-500 border-slate-200',
    Ditolak: 'bg-red-50 text-red-600 border-red-200',
  };

  return (
    <div className="space-y-3">
      {[...drafts].reverse().map((draft, idx) => (
        <div key={draft.id} className={`border rounded-xl p-4 ${draft.status === 'Aktif' ? 'border-primary/30 bg-primary/5' : 'border-border bg-white'}`}>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${draft.status === 'Aktif' ? 'bg-primary/10' : 'bg-muted'}`}>
                <FileText size={15} className={draft.status === 'Aktif' ? 'text-primary' : 'text-muted-foreground'} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-700 text-foreground">{draft.version}</p>
                  <span className={`text-[10px] font-600 px-1.5 py-0.5 rounded-full border ${statusStyle[draft.status]}`}>{draft.status}</span>
                  {idx === 0 && <span className="text-[10px] font-600 text-primary">Terbaru</span>}
                </div>
                <p className="text-[10px] text-muted-foreground">{draft.uploadedBy} · {formatDate(draft.uploadedAt)} · {draft.fileSize}</p>
              </div>
            </div>
            <button className="flex items-center gap-1.5 text-[11px] font-500 text-primary hover:text-primary/80 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-primary/10">
              <Download size={12} /> Unduh
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground mb-2 italic">"{draft.notes}"</p>
          <div>
            <p className="text-[10px] font-600 text-muted-foreground uppercase tracking-wide mb-1.5">Perubahan</p>
            <ul className="space-y-1">
              {draft.changes.map((c, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[11px] text-foreground/80">
                  <span className="text-primary mt-0.5">•</span> {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Collaboration Notes Tab ──────────────────────────────────────────────────
function CollaborationNotesTab({ notes }: { notes: CollaborationNote[] }) {
  const typeStyle: Record<string, { bg: string; border: string; badge: string; icon: string }> = {
    Catatan: { bg: 'bg-white', border: 'border-border', badge: 'bg-slate-100 text-slate-600', icon: '📝' },
    Keputusan: { bg: 'bg-blue-50/50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', icon: '✅' },
    'Tindak Lanjut': { bg: 'bg-amber-50/50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', icon: '⚡' },
    Peringatan: { bg: 'bg-red-50/50', border: 'border-red-200', badge: 'bg-red-100 text-red-700', icon: '⚠️' },
  };

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <MessageSquare size={32} className="text-muted-foreground/30 mb-3" />
        <p className="text-sm font-500 text-muted-foreground">Belum ada catatan kolaborasi</p>
      </div>
    );
  }

  const pinned = notes.filter((n) => n.pinned);
  const rest = notes.filter((n) => !n.pinned);

  return (
    <div className="space-y-3">
      {pinned.length > 0 && (
        <div className="space-y-2">
          {pinned.map((note) => {
            const style = typeStyle[note.type] ?? typeStyle['Catatan'];
            return (
              <div key={note.id} className={`border rounded-xl p-4 ${style.bg} ${style.border}`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-700 text-white">{note.author.split(' ').map((w) => w[0]).join('').slice(0, 2)}</span>
                    </div>
                    <div>
                      <p className="text-xs font-600 text-foreground">{note.author}</p>
                      <p className="text-[10px] text-muted-foreground">{note.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-500 px-1.5 py-0.5 rounded-full ${style.badge}`}>{style.icon} {note.type}</span>
                    <Pin size={11} className="text-primary" />
                  </div>
                </div>
                <p className="text-xs text-foreground leading-relaxed">{note.content}</p>
                <p className="text-[10px] text-muted-foreground mt-2">{note.timestamp}</p>
              </div>
            );
          })}
        </div>
      )}
      {rest.map((note) => {
        const style = typeStyle[note.type] ?? typeStyle['Catatan'];
        return (
          <div key={note.id} className={`border rounded-xl p-4 ${style.bg} ${style.border}`}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-600 text-foreground/70">{note.author.split(' ').map((w) => w[0]).join('').slice(0, 2)}</span>
                </div>
                <div>
                  <p className="text-xs font-600 text-foreground">{note.author}</p>
                  <p className="text-[10px] text-muted-foreground">{note.role}</p>
                </div>
              </div>
              <span className={`text-[10px] font-500 px-1.5 py-0.5 rounded-full ${style.badge}`}>{style.icon} {note.type}</span>
            </div>
            <p className="text-xs text-foreground leading-relaxed">{note.content}</p>
            <p className="text-[10px] text-muted-foreground mt-2">{note.timestamp}</p>
          </div>
        );
      })}
    </div>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────
type DetailTab = 'meetings' | 'issues' | 'drafts' | 'notes';

function NegotiationDetail({ neg, onClose }: { neg: Negotiation; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<DetailTab>('meetings');
  const cfg = stageConfig[neg.stage];
  const daysLeft = Math.ceil((new Date(neg.targetDate).getTime() - Date.now()) / 86400000);
  const openIssues = neg.issues.filter((i) => i.status !== 'Selesai').length;

  const tabs: { id: DetailTab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'meetings', label: 'Log Rapat', icon: <Calendar size={13} />, count: neg.meetings.length },
    { id: 'issues', label: 'Isu', icon: <AlertCircle size={13} />, count: openIssues || undefined },
    { id: 'drafts', label: 'Versi Draft', icon: <FileText size={13} />, count: neg.drafts.length },
    { id: 'notes', label: 'Catatan', icon: <MessageSquare size={13} />, count: neg.notes.length },
  ];

  return (
    <div className="bg-white border border-border rounded-xl flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-700 text-foreground leading-snug mb-1">{neg.title}</p>
            <p className="text-xs text-muted-foreground">{neg.mitra}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors flex-shrink-0">
            <X size={14} className="text-muted-foreground" />
          </button>
        </div>

        {/* Stage progress */}
        <div className="flex items-center gap-1.5 mb-3">
          {stageOrder.map((stage, idx) => {
            const stageCfg = stageConfig[stage];
            const isActive = stage === neg.stage;
            const isPast = stageOrder.indexOf(neg.stage) > idx;
            return (
              <div key={stage} className="flex items-center gap-1.5 flex-1">
                <div className={`flex-1 flex items-center justify-center py-1.5 px-2 rounded-lg text-[10px] font-600 border transition-all ${
                  isActive ? `${stageCfg.bg} ${stageCfg.border} ${stageCfg.color}` :
                  isPast ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-muted border-border text-muted-foreground'
                }`}>
                  {isPast ? '✓' : stageCfg.icon} {stage}
                </div>
                {idx < stageOrder.length - 1 && <ChevronRight size={10} className="text-muted-foreground/40 flex-shrink-0" />}
              </div>
            );
          })}
        </div>

        {/* Meta */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-muted/40 rounded-lg p-2.5">
            <p className="text-[10px] text-muted-foreground mb-0.5">Nilai Estimasi</p>
            <p className="text-xs font-700 text-foreground">{formatCurrency(neg.nilaiEstimasi)}</p>
          </div>
          <div className="bg-muted/40 rounded-lg p-2.5">
            <p className="text-[10px] text-muted-foreground mb-0.5">Target Selesai</p>
            <p className={`text-xs font-700 ${daysLeft < 14 ? 'text-red-600' : 'text-foreground'}`}>
              {daysLeft > 0 ? `${daysLeft} hari` : 'Lewat'}
            </p>
          </div>
          <div className="bg-muted/40 rounded-lg p-2.5">
            <p className="text-[10px] text-muted-foreground mb-0.5">Progress</p>
            <p className="text-xs font-700 text-foreground">{neg.progress}%</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <span>PIC: <strong className="text-foreground">{neg.picInternal}</strong></span>
          <span>·</span>
          <span>Mitra: <strong className="text-foreground">{neg.picMitra}</strong></span>
          <span>·</span>
          <PriorityBadge priority={neg.priority} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border px-4 pt-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-500 border-b-2 transition-all -mb-px ${
              activeTab === tab.id
                ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`text-[10px] font-700 px-1.5 py-0.5 rounded-full ${
                tab.id === 'issues' ? 'bg-red-100 text-red-600' : 'bg-muted text-muted-foreground'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'meetings' && <MeetingLogTab meetings={neg.meetings} />}
        {activeTab === 'issues' && <IssueTrackerTab issues={neg.issues} />}
        {activeTab === 'drafts' && <VersionControlTab drafts={neg.drafts} />}
        {activeTab === 'notes' && <CollaborationNotesTab notes={neg.notes} />}
      </div>
    </div>
  );
}

// ─── Main Client ──────────────────────────────────────────────────────────────
export default function NegotiationTrackerClient() {
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<NegotiationStage | ''>('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [selectedNeg, setSelectedNeg] = useState<Negotiation | null>(negotiations[0]);

  const filtered = negotiations.filter((n) => {
    if (search) {
      const q = search.toLowerCase();
      if (!n.title.toLowerCase().includes(q) && !n.mitra.toLowerCase().includes(q)) return false;
    }
    if (stageFilter && n.stage !== stageFilter) return false;
    if (statusFilter && n.status !== statusFilter) return false;
    if (priorityFilter && n.priority !== priorityFilter) return false;
    return true;
  });

  const totalValue = negotiations.reduce((s, n) => s + n.nilaiEstimasi, 0);
  const activeCount = negotiations.filter((n) => n.status === 'Aktif').length;
  const openIssuesTotal = negotiations.reduce((s, n) => s + n.issues.filter((i) => i.status !== 'Selesai').length, 0);
  const nearDeadline = negotiations.filter((n) => {
    const d = Math.ceil((new Date(n.targetDate).getTime() - Date.now()) / 86400000);
    return d > 0 && d <= 14 && n.status === 'Aktif';
  }).length;

  return (
    <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-12 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-700 text-foreground tracking-tight">Negosiasi Tracker</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola pipeline negosiasi, rapat, isu, dan versi draft kontrak
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-500 text-foreground hover:bg-muted transition-all active:scale-95">
            <Download size={14} /> Ekspor
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-600 hover:bg-primary/90 transition-all active:scale-95 shadow-sm">
            <Plus size={14} /> Negosiasi Baru
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Nilai Pipeline', value: formatCurrency(totalValue), sub: `${negotiations.length} negosiasi`, icon: <TrendingUp size={16} />, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Negosiasi Aktif', value: String(activeCount), sub: 'sedang berjalan', icon: <Circle size={16} />, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { label: 'Isu Terbuka', value: String(openIssuesTotal), sub: 'perlu perhatian', icon: <AlertCircle size={16} />, color: 'text-red-600', bg: 'bg-red-100' },
          { label: 'Mendekati Deadline', value: String(nearDeadline), sub: '≤ 14 hari', icon: <Clock size={16} />, color: 'text-amber-600', bg: 'bg-amber-100' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white border border-border rounded-xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center flex-shrink-0`}>
              <span className={kpi.color}>{kpi.icon}</span>
            </div>
            <div>
              <p className="text-xl font-700 text-foreground">{kpi.value}</p>
              <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
              <p className="text-[10px] text-muted-foreground/70">{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Stage Pipeline */}
      <StagePipeline negotiations={negotiations} />

      {/* Main Content: List + Detail */}
      <div className="grid grid-cols-5 gap-5">
        {/* Left: List */}
        <div className="col-span-2 flex flex-col gap-3">
          {/* Filters */}
          <div className="bg-white border border-border rounded-xl p-3 space-y-2">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari negosiasi atau mitra..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value as NegotiationStage | '')}
                className="px-2 py-1.5 text-[11px] border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 text-foreground"
              >
                <option value="">Semua Tahap</option>
                {stageOrder.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2 py-1.5 text-[11px] border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 text-foreground"
              >
                <option value="">Semua Status</option>
                {['Aktif', 'Ditunda', 'Selesai', 'Dibatalkan'].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-2 py-1.5 text-[11px] border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 text-foreground"
              >
                <option value="">Semua Prioritas</option>
                {['Tinggi', 'Sedang', 'Rendah'].map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Filter size={10} />
              <span>{filtered.length} dari {negotiations.length} negosiasi</span>
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 480px)' }}>
            {filtered.length === 0 ? (
              <div className="bg-white border border-border rounded-xl p-8 text-center">
                <p className="text-sm text-muted-foreground">Tidak ada negosiasi ditemukan</p>
              </div>
            ) : (
              filtered.map((neg) => (
                <NegotiationCard
                  key={neg.id}
                  neg={neg}
                  onSelect={() => setSelectedNeg(neg)}
                  selected={selectedNeg?.id === neg.id}
                />
              ))
            )}
          </div>
        </div>

        {/* Right: Detail */}
        <div className="col-span-3" style={{ minHeight: 600 }}>
          {selectedNeg ? (
            <NegotiationDetail
              neg={selectedNeg}
              onClose={() => setSelectedNeg(null)}
            />
          ) : (
            <div className="bg-white border border-border rounded-xl h-full flex flex-col items-center justify-center text-center p-12">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <FileText size={24} className="text-muted-foreground/40" />
              </div>
              <p className="text-sm font-600 text-muted-foreground mb-1">Pilih negosiasi</p>
              <p className="text-xs text-muted-foreground/70">Klik salah satu negosiasi di sebelah kiri untuk melihat detail</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

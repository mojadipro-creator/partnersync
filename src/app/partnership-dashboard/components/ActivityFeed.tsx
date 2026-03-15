'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Upload, CheckCircle, AlertTriangle, Bell, RefreshCw, FilePlus, Eye, ArrowRight,
} from 'lucide-react';
import { activityLogService } from '@/lib/supabaseService';

// Backend integration point: replace with GET /api/activity-logs?limit=6
function useActivityLogs() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    activityLogService
      .getRecent(6)
      .then((data) => setLogs(data))
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, []);

  return { loading, logs };
}

const typeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  upload: { icon: <Upload size={13} />, color: 'text-blue-700', bg: 'bg-blue-50' },
  approval: { icon: <CheckCircle size={13} />, color: 'text-emerald-700', bg: 'bg-emerald-50' },
  alert: { icon: <AlertTriangle size={13} />, color: 'text-red-700', bg: 'bg-red-50' },
  reminder: { icon: <Bell size={13} />, color: 'text-amber-700', bg: 'bg-amber-50' },
  renewal: { icon: <RefreshCw size={13} />, color: 'text-cyan-700', bg: 'bg-cyan-50' },
  create: { icon: <FilePlus size={13} />, color: 'text-violet-700', bg: 'bg-violet-50' },
  review: { icon: <Eye size={13} />, color: 'text-indigo-700', bg: 'bg-indigo-50' },
};

export default function ActivityFeed() {
  const { loading, logs } = useActivityLogs();

  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <h3 className="text-sm font-600 text-foreground">Aktivitas Terbaru</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Log aktivitas sistem & pengguna</p>
        </div>
        <Link href="/partnership-dashboard" className="flex items-center gap-1 text-xs font-600 text-primary hover:text-primary/80 transition-colors">
          Semua log <ArrowRight size={12} />
        </Link>
      </div>

      <div className="divide-y divide-border/60">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-5 py-3.5 flex items-start gap-3 animate-pulse">
                <div className="w-7 h-7 rounded-full bg-muted flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="h-3.5 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-full mb-1.5" />
                  <div className="h-3 bg-muted rounded w-1/3" />
                </div>
              </div>
            ))
          : logs.length === 0
          ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">
              Belum ada aktivitas tercatat.
            </div>
          )
          : logs.map((log) => {
              const cfg = typeConfig[log.type] ?? typeConfig.create;
              const displayTime = log.timestamp
                ? new Date(log.timestamp).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })
                : '';
              return (
                <div key={log.id} className="px-5 py-3.5 flex items-start gap-3 hover:bg-muted/20 transition-colors">
                  <div className={`w-7 h-7 rounded-full ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.color}`}>
                    {cfg.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-600 text-foreground leading-snug">{log.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">{log.description}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[11px] text-muted-foreground font-mono">{displayTime}</span>
                      <span className="text-[11px] text-muted-foreground">•</span>
                      <span className="text-[11px] text-muted-foreground">{log.user}</span>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}
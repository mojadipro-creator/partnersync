import React from 'react';

export type ContractStatus =
  | 'Draft' |'Review Legal' |'Approval SM/ED' |'Aktif' |'Mendekati Akhir' |'Expired' |'Renewal';

export type PartnerStatus =
  | 'Lead' |'Pra-Kualifikasi' |'Negosiasi' |'Mitra Aktif' |'Evaluasi' |'Penutupan';

export type ComplianceStatus = 'Lengkap' | 'Sebagian' | 'Tidak Lengkap' | 'Perlu Review';

type BadgeVariant = ContractStatus | PartnerStatus | ComplianceStatus | string;

const variantMap: Record<string, string> = {
  // Contract status
  Draft: 'bg-slate-100 text-slate-600 border-slate-200',
  'Review Legal': 'bg-blue-50 text-blue-700 border-blue-200',
  'Approval SM/ED': 'bg-violet-50 text-violet-700 border-violet-200',
  Aktif: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Mendekati Akhir': 'bg-amber-50 text-amber-700 border-amber-200',
  Expired: 'bg-red-50 text-red-700 border-red-200',
  Renewal: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  // Partner status
  Lead: 'bg-slate-100 text-slate-600 border-slate-200',
  'Pra-Kualifikasi': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Negosiasi: 'bg-orange-50 text-orange-700 border-orange-200',
  'Mitra Aktif': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Evaluasi: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  Penutupan: 'bg-red-50 text-red-600 border-red-200',
  // Compliance
  Lengkap: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Sebagian: 'bg-amber-50 text-amber-700 border-amber-200',
  'Tidak Lengkap': 'bg-red-50 text-red-700 border-red-200',
  'Perlu Review': 'bg-orange-50 text-orange-700 border-orange-200',
};

interface StatusBadgeProps {
  status: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
}

export default function StatusBadge({ status, size = 'md', dot = false }: StatusBadgeProps) {
  const classes = variantMap[status] ?? 'bg-slate-100 text-slate-600 border-slate-200';
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium border rounded-full
        ${size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'}
        ${classes}
      `}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />}
      {status}
    </span>
  );
}
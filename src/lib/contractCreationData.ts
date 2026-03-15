export type ContractType = 'MoU' | 'PKS' | 'Perjanjian Kerjasama' | 'Addendum';
export type ApprovalStatus = 'Pending' | 'Disetujui' | 'Ditolak' | 'Menunggu';
export type SignatureStatus = 'Belum Ditandatangani' | 'Sudah Ditandatangani' | 'Menunggu';
export type ContractStatus = 'Draft' | 'Review' | 'Approval' | 'Signing' | 'Aktif' | 'Ditolak';

export interface ContractTemplate {
  id: string;
  type: ContractType;
  name: string;
  description: string;
  clauses: string[];
  defaultDuration: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  usageCount: number;
}

export interface ApprovalStep {
  id: string;
  role: 'Legal' | 'SM' | 'ED';
  roleName: string;
  approver: string;
  status: ApprovalStatus;
  approvedAt?: string;
  comment?: string;
  order: number;
}

export interface SignatureParty {
  id: string;
  name: string;
  role: string;
  organization: string;
  email: string;
  status: SignatureStatus;
  signedAt?: string;
}

export interface ContractDraft {
  id: string;
  contractNumber: string;
  title: string;
  type: ContractType;
  mitra: string;
  mitraAddress: string;
  value: number;
  startDate: string;
  endDate: string;
  status: ContractStatus;
  createdBy: string;
  createdAt: string;
  lastModified: string;
  approvalSteps: ApprovalStep[];
  signatures: SignatureParty[];
  content: string;
  notes: string;
}

export const contractTemplates: ContractTemplate[] = [
  {
    id: 'tmpl-001',
    type: 'MoU',
    name: 'Memorandum of Understanding',
    description: 'Dokumen kesepahaman awal antara dua pihak untuk menyatakan niat kerja sama sebelum perjanjian formal.',
    clauses: [
      'Pasal 1 – Maksud dan Tujuan',
      'Pasal 2 – Ruang Lingkup Kerja Sama',
      'Pasal 3 – Hak dan Kewajiban Para Pihak',
      'Pasal 4 – Jangka Waktu',
      'Pasal 5 – Kerahasiaan',
      'Pasal 6 – Penyelesaian Perselisihan',
      'Pasal 7 – Ketentuan Penutup',
    ],
    defaultDuration: '1 Tahun',
    icon: '🤝',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    usageCount: 24,
  },
  {
    id: 'tmpl-002',
    type: 'PKS',
    name: 'Perjanjian Kerja Sama',
    description: 'Perjanjian formal yang mengatur hak, kewajiban, dan tanggung jawab para pihak dalam kerja sama operasional.',
    clauses: [
      'Pasal 1 – Definisi dan Interpretasi',
      'Pasal 2 – Ruang Lingkup Pekerjaan',
      'Pasal 3 – Nilai Kontrak dan Pembayaran',
      'Pasal 4 – Jangka Waktu Pelaksanaan',
      'Pasal 5 – Hak dan Kewajiban Pelindo',
      'Pasal 6 – Hak dan Kewajiban Mitra',
      'Pasal 7 – Standar K3 dan SMK3',
      'Pasal 8 – Kepatuhan GCG dan PNBP',
      'Pasal 9 – Sanksi dan Denda',
      'Pasal 10 – Force Majeure',
      'Pasal 11 – Penyelesaian Sengketa',
      'Pasal 12 – Ketentuan Penutup',
    ],
    defaultDuration: '2 Tahun',
    icon: '📋',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    usageCount: 58,
  },
  {
    id: 'tmpl-003',
    type: 'Perjanjian Kerjasama',
    name: 'Perjanjian Kerjasama Strategis',
    description: 'Perjanjian kerjasama strategis jangka panjang untuk proyek-proyek besar dengan nilai investasi signifikan.',
    clauses: [
      'Pasal 1 – Latar Belakang dan Tujuan Strategis',
      'Pasal 2 – Definisi',
      'Pasal 3 – Struktur Kerja Sama',
      'Pasal 4 – Kontribusi Para Pihak',
      'Pasal 5 – Tata Kelola dan Pengambilan Keputusan',
      'Pasal 6 – Keuangan dan Bagi Hasil',
      'Pasal 7 – Kekayaan Intelektual',
      'Pasal 8 – Kepatuhan Regulasi',
      'Pasal 9 – Audit dan Pelaporan',
      'Pasal 10 – Pengakhiran Perjanjian',
      'Pasal 11 – Kerahasiaan',
      'Pasal 12 – Hukum yang Berlaku',
    ],
    defaultDuration: '5 Tahun',
    icon: '🏛️',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    usageCount: 12,
  },
  {
    id: 'tmpl-004',
    type: 'Addendum',
    name: 'Addendum / Amandemen Kontrak',
    description: 'Dokumen perubahan atau penambahan klausul pada kontrak yang sudah ada tanpa membatalkan perjanjian asal.',
    clauses: [
      'Pasal 1 – Referensi Kontrak Asal',
      'Pasal 2 – Alasan Perubahan',
      'Pasal 3 – Klausul yang Diubah/Ditambahkan',
      'Pasal 4 – Klausul yang Dihapus',
      'Pasal 5 – Nilai Kontrak Baru (jika berubah)',
      'Pasal 6 – Jangka Waktu Baru (jika berubah)',
      'Pasal 7 – Ketentuan Lain Tetap Berlaku',
    ],
    defaultDuration: 'Mengikuti Kontrak Asal',
    icon: '📝',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    usageCount: 31,
  },
];

export const approvalWorkflowTemplate: ApprovalStep[] = [
  {
    id: 'appr-1',
    role: 'Legal',
    roleName: 'Divisi Legal',
    approver: 'Ir. Hendra Kusuma, S.H.',
    status: 'Pending',
    order: 1,
  },
  {
    id: 'appr-2',
    role: 'SM',
    roleName: 'Senior Manager',
    approver: 'Drs. Agus Prasetyo, M.M.',
    status: 'Menunggu',
    order: 2,
  },
  {
    id: 'appr-3',
    role: 'ED',
    roleName: 'Executive Director',
    approver: 'Dr. Siti Rahayu, M.B.A.',
    status: 'Menunggu',
    order: 3,
  },
];

export const signaturePartiesTemplate: SignatureParty[] = [
  {
    id: 'sig-1',
    name: 'Dr. Siti Rahayu, M.B.A.',
    role: 'Executive Director',
    organization: 'PT Pelindo Regional 2',
    email: 'siti.rahayu@pelindo.co.id',
    status: 'Belum Ditandatangani',
  },
  {
    id: 'sig-2',
    name: '[Nama Perwakilan Mitra]',
    role: 'Direktur Utama',
    organization: '[Nama Perusahaan Mitra]',
    email: '[email@mitra.co.id]',
    status: 'Belum Ditandatangani',
  },
];

export const recentContracts: ContractDraft[] = [
  {
    id: 'ctr-001',
    contractNumber: 'PKS/REG2/2025/001',
    title: 'PKS Pengelolaan Terminal Peti Kemas',
    type: 'PKS',
    mitra: 'PT Maju Bersama Logistik',
    mitraAddress: 'Jl. Pelabuhan No. 45, Jakarta Utara',
    value: 12500000000,
    startDate: '2025-01-15',
    endDate: '2027-01-14',
    status: 'Aktif',
    createdBy: 'Budi Santoso',
    createdAt: '2025-01-05',
    lastModified: '2025-01-14',
    approvalSteps: [
      { id: 'a1', role: 'Legal', roleName: 'Divisi Legal', approver: 'Ir. Hendra Kusuma, S.H.', status: 'Disetujui', approvedAt: '2025-01-10', comment: 'Klausul K3 sudah sesuai regulasi.', order: 1 },
      { id: 'a2', role: 'SM', roleName: 'Senior Manager', approver: 'Drs. Agus Prasetyo, M.M.', status: 'Disetujui', approvedAt: '2025-01-12', order: 2 },
      { id: 'a3', role: 'ED', roleName: 'Executive Director', approver: 'Dr. Siti Rahayu, M.B.A.', status: 'Disetujui', approvedAt: '2025-01-14', order: 3 },
    ],
    signatures: [
      { id: 's1', name: 'Dr. Siti Rahayu, M.B.A.', role: 'Executive Director', organization: 'PT Pelindo Regional 2', email: 'siti.rahayu@pelindo.co.id', status: 'Sudah Ditandatangani', signedAt: '2025-01-15' },
      { id: 's2', name: 'Ir. Bambang Wijaya', role: 'Direktur Utama', organization: 'PT Maju Bersama Logistik', email: 'bambang@majubersama.co.id', status: 'Sudah Ditandatangani', signedAt: '2025-01-15' },
    ],
    content: '',
    notes: 'Kontrak utama pengelolaan terminal peti kemas Pelabuhan Tanjung Priok.',
  },
  {
    id: 'ctr-002',
    contractNumber: 'MOU/REG2/2025/002',
    title: 'MoU Pengembangan Infrastruktur Digital',
    type: 'MoU',
    mitra: 'PT Teknologi Pelabuhan Indonesia',
    mitraAddress: 'Jl. Sudirman Kav. 52, Jakarta Selatan',
    value: 0,
    startDate: '2025-02-01',
    endDate: '2026-01-31',
    status: 'Approval',
    createdBy: 'Dewi Kusuma',
    createdAt: '2025-01-20',
    lastModified: '2025-02-10',
    approvalSteps: [
      { id: 'a1', role: 'Legal', roleName: 'Divisi Legal', approver: 'Ir. Hendra Kusuma, S.H.', status: 'Disetujui', approvedAt: '2025-02-05', order: 1 },
      { id: 'a2', role: 'SM', roleName: 'Senior Manager', approver: 'Drs. Agus Prasetyo, M.M.', status: 'Pending', order: 2 },
      { id: 'a3', role: 'ED', roleName: 'Executive Director', approver: 'Dr. Siti Rahayu, M.B.A.', status: 'Menunggu', order: 3 },
    ],
    signatures: [
      { id: 's1', name: 'Dr. Siti Rahayu, M.B.A.', role: 'Executive Director', organization: 'PT Pelindo Regional 2', email: 'siti.rahayu@pelindo.co.id', status: 'Belum Ditandatangani' },
      { id: 's2', name: '[Perwakilan TPI]', role: 'Direktur', organization: 'PT Teknologi Pelabuhan Indonesia', email: 'dir@tpi.co.id', status: 'Belum Ditandatangani' },
    ],
    content: '',
    notes: 'MoU untuk eksplorasi digitalisasi sistem pelabuhan.',
  },
];

export function generateContractNumber(type: ContractType): string {
  const typeCode: Record<ContractType, string> = {
    'MoU': 'MOU',
    'PKS': 'PKS',
    'Perjanjian Kerjasama': 'PKJ',
    'Addendum': 'ADD',
  };
  const year = new Date().getFullYear();
  const seq = String(Math.floor(Math.random() * 900) + 100).padStart(3, '0');
  return `${typeCode[type]}/REG2/${year}/${seq}`;
}

export type NegotiationStage = 'Proposal' | 'Diskusi' | 'Review Syarat' | 'Persetujuan';
export type NegotiationStatus = 'Aktif' | 'Ditunda' | 'Selesai' | 'Dibatalkan';
export type IssueStatus = 'Terbuka' | 'Dalam Proses' | 'Selesai';
export type IssuePriority = 'Tinggi' | 'Sedang' | 'Rendah';
export type MeetingType = 'Online' | 'Tatap Muka' | 'Hybrid';

export interface DraftVersion {
  id: string;
  version: string;
  uploadedBy: string;
  uploadedAt: string;
  notes: string;
  fileSize: string;
  status: 'Aktif' | 'Arsip' | 'Ditolak';
  changes: string[];
}

export interface MeetingLog {
  id: string;
  title: string;
  date: string;
  time: string;
  type: MeetingType;
  attendees: string[];
  agenda: string;
  outcome: string;
  nextAction: string;
  nextActionDue: string;
  recordedBy: string;
}

export interface NegotiationIssue {
  id: string;
  title: string;
  description: string;
  priority: IssuePriority;
  status: IssueStatus;
  raisedBy: string;
  raisedAt: string;
  resolvedAt?: string;
  assignedTo: string;
  category: 'Klausul' | 'Nilai' | 'Jadwal' | 'Teknis' | 'Legal' | 'Lainnya';
  resolution?: string;
}

export interface CollaborationNote {
  id: string;
  author: string;
  role: string;
  content: string;
  timestamp: string;
  type: 'Catatan' | 'Keputusan' | 'Tindak Lanjut' | 'Peringatan';
  mentions?: string[];
  pinned?: boolean;
}

export interface Negotiation {
  id: string;
  title: string;
  mitra: string;
  mitraId: string;
  jenisKontrak: string;
  nilaiEstimasi: number;
  stage: NegotiationStage;
  status: NegotiationStatus;
  picInternal: string;
  picMitra: string;
  startDate: string;
  targetDate: string;
  lastActivity: string;
  progress: number;
  region: string;
  priority: 'Tinggi' | 'Sedang' | 'Rendah';
  meetings: MeetingLog[];
  issues: NegotiationIssue[];
  drafts: DraftVersion[];
  notes: CollaborationNote[];
  tags: string[];
  description: string;
}

export const negotiations: Negotiation[] = [
  {
    id: 'neg001',
    title: 'PKS Pengelolaan Terminal Peti Kemas — PT Nusantara Logistik',
    mitra: 'PT Nusantara Logistik',
    mitraId: 'p001',
    jenisKontrak: 'PKS',
    nilaiEstimasi: 4800000000,
    stage: 'Review Syarat',
    status: 'Aktif',
    picInternal: 'Budi Santoso',
    picMitra: 'Hendra Wijaya',
    startDate: '2026-01-15',
    targetDate: '2026-03-30',
    lastActivity: '2026-03-14',
    progress: 68,
    region: 'Palembang',
    priority: 'Tinggi',
    description: 'Negosiasi PKS untuk pengelolaan terminal peti kemas kapasitas 50.000 TEUs/tahun. Fokus pada klausul K3, bagi hasil, dan SLA operasional.',
    tags: ['Terminal', 'Peti Kemas', 'K3', 'SLA'],
    meetings: [
      {
        id: 'm001',
        title: 'Kick-off Meeting Negosiasi PKS',
        date: '2026-01-20',
        time: '09:00',
        type: 'Tatap Muka',
        attendees: ['Budi Santoso', 'Hendra Wijaya', 'Rina Kusuma', 'Tim Legal'],
        agenda: 'Pembahasan ruang lingkup PKS, target timeline, dan identifikasi isu awal',
        outcome: 'Disepakati timeline 10 minggu. Identifikasi 5 klausul kritis yang perlu negosiasi mendalam.',
        nextAction: 'Penyusunan draft awal oleh tim legal internal',
        nextActionDue: '2026-01-27',
        recordedBy: 'Rina Kusuma',
      },
      {
        id: 'm002',
        title: 'Review Draft v1.0 — Klausul Bagi Hasil',
        date: '2026-02-05',
        time: '14:00',
        type: 'Online',
        attendees: ['Budi Santoso', 'Hendra Wijaya', 'Agus Pramono'],
        agenda: 'Review klausul bagi hasil dan mekanisme pembayaran PNBP',
        outcome: 'Mitra mengajukan revisi persentase bagi hasil dari 30% menjadi 25%. Perlu persetujuan SM.',
        nextAction: 'Eskalasi ke SM untuk keputusan persentase bagi hasil',
        nextActionDue: '2026-02-10',
        recordedBy: 'Budi Santoso',
      },
      {
        id: 'm003',
        title: 'Finalisasi Klausul K3 & SLA',
        date: '2026-03-01',
        time: '10:00',
        type: 'Hybrid',
        attendees: ['Budi Santoso', 'Hendra Wijaya', 'Tim K3', 'Legal Mitra'],
        agenda: 'Finalisasi klausul K3/SMK3 dan SLA operasional terminal',
        outcome: 'Klausul K3 disepakati mengacu standar ISO 45001. SLA 99.5% uptime disetujui kedua pihak.',
        nextAction: 'Penyusunan draft v2.0 dengan revisi klausul yang disepakati',
        nextActionDue: '2026-03-10',
        recordedBy: 'Rina Kusuma',
      },
    ],
    issues: [
      {
        id: 'i001',
        title: 'Klausul Bagi Hasil Belum Disepakati',
        description: 'Mitra mengajukan persentase bagi hasil 25%, sementara posisi internal adalah 30%. Perlu keputusan SM/ED.',
        priority: 'Tinggi',
        status: 'Dalam Proses',
        raisedBy: 'Budi Santoso',
        raisedAt: '2026-02-05',
        assignedTo: 'Direktur Komersial',
        category: 'Nilai',
      },
      {
        id: 'i002',
        title: 'Klausul Force Majeure Terlalu Luas',
        description: 'Definisi force majeure dalam draft mitra mencakup kondisi yang terlalu luas, berpotensi merugikan Pelindo.',
        priority: 'Sedang',
        status: 'Selesai',
        raisedBy: 'Tim Legal',
        raisedAt: '2026-01-25',
        resolvedAt: '2026-02-15',
        assignedTo: 'Tim Legal',
        category: 'Legal',
        resolution: 'Klausul force majeure direvisi mengacu pada definisi standar hukum Indonesia.',
      },
      {
        id: 'i003',
        title: 'Spesifikasi Teknis Peralatan Belum Terlampir',
        description: 'Lampiran teknis peralatan terminal belum dilengkapi oleh mitra.',
        priority: 'Rendah',
        status: 'Terbuka',
        raisedBy: 'Tim Teknis',
        raisedAt: '2026-03-05',
        assignedTo: 'Hendra Wijaya',
        category: 'Teknis',
      },
    ],
    drafts: [
      {
        id: 'd001',
        version: 'v1.0',
        uploadedBy: 'Tim Legal Internal',
        uploadedAt: '2026-01-27',
        notes: 'Draft awal berdasarkan template PKS standar Pelindo',
        fileSize: '2.4 MB',
        status: 'Arsip',
        changes: ['Struktur dasar PKS', 'Klausul K3 standar', 'Mekanisme pembayaran awal'],
      },
      {
        id: 'd002',
        version: 'v1.5',
        uploadedBy: 'Hendra Wijaya',
        uploadedAt: '2026-02-18',
        notes: 'Revisi dari mitra — perubahan klausul bagi hasil dan force majeure',
        fileSize: '2.7 MB',
        status: 'Arsip',
        changes: ['Revisi klausul bagi hasil (25%)', 'Perluasan definisi force majeure', 'Tambahan lampiran teknis'],
      },
      {
        id: 'd003',
        version: 'v2.0',
        uploadedBy: 'Tim Legal Internal',
        uploadedAt: '2026-03-10',
        notes: 'Draft konsolidasi pasca meeting 1 Maret — klausul K3 dan SLA final',
        fileSize: '3.1 MB',
        status: 'Aktif',
        changes: ['Klausul K3 ISO 45001', 'SLA 99.5% uptime', 'Revisi force majeure', 'Lampiran teknis parsial'],
      },
    ],
    notes: [
      {
        id: 'n001',
        author: 'Budi Santoso',
        role: 'PIC Internal',
        content: 'Mitra sangat kooperatif dalam pembahasan K3. Isu utama ada di klausul bagi hasil — perlu eskalasi segera ke SM sebelum target tanggal terlewat.',
        timestamp: '2026-03-14 09:30',
        type: 'Peringatan',
        pinned: true,
      },
      {
        id: 'n002',
        author: 'Rina Kusuma',
        role: 'Legal Officer',
        content: 'Klausul force majeure sudah diselesaikan. Draft v2.0 sudah mencerminkan semua kesepakatan dari meeting 1 Maret.',
        timestamp: '2026-03-10 15:45',
        type: 'Keputusan',
        pinned: false,
      },
      {
        id: 'n003',
        author: 'Agus Pramono',
        role: 'Manajer Komersial',
        content: 'Perlu konfirmasi dari Direktur Komersial terkait posisi akhir bagi hasil sebelum meeting berikutnya.',
        timestamp: '2026-03-08 11:00',
        type: 'Tindak Lanjut',
        pinned: false,
      },
    ],
  },
  {
    id: 'neg002',
    title: 'MoU Kerjasama Pengembangan Kawasan Industri — PT Sriwijaya Energi',
    mitra: 'PT Sriwijaya Energi',
    mitraId: 'p002',
    jenisKontrak: 'MoU',
    nilaiEstimasi: 12500000000,
    stage: 'Diskusi',
    status: 'Aktif',
    picInternal: 'Dewi Rahayu',
    picMitra: 'Bambang Sutrisno',
    startDate: '2026-02-01',
    targetDate: '2026-04-15',
    lastActivity: '2026-03-12',
    progress: 35,
    region: 'Palembang',
    priority: 'Tinggi',
    description: 'MoU untuk pengembangan kawasan industri terintegrasi di area pelabuhan. Nilai strategis tinggi untuk pertumbuhan PNBP jangka panjang.',
    tags: ['Kawasan Industri', 'Strategis', 'PNBP', 'Jangka Panjang'],
    meetings: [
      {
        id: 'm004',
        title: 'Presentasi Proposal Awal',
        date: '2026-02-08',
        time: '10:00',
        type: 'Tatap Muka',
        attendees: ['Dewi Rahayu', 'Bambang Sutrisno', 'Direksi Pelindo'],
        agenda: 'Presentasi konsep MoU dan potensi kerjasama kawasan industri',
        outcome: 'Direksi menyambut positif. Diminta studi kelayakan lebih detail dalam 3 minggu.',
        nextAction: 'Penyusunan studi kelayakan oleh tim pengembangan bisnis',
        nextActionDue: '2026-03-01',
        recordedBy: 'Dewi Rahayu',
      },
    ],
    issues: [
      {
        id: 'i004',
        title: 'Studi Kelayakan Belum Selesai',
        description: 'Tim pengembangan bisnis belum menyelesaikan studi kelayakan yang diminta direksi.',
        priority: 'Tinggi',
        status: 'Dalam Proses',
        raisedBy: 'Dewi Rahayu',
        raisedAt: '2026-03-05',
        assignedTo: 'Tim Pengembangan Bisnis',
        category: 'Teknis',
      },
    ],
    drafts: [
      {
        id: 'd004',
        version: 'v0.1',
        uploadedBy: 'Dewi Rahayu',
        uploadedAt: '2026-02-15',
        notes: 'Outline MoU awal — belum final, untuk diskusi internal',
        fileSize: '1.2 MB',
        status: 'Aktif',
        changes: ['Outline ruang lingkup kerjasama', 'Identifikasi awal klausul kritis'],
      },
    ],
    notes: [
      {
        id: 'n004',
        author: 'Dewi Rahayu',
        role: 'PIC Internal',
        content: 'Mitra sangat antusias dan memiliki kapasitas finansial yang kuat. Perlu percepatan studi kelayakan agar momentum tidak hilang.',
        timestamp: '2026-03-12 14:00',
        type: 'Catatan',
        pinned: true,
      },
    ],
  },
  {
    id: 'neg003',
    title: 'Addendum Kontrak Bongkar Muat — CV Maju Bersama',
    mitra: 'CV Maju Bersama',
    mitraId: 'p003',
    jenisKontrak: 'Addendum',
    nilaiEstimasi: 850000000,
    stage: 'Persetujuan',
    status: 'Aktif',
    picInternal: 'Rudi Hartono',
    picMitra: 'Siti Aminah',
    startDate: '2026-02-20',
    targetDate: '2026-03-25',
    lastActivity: '2026-03-13',
    progress: 90,
    region: 'Palembang',
    priority: 'Sedang',
    description: 'Addendum untuk perpanjangan kontrak bongkar muat dengan penyesuaian tarif dan penambahan kapasitas.',
    tags: ['Addendum', 'Bongkar Muat', 'Tarif', 'Perpanjangan'],
    meetings: [
      {
        id: 'm005',
        title: 'Finalisasi Addendum',
        date: '2026-03-10',
        time: '13:00',
        type: 'Online',
        attendees: ['Rudi Hartono', 'Siti Aminah'],
        agenda: 'Review final addendum sebelum penandatanganan',
        outcome: 'Semua klausul disetujui. Menunggu tanda tangan SM.',
        nextAction: 'Pengajuan ke SM untuk persetujuan dan penandatanganan',
        nextActionDue: '2026-03-20',
        recordedBy: 'Rudi Hartono',
      },
    ],
    issues: [],
    drafts: [
      {
        id: 'd005',
        version: 'v1.0',
        uploadedBy: 'Rudi Hartono',
        uploadedAt: '2026-02-25',
        notes: 'Draft addendum final — siap untuk persetujuan',
        fileSize: '0.8 MB',
        status: 'Aktif',
        changes: ['Penyesuaian tarif bongkar muat +8%', 'Perpanjangan 2 tahun', 'Penambahan kapasitas 20%'],
      },
    ],
    notes: [
      {
        id: 'n005',
        author: 'Rudi Hartono',
        role: 'PIC Internal',
        content: 'Addendum hampir final. Menunggu jadwal SM untuk penandatanganan. Target selesai sebelum 25 Maret.',
        timestamp: '2026-03-13 10:00',
        type: 'Tindak Lanjut',
        pinned: false,
      },
    ],
  },
  {
    id: 'neg004',
    title: 'PKS Layanan Logistik Terpadu — PT Garuda Cargo',
    mitra: 'PT Garuda Cargo',
    mitraId: 'p004',
    jenisKontrak: 'PKS',
    nilaiEstimasi: 2300000000,
    stage: 'Proposal',
    status: 'Aktif',
    picInternal: 'Sari Indah',
    picMitra: 'Doni Prasetyo',
    startDate: '2026-03-10',
    targetDate: '2026-05-30',
    lastActivity: '2026-03-14',
    progress: 12,
    region: 'Palembang',
    priority: 'Sedang',
    description: 'PKS baru untuk layanan logistik terpadu termasuk pergudangan, distribusi, dan manajemen rantai pasok.',
    tags: ['Logistik', 'Pergudangan', 'Distribusi', 'Baru'],
    meetings: [
      {
        id: 'm006',
        title: 'Pertemuan Awal — Eksplorasi Peluang',
        date: '2026-03-12',
        time: '11:00',
        type: 'Tatap Muka',
        attendees: ['Sari Indah', 'Doni Prasetyo'],
        agenda: 'Eksplorasi kebutuhan mitra dan potensi kerjasama',
        outcome: 'Mitra tertarik dengan paket layanan terintegrasi. Diminta proposal formal dalam 2 minggu.',
        nextAction: 'Penyusunan proposal formal oleh tim komersial',
        nextActionDue: '2026-03-26',
        recordedBy: 'Sari Indah',
      },
    ],
    issues: [],
    drafts: [],
    notes: [
      {
        id: 'n006',
        author: 'Sari Indah',
        role: 'PIC Internal',
        content: 'Mitra baru dengan potensi besar. Perlu proposal yang komprehensif dan kompetitif. Koordinasi dengan tim teknis untuk spesifikasi layanan.',
        timestamp: '2026-03-14 08:30',
        type: 'Catatan',
        pinned: false,
      },
    ],
  },
  {
    id: 'neg005',
    title: 'Perjanjian TUKS — PT Pelayaran Nusantara',
    mitra: 'PT Pelayaran Nusantara',
    mitraId: 'p005',
    jenisKontrak: 'TUKS',
    nilaiEstimasi: 6700000000,
    stage: 'Diskusi',
    status: 'Ditunda',
    picInternal: 'Budi Santoso',
    picMitra: 'Wahyu Setiawan',
    startDate: '2026-01-10',
    targetDate: '2026-04-30',
    lastActivity: '2026-02-28',
    progress: 28,
    region: 'Palembang',
    priority: 'Rendah',
    description: 'Perjanjian Terminal Untuk Kepentingan Sendiri (TUKS) untuk operasional kapal tanker. Ditunda karena perubahan regulasi.',
    tags: ['TUKS', 'Tanker', 'Regulasi', 'Ditunda'],
    meetings: [
      {
        id: 'm007',
        title: 'Diskusi Regulasi TUKS Terbaru',
        date: '2026-02-15',
        time: '09:30',
        type: 'Online',
        attendees: ['Budi Santoso', 'Wahyu Setiawan', 'Tim Legal'],
        agenda: 'Pembahasan dampak perubahan regulasi TUKS terhadap negosiasi',
        outcome: 'Negosiasi ditunda menunggu klarifikasi dari Kemenhub terkait regulasi baru.',
        nextAction: 'Monitoring perkembangan regulasi dari Kemenhub',
        nextActionDue: '2026-03-31',
        recordedBy: 'Budi Santoso',
      },
    ],
    issues: [
      {
        id: 'i005',
        title: 'Perubahan Regulasi TUKS dari Kemenhub',
        description: 'Kemenhub mengeluarkan regulasi baru yang mempengaruhi persyaratan TUKS. Perlu analisis dampak sebelum melanjutkan negosiasi.',
        priority: 'Tinggi',
        status: 'Dalam Proses',
        raisedBy: 'Tim Legal',
        raisedAt: '2026-02-10',
        assignedTo: 'Tim Legal',
        category: 'Legal',
      },
    ],
    drafts: [
      {
        id: 'd006',
        version: 'v1.0',
        uploadedBy: 'Tim Legal Internal',
        uploadedAt: '2026-01-25',
        notes: 'Draft awal TUKS — ditahan karena perubahan regulasi',
        fileSize: '1.9 MB',
        status: 'Arsip',
        changes: ['Draft awal berdasarkan regulasi lama'],
      },
    ],
    notes: [
      {
        id: 'n007',
        author: 'Budi Santoso',
        role: 'PIC Internal',
        content: 'Negosiasi ditunda karena faktor eksternal (regulasi). Mitra memahami situasi. Akan dilanjutkan setelah ada kepastian regulasi dari Kemenhub.',
        timestamp: '2026-02-28 16:00',
        type: 'Keputusan',
        pinned: true,
      },
    ],
  },
];

export const stageOrder: NegotiationStage[] = ['Proposal', 'Diskusi', 'Review Syarat', 'Persetujuan'];

export const stageConfig: Record<NegotiationStage, { color: string; bg: string; border: string; icon: string; description: string }> = {
  Proposal: {
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: '📋',
    description: 'Penyusunan dan pengajuan proposal awal',
  },
  Diskusi: {
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: '💬',
    description: 'Pembahasan dan negosiasi klausul',
  },
  'Review Syarat': {
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: '🔍',
    description: 'Review legal dan teknis syarat kontrak',
  },
  Persetujuan: {
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: '✅',
    description: 'Persetujuan final dan penandatanganan',
  },
};

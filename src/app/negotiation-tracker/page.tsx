import AppLayout from '@/components/AppLayout';
import NegotiationTrackerClient from './components/NegotiationTrackerClient';

export const metadata = {
  title: 'Negosiasi Tracker — PartnerSync',
  description: 'Kelola pipeline negosiasi, log rapat, isu, versi draft, dan catatan kolaborasi mitra',
};

export default function NegotiationTrackerPage() {
  return (
    <AppLayout>
      <NegotiationTrackerClient />
    </AppLayout>
  );
}

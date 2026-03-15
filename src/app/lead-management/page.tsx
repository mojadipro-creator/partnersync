import AppLayout from '@/components/AppLayout';
import LeadManagementClient from './components/LeadManagementClient';

export const metadata = {
  title: 'Manajemen Lead | PartnerSync',
  description: 'Pipeline pre-sales dan manajemen lead kerjasama Pelindo Regional 2',
};

export default function LeadManagementPage() {
  return (
    <AppLayout>
      <LeadManagementClient />
    </AppLayout>
  );
}

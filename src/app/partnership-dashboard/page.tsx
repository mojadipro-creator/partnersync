import AppLayout from '@/components/AppLayout';
import DashboardHeader from './components/DashboardHeader';
import KPIBentoGrid from './components/KPIBentoGrid';
import DashboardCharts from './components/DashboardCharts';
import ExpiringContractsTable from './components/ExpiringContractsTable';
import ActivityFeed from './components/ActivityFeed';

export default function PartnershipDashboardPage() {
  return (
    <AppLayout>
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-12 py-8">
        <DashboardHeader />

        {/* KPI Bento Grid */}
        <section className="mb-6">
          <KPIBentoGrid />
        </section>

        {/* Charts */}
        <section className="mb-6">
          <DashboardCharts />
        </section>

        {/* Bottom: Expiring Table + Activity Feed */}
        <section className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2">
            <ExpiringContractsTable />
          </div>
          <div>
            <ActivityFeed />
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
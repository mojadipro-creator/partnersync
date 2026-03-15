import type { Metadata } from 'next';
import '@/styles/tailwind.css';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'PartnerSync — SIM Kerja Sama Pelindo',
  description: 'Sistem Informasi Manajemen Kerja Sama Pelindo Regional 2',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
            },
            duration: 3500,
          }}
          richColors
        />

        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fpartnersyn2506back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.17" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.2" /></body>
    </html>
  );
}
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import {
  LayoutDashboard,
  FileText,
  Users,
  ChevronLeft,
  ChevronRight,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  ShieldCheck,
  Handshake,
  ClipboardList,
  AlertTriangle,
  FilePlus,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  group?: string;
}

const navItems: NavItem[] = [
  {
    group: 'Utama',
    label: 'Dashboard',
    href: '/partnership-dashboard',
    icon: <LayoutDashboard size={18} />,
  },
  {
    group: 'Utama',
    label: 'Manajemen Kontrak',
    href: '/contract-management',
    icon: <FileText size={18} />,
    badge: 4,
  },
  {
    group: 'Utama',
    label: 'Manajemen Mitra',
    href: '/partner-management',
    icon: <Users size={18} />,
  },
  {
    group: 'Pipeline',
    label: 'Lead & Pre-Sales',
    href: '/lead-management',
    icon: <Handshake size={18} />,
    badge: 7,
  },
  {
    group: 'Pipeline',
    label: 'Negosiasi',
    href: '/negotiation-tracker',
    icon: <ClipboardList size={18} />,
    badge: 2,
  },
  {
    group: 'Pipeline',
    label: 'Buat Kontrak',
    href: '/contract-creation',
    icon: <FilePlus size={18} />,
  },
  {
    group: 'Kepatuhan',
    label: 'Compliance & K3',
    href: '/partnership-dashboard',
    icon: <ShieldCheck size={18} />,
    badge: 3,
  },
  {
    group: 'Kepatuhan',
    label: 'Alert & Notifikasi',
    href: '/partnership-dashboard',
    icon: <AlertTriangle size={18} />,
    badge: 6,
  },
  {
    group: 'Laporan',
    label: 'Analytics & Laporan',
    href: '/partnership-dashboard',
    icon: <BarChart3 size={18} />,
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const groups = Array.from(new Set(navItems.map((i) => i.group)));

  return (
    <aside
      className={`
        relative flex flex-col h-screen bg-white border-r border-border
        transition-all duration-300 ease-in-out flex-shrink-0
        ${collapsed ? 'w-16' : 'w-60'}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center h-16 px-4 border-b border-border ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
        <AppLogo size={32} />
        {!collapsed && (
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-700 text-primary tracking-tight">PartnerSync</span>
            <span className="text-[10px] text-muted-foreground font-medium">SIM Kerja Sama Pelindo</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        {groups.map((group) => {
          const items = navItems.filter((i) => i.group === group);
          return (
            <div key={group} className="mb-4">
              {!collapsed && (
                <p className="px-4 mb-1.5 text-[10px] font-600 uppercase tracking-widest text-muted-foreground">
                  {group}
                </p>
              )}
              {items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/partnership-dashboard' && pathname.startsWith(item.href));
                const isExactActive = pathname === item.href;
                const active = item.href === '/partnership-dashboard' ? isExactActive : isActive;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={`
                      group relative flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg mb-0.5
                      text-sm font-medium transition-all duration-150
                      ${active
                        ? 'bg-primary/10 text-primary' :'text-foreground/70 hover:bg-muted hover:text-foreground'
                      }
                    `}
                  >
                    <span className={`flex-shrink-0 ${active ? 'text-primary' : 'text-foreground/50 group-hover:text-foreground/80'}`}>
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge !== undefined && (
                          <span className={`
                            text-[10px] font-700 px-1.5 py-0.5 rounded-full min-w-[18px] text-center
                            ${active ? 'bg-primary text-white' : 'bg-destructive/10 text-destructive'}
                          `}>
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                    {collapsed && item.badge !== undefined && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
                    )}
                    {/* Tooltip for collapsed */}
                    {collapsed && (
                      <div className="
                        absolute left-full ml-3 px-2.5 py-1.5 bg-foreground text-background text-xs
                        rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none
                        transition-opacity duration-150 z-50 shadow-lg
                      ">
                        {item.label}
                        {item.badge !== undefined && (
                          <span className="ml-1.5 bg-destructive text-white text-[10px] px-1 py-0.5 rounded-full">{item.badge}</span>
                        )}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-foreground" />
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-border p-3 space-y-1">
        <Link
          href="/partnership-dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/70 hover:bg-muted hover:text-foreground transition-all duration-150 group"
        >
          <Bell size={18} className="flex-shrink-0 text-foreground/50 group-hover:text-foreground/80" />
          {!collapsed && <span>Notifikasi</span>}
          {!collapsed && <span className="ml-auto text-[10px] font-700 px-1.5 py-0.5 rounded-full bg-accent/20 text-accent-foreground">12</span>}
        </Link>
        <Link
          href="/partnership-dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/70 hover:bg-muted hover:text-foreground transition-all duration-150 group"
        >
          <Settings size={18} className="flex-shrink-0 text-foreground/50 group-hover:text-foreground/80" />
          {!collapsed && <span>Pengaturan</span>}
        </Link>

        {/* User */}
        <div className={`flex items-center gap-2.5 px-3 py-2.5 mt-1 rounded-lg bg-muted/60 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-700 text-white">BS</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-600 text-foreground truncate">Budi Santoso</p>
              <p className="text-[10px] text-muted-foreground truncate">Manajer Kerja Sama</p>
            </div>
          )}
          {!collapsed && (
            <button className="text-muted-foreground hover:text-destructive transition-colors" title="Keluar">
              <LogOut size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="
          absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-border
          flex items-center justify-center shadow-sm hover:bg-muted
          transition-all duration-150 z-10
        "
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
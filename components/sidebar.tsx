'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Search,
  FileText,
  Settings,
  LogOut,
  Users,
  TrendingUp,
  Building2,
} from 'lucide-react';

interface SidebarProps {
  role: 'investor' | 'startup' | 'admin';
  userName: string;
}

export function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    router.push('/login');
  };

  const menuItems =
    role === 'investor'
      ? [
          { icon: Search, label: 'Browse Startups', href: '/investor/browse' },
          { icon: Users, label: 'My Connections', href: '/investor/connections' },
        ]
      : role === 'startup'
        ? [
            { icon: FileText, label: 'My Pitch', href: '/startup/pitch' },
            { icon: TrendingUp, label: 'Funding Status', href: '/startup/funding' },
            { icon: Users, label: 'Investor Inquiries', href: '/startup/inquiries' },
            { icon: Building2, label: 'Incubation Centers', href: '/startup/incubation' },
            { icon: Settings, label: 'Settings', href: '/settings' },
          ]
        : [
            { icon: Users, label: 'Users', href: '/admin/users' },
            { icon: FileText, label: 'Startups', href: '/admin/startups' },
            { icon: TrendingUp, label: 'Deals', href: '/admin/deals' },
            { icon: Building2, label: 'Incubation Centers', href: '/admin/centers' },
            { icon: Settings, label: 'Settings', href: '/admin/settings' },
          ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-sidebar-background text-sidebar-foreground">
      {/* Logo */}
      <div className="border-b border-sidebar-border p-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white font-bold">
            IS
          </div>
          <span className="font-bold text-white">InvestStart</span>
        </Link>
      </div>

      {/* User Info */}
      <div className="border-b border-sidebar-border p-4">
        <p className="text-sm text-sidebar-accent-foreground/80">Logged in as</p>
        <p className="font-medium text-white">{userName}</p>
        <p className="text-xs text-sidebar-accent-foreground/60 capitalize">{role}</p>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-2 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-4 left-4 right-4">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground bg-transparent"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}

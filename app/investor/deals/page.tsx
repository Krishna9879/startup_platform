'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu, LogOut, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Deal {
  id: string;
  startupName: string;
  amount: string;
  equity: string;
  status: 'Completed' | 'Pending' | 'Declined';
  date: string;
  expectedReturn: string;
}

export default function InvestorDeals() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');

    if (!token || role !== 'investor') {
      router.push('/login');
      return;
    }

    setLoading(false);
  }, [router]);

  const deals: Deal[] = [
    {
      id: '1',
      startupName: 'TechAI Solutions',
      amount: '₹10L',
      equity: '5%',
      status: 'Completed',
      date: 'Jan 15, 2024',
      expectedReturn: '₹25L',
    },
    {
      id: '2',
      startupName: 'FinFlow',
      amount: '₹5L',
      equity: '8%',
      status: 'Completed',
      date: 'Feb 20, 2024',
      expectedReturn: '₹15L',
    },
    {
      id: '3',
      startupName: 'EcoCart',
      amount: '₹7L',
      equity: '7%',
      status: 'Completed',
      date: 'Mar 10, 2024',
      expectedReturn: '₹18L',
    },
    {
      id: '4',
      startupName: 'DataVault',
      amount: '₹3L',
      equity: '4%',
      status: 'Pending',
      date: 'Apr 5, 2024',
      expectedReturn: '₹8L',
    },
    {
      id: '5',
      startupName: 'CloudNext',
      amount: '₹4.5L',
      equity: '6%',
      status: 'Pending',
      date: 'Apr 12, 2024',
      expectedReturn: '₹12L',
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    router.push('/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-primary/15 text-primary border border-primary/30';
      case 'Pending':
        return 'bg-yellow-500/15 text-yellow-500 border border-yellow-500/30';
      case 'Declined':
        return 'bg-red-500/15 text-red-500 border border-red-500/30';
      default:
        return 'bg-secondary/50 text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'Pending':
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  const totalDeals = deals.length;
  const completedDeals = deals.filter((d) => d.status === 'Completed').length;
  const pendingDeals = deals.filter((d) => d.status === 'Pending').length;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0'}`}>
        <div className="h-full bg-secondary/30 border-r border-border/30 flex flex-col p-6 overflow-hidden">
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center font-bold text-foreground">
              IS
            </div>
            <span className="font-semibold text-foreground">InvestStart</span>
          </Link>

          <nav className="flex-1 space-y-2">
            <Link href="/investor/browse" className="block px-3 py-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors text-sm">
              Browse Startups
            </Link>
            <Link href="/investor/portfolio" className="block px-3 py-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors text-sm">
              My Portfolio
            </Link>
            <Link href="/investor/deals" className="block px-3 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary font-medium text-sm">
              My Deals
            </Link>
          </nav>

          <button onClick={handleLogout} className="w-full px-3 py-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors text-sm">
            Logout
          </button>
        </div>
      </div>

      {/* Main */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="sticky top-0 z-30 border-b border-border/20 bg-background/80 backdrop-blur-xl px-6 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-secondary/50 rounded-lg transition-colors">
              <Menu className="h-5 w-5" />
            </button>
            <div className="text-2xl font-bold">My Deals</div>
            <div className="w-8"></div>
          </div>
        </div>

        <div className="p-8">
          {/* Deal Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Deals', value: totalDeals, icon: '📊' },
              { label: 'Completed', value: completedDeals, icon: '✓' },
              { label: 'Pending', value: pendingDeals, icon: '⏱️' },
            ].map((stat, i) => (
              <div key={i} className="bg-secondary/20 border border-border/30 rounded-xl p-6 hover:border-primary/30 transition-all duration-300 fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Deals Table */}
          <div className="bg-secondary/20 border border-border/30 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/30 bg-secondary/30">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Startup</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Investment</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Equity</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Expected Return</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Date</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {deals.map((deal, i) => (
                    <tr key={deal.id} className="border-b border-border/20 hover:bg-secondary/30 transition-colors duration-300 fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                      <td className="px-6 py-4">
                        <p className="font-semibold">{deal.startupName}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold">{deal.amount}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-muted-foreground">{deal.equity}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-primary font-semibold">{deal.expectedReturn}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-muted-foreground text-sm">{deal.date}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(deal.status)}`}>
                          {getStatusIcon(deal.status)}
                          {deal.status}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Empty State Alternative */}
          {deals.length === 0 && (
            <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-6">No deals yet. Start investing in promising startups!</p>
              <Button asChild className="bg-primary hover:bg-primary/90 text-background btn-smooth">
                <Link href="/investor/browse">Browse Startups</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

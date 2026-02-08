'use client';

import { Badge } from "@/components/ui/badge"

import { CardDescription } from "@/components/ui/card"

import { CardContent } from "@/components/ui/card"

import { CardTitle } from "@/components/ui/card"

import { CardHeader } from "@/components/ui/card"

import { Card } from "@/components/ui/card"

import { Sidebar } from "@/components/ui/sidebar"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, DollarSign, Users, Target, Menu, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Portfolio {
  totalInvested: number;
  activeInvestments: number;
  roi: number;
  avgReturn: number;
}

export default function InvestorPortfolio() {
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

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    router.push('/login');
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

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
            <Link href="/investor/portfolio" className="block px-3 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary font-medium text-sm">
              My Portfolio
            </Link>
            <Link href="/investor/deals" className="block px-3 py-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors text-sm">
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
            <div className="text-2xl font-bold">Investment Portfolio</div>
            <div className="w-8"></div>
          </div>
        </div>

        <div className="p-8">
          {/* Portfolio Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Invested', value: '₹25,00,000', icon: DollarSign },
              { label: 'Active Investments', value: '5', icon: TrendingUp },
              { label: 'ROI', value: '+18.5%', icon: Target },
              { label: 'Avg Return', value: '₹85K', icon: Users },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-secondary/20 border border-border/30 rounded-xl p-6 hover:border-primary/30 transition-all duration-300 fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                  <Icon className="h-5 w-5 text-primary mb-3" />
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
              );
            })}
          </div>

          {/* Investments List */}
          <div className="bg-secondary/20 border border-border/30 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">Your Investments</h2>
            <div className="space-y-4">
              {[
                { name: 'TechAI Solutions', amount: '₹10L', equity: '5%', status: 'Active' },
                { name: 'FinFlow', amount: '₹5L', equity: '8%', status: 'Active' },
                { name: 'EcoCart', amount: '₹7L', equity: '7%', status: 'Active' },
                { name: 'DataVault', amount: '₹3L', equity: '4%', status: 'Pending' },
              ].map((inv, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-background/50 rounded-lg hover:bg-background/70 transition-colors duration-300">
                  <div>
                    <p className="font-semibold">{inv.name}</p>
                    <p className="text-sm text-muted-foreground">{inv.equity} equity · {inv.amount}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${inv.status === 'Active' ? 'bg-primary/15 text-primary border border-primary/30' : 'bg-yellow-500/15 text-yellow-500 border border-yellow-500/30'}`}>
                    {inv.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action */}
          <Button asChild className="bg-primary hover:bg-primary/90 text-background btn-smooth group">
            <Link href="/investor/browse" className="flex items-center gap-2">
              Find More Opportunities
              <TrendingUp className="h-4 w-4 group-hover:translate-y-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}

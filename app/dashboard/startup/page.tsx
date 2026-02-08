'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Target, FileText, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { investorDataService } from '@/lib/investor-data';

interface StartupStats {
  fundingNeeded: number;
  fundingReceived: number;
  investorInterests: number;
  viewCount: number;
}

export default function StartupDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState<StartupStats>({
    fundingNeeded: 1000000,
    fundingReceived: 300000,
    investorInterests: 24,
    viewCount: 156,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');

    if (!token || role !== 'startup') {
      router.push('/login');
      return;
    }

    // Fetch user data
    const user = localStorage.getItem('userName') || 'Startup';
    setUserName(user);

    // Fetch real data
    const startupId = 1; // Mock startup ID - in production, get from user profile
    const interests = investorDataService.getInterestsForStartup(startupId);
    const fundingStatus = investorDataService.getFundingStatus(startupId);
    
    setStats({
      fundingNeeded: fundingStatus.fundingNeeded,
      fundingReceived: fundingStatus.fundingReceived,
      investorInterests: interests.length,
      viewCount: 156, // This would come from analytics
    });

    setLoading(false);
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const fundingProgress = (stats.fundingReceived / stats.fundingNeeded) * 100;

  const statCards = [
    {
      title: 'Funding Goal',
      value: `₹${(stats.fundingNeeded / 100000).toFixed(1)}L`,
      icon: Target,
    },
    {
      title: 'Received',
      value: `₹${(stats.fundingReceived / 100000).toFixed(1)}L`,
      icon: TrendingUp,
    },
    {
      title: 'Investor Interests',
      value: stats.investorInterests,
      icon: Users,
    },
    {
      title: 'Profile Views',
      value: stats.viewCount,
      icon: FileText,
    },
  ];

  return (
    <div className="flex">
      <Sidebar role="startup" userName={userName} />
      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {userName}!</h1>
          <p className="mt-2 text-muted-foreground">
            Track your funding journey and manage investor inquiries
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.title} className="border-primary/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <Icon className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Funding Progress */}
        <Card className="mb-8 border-primary/10">
          <CardHeader>
            <CardTitle>Funding Progress</CardTitle>
            <CardDescription>Track your fundraising journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={fundingProgress} className="h-3" />
              <div className="flex justify-between text-sm">
                <span>₹{(stats.fundingReceived / 100000).toFixed(1)}L</span>
                <span className="text-muted-foreground">₹{(stats.fundingNeeded / 100000).toFixed(1)}L</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {fundingProgress.toFixed(0)}% of funding goal achieved
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle>Edit My Pitch</CardTitle>
              <CardDescription>Update your startup information</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/startup/pitch">
                  Edit Pitch <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle>Investor Inquiries</CardTitle>
              <CardDescription>Manage interest from investors</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="border-primary text-primary bg-transparent">
                <Link href="/startup/inquiries">
                  View Inquiries ({stats.investorInterests})
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Documents Section */}
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>Manage your pitch deck and financial reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-primary/10 p-4">
                <div>
                  <h3 className="font-medium">Pitch Deck</h3>
                  <p className="text-sm text-muted-foreground">Latest: 2024-02-08</p>
                </div>
                <Button size="sm" variant="outline">
                  Update
                </Button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-primary/10 p-4">
                <div>
                  <h3 className="font-medium">Financial Report</h3>
                  <p className="text-sm text-muted-foreground">Q4 2024</p>
                </div>
                <Button size="sm" variant="outline">
                  Upload
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

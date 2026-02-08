'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, DollarSign, Users, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import { investorDataService, FundingStatus } from '@/lib/investor-data';

export default function StartupFunding() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [fundingStatus, setFundingStatus] = useState<FundingStatus | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');

    if (!token || role !== 'startup') {
      router.push('/login');
      return;
    }

    const user = localStorage.getItem('userName') || 'Startup';
    setUserName(user);

    // Get startup ID (in production, this would come from user profile)
    const startupId = 1; // Mock startup ID
    
    // Fetch funding status
    const status = investorDataService.getFundingStatus(startupId);
    setFundingStatus(status);

    setLoading(false);
  }, [router]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Funded':
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Funded</Badge>;
      case 'Approved':
        return <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30">Approved</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">Pending</Badge>;
      default:
        return <Badge className="bg-secondary/50 text-muted-foreground">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading || !fundingStatus) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const fundingProgress = (fundingStatus.fundingReceived / fundingStatus.fundingNeeded) * 100;
  const pendingInvestments = fundingStatus.investments.filter(i => i.status === 'Pending');
  const approvedInvestments = fundingStatus.investments.filter(i => i.status === 'Approved');
  const fundedInvestments = fundingStatus.investments.filter(i => i.status === 'Funded');

  return (
    <div className="flex">
      <Sidebar role="startup" userName={userName} />
      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Funding Status</h1>
          <p className="mt-2 text-muted-foreground">
            Track your fundraising progress and investor commitments
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Funding Goal</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{(fundingStatus.fundingNeeded / 100000).toFixed(1)}L</div>
            </CardContent>
          </Card>

          <Card className="border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Received</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{(fundingStatus.fundingReceived / 100000).toFixed(1)}L</div>
              <p className="text-xs text-muted-foreground mt-1">
                {fundingProgress.toFixed(0)}% of goal
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Investors</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fundingStatus.investments.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {fundedInvestments.length} funded
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Remaining</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{((fundingStatus.fundingNeeded - fundingStatus.fundingReceived) / 100000).toFixed(1)}L
              </div>
            </CardContent>
          </Card>
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
                <span>₹{(fundingStatus.fundingReceived / 100000).toFixed(1)}L received</span>
                <span className="text-muted-foreground">₹{(fundingStatus.fundingNeeded / 100000).toFixed(1)}L goal</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {fundingProgress.toFixed(0)}% of funding goal achieved
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Investments List */}
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle>Investment Commitments</CardTitle>
            <CardDescription>
              {fundingStatus.investments.length === 0
                ? 'No investments yet'
                : `${fundingStatus.investments.length} investment${fundingStatus.investments.length > 1 ? 's' : ''} received`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {fundingStatus.investments.length === 0 ? (
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No investments yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Investor commitments will appear here when they make investment offers
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {fundingStatus.investments.map((investment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-primary/10 p-4 hover:bg-primary/5 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">{investment.investorName}</h3>
                        {getStatusBadge(investment.status)}
                      </div>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground ml-8">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>₹{(investment.amount / 100000).toFixed(1)}L</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          <span>{investment.equity}% equity</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(investment.date)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

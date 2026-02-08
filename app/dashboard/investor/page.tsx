'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, Users } from 'lucide-react';
import Link from 'next/link';

export default function InvestorDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');

    if (!token || role !== 'investor') {
      router.push('/login');
      return;
    }

    // Fetch user data
    const user = localStorage.getItem('userName') || 'Investor';
    setUserName(user);

    setLoading(false);
  }, [router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex">
      <Sidebar role="investor" userName={userName} />
      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {userName}!</h1>
          <p className="mt-2 text-muted-foreground">
            Discover startups and manage your connections
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 max-w-4xl">
          <Card className="border-primary/10 hover:border-primary/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Search className="h-5 w-5 text-primary" />
                Browse Startups
              </CardTitle>
              <CardDescription>Find and explore promising startups looking for investment</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="bg-primary hover:bg-primary/90 w-full btn-smooth">
                <Link href="/investor/browse" className="flex items-center justify-center gap-2">
                  Browse Startups
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/10 hover:border-primary/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                My Connections
              </CardTitle>
              <CardDescription>View messages and connections from startups</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="border-primary text-primary bg-transparent hover:bg-primary/10 w-full btn-smooth">
                <Link href="/investor/connections" className="flex items-center justify-center gap-2">
                  View Connections
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

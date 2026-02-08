'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Mail, Calendar, User, Building2, ArrowRight } from 'lucide-react';
import { investorDataService, InvestorInterest } from '@/lib/investor-data';

export default function StartupInquiries() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [interests, setInterests] = useState<InvestorInterest[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

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

    // Fetch interests
    const fetchedInterests = investorDataService.getInterestsForStartup(startupId);
    setInterests(fetchedInterests);

    setLoading(false);
  }, [router]);

  const markAsRead = (interestId: string) => {
    investorDataService.markAsRead(interestId);
    setInterests(prev =>
      prev.map(interest =>
        interest.id === interestId ? { ...interest, read: true } : interest
      )
    );
  };

  const handleShareDetails = (interestId: string) => {
    // In production, these would be the founder's verified details
    const founderEmail = "founder@startup.com";
    const founderPhone = "+91 98765 43210";

    investorDataService.shareDetails(interestId, founderEmail, founderPhone);

    setInterests(prev =>
      prev.map(interest =>
        interest.id === interestId ? { ...interest, status: 'DetailsShared', sharedEmail: founderEmail, sharedPhone: founderPhone } : interest
      )
    );

    alert('Contact details shared with the investor successfully!');
  };

  const getInterestBadgeColor = (type: string, status?: string) => {
    if (status === 'DetailsShared') {
      return 'bg-green-500/20 text-green-500 border-green-500/30';
    }
    switch (type) {
      case 'Interested':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'Contacted':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      default:
        return 'bg-secondary/50 text-muted-foreground';
    }
  };

  const filteredInterests = filter === 'unread'
    ? interests.filter(i => !i.read)
    : interests;

  const unreadCount = interests.filter(i => !i.read).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex">
      <Sidebar role="startup" userName={userName} />
      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Investor Inquiries</h1>
          <p className="mt-2 text-muted-foreground">
            Manage interest and messages from investors
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all'
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'bg-secondary/20 text-muted-foreground hover:bg-secondary/30'
              }`}
          >
            All Inquiries ({interests.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg transition-colors ${filter === 'unread'
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'bg-secondary/20 text-muted-foreground hover:bg-secondary/30'
              }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Inquiries List */}
        {filteredInterests.length === 0 ? (
          <Card className="border-border/30">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg mb-2">No inquiries yet</p>
              <p className="text-muted-foreground text-sm">
                Investor inquiries will appear here when they express interest in your startup
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredInterests.map((interest, index) => (
              <Card
                key={interest.id}
                className={`border-border/30 hover:border-primary/30 transition-all duration-300 ${!interest.read ? 'bg-primary/5 border-primary/20' : ''
                  }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <User className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">{interest.investorName}</CardTitle>
                        <Badge className={getInterestBadgeColor(interest.interestType, interest.status)}>
                          {interest.status === 'DetailsShared' ? 'Details Shared' : interest.interestType}
                        </Badge>
                        {!interest.read && (
                          <Badge className="bg-primary/20 text-primary border-primary/30">
                            New
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {interest.investorEmail}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(interest.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {interest.message && (
                    <div className="mb-4 p-4 rounded-lg bg-secondary/30 border border-border/20">
                      <p className="text-sm text-muted-foreground mb-1">Message:</p>
                      <p className="text-foreground">{interest.message}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    {interest.status !== 'DetailsShared' ? (
                      <Button
                        className="bg-primary hover:bg-primary/90 text-background"
                        onClick={() => {
                          handleShareDetails(interest.id);
                          markAsRead(interest.id);
                        }}
                      >
                        Share Contact Details
                      </Button>
                    ) : (
                      <Button
                        disabled
                        className="bg-green-500/20 text-green-500 border border-green-500/30"
                      >
                        Details Shared
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="border-border/30 hover:border-primary/50"
                      onClick={() => {
                        window.location.href = `mailto:${interest.investorEmail}?subject=Re: Interest in ${interest.startupName}`;
                        markAsRead(interest.id);
                      }}
                    >
                      Reply via Email
                    </Button>
                    {!interest.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(interest.id)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

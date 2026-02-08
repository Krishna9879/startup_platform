'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu, LogOut, MessageSquare, Building2, Mail, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sidebar } from '@/components/sidebar';

interface Connection {
  id: string;
  startupName: string;
  startupEmail: string;
  message: string;
  subject: string;
  timestamp: string;
  read: boolean;
  startupId: string;
}

export default function InvestorConnections() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [connections, setConnections] = useState<Connection[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');

    if (!token || role !== 'investor') {
      router.push('/login');
      return;
    }

    const user = localStorage.getItem('userName') || 'Investor';
    setUserName(user);

    // Mock connections data - in production, fetch from API
    const mockConnections: Connection[] = [
      {
        id: '1',
        startupName: 'TechAI Solutions',
        startupEmail: 'contact@techai.com',
        subject: 'Investment Opportunity - AI Platform',
        message: 'Hello! We are TechAI Solutions, an innovative AI platform looking for investment. We have a strong team and a proven product. Would you be interested in learning more about our opportunity?',
        timestamp: '2024-01-15T10:30:00',
        read: false,
        startupId: '1',
      },
      {
        id: '2',
        startupName: 'FinFlow',
        startupEmail: 'hello@finflow.com',
        subject: 'Partnership Opportunity',
        message: 'Hi there! FinFlow is a fintech startup revolutionizing payment solutions. We are seeking strategic investors who can help us scale. Let\'s connect!',
        timestamp: '2024-01-20T14:20:00',
        read: false,
        startupId: '2',
      },
      {
        id: '3',
        startupName: 'EcoCart',
        startupEmail: 'info@ecocart.com',
        subject: 'Sustainable E-commerce Platform',
        message: 'We are EcoCart, building the future of sustainable e-commerce. Our platform has gained significant traction and we are looking for investors who share our vision.',
        timestamp: '2024-01-18T09:15:00',
        read: true,
        startupId: '3',
      },
      {
        id: '4',
        startupName: 'DataVault',
        startupEmail: 'contact@datavault.io',
        subject: 'Data Security Startup Seeking Investment',
        message: 'DataVault offers enterprise-grade data security solutions. We have secured several enterprise clients and are ready to scale. Interested in discussing an investment?',
        timestamp: '2024-01-22T16:45:00',
        read: false,
        startupId: '4',
      },
      {
        id: '5',
        startupName: 'CloudNext',
        startupEmail: 'hello@cloudnext.com',
        subject: 'Cloud Infrastructure Platform',
        message: 'CloudNext is building next-generation cloud infrastructure. We have a strong technical team and are looking for investors to help us grow.',
        timestamp: '2024-01-19T11:30:00',
        read: true,
        startupId: '5',
      },
    ];

    setConnections(mockConnections);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    router.push('/login');
  };

  const markAsRead = (id: string) => {
    setConnections(prev =>
      prev.map(conn => conn.id === id ? { ...conn, read: true } : conn)
    );
  };

  const filteredConnections = filter === 'unread'
    ? connections.filter(c => !c.read)
    : connections;

  const unreadCount = connections.filter(c => !c.read).length;

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
    <div className="flex min-h-screen bg-background">
      <Sidebar role="investor" userName={userName} />

      {/* Main */}
      <main className="ml-64 flex-1">
        <div className="sticky top-0 z-30 border-b border-border/20 bg-background/80 backdrop-blur-xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">My Connections</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Messages from startups interested in connecting
              </p>
            </div>
            <div className="flex items-center gap-4">
              {unreadCount > 0 && (
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                  {unreadCount} unread
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-secondary/20 text-muted-foreground hover:bg-secondary/30'
              }`}
            >
              All Messages ({connections.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'unread'
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-secondary/20 text-muted-foreground hover:bg-secondary/30'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Connections List */}
          {filteredConnections.length === 0 ? (
            <Card className="border-border/30">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground text-lg mb-2">No connections yet</p>
                <p className="text-muted-foreground text-sm mb-6">
                  Startups will appear here when they send you messages
                </p>
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link href="/investor/browse">Browse Startups</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredConnections.map((connection, index) => (
                <Card
                  key={connection.id}
                  className={`border-border/30 hover:border-primary/30 transition-all duration-300 fade-in ${
                    !connection.read ? 'bg-primary/5 border-primary/20' : ''
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Building2 className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg">{connection.startupName}</CardTitle>
                          {!connection.read && (
                            <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{connection.subject}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {connection.startupEmail}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(connection.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{connection.message}</p>
                    <div className="flex items-center gap-3">
                      <Button
                        asChild
                        className="bg-primary hover:bg-primary/90 btn-smooth"
                        onClick={() => markAsRead(connection.id)}
                      >
                        <Link href={`/investor/startup/${connection.startupId}`} className="flex items-center gap-2">
                          View Startup Profile
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="border-border/30 hover:border-primary/50"
                        onClick={() => {
                          window.location.href = `mailto:${connection.startupEmail}?subject=Re: ${connection.subject}`;
                          markAsRead(connection.id);
                        }}
                      >
                        Reply via Email
                      </Button>
                      {!connection.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(connection.id)}
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
        </div>
      </main>
    </div>
  );
}

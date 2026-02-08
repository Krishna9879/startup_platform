'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, Globe, Users, Target, Zap, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { investorDataService } from '@/lib/investor-data';

interface Startup {
  id: number;
  name: string;
  industry: string;
  stage: string;
  fundingNeeded: number;
  equityOffered: number;
  description: string;
  longDescription: string;
  website: string;
  teamSize: number;
  foundingYear: number;
  city: string;
  state: string;
  logoUrl: string;
  views: number;
}

const MOCK_STARTUP: Startup = {
  id: 1,
  name: 'TechAI Solutions',
  industry: 'AI/ML',
  stage: 'Series A',
  fundingNeeded: 1000000,
  equityOffered: 5,
  description: 'Building AI-powered analytics for enterprises',
  longDescription: `TechAI Solutions is revolutionizing enterprise analytics with cutting-edge artificial intelligence and machine learning technologies. Our platform helps businesses make data-driven decisions in real-time.

Founded in 2022, we've already worked with 50+ enterprise clients across various industries. We're looking for strategic investors to accelerate our market expansion and product development.

Our team consists of experienced engineers, data scientists, and business leaders who have previously worked at leading tech companies. We have a strong product-market fit and are scaling rapidly.`,
  website: 'https://techaisolutions.com',
  teamSize: 12,
  foundingYear: 2022,
  city: 'Bangalore',
  state: 'Karnataka',
  logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=TechAI',
  views: 342,
};

export default function StartupDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState<number>(0);
  const [startup, setStartup] = useState<Startup>(MOCK_STARTUP);
  const [loading, setLoading] = useState(true);
  const [isInterested, setIsInterested] = useState(false);
  const [interestStatus, setInterestStatus] = useState<'Interested' | 'DetailsShared' | 'None'>('None');
  const [founderDetails, setFounderDetails] = useState<{ email: string, phone: string } | null>(null);
  const [showInvestmentForm, setShowInvestmentForm] = useState(false);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');

    if (!token || role !== 'investor') {
      router.push('/login');
      return;
    }

    const user = localStorage.getItem('userName') || 'Investor';
    // Get userId from token or use a default (in production, decode from JWT)
    const userIdStr = localStorage.getItem('userId') || '1';
    setUserName(user);
    const uId = parseInt(userIdStr);
    setUserId(uId);

    // Check if already interested
    const startupId = parseInt(params.id as string) || startup.id;
    const existingInterests = investorDataService.getInterestsForStartup(startupId);
    const existingInterest = existingInterests.find(i => i.investorId === uId);
    if (existingInterest) {
      if (existingInterest.status === 'DetailsShared') {
        setInterestStatus('DetailsShared');
        setFounderDetails({
          email: existingInterest.sharedEmail || '',
          phone: existingInterest.sharedPhone || ''
        });
        setIsInterested(true);
      } else if (existingInterest.interestType === 'Interested') {
        setInterestStatus('Interested');
        setIsInterested(true);
      }
    }

    setLoading(false);
  }, [router, params.id, startup.id]);

  const handleExpress = () => {
    const startupId = parseInt(params.id as string) || startup.id;
    const newInterestState = !isInterested;

    investorDataService.addInterest({
      investorId: userId,
      investorName: userName,
      investorEmail: `${userName.toLowerCase().replace(' ', '.')}@example.com`,
      startupId: startupId,
      startupName: startup.name,
      interestType: newInterestState ? 'Interested' : 'Viewed',
    });

    setIsInterested(newInterestState);
    if (newInterestState) {
      setInterestStatus('Interested');
    } else {
      setInterestStatus('None');
    }
    alert(newInterestState ? 'Interest expressed successfully! The founder will be notified and may share their contact details with you.' : 'Interest removed');
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) {
      alert('Please enter a message');
      return;
    }

    const startupId = parseInt(params.id as string) || startup.id;

    investorDataService.addInterest({
      investorId: userId,
      investorName: userName,
      investorEmail: `${userName.toLowerCase().replace(' ', '.')}@example.com`,
      startupId: startupId,
      startupName: startup.name,
      interestType: 'Contacted',
      message: messageText,
    });

    alert('Message sent successfully! The founder will be notified.');
    setMessageText('');
    setShowInvestmentForm(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex">
      <Sidebar role="investor" userName={userName} />
      <main className="ml-64 flex-1 p-8">
        {/* Back Button */}
        <Link href="/investor/browse" className="mb-6 inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Browse
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Section */}
            <Card className="mb-6 border-primary/10">
              <CardContent className="pt-6">
                <div className="flex items-start gap-6">
                  <img
                    src={startup.logoUrl || "/placeholder.svg"}
                    alt={startup.name}
                    className="h-20 w-20 rounded-lg border border-primary/10"
                  />
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold">{startup.name}</h1>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge className="bg-primary/10 text-primary border-primary/20">{startup.industry}</Badge>
                      <Badge className="bg-secondary/50">{startup.stage}</Badge>
                      <Badge variant="outline">₹{(startup.views).toLocaleString()} views</Badge>
                    </div>
                    <p className="mt-4 text-muted-foreground">{startup.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              <Card className="border-primary/10">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Founded</p>
                  <p className="text-xl font-bold">{startup.foundingYear}</p>
                </CardContent>
              </Card>
              <Card className="border-primary/10">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Team Size</p>
                  <p className="text-xl font-bold">{startup.teamSize}</p>
                </CardContent>
              </Card>
              <Card className="border-primary/10">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="text-xl font-bold">{startup.city}</p>
                </CardContent>
              </Card>
              <Card className="border-primary/10">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Industry</p>
                  <p className="text-xl font-bold">{startup.industry}</p>
                </CardContent>
              </Card>
            </div>

            {/* About */}
            <Card className="mb-6 border-primary/10">
              <CardHeader>
                <CardTitle>About the Company</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground whitespace-pre-line">{startup.longDescription}</p>
              </CardContent>
            </Card>

            {/* Team */}
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle>Team & Credentials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: 'Founder & CEO',
                      title: 'AI/ML Expert',
                      exp: '10+ years in tech',
                    },
                    {
                      name: 'CTO',
                      title: 'Full-Stack Developer',
                      exp: '8+ years experience',
                    },
                    {
                      name: 'Head of Sales',
                      title: 'Business Development',
                      exp: '7+ years enterprise sales',
                    },
                  ].map((member, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-primary/10 p-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/20" />
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.title}</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-primary">{member.exp}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Investment Info */}
          <div>
            {/* Investment Card */}
            <Card className="sticky top-8 border-primary/10">
              <CardHeader>
                <CardTitle>Investment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Seeking</span>
                    <span className="font-bold">₹{(startup.fundingNeeded / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Equity Offered</span>
                    <span className="font-bold">{startup.equityOffered}%</span>
                  </div>
                  <div className="border-t border-border pt-2">
                    <p className="text-sm text-muted-foreground">Valuation</p>
                    <p className="font-bold">
                      ₹{(startup.fundingNeeded / (startup.equityOffered / 100) / 100000).toFixed(0)}L
                    </p>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Commission Structure</p>
                  <div className="rounded-lg bg-primary/5 p-3 text-sm">
                    <p className="font-medium text-primary">2% + 2% Model</p>
                    <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                      <li>• 2% from investor</li>
                      <li>• 2% from startup</li>
                      <li>• Total: ₹{((startup.fundingNeeded * 0.04) / 100000).toFixed(1)}L</li>
                    </ul>
                  </div>
                </div>

                <Button
                  onClick={handleExpress}
                  className={`w-full ${isInterested
                    ? 'bg-primary/10 text-primary border border-primary'
                    : 'bg-primary hover:bg-primary/90'
                    }`}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  {isInterested ? 'Interest Expressed' : 'Express Interest'}
                </Button>

                <Button onClick={() => setShowInvestmentForm(!showInvestmentForm)} variant="outline" className="w-full border-primary text-primary">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Send Message
                </Button>

                {showInvestmentForm && (
                  <div className="rounded-lg border border-primary/10 p-4 bg-primary/5">
                    <textarea
                      placeholder="Write your message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="w-full rounded-lg border border-primary/20 p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                      rows={3}
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="mt-3 w-full bg-primary hover:bg-primary/90 text-sm"
                    >
                      Send
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card className="mt-6 border-primary/10">
              <CardHeader>
                <CardTitle className="text-base text-primary">Founder Contact Details</CardTitle>
                <CardDescription>
                  {interestStatus === 'DetailsShared'
                    ? "The founder has shared their details with you."
                    : interestStatus === 'Interested'
                      ? "Founder will share details if they're interested."
                      : "Express interest to see founder's details."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {interestStatus === 'DetailsShared' && founderDetails ? (
                  <>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
                      <Mail className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="font-medium">{founderDetails.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
                      <Zap className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="font-medium">{founderDetails.phone}</p>
                      </div>
                    </div>
                    <Button asChild variant="outline" className="w-full mt-2">
                      <Link href={`mailto:${founderDetails.email}`}>
                        <Mail className="h-4 w-4 mr-2" /> Direct Email
                      </Link>
                    </Button>
                  </>
                ) : (
                  <div className="text-center p-4 py-8 border border-dashed border-border rounded-xl opacity-60">
                    <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground italic">Contact details are locked</p>
                  </div>
                )}

                <div className="pt-4 border-t border-border mt-4">
                  <Link href={startup.website} target="_blank" className="flex items-center gap-2 text-primary hover:underline">
                    <Globe className="h-4 w-4" />
                    Visit Website
                  </Link>
                  <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {startup.teamSize} team members
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

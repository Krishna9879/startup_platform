'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Calendar, Mail, CheckCircle2, Clock } from 'lucide-react';

interface IncubationCenter {
  id: number;
  name: string;
  city: string;
  state: string;
  industries: string[];
  capacity: number;
  program_duration_months: number;
  contact_email: string;
  description: string;
  acceptance_rate: number;
}

interface ApplicationStatus {
  centerId: number;
  status: 'Submitted' | 'Under Review' | 'Accepted' | 'Rejected';
  submittedDate: string;
}

const MOCK_CENTERS: IncubationCenter[] = [
  {
    id: 1,
    name: 'IIT Delhi Incubation Cell',
    city: 'Delhi',
    state: 'Delhi',
    industries: ['AI/ML', 'Robotics', 'Hardware'],
    capacity: 50,
    program_duration_months: 12,
    contact_email: 'incubation@iitd.ac.in',
    description: 'Premier incubation center at India\'s leading technical institute',
    acceptance_rate: 15,
  },
  {
    id: 2,
    name: 'NASSCOM 10000 Startups',
    city: 'Multiple',
    state: 'Multiple',
    industries: ['All'],
    capacity: 200,
    program_duration_months: 6,
    contact_email: 'startups@nasscom.in',
    description: 'Large-scale startup program across India',
    acceptance_rate: 25,
  },
  {
    id: 3,
    name: 'TiE Mumbai Incubator',
    city: 'Mumbai',
    state: 'Maharashtra',
    industries: ['FinTech', 'E-commerce', 'SaaS'],
    capacity: 30,
    program_duration_months: 9,
    contact_email: 'incubator@tiemumbai.com',
    description: 'Focused on scaling startups in key sectors',
    acceptance_rate: 20,
  },
  {
    id: 4,
    name: 'Bangalore StartupHub',
    city: 'Bangalore',
    state: 'Karnataka',
    industries: ['AI/ML', 'SaaS', 'Cybersecurity'],
    capacity: 75,
    program_duration_months: 6,
    contact_email: 'hello@bslhub.com',
    description: 'Techie hub with strong industry connections',
    acceptance_rate: 18,
  },
];

const MOCK_APPLICATIONS: ApplicationStatus[] = [
  {
    centerId: 1,
    status: 'Under Review',
    submittedDate: '2024-02-01',
  },
];

const STATUS_COLORS = {
  Submitted: 'bg-blue-100 text-blue-800',
  'Under Review': 'bg-yellow-100 text-yellow-800',
  Accepted: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
};

const STATUS_ICONS = {
  Submitted: Clock,
  'Under Review': Clock,
  Accepted: CheckCircle2,
  Rejected: Clock,
};

export default function StartupIncubationPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [centers, setCenters] = useState<IncubationCenter[]>(MOCK_CENTERS);
  const [applications, setApplications] = useState<ApplicationStatus[]>(MOCK_APPLICATIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');

    if (!token || role !== 'startup') {
      router.push('/login');
      return;
    }

    const user = localStorage.getItem('userName') || 'Startup';
    setUserName(user);
    setLoading(false);
  }, [router]);

  const handleApply = (centerId: number) => {
    const newApplication: ApplicationStatus = {
      centerId,
      status: 'Submitted',
      submittedDate: new Date().toISOString().split('T')[0],
    };
    setApplications([...applications, newApplication]);
    alert('Application submitted successfully!');
  };

  const getApplicationStatus = (centerId: number) => {
    return applications.find((app) => app.centerId === centerId);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex">
      <Sidebar role="startup" userName={userName} />
      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Incubation Centers</h1>
          <p className="mt-2 text-muted-foreground">
            Apply to incubation programs and get mentorship support
          </p>
        </div>

        {/* My Applications */}
        {applications.length > 0 && (
          <Card className="mb-8 border-primary/10">
            <CardHeader>
              <CardTitle>My Applications</CardTitle>
              <CardDescription>Track your incubation center applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {applications.map((app) => {
                  const center = centers.find((c) => c.id === app.centerId);
                  const StatusIcon = STATUS_ICONS[app.status];
                  return (
                    <div key={app.centerId} className="flex items-center justify-between rounded-lg border border-primary/10 p-4">
                      <div className="flex items-center gap-3">
                        <StatusIcon className="h-5 w-5 text-primary" />
                        <div>
                          <h3 className="font-medium">{center?.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Applied on {new Date(app.submittedDate).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                      </div>
                      <Badge className={STATUS_COLORS[app.status]}>{app.status}</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Centers */}
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle>Browse Incubation Centers</CardTitle>
            <CardDescription>Find the right incubation program for your startup</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {centers.map((center) => {
                const appStatus = getApplicationStatus(center.id);
                const hasApplied = !!appStatus;
                return (
                  <div key={center.id} className="rounded-lg border border-primary/10 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold">{center.name}</h3>
                        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {center.city}, {center.state}
                        </div>
                      </div>
                      {hasApplied && (
                        <Badge className={STATUS_COLORS[appStatus!.status]}>
                          {appStatus!.status}
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">{center.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-4 md:grid-cols-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Duration</p>
                        <p className="font-bold">{center.program_duration_months} months</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Capacity</p>
                        <p className="font-bold">{center.capacity} startups</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Acceptance Rate</p>
                        <p className="font-bold">{center.acceptance_rate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Industries</p>
                        <p className="font-bold text-primary">{center.industries.length} sectors</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Supported Industries</p>
                      <div className="flex flex-wrap gap-2">
                        {center.industries.map((ind) => (
                          <Badge key={ind} variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            {ind}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <a
                        href={`mailto:${center.contact_email}`}
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        <Mail className="h-4 w-4" />
                        {center.contact_email}
                      </a>
                      {!hasApplied ? (
                        <Button
                          onClick={() => handleApply(center.id)}
                          className="bg-primary hover:bg-primary/90"
                        >
                          Apply Now
                        </Button>
                      ) : (
                        <Button disabled variant="outline">
                          Application Pending
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

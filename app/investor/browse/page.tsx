'use client';

import { CardContent } from "@/components/ui/card"
import { CardTitle } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
import { Sidebar } from "@/components/sidebar"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowRight, Search, X, Menu, Target, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

interface Startup {
  id: number;
  name: string;
  industry: string;
  stage: string;
  fundingNeeded: number;
  equityOffered: number;
  description: string;
  views: number;
}

interface Filters {
  industry: string;
  stage: string;
  minFunding: string;
  maxFunding: string;
  search: string;
}

const MOCK_STARTUPS: Startup[] = [
  {
    id: 1,
    name: 'TechAI Solutions',
    industry: 'AI/ML',
    stage: 'MVP',
    fundingNeeded: 300000,
    equityOffered: 5,
    description: 'Building AI-powered analytics for enterprises',
    views: 342,
  },
  {
    id: 2,
    name: 'FinFlow',
    industry: 'FinTech',
    stage: 'MVP',
    fundingNeeded: 250000,
    equityOffered: 8,
    description: 'Blockchain-based payment solutions',
    views: 218,
  },
  {
    id: 3,
    name: 'EcoCart',
    industry: 'E-commerce',
    stage: 'MVP',
    fundingNeeded: 400000,
    equityOffered: 7,
    description: 'Sustainable fashion e-commerce platform',
    views: 156,
  },
  {
    id: 4,
    name: 'HealthMind',
    industry: 'HealthTech',
    stage: 'Idea',
    fundingNeeded: 200000,
    equityOffered: 6,
    description: 'Mental health AI companion app',
    views: 289,
  },
  {
    id: 5,
    name: 'DataVault',
    industry: 'Cybersecurity',
    stage: 'MVP',
    fundingNeeded: 350000,
    equityOffered: 4,
    description: 'Zero-knowledge encryption for data storage',
    views: 401,
  },
  {
    id: 6,
    name: 'GreenEnergy',
    industry: 'Clean Tech',
    stage: 'Idea',
    fundingNeeded: 500000,
    equityOffered: 9,
    description: 'Solar panel optimization using IoT',
    views: 167,
  },
];

const INDUSTRIES = ['All', 'AI/ML', 'FinTech', 'E-commerce', 'HealthTech', 'Cybersecurity', 'Clean Tech'];
const STAGES = ['All', 'Idea', 'MVP'];
const FUNDING_RANGES = [
  { label: 'All', min: 0, max: 5000000 },
  { label: '0-1L', min: 0, max: 100000 },
  { label: '1-2L', min: 100000, max: 200000 },
  { label: '2-3L', min: 200000, max: 300000 },
  { label: '3-5L', min: 300000, max: 500000 },
];

export default function BrowseStartups() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [filters, setFilters] = useState<Filters>({
    industry: 'All',
    stage: 'All',
    minFunding: '0',
    maxFunding: '5000000',
    search: '',
  });
  const [filteredStartups, setFilteredStartups] = useState<Startup[]>(MOCK_STARTUPS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');

    if (!token || role !== 'investor') {
      router.push('/login');
      return;
    }

    const user = localStorage.getItem('userName') || 'Investor';
    setUserName(user);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    let results = MOCK_STARTUPS;

    if (filters.industry !== 'All') {
      results = results.filter((s) => s.industry === filters.industry);
    }

    if (filters.stage !== 'All') {
      results = results.filter((s) => s.stage === filters.stage);
    }

    const min = parseInt(filters.minFunding);
    const max = parseInt(filters.maxFunding);
    results = results.filter((s) => s.fundingNeeded >= min && s.fundingNeeded <= max);

    if (filters.search) {
      results = results.filter(
        (s) =>
          s.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          s.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredStartups(results);
  }, [filters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role="investor" userName={userName} />

      {/* Main Content */}
      <main className="ml-64 flex-1">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 border-b border-border/20 bg-background/80 backdrop-blur-xl">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="text-2xl font-bold">Discover Opportunities</div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-8">
          {/* Filters */}
          <div className="mb-8 bg-secondary/20 border border-border/30 rounded-2xl p-6 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder="Company name..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-10 bg-background/50 border-border/30 focus:border-primary/50 h-10 text-sm"
                  />
                </div>
              </div>

              {/* Industry */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase">Industry</label>
                <Select value={filters.industry} onValueChange={(v) => setFilters({ ...filters, industry: v })}>
                  <SelectTrigger className="bg-background/50 border-border/30 focus:border-primary/50 h-10 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-secondary border-border/30">
                    {INDUSTRIES.map((ind) => (
                      <SelectItem key={ind} value={ind}>
                        {ind}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Stage */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase">Stage</label>
                <Select value={filters.stage} onValueChange={(v) => setFilters({ ...filters, stage: v })}>
                  <SelectTrigger className="bg-background/50 border-border/30 focus:border-primary/50 h-10 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-secondary border-border/30">
                    {STAGES.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Funding */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase">Funding</label>
                <Select
                  value={`${filters.minFunding}-${filters.maxFunding}`}
                  onValueChange={(v) => {
                    const [min, max] = v.split('-');
                    setFilters({ ...filters, minFunding: min, maxFunding: max });
                  }}
                >
                  <SelectTrigger className="bg-background/50 border-border/30 focus:border-primary/50 h-10 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-secondary border-border/30">
                    {FUNDING_RANGES.map((range) => (
                      <SelectItem key={range.label} value={`${range.min}-${range.max}`}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Reset */}
              <div className="flex items-end">
                <Button
                  onClick={() =>
                    setFilters({
                      industry: 'All',
                      stage: 'All',
                      minFunding: '0',
                      maxFunding: '5000000',
                      search: '',
                    })
                  }
                  variant="outline"
                  className="w-full bg-background/50 border-border/30 hover:bg-secondary/50 h-10 text-sm"
                >
                  <X className="h-4 w-4 mr-1" /> Reset
                </Button>
              </div>
            </div>
          </div>

          {/* Startups Grid */}
          <div className="space-y-4">
            {filteredStartups.length > 0 ? (
              filteredStartups.map((startup, idx) => (
                <div
                  key={startup.id}
                  className="group bg-secondary/20 border border-border/30 rounded-xl p-6 hover:border-primary/30 hover:bg-secondary/40 transition-all duration-300 cursor-pointer fade-in"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{startup.name}</h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="inline-block rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary border border-primary/20">
                          {startup.industry}
                        </span>
                        <span className="inline-block rounded-full bg-secondary/80 px-3 py-1 text-xs font-semibold text-foreground border border-border/20">
                          {startup.stage}
                        </span>
                      </div>
                      <p className="mt-4 text-sm text-muted-foreground line-clamp-2">{startup.description}</p>
                      <div className="mt-4 flex flex-wrap gap-6 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Target className="h-4 w-4 text-primary" />
                          <span>₹{(startup.fundingNeeded / 100000).toFixed(1)}L</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          <span>{startup.equityOffered}% equity</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4 text-primary" />
                          <span>{startup.views} views</span>
                        </div>
                      </div>
                    </div>
                    <Button asChild className="bg-primary hover:bg-primary/90 text-background btn-smooth group-hover:gap-3 h-10">
                      <Link href={`/investor/startup/${startup.id}`}>
                        View
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No startups found matching your filters</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

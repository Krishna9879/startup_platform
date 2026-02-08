'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, CheckCircle2, Save } from 'lucide-react';

interface PitchData {
  companyName: string;
  industry: string;
  stage: string;
  fundingNeeded: string;
  equityOffered: string;
  description: string;
  website: string;
  teamSize: string;
  city: string;
  state: string;
  pitchDeckUrl: string;
  financialReportUrl: string;
}

export default function StartupPitchPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [pitch, setPitch] = useState<PitchData>({
    companyName: 'My Awesome Startup',
    industry: 'AI/ML',
    stage: 'MVP',
    fundingNeeded: '500000',
    equityOffered: '8',
    description: 'Building innovative AI solutions for enterprise customers.',
    website: 'https://example.com',
    teamSize: '5',
    city: 'Bangalore',
    state: 'Karnataka',
    pitchDeckUrl: '',
    financialReportUrl: '',
  });
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

  const handleInputChange = (field: keyof PitchData, value: string) => {
    setPitch({ ...pitch, [field]: value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccessMessage('Pitch saved successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('[v0] Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex">
      <Sidebar role="startup" userName={userName} />
      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Pitch</h1>
            <p className="mt-2 text-muted-foreground">
              Manage your startup profile and pitch information
            </p>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? 'outline' : 'default'}
            className={isEditing ? 'border-primary text-primary' : 'bg-primary hover:bg-primary/90'}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="flex items-center gap-3 pt-6">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <p className="text-sm text-green-800">{successMessage}</p>
            </CardContent>
          </Card>
        )}

        {/* Pitch Form */}
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>
              This information is displayed to potential investors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Company Name */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Company Name*</label>
                <Input
                  disabled={!isEditing}
                  value={pitch.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="mt-2 border-primary/20 disabled:bg-muted"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Website</label>
                <Input
                  disabled={!isEditing}
                  type="url"
                  value={pitch.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="mt-2 border-primary/20 disabled:bg-muted"
                />
              </div>
            </div>

            {/* Industry & Stage */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Industry*</label>
                <Select
                  value={pitch.industry}
                  disabled={!isEditing}
                  onValueChange={(v) => handleInputChange('industry', v)}
                >
                  <SelectTrigger className="mt-2 border-primary/20 disabled:bg-muted">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      'AI/ML',
                      'FinTech',
                      'E-commerce',
                      'HealthTech',
                      'Cybersecurity',
                      'Clean Tech',
                      'Other',
                    ].map((ind) => (
                      <SelectItem key={ind} value={ind}>
                        {ind}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Startup Stage*</label>
                <Select
                  value={pitch.stage}
                  disabled={!isEditing}
                  onValueChange={(v) => handleInputChange('stage', v)}
                >
                  <SelectTrigger className="mt-2 border-primary/20 disabled:bg-muted">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['Idea', 'MVP', 'Pre-launch', 'Early Revenue', 'Growth'].map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Funding & Equity */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Funding Needed (₹)*</label>
                <Input
                  disabled={!isEditing}
                  type="number"
                  value={pitch.fundingNeeded}
                  onChange={(e) => handleInputChange('fundingNeeded', e.target.value)}
                  className="mt-2 border-primary/20 disabled:bg-muted"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Equity Offered (%)*</label>
                <Input
                  disabled={!isEditing}
                  type="number"
                  value={pitch.equityOffered}
                  onChange={(e) => handleInputChange('equityOffered', e.target.value)}
                  className="mt-2 border-primary/20 disabled:bg-muted"
                />
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">City*</label>
                <Input
                  disabled={!isEditing}
                  value={pitch.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="mt-2 border-primary/20 disabled:bg-muted"
                />
              </div>
              <div>
                <label className="text-sm font-medium">State*</label>
                <Input
                  disabled={!isEditing}
                  value={pitch.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="mt-2 border-primary/20 disabled:bg-muted"
                />
              </div>
            </div>

            {/* Team & Description */}
            <div>
              <label className="text-sm font-medium">Team Size</label>
              <Input
                disabled={!isEditing}
                type="number"
                value={pitch.teamSize}
                onChange={(e) => handleInputChange('teamSize', e.target.value)}
                className="mt-2 border-primary/20 disabled:bg-muted"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Pitch Description*</label>
              <Textarea
                disabled={!isEditing}
                value={pitch.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Tell investors about your startup idea, market opportunity, and vision..."
                className="mt-2 min-h-32 border-primary/20 disabled:bg-muted"
              />
            </div>

            {/* Documents */}
            <div className="rounded-lg border border-primary/10 bg-primary/5 p-4">
              <h3 className="font-medium mb-4">Documents (Optional)</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Pitch Deck URL</label>
                  <Input
                    disabled={!isEditing}
                    type="url"
                    placeholder="https://..."
                    value={pitch.pitchDeckUrl}
                    onChange={(e) => handleInputChange('pitchDeckUrl', e.target.value)}
                    className="mt-2 border-primary/20 disabled:bg-muted"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Financial Report URL</label>
                  <Input
                    disabled={!isEditing}
                    type="url"
                    placeholder="https://..."
                    value={pitch.financialReportUrl}
                    onChange={(e) => handleInputChange('financialReportUrl', e.target.value)}
                    className="mt-2 border-primary/20 disabled:bg-muted"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-primary hover:bg-primary/90"
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Profile Preview */}
        <Card className="mt-8 border-primary/10">
          <CardHeader>
            <CardTitle>How Investors See Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-primary/10 p-6">
              <h2 className="text-2xl font-bold">{pitch.companyName}</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  {pitch.industry}
                </span>
                <span className="inline-block rounded-full bg-secondary/50 px-3 py-1 text-sm font-medium">
                  {pitch.stage}
                </span>
              </div>
              <p className="mt-4 text-muted-foreground">{pitch.description}</p>
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Funding Seeking</p>
                  <p className="font-bold">₹{(parseInt(pitch.fundingNeeded) / 100000).toFixed(1)}L</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Equity Offered</p>
                  <p className="font-bold">{pitch.equityOffered}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

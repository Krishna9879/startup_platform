'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Bell, Shield, Save, LogOut } from 'lucide-react';

interface UserSettings {
  fullName: string;
  email: string;
  phone: string;
  bio: string;
  emailNotifications: boolean;
  dealNotifications: boolean;
  promotionalEmails: boolean;
  twoFactorEnabled: boolean;
}

type UserRole = 'investor' | 'startup' | 'admin' | null;

export default function SettingsPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState<UserRole>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');
  const [settings, setSettings] = useState<UserSettings>({
    fullName: 'John Investor',
    email: 'john@example.com',
    phone: '+91-9999999999',
    bio: 'Angel investor focused on AI/ML startups',
    emailNotifications: true,
    dealNotifications: true,
    promotionalEmails: false,
    twoFactorEnabled: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');

    if (!token) {
      router.push('/login');
      return;
    }

    setRole(userRole as UserRole);
    const user = localStorage.getItem('userName') || 'User';
    setUserName(user);
    setLoading(false);
  }, [router]);

  const handleInputChange = (field: keyof UserSettings, value: any) => {
    setSettings({ ...settings, [field]: value });
  };

  const handleSave = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsEditing(false);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('[v0] Save error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    router.push('/login');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex">
      <Sidebar role={role as any} userName={userName} />
      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="mt-2 text-muted-foreground">Manage your account and preferences</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-border">
          {(['profile', 'notifications', 'security'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium transition-colors capitalize ${
                activeTab === tab
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <>
            <Card className="border-primary/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </div>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? 'outline' : 'default'}
                  className={isEditing ? 'border-primary text-primary' : 'bg-primary hover:bg-primary/90'}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <Input
                      disabled={!isEditing}
                      value={settings.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="mt-2 border-primary/20 disabled:bg-muted"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      disabled={!isEditing}
                      type="email"
                      value={settings.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="mt-2 border-primary/20 disabled:bg-muted"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input
                    disabled={!isEditing}
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="mt-2 border-primary/20 disabled:bg-muted"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Bio</label>
                  <Textarea
                    disabled={!isEditing}
                    value={settings.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell others about yourself..."
                    className="mt-2 min-h-24 border-primary/20 disabled:bg-muted"
                  />
                </div>

                {isEditing && (
                  <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="mt-8 border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-900">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-red-900">Delete Account</p>
                    <p className="text-sm text-red-800">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Control how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {[
                  {
                    id: 'emailNotifications',
                    label: 'Email Notifications',
                    description: 'Receive email updates about your account',
                    icon: Bell,
                  },
                  {
                    id: 'dealNotifications',
                    label: 'Deal Notifications',
                    description: 'Get notified about new deals and opportunities',
                    icon: AlertCircle,
                  },
                  {
                    id: 'promotionalEmails',
                    label: 'Promotional Emails',
                    description: 'Receive updates about new features and promotions',
                    icon: Bell,
                  },
                ].map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      className="flex items-center justify-between rounded-lg border border-primary/10 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{notification.label}</p>
                          <p className="text-sm text-muted-foreground">{notification.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          handleInputChange(notification.id as any, !settings[notification.id as any])
                        }
                        className={`relative h-6 w-11 rounded-full transition-colors ${
                          settings[notification.id as any]
                            ? 'bg-primary'
                            : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                            settings[notification.id as any] ? 'translate-x-5' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>

              <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Password & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full border-primary text-primary bg-transparent">
                  Change Password
                </Button>
                <div className="rounded-lg border border-primary/10 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <button
                      onClick={() => handleInputChange('twoFactorEnabled', !settings.twoFactorEnabled)}
                      className={`relative h-6 w-11 rounded-full transition-colors ${
                        settings.twoFactorEnabled ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                          settings.twoFactorEnabled ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>Manage your login sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-primary/10 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Current Session</p>
                      <p className="text-sm text-muted-foreground">Chrome • Windows</p>
                    </div>
                    <span className="text-xs text-green-600 font-medium">Active now</span>
                  </div>
                </div>
                <Button variant="outline" className="mt-4 w-full border-destructive text-destructive bg-transparent">
                  Sign Out From All Devices
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle>Logout</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={handleLogout} variant="destructive" className="w-full">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout From This Account
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

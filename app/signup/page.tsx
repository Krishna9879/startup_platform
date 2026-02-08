'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, User, Mail, Lock } from 'lucide-react';

type Role = 'investor' | 'startup';

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>('investor');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Signup failed');
        return;
      }

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userRole', data.user.role);
      router.push(`/dashboard/${role}`);
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('[v0] Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md fade-in">
        {/* Header */}
        <div className="mb-10 text-center">
          <Link href="/" className="inline-flex items-center justify-center mb-6">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center font-bold text-foreground">
              IS
            </div>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join InvestStart and start your journey</p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {(['investor', 'startup'] as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`relative group rounded-xl p-4 transition-all duration-300 border ${
                role === r
                  ? 'bg-primary/15 border-primary/40'
                  : 'bg-secondary/20 border-border/30 hover:border-primary/30'
              }`}
            >
              <div className="text-sm font-semibold capitalize text-foreground">{r}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {r === 'investor' ? 'Looking to invest' : 'Seeking funding'}
              </div>
              {role === r && (
                <div className="absolute inset-0 rounded-xl bg-primary/5 animate-pulse"></div>
              )}
            </button>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-secondary/20 border border-border/30 rounded-2xl p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-4 text-sm text-destructive/90">
                {error}
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium text-foreground">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="pl-10 bg-background/50 border-border/30 focus:border-primary/50 h-11"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-background/50 border-border/30 focus:border-primary/50 h-11"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 bg-background/50 border-border/30 focus:border-primary/50 h-11"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pl-10 bg-background/50 border-border/30 focus:border-primary/50 h-11"
                />
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-background h-11 btn-smooth group font-medium"
            >
              {loading ? (
                'Creating Account...'
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Create Account
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>
        </div>

        {/* Sign In Link */}
        <div className="mt-6 text-center text-sm">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-1/4 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-1/4 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-10 -z-10"></div>
    </div>
  );
}

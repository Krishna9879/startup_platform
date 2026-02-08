'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userRole', data.user.role);
      localStorage.setItem('userId', data.user.id.toString());
      localStorage.setItem('userName', data.user.full_name);
      router.push(`/dashboard/${data.user.role}`);
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('[v0] Login error:', err);
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
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your InvestStart account</p>
        </div>

        {/* Form Card */}
        <div className="bg-secondary/20 border border-border/30 rounded-2xl p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-4 text-sm text-destructive/90">
                {error}
              </div>
            )}

            {/* Email Field */}
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

            {/* Password Field */}
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

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-background h-11 btn-smooth group font-medium"
            >
              {loading ? (
                'Signing in...'
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/20"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-secondary/20 text-muted-foreground">or</span>
            </div>
          </div>

          {/* Test Credentials */}
          <div className="bg-background/50 rounded-lg p-4 mb-6">
            <p className="text-xs text-muted-foreground mb-3 font-medium">Test Credentials:</p>
            <div className="space-y-2 text-xs">
              <div>
                <p className="text-muted-foreground">Investor:</p>
                <p className="text-foreground font-mono">investor@example.com / password123</p>
              </div>
              <div>
                <p className="text-muted-foreground">Startup:</p>
                <p className="text-foreground font-mono">startup@example.com / password123</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="mt-6 text-center text-sm">
          <p className="text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/signup" className="font-medium text-primary hover:text-primary/80 transition-colors">
              Create one now
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

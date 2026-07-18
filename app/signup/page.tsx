'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth';
import { Button } from '@/components/ui/button';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

    setIsLoading(true);

    try {
      await signup(username, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.data?.error || err?.message || 'Signup failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    // Full page redirect to Google OAuth endpoint
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/auth/google`;
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Brew Edge</h1>
          <p className="text-muted-foreground">Create your coffee journal</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="coffeelover"
              className="w-full px-4 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              Password (atleast 8 chars)
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
              disabled={isLoading}
            />
          </div>

          {error && <div className="text-sm text-destructive">{error}</div>}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        {/* Google OAuth Button */}
        <div className="mt-6">
          <button
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-border rounded-md bg-card text-foreground hover:bg-muted transition disabled:opacity-50"
          >
            Continue with Google
          </button>
        </div>

        {/* Login link */}
        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link href="/login" className="text-primary hover:underline font-medium">
            Log in
          </Link>
        </div>

        {/* Demo hint */}
    
      </div>
    </main>
  );
}

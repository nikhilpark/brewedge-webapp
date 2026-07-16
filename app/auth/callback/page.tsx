'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth';
import { apiClient, setAuthToken } from '@/lib/apiClient';

export default function CallbackPage() {
  const router = useRouter();
  const { setUser } = useAuth() as any; // Type will be fixed once auth context is updated

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Fetch user data - backend already set httpOnly cookie
        const userData = await apiClient('/auth/me');
        
        // Store token if provided
        if (userData.accessToken) {
          setAuthToken(userData.accessToken);
        }
        
        // Update auth context
        setUser(userData);
        
        // Redirect to dashboard
        router.push('/dashboard');
      } catch (error) {
        console.error('Auth callback failed:', error);
        router.push('/login?error=auth_failed');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}

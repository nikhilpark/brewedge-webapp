'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth';
import Navigation from '@/components/navigation';
import CompareTray from '@/components/compare-tray';

export default function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Wait until session restoration has finished before deciding
    // whether the user should be redirected.
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  // AuthProvider is still checking/restoring the session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Session check completed and there is no authenticated user.
  // useEffect above will redirect to /login.
  if (!user) {
    return null;
  }

  return (
    <>
      <Navigation />
      <main className="pb-32">{children}</main>
      <CompareTray />
    </>
  );
}
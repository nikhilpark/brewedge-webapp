'use client';

import { useAuth } from '@/context/auth';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Navigation() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-serif font-bold text-lg">☕</span>
            </div>
            <span className="font-serif font-bold text-xl text-foreground hidden sm:inline">Brew Edge</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1 sm:gap-4">
            <Link
              href="/dashboard"
              className={`px-3 py-2 text-sm font-medium rounded-md transition ${
                isActive('/dashboard')
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/explore"
              className={`px-3 py-2 text-sm font-medium rounded-md transition ${
                isActive('/explore')
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              Explore
            </Link>
            <Link
              href="/recipes/new"
              className={`px-3 py-2 text-sm font-medium rounded-md transition ${
                isActive('/recipes/new')
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              + New
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <img
              src={user?.avatarUrl}
              alt={user?.username}
              className="w-8 h-8 rounded-full"
            />
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-foreground">{user?.username}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-muted-foreground hover:text-foreground transition px-2 py-1"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

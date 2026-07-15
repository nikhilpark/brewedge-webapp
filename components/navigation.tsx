'use client';

import { useAuth } from '@/context/auth';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import ThemeToggle from './theme-toggle';
import { useState } from 'react';

export default function Navigation() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);

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

          {/* Right Side: Theme Toggle + User Menu */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-8 h-8 rounded-full overflow-hidden border-2 border-muted hover:border-primary transition"
                title={user?.username}
              >
                <img
                  src={user?.avatarUrl}
                  alt={user?.username}
                  className="w-full h-full object-cover"
                />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg z-50">
                  <Link
                    href={`/profile/${user?.id}`}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition border-b border-border"
                    onClick={() => setShowMenu(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/tools/grind-converter"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition border-b border-border"
                    onClick={() => setShowMenu(false)}
                  >
                    Tools
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { FiHome, FiLogOut, FiUser } from 'react-icons/fi';

export default function Navigation() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) return null;

  return (
    <nav className="bg-white shadow-lg border-b border-slate-200">
      <div className="container h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🚂</span>
              <span className="text-xl font-bold text-slate-900">Train Schedule</span>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className={`nav-link flex items-center space-x-1 ${
                  pathname === '/' ? 'nav-link-active' : ''
                }`}
              >
                <FiHome className="h-4 w-4" />
                <span>Schedules</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <FiUser className="h-5 w-5 text-slate-400" />
              <span className="text-sm font-medium text-slate-700">
                {user.firstName} {user.lastName}
              </span>
            </div>

            <button
              onClick={logout}
              className="btn-outline flex items-center space-x-1 py-1.5"
            >
              <FiLogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 
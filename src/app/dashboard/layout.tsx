'use client';

import { LayoutDashboard, Briefcase, PiggyBank, ArrowUpRight, Users, User, Settings, ShieldCheck, LogOut, Menu, X, Leaf } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Briefcase, label: 'Investments', href: '/dashboard/investments' },
    { icon: PiggyBank, label: 'Wallet', href: '/dashboard/wallet' },
    { icon: ArrowUpRight, label: 'Withdrawals', href: '/dashboard/withdrawals' },
    { icon: PiggyBank, label: 'Transactions', href: '/dashboard/transactions' },
    { icon: Users, label: 'Referrals', href: '/dashboard/referrals' },
    { icon: User, label: 'Profile', href: '/dashboard/profile' },
    { icon: ShieldCheck, label: 'KYC Verification', href: '/dashboard/kyc' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-green-800 to-green-900 text-white
          transform transition-transform duration-300 lg:transform-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-6 border-b border-green-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">AGEC</h1>
                <p className="text-xs text-green-300">AGRO ELITE</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-700/50 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-green-700">
            <div className="bg-green-700/30 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Grow Wealth</p>
                  <p className="text-xs text-green-300">Sustainably</p>
                </div>
              </div>
              <Link href="/dashboard/investments">
                <Button className="w-full bg-green-600 hover:bg-green-500">
                  Invest Now
                </Button>
              </Link>
            </div>

            <button 
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-700/50 transition-colors w-full text-left"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="lg:ml-64">
          {/* Top navigation */}
          <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex-1 max-w-md mx-4 hidden sm:block">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search anything..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-green-600"
                  />
                  <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{user?.displayName || user?.email?.split('@')[0]}</p>
                    <p className="text-xs text-gray-500">ID: {user?.uid?.slice(0, 8).toUpperCase()}</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center text-white font-bold">
                    {(user?.displayName?.[0] || user?.email?.[0]?.toUpperCase())}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

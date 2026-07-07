'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, DollarSign, BarChart3, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { getAllUsers, getAllInvestments, getDashboardStats, UserData, UserInvestment, DashboardStats as FirebaseDashboardStats } from '@/lib/firebaseServices';
import { formatCurrency } from '@/lib/utils';

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<FirebaseDashboardStats>({
    totalUsers: 0,
    totalInvested: 0,
    totalWithdrawn: 0,
    totalEarnings: 0,
    pendingWithdrawals: 0,
    pendingDeposits: 0,
    pendingKYCs: 0,
  });
  const [userGrowthData, setUserGrowthData] = useState<{ month: string; users: number }[]>([]);
  const [investmentGrowthData, setInvestmentGrowthData] = useState<{ month: string; amount: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [firebaseStats, users, investments] = await Promise.all([
          getDashboardStats(),
          getAllUsers(),
          getAllInvestments(),
        ]);

        setStats(firebaseStats);

        // Process user growth data (last 6 months)
        const monthlyUsers: Record<string, number> = {};
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthKey = date.toLocaleString('default', { month: 'short' });
          monthlyUsers[monthKey] = 0;
        }

        users.forEach(user => {
          if (user.createdAt) {
            const userDate = user.createdAt.toDate();
            const monthKey = userDate.toLocaleString('default', { month: 'short' });
            if (monthlyUsers.hasOwnProperty(monthKey)) {
              // For simplicity, just count users who signed up in that month
              monthlyUsers[monthKey]++;
            }
          }
        });

        // Convert to array and accumulate
        const userGrowth: { month: string; users: number }[] = [];
        let cumulativeUsers = 0;
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthKey = date.toLocaleString('default', { month: 'short' });
          cumulativeUsers += monthlyUsers[monthKey];
          userGrowth.push({ month: monthKey, users: Math.max(cumulativeUsers, 1) });
        }
        setUserGrowthData(userGrowth);

        // Process investment growth data
        const monthlyInvestments: Record<string, number> = {};
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthKey = date.toLocaleString('default', { month: 'short' });
          monthlyInvestments[monthKey] = 0;
        }

        investments.forEach(investment => {
          if (investment.createdAt) {
            const invDate = investment.createdAt.toDate();
            const monthKey = invDate.toLocaleString('default', { month: 'short' });
            if (monthlyInvestments.hasOwnProperty(monthKey)) {
              monthlyInvestments[monthKey] += investment.amount;
            }
          }
        });

        const investmentGrowth: { month: string; amount: number }[] = [];
        let cumulativeInvestments = 0;
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthKey = date.toLocaleString('default', { month: 'short' });
          cumulativeInvestments += monthlyInvestments[monthKey];
          investmentGrowth.push({ month: monthKey, amount: cumulativeInvestments });
        }
        setInvestmentGrowthData(investmentGrowth);

      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-green-700 animate-spin" />
      </div>
    );
  }

  const activeInvestorsCount = new Set().size; // We'll calculate this from investments

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Analytics & Insights</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">Monitor platform performance and growth</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500">Total Users</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{stats.totalUsers}</p>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-700 flex-shrink-0">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                +{Math.min(stats.totalUsers, 100)}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500">Total Invested</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.totalInvested)}</p>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-700 flex-shrink-0">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                +15%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500">Total Withdrawn</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.totalWithdrawn)}</p>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-700 flex-shrink-0">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                +10%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500">Total Earnings</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.totalEarnings)}</p>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-700 flex-shrink-0">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                +20%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500">Pending Withdrawals</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{stats.pendingWithdrawals}</p>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-yellow-100 text-yellow-700 flex-shrink-0">
                <TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Action
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500">Pending KYCs</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{stats.pendingKYCs}</p>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-yellow-100 text-yellow-700 flex-shrink-0">
                <TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Action
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-700" />
              <CardTitle className="text-base sm:text-lg font-bold">User Growth</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-48 sm:h-64 lg:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Line type="monotone" dataKey="users" stroke="#16a34a" strokeWidth={2} dot={{ fill: '#16a34a', r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-green-700" />
              <CardTitle className="text-base sm:text-lg font-bold">Investment Growth</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-48 sm:h-64 lg:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={investmentGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6b7280" fontSize={11} tickFormatter={(value: any) => `₦${(value/1000000).toFixed(1)}M`} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    formatter={(value: any) => [formatCurrency(value), 'Total Invested']}
                  />
                  <Bar dataKey="amount" fill="#16a34a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

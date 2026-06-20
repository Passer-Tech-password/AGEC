'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp, ArrowDownToLine, ArrowUpFromLine, Users, Wallet, Briefcase, Clock, CheckCircle, Leaf, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

// Sample data - will be replaced with real data
const chartData = [
  { name: 'Jan', earnings: 40000 },
  { name: 'Feb', earnings: 30000 },
  { name: 'Mar', earnings: 50000 },
  { name: 'Apr', earnings: 45000 },
  { name: 'May', earnings: 60000 },
  { name: 'Jun', earnings: 70000 },
];

export default function DashboardPage() {
  const { user, userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-green-700 animate-spin" />
      </div>
    );
  }

  const totalInvested = userData?.wallet.totalInvested || 0;
  const totalEarnings = userData?.wallet.totalEarnings || 0;
  const availableBalance = userData?.wallet.balance || 0;
  const userInvestments = userData?.investments || [];
  const userName = user?.displayName || user?.email?.split('@')[0] || 'User';

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {userName}!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your investments.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/investments">
            <Button className="bg-green-700 hover:bg-green-800 text-white">
              <Briefcase className="w-4 h-4 mr-2" />
              Make Investment
            </Button>
          </Link>
          <Link href="/dashboard/wallet">
            <Button variant="secondary">
              <Wallet className="w-4 h-4 mr-2" />
              Deposit Funds
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Investment</CardTitle>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-green-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(totalInvested)}</div>
            <p className="text-sm text-green-600 mt-1 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              {userInvestments.length} Active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Earnings</CardTitle>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-amber-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(totalEarnings)}</div>
            <p className="text-sm text-amber-600 mt-1">All Time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Available Balance</CardTitle>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-green-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(availableBalance)}</div>
            <Link href="/dashboard/wallet">
              <Button variant="secondary" className="mt-2 w-full h-8 text-xs">
                Withdraw
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Referral Earnings</CardTitle>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(15000)}</div>
            <Link href="/dashboard/referrals">
              <p className="text-sm text-emerald-600 mt-1 cursor-pointer hover:underline">View Referrals</p>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Next Payout */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Earnings Overview</CardTitle>
              <select className="text-sm border border-gray-200 rounded-lg px-3 py-1">
                <option>This Month</option>
                <option>Last 3 Months</option>
                <option>This Year</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `₦${value/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Line type="monotone" dataKey="earnings" stroke="#16a34a" strokeWidth={3} dot={{ fill: '#16a34a', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Withdrawal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {userInvestments.length > 0 ? (
              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Next Withdrawal Date</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(userInvestments[0].nextPayoutDate.toDate()).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="border-t border-green-100 pt-3">
                  <p className="text-sm text-gray-600">Est. Payout Amount</p>
                  <p className="text-2xl font-bold text-green-800">
                    {formatCurrency((userInvestments[0].amount * userInvestments[0].roi / 100) / (userInvestments[0].durationMonths * 2))}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Start investing to receive payouts!</p>
              </div>
            )}
            <div className="text-center text-sm text-gray-500">
              <p>Frequency: Every 2 Weeks</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Investments and Transactions */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Investments</CardTitle>
            <Link href="/dashboard/investments">
              <Button variant="ghost" className="h-8 text-sm text-green-700">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userInvestments.slice(0, 4).map((investment) => (
                <div key={investment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-green-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{investment.planName}</p>
                      <p className="text-sm text-gray-500">{new Date(investment.startDate.toDate()).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(investment.amount)}</p>
                    <p className="text-sm text-green-600 flex items-center justify-end">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Active
                    </p>
                  </div>
                </div>
              ))}
              {userInvestments.length === 0 && (
                <div className="text-center py-8 text-gray-500">No investments yet</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Link href="/dashboard/transactions">
              <Button variant="ghost" className="h-8 text-sm text-green-700">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <p>Connect wallet to see transactions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/investments" className="w-full">
              <Button className="w-full h-auto py-6 flex-col gap-2 bg-green-700 hover:bg-green-800 text-white">
                <Briefcase className="w-6 h-6" />
                <span>Make Investment</span>
              </Button>
            </Link>
            <Link href="/dashboard/wallet" className="w-full">
              <Button className="w-full h-auto py-6 flex-col gap-2 bg-amber-600 hover:bg-amber-700 text-white">
                <Wallet className="w-6 h-6" />
                <span>Deposit Funds</span>
              </Button>
            </Link>
            <Link href="/dashboard/withdrawals" className="w-full">
              <Button className="w-full h-auto py-6 flex-col gap-2 bg-green-700 hover:bg-green-800 text-white">
                <ArrowUpFromLine className="w-6 h-6" />
                <span>Withdraw Funds</span>
              </Button>
            </Link>
            <Link href="/dashboard/investments" className="w-full">
              <Button className="w-full h-auto py-6 flex-col gap-2 bg-amber-600 hover:bg-amber-700 text-white">
                <Leaf className="w-6 h-6" />
                <span>View Farm Projects</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 pt-4">
        <p>All investments are subject to terms and conditions. Please read our investment agreement carefully.</p>
      </div>
    </div>
  );
}

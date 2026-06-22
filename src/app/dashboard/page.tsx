'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp, Wallet, Briefcase, Users, Leaf, Loader2, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

// Sample data - will be replaced with real data
const chartData = [
  { name: 'May 1', earnings: 20000 },
  { name: 'May 8', earnings: 25000 },
  { name: 'May 15', earnings: 30000 },
  { name: 'May 22', earnings: 40000 },
  { name: 'May 29', earnings: 45000 },
];

const sampleInvestments = [
  { id: 1, plan: 'Poultry Farm', amount: 50000, status: 'Active', date: 'May 15, 2024', roi: '24%' },
  { id: 2, plan: 'Rice Farm', amount: 100000, status: 'Active', date: 'May 10, 2024', roi: '30%' },
  { id: 3, plan: 'Fish Farm', amount: 75000, status: 'Active', date: 'May 5, 2024', roi: '28%' },
  { id: 4, plan: 'Greenhouse', amount: 125000, status: 'Active', date: 'May 1, 2024', roi: '32%' },
];

const sampleTransactions = [
  { id: 1, type: 'Withdrawal', amount: -15000, date: 'May 28, 2024', status: 'Completed' },
  { id: 2, type: 'Investment', amount: -50000, date: 'May 15, 2024', status: 'Completed' },
  { id: 3, type: 'Referral Bonus', amount: 2500, date: 'May 12, 2024', status: 'Completed' },
  { id: 4, type: 'Withdrawal', amount: -10000, date: 'May 5, 2024', status: 'Completed' },
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

  // Mock data for demo purposes
  const totalInvested = userData?.totalInvested || 350000;
  const totalEarnings = userData?.totalEarnings || 120000;
  const availableBalance = userData?.walletBalance || 45000;
  const referralEarnings = 15000;
  const totalWithdrawn = 75000;
  
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
            <Button className="bg-green-700 hover:bg-green-800 text-white shadow-lg shadow-green-700/20">
              <Briefcase className="w-4 h-4 mr-2" />
              Make Investment
            </Button>
          </Link>
          <Link href="/dashboard/wallet">
            <Button variant="secondary" className="bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20">
              <Wallet className="w-4 h-4 mr-2" />
              Deposit Funds
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-2 border-transparent hover:border-green-200 shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Investment</CardTitle>
            <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-green-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(totalInvested)}</div>
            <p className="text-sm text-green-600 mt-2 flex items-center font-medium">
              <TrendingUp className="w-4 h-4 mr-1.5" />
              {sampleInvestments.length} Active
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-transparent hover:border-amber-200 shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Earnings</CardTitle>
            <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-amber-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(totalEarnings)}</div>
            <p className="text-sm text-amber-600 mt-2 font-medium">All Time</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-transparent hover:border-green-200 shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Available Balance</CardTitle>
            <div className="w-14 h-14 bg-gradient-to-br from-green-700 to-green-800 rounded-2xl flex items-center justify-center">
              <Wallet className="w-7 h-7 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(availableBalance)}</div>
            <Link href="/dashboard/wallet">
              <Button className="mt-3 w-full h-9 bg-green-700 hover:bg-green-800 text-white text-sm">
                Withdraw
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-2 border-transparent hover:border-emerald-200 shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Referral Earnings</CardTitle>
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center">
              <Users className="w-7 h-7 text-emerald-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(referralEarnings)}</div>
            <Link href="/dashboard/referrals">
              <p className="text-sm text-emerald-600 mt-2 cursor-pointer hover:underline font-medium">View Referrals</p>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Next Payout */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-2 border-transparent hover:border-green-100 shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">Investment Growth</CardTitle>
              <select className="text-sm border border-gray-200 rounded-xl px-4 py-2 bg-white">
                <option>This Month</option>
                <option>Last 3 Months</option>
                <option>This Year</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(value: any) => `₦${value/1000}k`} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    formatter={(value: any) => formatCurrency(value)}
                  />
                  <Line type="monotone" dataKey="earnings" stroke="#16a34a" strokeWidth={4} dot={{ fill: '#16a34a', r: 5, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-transparent hover:border-green-100 shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Upcoming Withdrawal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-700 rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Next Withdrawal Date</p>
                  <p className="text-lg font-bold text-gray-900">May 30, 2024</p>
                </div>
              </div>
              <div className="border-t border-green-100 pt-4">
                <p className="text-sm text-gray-500 font-medium mb-1">Estimated Payout Amount</p>
                <p className="text-2xl font-bold text-green-700">{formatCurrency(7500)}</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 font-medium">Frequency: Every 2 Weeks</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Investments and Transactions */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-2 border-transparent hover:border-green-100 shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Recent Investments</CardTitle>
            <Link href="/dashboard/investments">
              <Button variant="ghost" className="h-9 text-sm text-green-700 font-medium flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sampleInvestments.slice(0, 4).map((investment) => (
                <div key={investment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-green-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                      <Leaf className="w-6 h-6 text-green-700" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{investment.plan}</p>
                      <p className="text-sm text-gray-500">{investment.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatCurrency(investment.amount)}</p>
                    <p className="text-sm text-green-600 font-medium">{investment.roi}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-transparent hover:border-green-100 shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Recent Transactions</CardTitle>
            <Link href="/dashboard/transactions">
              <Button variant="ghost" className="h-9 text-sm text-green-700 font-medium flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sampleTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-green-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      transaction.amount < 0 
                        ? 'bg-gradient-to-br from-red-100 to-red-200' 
                        : 'bg-gradient-to-br from-green-100 to-green-200'
                    }`}>
                      <Wallet className={`w-6 h-6 ${
                        transaction.amount < 0 ? 'text-red-700' : 'text-green-700'
                      }`} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{transaction.type}</p>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      transaction.amount < 0 ? 'text-red-700' : 'text-green-700'
                    }`}>
                      {transaction.amount < 0 ? '-' : '+'}{formatCurrency(Math.abs(transaction.amount))}
                    </p>
                    <p className="text-sm text-green-600 font-medium">{transaction.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-2 border-transparent hover:border-green-100 shadow-lg transition-all">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Link href="/dashboard/investments" className="w-full">
              <Button className="w-full h-auto py-7 flex-col gap-3 bg-gradient-to-br from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 text-white shadow-lg shadow-green-700/20 rounded-2xl">
                <Briefcase className="w-8 h-8" />
                <span className="font-semibold text-lg">Make Investment</span>
              </Button>
            </Link>
            <Link href="/dashboard/wallet" className="w-full">
              <Button className="w-full h-auto py-7 flex-col gap-3 bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/20 rounded-2xl">
                <Wallet className="w-8 h-8" />
                <span className="font-semibold text-lg">Deposit Funds</span>
              </Button>
            </Link>
            <Link href="/dashboard/withdrawals" className="w-full">
              <Button className="w-full h-auto py-7 flex-col gap-3 bg-gradient-to-br from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 text-white shadow-lg shadow-green-700/20 rounded-2xl">
                <Users className="w-8 h-8" />
                <span className="font-semibold text-lg">Withdraw Funds</span>
              </Button>
            </Link>
            <Link href="/dashboard/investments" className="w-full">
              <Button className="w-full h-auto py-7 flex-col gap-3 bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/20 rounded-2xl">
                <Leaf className="w-8 h-8" />
                <span className="font-semibold text-lg">View Farm Projects</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 pt-2 pb-6">
        <p>All investments are subject to terms and conditions. Please read our investment agreement carefully.</p>
      </div>
    </div>
  );
}

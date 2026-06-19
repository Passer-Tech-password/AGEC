'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, ArrowDownToLine, ArrowUpFromLine, Users, Wallet, Briefcase, Clock, CheckCircle, Leaf } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data
const chartData = [
  { name: 'Jan', earnings: 40000 },
  { name: 'Feb', earnings: 30000 },
  { name: 'Mar', earnings: 50000 },
  { name: 'Apr', earnings: 45000 },
  { name: 'May', earnings: 60000 },
  { name: 'Jun', earnings: 70000 },
];

const recentInvestments = [
  { id: 1, plan: 'Poultry Farm Investment', amount: 50000, date: '2024-05-15', status: 'Active', roi: 24, nextPayout: '2024-06-01' },
  { id: 2, plan: 'Rice Farm Investment', amount: 100000, date: '2024-04-20', status: 'Active', roi: 30, nextPayout: '2024-06-03' },
  { id: 3, plan: 'Fish Farm Investment', amount: 75000, date: '2024-03-10', status: 'Active', roi: 28, nextPayout: '2024-06-05' },
  { id: 4, plan: 'Greenhouse Vegetables', amount: 125000, date: '2024-02-28', status: 'Active', roi: 32, nextPayout: '2024-06-07' },
];

const recentTransactions = [
  { id: 1, type: 'Withdrawal', amount: -15000, date: '2024-05-20', status: 'Completed' },
  { id: 2, type: 'Investment', amount: -50000, date: '2024-05-15', status: 'Completed' },
  { id: 3, type: 'Referral Bonus', amount: 2500, date: '2024-05-14', status: 'Completed' },
  { id: 4, type: 'Payout', amount: 7500, date: '2024-05-05', status: 'Completed' },
  { id: 5, type: 'Deposit', amount: 100000, date: '2024-05-01', status: 'Completed' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, John!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your investments.</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-green-700 hover:bg-green-800 text-white">
            <Briefcase className="w-4 h-4 mr-2" />
            Make Investment
          </Button>
          <Button variant="secondary">
            <Wallet className="w-4 h-4 mr-2" />
            Deposit Funds
          </Button>
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
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(350000)}</div>
            <p className="text-sm text-green-600 mt-1 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              Active
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
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(120000)}</div>
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
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(45000)}</div>
            <Button variant="secondary" className="mt-2 w-full h-8 text-xs">
              Withdraw
            </Button>
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
            <p className="text-sm text-emerald-600 mt-1">View Referrals</p>
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
            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Next Withdrawal Date</p>
                  <p className="font-semibold text-gray-900">May 30, 2024</p>
                </div>
              </div>
              <div className="border-t border-green-100 pt-3">
                <p className="text-sm text-gray-600">Amount</p>
                <p className="text-2xl font-bold text-green-800">{formatCurrency(7500)}</p>
              </div>
            </div>
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
            <Button variant="ghost" className="h-8 text-sm text-green-700">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInvestments.map((investment) => (
                <div key={investment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-green-700" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{investment.plan}</p>
                      <p className="text-sm text-gray-500">{new Date(investment.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(investment.amount)}</p>
                    <p className="text-sm text-green-600 flex items-center justify-end">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {investment.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Button variant="ghost" className="h-8 text-sm text-green-700">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      transaction.amount > 0 
                        ? 'bg-green-100 text-green-700' 
                        : transaction.type === 'Withdrawal'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                    }`}>
                      {transaction.amount > 0 ? (
                        <ArrowDownToLine className="w-5 h-5" />
                      ) : (
                        <ArrowUpFromLine className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.type}</p>
                      <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${transaction.amount > 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                    </p>
                    <p className="text-sm text-gray-500">{transaction.status}</p>
                  </div>
                </div>
              ))}
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
            <Button className="h-auto py-6 flex-col gap-2 bg-green-700 hover:bg-green-800 text-white">
              <Briefcase className="w-6 h-6" />
              <span>Make Investment</span>
            </Button>
            <Button className="h-auto py-6 flex-col gap-2 bg-amber-600 hover:bg-amber-700 text-white">
              <Wallet className="w-6 h-6" />
              <span>Deposit Funds</span>
            </Button>
            <Button className="h-auto py-6 flex-col gap-2 bg-green-700 hover:bg-green-800 text-white">
              <ArrowUpFromLine className="w-6 h-6" />
              <span>Withdraw Funds</span>
            </Button>
            <Button className="h-auto py-6 flex-col gap-2 bg-amber-600 hover:bg-amber-700 text-white">
              <Leaf className="w-6 h-6" />
              <span>View Farm Projects</span>
            </Button>
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

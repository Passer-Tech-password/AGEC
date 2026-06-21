'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { Users, Briefcase, ArrowUpRight, ArrowDownToLine, TrendingUp, BarChart3, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Sample data
const revenueData = [
  { month: 'Jan', revenue: 1500000, investments: 1200000 },
  { month: 'Feb', revenue: 1800000, investments: 1500000 },
  { month: 'Mar', revenue: 2200000, investments: 1800000 },
  { month: 'Apr', revenue: 2500000, investments: 2100000 },
  { month: 'May', revenue: 2800000, investments: 2400000 },
  { month: 'Jun', revenue: 3200000, investments: 2700000 },
];

const userGrowthData = [
  { month: 'Jan', users: 250 },
  { month: 'Feb', users: 380 },
  { month: 'Mar', users: 490 },
  { month: 'Apr', users: 620 },
  { month: 'May', users: 780 },
  { month: 'Jun', users: 950 },
];

const recentUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+234 801 234 5678', joined: '2024-05-25', status: 'Active', invested: 150000 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+234 802 345 6789', joined: '2024-05-24', status: 'Active', invested: 75000 },
  { id: 3, name: 'Michael Brown', email: 'michael@example.com', phone: '+234 803 456 7890', joined: '2024-05-23', status: 'Pending KYC', invested: 0 },
  { id: 4, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+234 804 567 8901', joined: '2024-05-22', status: 'Active', invested: 250000 },
  { id: 5, name: 'David Wilson', email: 'david@example.com', phone: '+234 805 678 9012', joined: '2024-05-21', status: 'Active', invested: 100000 },
];

const pendingWithdrawals = [
  { id: 1, user: 'John Doe', amount: 25000, date: '2024-05-26', bank: 'First Bank', status: 'Pending' },
  { id: 2, user: 'Jane Smith', amount: 15000, date: '2024-05-26', bank: 'GTBank', status: 'Pending' },
  { id: 3, user: 'Sarah Johnson', amount: 50000, date: '2024-05-25', bank: 'Access Bank', status: 'Pending' },
];

const pendingKYC = [
  { id: 1, user: 'Michael Brown', submitted: '2024-05-25', type: 'National ID', status: 'Pending' },
  { id: 2, user: 'Emily Davis', submitted: '2024-05-24', type: "Driver's License", status: 'Pending' },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of AGEC platform performance and activities.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">950</div>
            <p className="text-sm text-green-600 mt-1 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12% this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Investments</CardTitle>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-green-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(125000000)}</div>
            <p className="text-sm text-green-600 mt-1 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              +18% this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Withdrawals</CardTitle>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6 text-amber-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(28500000)}</div>
            <p className="text-sm text-amber-600 mt-1">785 withdrawals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(15000000)}</div>
            <p className="text-sm text-green-600 mt-1 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              +22% this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Investments</CardTitle>
            <CardDescription>Monthly comparison of revenue and investments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value: any) => `₦${value/1000000}M`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    formatter={(value: any) => formatCurrency(value)}
                  />
                  <Bar dataKey="revenue" fill="#16a34a" name="Revenue" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="investments" fill="#059669" name="Investments" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New user registrations per month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>Latest registered users on the platform</CardDescription>
            </div>
            <Button variant="ghost" className="h-8 text-sm text-blue-700">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Joined</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500 text-sm">Invested</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-gray-500 text-sm">{user.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{new Date(user.joined).toLocaleDateString()}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'Active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {user.status === 'Active' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-gray-900">
                        {formatCurrency(user.invested)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pending Actions */}
        <div className="space-y-6">
          {/* Pending Withdrawals */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                Pending Withdrawals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingWithdrawals.map((withdrawal) => (
                <div key={withdrawal.id} className="p-3 bg-amber-50 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{withdrawal.user}</p>
                    <p className="text-sm text-gray-500">{new Date(withdrawal.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(withdrawal.amount)}</p>
                    <Button className="h-7 text-xs mt-1 bg-green-700 hover:bg-green-800 text-white px-3">
                      Process
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="secondary" className="w-full h-8 text-sm">
                View All Requests
              </Button>
            </CardContent>
          </Card>

          {/* Pending KYC */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                Pending KYC
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingKYC.map((kyc) => (
                <div key={kyc.id} className="p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{kyc.user}</p>
                    <p className="text-sm text-gray-500">{kyc.type}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button className="h-7 text-xs bg-green-700 hover:bg-green-800 text-white px-3">
                      Approve
                    </Button>
                    <Button className="h-7 text-xs bg-red-600 hover:bg-red-700 text-white px-3">
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="secondary" className="w-full h-8 text-sm">
                View All KYC
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

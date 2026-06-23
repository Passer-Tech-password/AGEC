'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { Users, Briefcase, TrendingUp, BarChart3, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getDashboardStats, getAllUsers, getAllInvestments, getAllWithdrawals, getAllKYCs } from '@/lib/firebaseServices';
import { UserData, UserInvestment, WithdrawalRequest, KYCSubmission } from '@/lib/firebaseServices';

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{ totalUsers: number; totalInvested: number; totalWithdrawn: number; totalEarnings: number; pendingWithdrawals: number; pendingDeposits: number; pendingKYCs: number; } | null>(null);
  const [recentUsers, setRecentUsers] = useState<UserData[]>([]);
  const [recentInvestments, setRecentInvestments] = useState<UserInvestment[]>([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [pendingKYCs, setPendingKYCs] = useState<KYCSubmission[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardStats, users, investments, withdrawals, kycs] = await Promise.all([
          getDashboardStats(),
          getAllUsers(),
          getAllInvestments(),
          getAllWithdrawals(),
          getAllKYCs()
        ]);
        setStats(dashboardStats);
        setRecentUsers(users.slice(0, 5));
        setRecentInvestments(investments.slice(0, 5));
        setPendingWithdrawals(withdrawals.filter(w => w.status === "pending").slice(0, 5));
        setPendingKYCs(kycs.filter(k => k.status === "pending").slice(0, 5));
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

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
            <div className="text-3xl font-bold text-gray-900">{stats?.totalUsers || 0}</div>
            <p className="text-sm text-green-600 mt-1 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              Growing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Invested</CardTitle>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-green-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(stats?.totalInvested || 0)}</div>
            <p className="text-sm text-green-600 mt-1 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              Growing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Withdrawn</CardTitle>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-amber-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(stats?.totalWithdrawn || 0)}</div>
            <p className="text-sm text-amber-600 mt-1">{stats?.pendingWithdrawals || 0} pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Earnings</CardTitle>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(stats?.totalEarnings || 0)}</div>
            <p className="text-sm text-green-600 mt-1 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              Growing
            </p>
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
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500 text-sm">Invested</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr key={user.uid} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <p className="font-medium text-gray-900">{user.fullName}</p>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{user.email}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.kycVerified
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {user.kycVerified ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {user.kycVerified ? 'Verified' : 'Pending KYC'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-gray-900">
                        {formatCurrency(user.totalInvested)}
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
              {pendingWithdrawals.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No pending withdrawals</p>
              ) : (
                pendingWithdrawals.map((withdrawal) => (
                  <div key={withdrawal.id} className="p-3 bg-amber-50 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">User ID: {withdrawal.userId.slice(0, 8)}...</p>
                      <p className="text-sm text-gray-500">{new Date(withdrawal.createdAt.toDate()).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(withdrawal.amount)}</p>
                    </div>
                  </div>
                ))
              )}
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
              {pendingKYCs.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No pending KYC</p>
              ) : (
                pendingKYCs.map((kyc) => (
                  <div key={kyc.id} className="p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">User ID: {kyc.userId.slice(0, 8)}...</p>
                      <p className="text-sm text-gray-500">{kyc.idType.toUpperCase()}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

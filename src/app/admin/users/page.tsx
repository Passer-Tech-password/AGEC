'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle, Clock, Edit } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAllUsers } from '@/lib/firebaseServices';
import { UserData } from '@/lib/firebaseServices';

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserData[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-1">Manage all platform users.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>List of all registered users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Full Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Phone</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">KYC Status</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500 text-sm">Wallet Balance</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500 text-sm">Invested</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-gray-500 py-8">No users found</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.uid} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <p className="font-medium text-gray-900">{user.fullName}</p>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{user.email}</td>
                      <td className="py-4 px-4 text-gray-600">{user.phoneNumber || 'N/A'}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.kycVerified
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {user.kycVerified ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {user.kycVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-gray-900">{formatCurrency(user.walletBalance)}</td>
                      <td className="py-4 px-4 text-right font-semibold text-gray-900">{formatCurrency(user.totalInvested)}</td>
                      <td className="py-4 px-4">
                        <div className="flex justify-end">
                          <Button variant="secondary" className="h-8 text-xs">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

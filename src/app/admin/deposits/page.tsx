'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAllDeposits, getAllUsers, updateDepositStatus } from '@/lib/firebaseServices';
import { DepositRequest, UserData } from '@/lib/firebaseServices';

export default function AdminDepositsPage() {
  const [loading, setLoading] = useState(true);
  const [deposits, setDeposits] = useState<DepositRequest[]>([]);
  const [users, setUsers] = useState<Record<string, UserData>>({});
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [depositsData, usersData] = await Promise.all([
          getAllDeposits(),
          getAllUsers()
        ]);
        const usersMap: Record<string, UserData> = {};
        usersData.forEach(u => { usersMap[u.uid] = u; });
        setUsers(usersMap);
        setDeposits(depositsData);
      } catch (err) {
        console.error('Error fetching deposits:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected' | 'completed') => {
    setProcessing(id);
    try {
      await updateDepositStatus(id, status);
      // Refresh the list
      const updatedDeposits = await getAllDeposits();
      setDeposits(updatedDeposits);
    } catch (err) {
      console.error('Error updating deposit status:', err);
      alert('Failed to update status');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deposit Management</h1>
          <p className="text-gray-600 mt-1">View and manage user deposit requests</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Deposits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Method</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {deposits.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-gray-500 py-8">No deposits found</td>
                  </tr>
                ) : (
                  deposits.map((deposit) => (
                    <tr key={deposit.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <span className="font-medium text-gray-900">{deposit.id?.slice(0, 8)}...</span>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{users[deposit.userId]?.fullName || deposit.userId.slice(0, 8) + '...'}</p>
                          <p className="text-sm text-gray-500">{users[deposit.userId]?.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-900">{formatCurrency(deposit.amount)}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-600">{deposit.paymentMethod}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {deposit.status === 'completed' && (
                            <span className="flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                              <CheckCircle className="w-4 h-4" />
                              Completed
                            </span>
                          )}
                          {deposit.status === 'pending' && (
                            <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                              <Clock className="w-4 h-4" />
                              Pending
                            </span>
                          )}
                          {deposit.status === 'rejected' && (
                            <span className="flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                              <XCircle className="w-4 h-4" />
                              Rejected
                            </span>
                          )}
                          {deposit.status === 'approved' && (
                            <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                              <CheckCircle className="w-4 h-4" />
                              Approved
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-500 text-sm">{new Date(deposit.createdAt.toDate()).toLocaleDateString()}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          {deposit.status === 'pending' && (
                            <>
                              <Button
                                className="h-8 text-xs bg-green-700 hover:bg-green-800"
                                onClick={() => handleStatusChange(deposit.id!, 'approved')}
                                disabled={processing === deposit.id}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                className="h-8 text-xs bg-red-600 hover:bg-red-700"
                                onClick={() => handleStatusChange(deposit.id!, 'rejected')}
                                disabled={processing === deposit.id}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          {deposit.status === 'approved' && (
                            <Button
                              className="h-8 text-xs bg-blue-600 hover:bg-blue-700"
                              onClick={() => handleStatusChange(deposit.id!, 'completed')}
                              disabled={processing === deposit.id}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Mark Completed
                            </Button>
                          )}
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

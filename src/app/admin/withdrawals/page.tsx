'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAllWithdrawals, getAllUsers, updateWithdrawalStatus } from '@/lib/firebaseServices';
import { WithdrawalRequest, UserData } from '@/lib/firebaseServices';

export default function AdminWithdrawalsPage() {
  const [loading, setLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [users, setUsers] = useState<Record<string, UserData>>({});
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [withdrawalsData, usersData] = await Promise.all([
          getAllWithdrawals(),
          getAllUsers()
        ]);
        const usersMap: Record<string, UserData> = {};
        usersData.forEach(u => { usersMap[u.uid] = u; });
        setUsers(usersMap);
        setWithdrawals(withdrawalsData);
      } catch (err) {
        console.error('Error fetching withdrawals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected' | 'paid') => {
    setProcessing(id);
    try {
      await updateWithdrawalStatus(id, status);
      // Refresh the list
      const updatedWithdrawals = await getAllWithdrawals();
      setWithdrawals(updatedWithdrawals);
    } catch (err) {
      console.error('Error updating withdrawal status:', err);
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Withdrawal Requests</h1>
        <p className="text-gray-600 mt-1">Process withdrawal requests.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Pending Withdrawals</CardTitle>
          <CardDescription>Withdrawals awaiting approval</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Bank</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Account No</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Account Name</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500 text-sm">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center text-gray-500 py-8">No withdrawal requests</td>
                  </tr>
                ) : (
                  withdrawals.map((withdrawal) => (
                    <tr key={withdrawal.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <p className="font-medium text-gray-900">{users[withdrawal.userId]?.fullName || withdrawal.userId.slice(0, 8) + '...'}</p>
                        <p className="text-sm text-gray-500">{users[withdrawal.userId]?.email}</p>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{withdrawal.bankName}</td>
                      <td className="py-4 px-4 text-gray-600">{withdrawal.accountNumber}</td>
                      <td className="py-4 px-4 text-gray-600">{withdrawal.accountName}</td>
                      <td className="py-4 px-4 text-right font-semibold text-gray-900">{formatCurrency(withdrawal.amount)}</td>
                      <td className="py-4 px-4 text-gray-600">{new Date(withdrawal.createdAt.toDate()).toLocaleDateString()}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          withdrawal.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          withdrawal.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                          withdrawal.status === 'paid' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {withdrawal.status === 'pending' ? <Clock className="w-3 h-3" /> :
                           withdrawal.status === 'approved' || withdrawal.status === 'paid' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-end gap-2">
                          {withdrawal.status === 'pending' && (
                            <>
                              <Button
                                className="h-8 text-xs bg-green-700 hover:bg-green-800"
                                onClick={() => handleStatusChange(withdrawal.id!, 'approved')}
                                disabled={processing === withdrawal.id}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                className="h-8 text-xs bg-red-600 hover:bg-red-700"
                                onClick={() => handleStatusChange(withdrawal.id!, 'rejected')}
                                disabled={processing === withdrawal.id}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          {withdrawal.status === 'approved' && (
                            <Button
                              className="h-8 text-xs bg-blue-600 hover:bg-blue-700"
                              onClick={() => handleStatusChange(withdrawal.id!, 'paid')}
                              disabled={processing === withdrawal.id}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Mark Paid
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

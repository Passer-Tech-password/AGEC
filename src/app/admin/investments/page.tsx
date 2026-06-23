'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAllInvestments, getAllUsers } from '@/lib/firebaseServices';
import { UserInvestment, UserData } from '@/lib/firebaseServices';

export default function AdminInvestmentsPage() {
  const [loading, setLoading] = useState(true);
  const [investments, setInvestments] = useState<UserInvestment[]>([]);
  const [users, setUsers] = useState<Record<string, UserData>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [investmentsData, usersData] = await Promise.all([
          getAllInvestments(),
          getAllUsers()
        ]);
        const usersMap: Record<string, UserData> = {};
        usersData.forEach(u => { usersMap[u.uid] = u; });
        setUsers(usersMap);
        setInvestments(investmentsData);
      } catch (err) {
        console.error('Error fetching investments:', err);
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Investment Management</h1>
        <p className="text-gray-600 mt-1">Manage all investments on the platform.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Investments</CardTitle>
          <CardDescription>List of all investments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Plan</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">User</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500 text-sm">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Start Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Maturity Date</th>
                </tr>
              </thead>
              <tbody>
                {investments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-500 py-8">No investments found</td>
                  </tr>
                ) : (
                  investments.map((investment) => (
                    <tr key={investment.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <p className="font-medium text-gray-900">{investment.planName}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-600">{users[investment.userId]?.fullName || investment.userId.slice(0, 8) + '...'}</p>
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-gray-900">
                        {formatCurrency(investment.amount)}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          investment.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : investment.status === 'matured'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {investment.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {investment.startDate.toDate().toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {investment.maturityDate.toDate().toLocaleDateString()}
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

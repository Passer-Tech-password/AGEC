import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, ArrowDownToLine } from 'lucide-react';

// Sample deposit data
const deposits = [
  { id: 'D001', userId: 'U001', userName: 'John Investor', email: 'john@example.com', amount: 500000, method: 'Bank Transfer', status: 'completed', date: '2024-06-15 10:30 AM' },
  { id: 'D002', userId: 'U002', userName: 'Sarah Ngozi', email: 'sarah@example.com', amount: 250000, method: 'Flutterwave', status: 'pending', date: '2024-06-15 09:15 AM' },
  { id: 'D003', userId: 'U003', userName: 'Michael Chukwu', email: 'michael@example.com', amount: 1000000, method: 'Paystack', status: 'completed', date: '2024-06-14 03:45 PM' },
  { id: 'D004', userId: 'U004', userName: 'Blessing Okafor', email: 'blessing@example.com', amount: 150000, method: 'Bank Transfer', status: 'failed', date: '2024-06-14 11:20 AM' },
  { id: 'D005', userId: 'U005', userName: 'Daniel Kalu', email: 'daniel@example.com', amount: 750000, method: 'Paystack', status: 'completed', date: '2024-06-13 02:10 PM' },
];

const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;

export default function AdminDepositsPage() {
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
          <div className="flex gap-2">
            <select className="px-3 py-1 border border-gray-200 rounded-lg text-sm">
              <option>All Status</option>
              <option>Pending</option>
              <option>Completed</option>
              <option>Failed</option>
            </select>
          </div>
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
                {deposits.map((deposit) => (
                  <tr key={deposit.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">{deposit.id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{deposit.userName}</p>
                        <p className="text-sm text-gray-500">{deposit.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-gray-900">{formatCurrency(deposit.amount)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-600">{deposit.method}</span>
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
                        {deposit.status === 'failed' && (
                          <span className="flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                            <XCircle className="w-4 h-4" />
                            Failed
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-500 text-sm">{deposit.date}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        {deposit.status === 'pending' && (
                          <>
                            <Button className="h-8 text-sm bg-green-700 hover:bg-green-800">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button className="h-8 text-sm bg-red-600 hover:bg-red-700">
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

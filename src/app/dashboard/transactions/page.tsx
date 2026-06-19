'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle, ArrowUpFromLine, ArrowDownToLine } from 'lucide-react';

const transactions = [
  { id: 1, type: 'Deposit', amount: 100000, date: '2024-05-20', status: 'Completed', method: 'Bank Transfer' },
  { id: 2, type: 'Withdrawal', amount: -15000, date: '2024-05-18', status: 'Completed', method: 'Bank Transfer' },
  { id: 3, type: 'Payout', amount: 7500, date: '2024-05-15', status: 'Completed', method: 'Automatic' },
  { id: 4, type: 'Investment', amount: -50000, date: '2024-05-10', status: 'Completed', method: 'Wallet' },
  { id: 5, type: 'Referral Bonus', amount: 2500, date: '2024-05-05', status: 'Completed', method: 'Automatic' },
];

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
        <p className="text-gray-600 mt-1">View all your wallet transactions.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>Complete history of your financial activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Method</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500 text-sm">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.amount > 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-900">{new Date(transaction.date).toLocaleDateString()}</td>
                    <td className="py-4 px-4 text-gray-600">{transaction.method}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 text-green-700 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        {transaction.status}
                      </span>
                    </td>
                    <td className={`py-4 px-4 text-right font-semibold ${transaction.amount > 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
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

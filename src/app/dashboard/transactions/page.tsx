'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle, ArrowUpFromLine, ArrowDownToLine } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserTransactions, Transaction } from '@/lib/firebaseServices';

export default function TransactionsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getUserTransactions(user.uid).then(t => {
        setTransactions(t);
        setLoading(false);
      }).catch(err => {
        console.error("Error fetching transactions:", err);
        setLoading(false);
      });
    }
  }, [user]);

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
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500 text-sm">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-500 py-8">No transactions yet</td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
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
                      <td className="py-4 px-4 text-gray-900">
                        {transaction.createdAt.toDate().toLocaleDateString()}
                      </td>
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

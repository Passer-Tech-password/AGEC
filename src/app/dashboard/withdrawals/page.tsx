'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';
import { ArrowUpFromLine, BanknoteIcon, CheckCircle, Clock } from 'lucide-react';
import { useState } from 'react';

const withdrawalHistory = [
  { id: 1, amount: 15000, date: '2024-05-20', status: 'Completed', bank: 'First Bank' },
  { id: 2, amount: 10000, date: '2024-04-20', status: 'Completed', bank: 'GTBank' },
  { id: 3, amount: 25000, date: '2024-03-15', status: 'Completed', bank: 'First Bank' },
];

export default function WithdrawalsPage() {
  const [amount, setAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Withdrawals</h1>
        <p className="text-gray-600 mt-1">Withdraw funds from your wallet to your bank account.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Withdrawal Form */}
        <Card>
          <CardHeader>
            <CardTitle>New Withdrawal</CardTitle>
            <CardDescription>Withdraw funds to your bank account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600">Available Balance</p>
              <p className="text-3xl font-bold text-green-800">{formatCurrency(45000)}</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount (₦)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">Minimum withdrawal: ₦5,000</p>
              </div>
              <div>
                <Label htmlFor="bank">Select Bank Account</Label>
                <select
                  id="bank"
                  className="w-full mt-2 border border-gray-200 rounded-lg px-4 py-2"
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                >
                  <option value="">Select a bank account</option>
                  <option value="first-bank">First Bank - 3012345678</option>
                  <option value="gtbank">GTBank - 0587654321</option>
                </select>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> Withdrawals are processed within 24 hours. Bi-weekly payouts are automatic.
                </p>
              </div>
              <Button className="w-full bg-green-700 hover:bg-green-800 text-white">
                <ArrowUpFromLine className="w-4 h-4 mr-2" />
                Request Withdrawal
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Withdrawal History */}
        <Card>
          <CardHeader>
            <CardTitle>Withdrawal History</CardTitle>
            <CardDescription>Your past withdrawal requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {withdrawalHistory.map((withdrawal) => (
                <div key={withdrawal.id} className="p-4 border border-gray-200 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{formatCurrency(withdrawal.amount)}</p>
                    <p className="text-sm text-gray-500">{withdrawal.bank} • {new Date(withdrawal.date).toLocaleDateString()}</p>
                  </div>
                  <span className="flex items-center gap-1 px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    {withdrawal.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

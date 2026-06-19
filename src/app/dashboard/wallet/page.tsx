'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';
import { Wallet, Plus, ArrowUpFromLine, ArrowDownToLine, CreditCard, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';

// Sample transaction history
const transactions = [
  { id: 1, type: 'Deposit', amount: 100000, date: '2024-05-20', status: 'Completed', method: 'Bank Transfer' },
  { id: 2, type: 'Withdrawal', amount: -15000, date: '2024-05-18', status: 'Completed', method: 'Bank Transfer' },
  { id: 3, type: 'Payout', amount: 7500, date: '2024-05-15', status: 'Completed', method: 'Automatic' },
  { id: 4, type: 'Investment', amount: -50000, date: '2024-05-10', status: 'Completed', method: 'Wallet' },
  { id: 5, type: 'Referral Bonus', amount: 2500, date: '2024-05-05', status: 'Completed', method: 'Automatic' },
  { id: 6, type: 'Deposit', amount: 75000, date: '2024-04-28', status: 'Completed', method: 'Bank Transfer' },
  { id: 7, type: 'Withdrawal', amount: -10000, date: '2024-04-20', status: 'Completed', method: 'Bank Transfer' },
  { id: 8, type: 'Payout', amount: 5000, date: '2024-04-15', status: 'Completed', method: 'Automatic' },
];

const bankAccounts = [
  { id: 1, bankName: 'First Bank', accountName: 'John Investor', accountNumber: '3012345678', status: 'Verified' },
  { id: 2, bankName: 'GTBank', accountName: 'John Investor', accountNumber: '0587654321', status: 'Verified' },
];

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState<'transactions' | 'bank-accounts'>('transactions');
  const [copied, setCopied] = useState(false);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('2012345678');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>
        <p className="text-gray-600 mt-1">Manage your funds, deposits, and withdrawals.</p>
      </div>

      {/* Wallet Balance Card */}
      <Card className="bg-gradient-to-br from-green-700 to-green-900 text-white">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-green-200 mb-2">Available Balance</p>
              <p className="text-5xl font-bold mb-2">{formatCurrency(45000)}</p>
              <p className="text-green-200 text-sm">Updated just now</p>
            </div>
            <div className="flex gap-4">
              <Button className="bg-white text-green-800 hover:bg-green-50">
                <ArrowDownToLine className="w-4 h-4 mr-2" />
                Deposit
              </Button>
              <Button className="bg-green-600 hover:bg-green-500 text-white border border-green-500">
                <ArrowUpFromLine className="w-4 h-4 mr-2" />
                Withdraw
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <ArrowDownToLine className="w-4 h-4 text-green-600" />
              Total Deposits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(500000)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <ArrowUpFromLine className="w-4 h-4 text-red-600" />
              Total Withdrawals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(75000)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-600" />
              Total Payouts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(120000)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`py-4 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'transactions'
                ? 'border-green-700 text-green-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Transactions
          </button>
          <button
            onClick={() => setActiveTab('bank-accounts')}
            className={`py-4 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'bank-accounts'
                ? 'border-green-700 text-green-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Bank Accounts
          </button>
        </nav>
      </div>

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View all your wallet transactions</CardDescription>
            </div>
            <div className="flex gap-2">
              <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
                <option>All Types</option>
                <option>Deposits</option>
                <option>Withdrawals</option>
                <option>Payouts</option>
                <option>Investments</option>
              </select>
              <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
                <option>Last 30 Days</option>
                <option>Last 7 Days</option>
                <option>This Month</option>
                <option>Last Month</option>
              </select>
            </div>
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
                          transaction.type === 'Deposit' || transaction.type === 'Payout' || transaction.type === 'Referral Bonus'
                            ? 'bg-green-100 text-green-700'
                            : transaction.type === 'Withdrawal' || transaction.type === 'Investment'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
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
      )}

      {/* Bank Accounts Tab */}
      {activeTab === 'bank-accounts' && (
        <div className="space-y-6">
          {/* Deposit Account Info */}
          <Card>
            <CardHeader>
              <CardTitle>Deposit Account</CardTitle>
              <CardDescription>Transfer funds to this account to fund your wallet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Bank Name</p>
                    <p className="text-lg font-semibold text-gray-900">AGEC Trust Bank</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Account Name</p>
                    <p className="text-lg font-semibold text-gray-900">AGRO ELITE COMMUNITY</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Account Number</p>
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-semibold text-gray-900">2012345678</p>
                      <button
                        onClick={handleCopyAccount}
                        className="flex items-center gap-1 px-3 py-1 bg-white rounded-lg border border-green-300 text-green-700 text-sm hover:bg-green-50"
                      >
                        {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Reference</p>
                    <p className="text-lg font-semibold text-gray-900">Your Full Name</p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-white rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    <strong>Important:</strong> Always include your full name as payment reference. 
                    Your wallet will be credited automatically within 15 minutes after confirmation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Saved Bank Accounts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Saved Bank Accounts</CardTitle>
                <CardDescription>Your verified bank accounts for withdrawals</CardDescription>
              </div>
              <Button className="bg-green-700 hover:bg-green-800 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Account
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bankAccounts.map((account) => (
                  <div key={account.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-green-700" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{account.bankName}</p>
                        <p className="text-gray-600">{account.accountName} • {account.accountNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {account.status}
                      </span>
                      <Button variant="ghost" className="h-8">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

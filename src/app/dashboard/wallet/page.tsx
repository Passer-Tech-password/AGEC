'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';
import { Wallet as WalletIcon, Plus, ArrowUpFromLine, ArrowDownToLine, CreditCard, Copy, CheckCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserTransactions, getUserDeposits, requestDeposit, getUserWithdrawals, Transaction, DepositRequest, WithdrawalRequest } from '@/lib/firebaseServices';

export default function WalletPage() {
  const { user, userData, refreshUserData } = useAuth();
  const [activeTab, setActiveTab] = useState<'transactions' | 'bank-accounts'>('transactions');
  const [copied, setCopied] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [deposits, setDeposits] = useState<DepositRequest[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Deposit form state
  const [depositAmount, setDepositAmount] = useState('');
  const [depositPaymentMethod, setDepositPaymentMethod] = useState('Bank Transfer');
  const [depositProofUrl, setDepositProofUrl] = useState('');
  const [depositLoading, setDepositLoading] = useState(false);

  // Withdraw form state
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawBankName, setWithdrawBankName] = useState('');
  const [withdrawAccountNumber, setWithdrawAccountNumber] = useState('');
  const [withdrawAccountName, setWithdrawAccountName] = useState('');
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  useEffect(() => {
    if (user) {
      Promise.all([
        getUserTransactions(user.uid),
        getUserDeposits(user.uid),
        getUserWithdrawals(user.uid)
      ]).then(([tx, dep, wit]) => {
        setTransactions(tx);
        setDeposits(dep);
        setWithdrawals(wit);
        setLoading(false);
      }).catch(err => {
        console.error("Error fetching wallet data:", err);
        setLoading(false);
      });
    }
  }, [user]);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('2012345678');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeposit = async () => {
    if (!user || !depositAmount) return;
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) return;

    setDepositLoading(true);
    try {
      await requestDeposit(user.uid, amount, depositPaymentMethod, depositProofUrl);
      await refreshUserData();
      // Refresh deposits list
      const newDeposits = await getUserDeposits(user.uid);
      setDeposits(newDeposits);
      setShowDepositModal(false);
      setDepositAmount('');
      setDepositProofUrl('');
      alert('Deposit request submitted successfully!');
    } catch (err) {
      console.error("Error requesting deposit:", err);
      alert('Failed to submit deposit request. Please try again.');
    } finally {
      setDepositLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!user || !withdrawAmount || !withdrawBankName || !withdrawAccountNumber || !withdrawAccountName) return;
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) return;
    if (userData && amount > userData.walletBalance) {
      alert('Insufficient balance');
      return;
    }

    setWithdrawLoading(true);
    try {
      // We'll use requestWithdrawal from firebaseServices
      // First, let's import that (we already did)
      const { requestWithdrawal } = await import('@/lib/firebaseServices');
      await requestWithdrawal(user.uid, amount, withdrawBankName, withdrawAccountNumber, withdrawAccountName);
      await refreshUserData();
      // Refresh withdrawals list
      const newWithdrawals = await getUserWithdrawals(user.uid);
      setWithdrawals(newWithdrawals);
      // Also refresh transactions
      const newTransactions = await getUserTransactions(user.uid);
      setTransactions(newTransactions);
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      setWithdrawBankName('');
      setWithdrawAccountNumber('');
      setWithdrawAccountName('');
      alert('Withdrawal request submitted successfully!');
    } catch (err) {
      console.error("Error requesting withdrawal:", err);
      alert('Failed to submit withdrawal request. Please try again.');
    } finally {
      setWithdrawLoading(false);
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
              <p className="text-5xl font-bold mb-2">{formatCurrency(userData?.walletBalance || 0)}</p>
              <p className="text-green-200 text-sm">Updated just now</p>
            </div>
            <div className="flex gap-4">
              <Button onClick={() => setShowDepositModal(true)} className="bg-white text-green-800 hover:bg-green-50">
                <ArrowDownToLine className="w-4 h-4 mr-2" />
                Deposit
              </Button>
              <Button onClick={() => setShowWithdrawModal(true)} className="bg-green-600 hover:bg-green-500 text-white border border-green-500">
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
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(deposits.filter(d => d.status === 'completed' || d.status === 'approved').reduce((sum, d) => sum + d.amount, 0))}
            </div>
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
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(userData?.totalWithdrawn || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-600" />
              Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(userData?.totalEarnings || 0)}
            </div>
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
                    <p className="text-lg font-semibold text-gray-900">{user?.displayName || user?.email?.split('@')[0] || 'Your Name'}</p>
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
        </div>
      )}

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Deposit Funds</CardTitle>
                <CardDescription>Enter deposit details</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowDepositModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="deposit-amount">Amount (₦)</Label>
                <Input
                  id="deposit-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="deposit-proof">Proof of Payment (URL, optional)</Label>
                <Input
                  id="deposit-proof"
                  type="text"
                  placeholder="https://example.com/proof.jpg"
                  value={depositProofUrl}
                  onChange={(e) => setDepositProofUrl(e.target.value)}
                  className="mt-2"
                />
              </div>
              <Button
                onClick={handleDeposit}
                className="w-full bg-green-700 hover:bg-green-800 text-white"
                disabled={depositLoading}
              >
                {depositLoading ? 'Submitting...' : 'Submit Deposit Request'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Withdraw Funds</CardTitle>
                <CardDescription>Enter withdrawal details</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowWithdrawModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="withdraw-amount">Amount (₦)</Label>
                <Input
                  id="withdraw-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Available: {formatCurrency(userData?.walletBalance || 0)}
                </p>
              </div>
              <div>
                <Label htmlFor="withdraw-bank">Bank Name</Label>
                <Input
                  id="withdraw-bank"
                  type="text"
                  placeholder="e.g., First Bank"
                  value={withdrawBankName}
                  onChange={(e) => setWithdrawBankName(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="withdraw-account-number">Account Number</Label>
                <Input
                  id="withdraw-account-number"
                  type="text"
                  placeholder="Enter account number"
                  value={withdrawAccountNumber}
                  onChange={(e) => setWithdrawAccountNumber(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="withdraw-account-name">Account Name</Label>
                <Input
                  id="withdraw-account-name"
                  type="text"
                  placeholder="Enter account name"
                  value={withdrawAccountName}
                  onChange={(e) => setWithdrawAccountName(e.target.value)}
                  className="mt-2"
                />
              </div>
              <Button
                onClick={handleWithdraw}
                className="w-full bg-green-700 hover:bg-green-800 text-white"
                disabled={withdrawLoading}
              >
                {withdrawLoading ? 'Submitting...' : 'Submit Withdrawal Request'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

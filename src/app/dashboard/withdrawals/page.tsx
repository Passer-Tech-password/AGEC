'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';
import { ArrowUpFromLine, BanknoteIcon, CheckCircle, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserWithdrawals, requestWithdrawal, WithdrawalRequest } from '@/lib/firebaseServices';

export default function WithdrawalsPage() {
  const { user, userData, refreshUserData } = useAuth();
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);

  useEffect(() => {
    if (user) {
      getUserWithdrawals(user.uid).then(w => {
        setWithdrawals(w);
        setLoading(false);
      }).catch(err => {
        console.error("Error fetching withdrawals:", err);
        setLoading(false);
      });
    }
  }, [user]);

  const handleRequestWithdrawal = async () => {
    if (!user || !amount || !bankName || !accountNumber || !accountName) return;
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return;
    if (userData && amt > userData.walletBalance) {
      alert('Insufficient balance');
      return;
    }

    setRequestLoading(true);
    try {
      await requestWithdrawal(user.uid, amt, bankName, accountNumber, accountName);
      await refreshUserData();
      const newWithdrawals = await getUserWithdrawals(user.uid);
      setWithdrawals(newWithdrawals);
      setAmount('');
      setBankName('');
      setAccountNumber('');
      setAccountName('');
      alert('Withdrawal request submitted successfully!');
    } catch (err) {
      console.error("Error requesting withdrawal:", err);
      alert('Failed to submit withdrawal request. Please try again.');
    } finally {
      setRequestLoading(false);
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
              <p className="text-3xl font-bold text-green-800">{formatCurrency(userData?.walletBalance || 0)}</p>
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
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  type="text"
                  placeholder="e.g., First Bank"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  type="text"
                  placeholder="Enter account number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="accountName">Account Name</Label>
                <Input
                  id="accountName"
                  type="text"
                  placeholder="Enter account name"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> Withdrawals are processed within 24 hours. Bi-weekly payouts are automatic.
                </p>
              </div>
              <Button
                className="w-full bg-green-700 hover:bg-green-800 text-white"
                onClick={handleRequestWithdrawal}
                disabled={requestLoading}
              >
                <ArrowUpFromLine className="w-4 h-4 mr-2" />
                {requestLoading ? 'Processing...' : 'Request Withdrawal'}
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
              {withdrawals.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No withdrawals yet</p>
              ) : (
                withdrawals.map((withdrawal) => (
                  <div key={withdrawal.id} className="p-4 border border-gray-200 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{formatCurrency(withdrawal.amount)}</p>
                      <p className="text-sm text-gray-500">{withdrawal.bankName} • {withdrawal.createdAt.toDate().toLocaleDateString()}</p>
                    </div>
                    <span className={`flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full ${
                      withdrawal.status === 'approved' || withdrawal.status === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : withdrawal.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {withdrawal.status === 'pending' ? <Clock className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                      {withdrawal.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

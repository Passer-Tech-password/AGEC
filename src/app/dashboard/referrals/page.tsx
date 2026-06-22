'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { Users, Copy, CheckCircle, Share2, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const referrals = [
  { id: 1, name: 'Jane Smith', email: 'jane@example.com', joined: '2024-05-10', status: 'Active', earned: 5000 },
  { id: 2, name: 'Michael Brown', email: 'michael@example.com', joined: '2024-04-25', status: 'Active', earned: 7500 },
  { id: 3, name: 'Sarah Johnson', email: 'sarah@example.com', joined: '2024-04-15', status: 'Invested', earned: 10000 },
];

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const { userData } = useAuth();

  const referralLink = userData?.referralCode 
    ? `https://agec.ng/ref/${userData.referralCode}` 
    : 'https://agec.ng';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      // Fallback: alert the user if copy fails
      alert('Could not copy automatically. Please manually copy the link.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Referral Program</h1>
        <p className="text-gray-600 mt-1">Invite friends and earn 5% on their investments!</p>
      </div>

      {/* Referral Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">15</div>
            <p className="text-sm text-green-600 mt-1 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              3 this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">{formatCurrency(32500)}</div>
            <p className="text-sm text-gray-500 mt-1">From referrals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">8</div>
            <p className="text-sm text-gray-500 mt-1">Investing users</p>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link */}
      <Card>
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
          <CardDescription>Share this link to invite friends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1 bg-gray-100 rounded-lg px-4 py-3 font-mono text-gray-700">
              {referralLink}
            </div>
            <Button onClick={handleCopy} className="bg-green-700 hover:bg-green-800 text-white">
              {copied ? <CheckCircle className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button variant="secondary">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Referral List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Referrals</CardTitle>
          <CardDescription>People who joined using your link</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {referrals.map((referral) => (
              <div key={referral.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{referral.name}</p>
                    <p className="text-sm text-gray-500">{referral.email} • Joined {new Date(referral.joined).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-700">+{formatCurrency(referral.earned)}</p>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    {referral.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

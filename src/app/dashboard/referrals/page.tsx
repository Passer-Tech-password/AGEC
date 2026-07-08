'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { 
  Users, 
  Copy, 
  CheckCircle, 
  Share2, 
  TrendingUp, 
  Gift, 
  Link, 
  Info, 
  Facebook,
  Twitter,
  Send,
  MoreHorizontal
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const referrals = [
  { id: 1, name: 'Emeka Daniel', email: 'emeka.daniel@example.com', joined: 'May 10, 2024', lastInvestment: '₦150,000.00', earned: 7500, status: 'Active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah.johnson@example.com', joined: 'May 8, 2024', lastInvestment: '₦200,000.00', earned: 10000, status: 'Active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' },
  { id: 3, name: 'Michael Okafur', email: 'michael.okafur@example.com', joined: 'May 12, 2024', lastInvestment: '₦0.00', earned: 0, status: 'Pending', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=100' },
  { id: 4, name: 'Peace Mbatoha', email: 'peace.mbatoha@example.com', joined: 'Apr 28, 2024', lastInvestment: '₦50,000.00', earned: 2500, status: 'Active', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100' },
  { id: 5, name: 'David Williams', email: 'david.williams@example.com', joined: 'Apr 20, 2024', lastInvestment: '₦100,000.00', earned: 5000, status: 'Active', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100' },
];

const leaderboard = [
  { id: 1, name: 'James Investor', earned: 250000, rank: 1, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100' },
  { id: 2, name: 'Mary Agro', earned: 180000, rank: 2, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100' },
  { id: 3, name: 'Alex Green', earned: 50000, rank: 3, avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=100' },
  { id: 4, name: 'John Investor (You)', earned: 20000, rank: 12, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', isYou: true },
];

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const { user, userData } = useAuth();

  const referralCode = user?.uid?.slice(0, 6).toUpperCase() || 'AGEC78';
  const referralLink = `https://agec.com/register?ref=AGEC-${referralCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('Could not copy automatically. Please manually copy the link.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Referrals</h1>
        <p className="text-gray-600 mt-1">Invite friends and earn exciting rewards. The more you refer, the more you earn!</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Referral Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Referrals</p>
                    <p className="text-3xl font-bold text-gray-900">24</p>
                    <p className="text-xs text-gray-400 mt-1">All time referrals</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-700" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-amber-600 mb-1">Active Referrals</p>
                    <p className="text-3xl font-bold text-amber-700">18</p>
                    <p className="text-xs text-amber-500 mt-1">Currently active</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-amber-700" />
                  </div>
                </div>
                <TrendingUp className="w-10 h-10 text-amber-200 absolute bottom-0 right-0" />
              </CardContent>
            </Card>

            <Card className="border-green-100 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-green-600 mb-1">Total Earnings</p>
                    <p className="text-3xl font-bold text-green-700">₦120,000.00</p>
                    <p className="text-xs text-green-500 mt-1">From referrals</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Gift className="w-6 h-6 text-green-700" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-100 bg-gradient-to-br from-purple-50 to-violet-50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-purple-600 mb-1">Pending Earnings</p>
                    <p className="text-3xl font-bold text-purple-700">₦15,000.00</p>
                    <p className="text-xs text-purple-500 mt-1">Will be added after activation</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Gift className="w-6 h-6 text-purple-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Referral Link Card */}
          <Card className="border-green-100 bg-gradient-to-br from-green-50/50 to-white">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                <div className="lg:col-span-1 flex items-center gap-4">
                  <div className="w-32 h-24 bg-green-700 rounded-2xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-800"></div>
                    <div className="relative z-10 w-20 h-14 bg-white rounded-lg flex items-center justify-center">
                      <Link className="w-10 h-10 text-green-700" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Your Referral Link</h3>
                    <p className="text-xs text-gray-600">
                      Share your unique referral link with friends and earn rewards when they join and invest.
                    </p>
                  </div>
                </div>
                <div className="lg:col-span-2">
                  <div className="flex gap-3 flex-wrap">
                    <div className="flex-1 min-w-[200px] bg-white border border-gray-200 rounded-lg px-4 py-3 font-mono text-sm text-gray-700">
                      {referralLink}
                    </div>
                    <Button onClick={handleCopy} className="bg-green-700 hover:bg-green-800 text-white">
                      {copied ? <CheckCircle className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      {copied ? 'Copied!' : 'Copy Link'}
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="ghost" className="w-10 h-10 p-0 rounded-full bg-green-500 text-white hover:bg-green-600">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" className="w-10 h-10 p-0 rounded-full bg-blue-600 text-white hover:bg-blue-700">
                      <Facebook className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" className="w-10 h-10 p-0 rounded-full bg-blue-400 text-white hover:bg-blue-500">
                      <Twitter className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" className="w-10 h-10 p-0 rounded-full bg-sky-500 text-white hover:bg-sky-600">
                      <Send className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" className="w-10 h-10 p-0 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Referrals List */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <CardTitle className="text-base font-semibold text-gray-900">Your Referrals</CardTitle>
                <CardDescription className="text-xs text-gray-500">Track the status of your referrals and earnings.</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-gray-600">
                All Status
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-xs text-gray-500 uppercase">
                    <tr>
                      <th className="pb-3 font-medium">Name</th>
                      <th className="pb-3 font-medium">Email</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Joined On</th>
                      <th className="pb-3 font-medium">Last Investment</th>
                      <th className="pb-3 font-medium">You Earned</th>
                      <th className="pb-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {referrals.map((referral) => (
                      <tr key={referral.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={referral.avatar}
                              alt={referral.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <span className="font-semibold text-gray-900">{referral.name}</span>
                          </div>
                        </td>
                        <td className="py-4 text-gray-600">{referral.email}</td>
                        <td className="py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            referral.status === 'Active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {referral.status === 'Active' ? <CheckCircle className="w-3 h-3" /> : null}
                            {referral.status}
                          </span>
                        </td>
                        <td className="py-4 text-gray-600">{referral.joined}</td>
                        <td className="py-4 text-gray-900">{referral.lastInvestment}</td>
                        <td className="py-4 font-semibold text-green-700">
                          {referral.earned > 0 ? formatCurrency(referral.earned) : '₦0.00'}
                        </td>
                        <td className="py-4">
                          <Button variant="ghost" className="text-green-700 text-xs p-0 h-auto">
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-center mt-6">
                <Button variant="ghost" className="text-green-700">
                  View All Referrals
                  <MoreHorizontal className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Note */}
          <div className="flex items-start gap-2 text-xs text-gray-500">
            <Info className="w-4 h-4 flex-shrink-0" />
            <p>Referral earnings are added to your wallet balance after your referral's investment is activated and verified.</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* How It Works */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-semibold text-gray-900">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-green-700 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Share Your Link</p>
                  <p className="text-xs text-gray-600">Share your unique referral link with your friends.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-green-700 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">They Sign Up</p>
                  <p className="text-xs text-gray-600">Your friends register using your referral link.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-green-700 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">They Invest</p>
                  <p className="text-xs text-gray-600">Your referrals make their first investment.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-green-700 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">4</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">You Earn</p>
                  <p className="text-xs text-gray-600">You earn a percentage as referral bonus.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Referral Commission */}
          <Card className="border-green-100 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-900">Referral Commission</CardTitle>
              <CardDescription className="text-xs text-gray-500">
                Earn attractive commissions when your referrals invest in any of our farm projects.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">You earn 5% of your referrals</p>
                  <p className="text-xs text-gray-600">successful investment.</p>
                </div>
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-700">5%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold text-gray-900">Leaderboard</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-green-700">
                View All
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {leaderboard.map((user) => (
                <div key={user.id} className={`flex items-center gap-3 ${user.isYou ? 'bg-green-50 p-2 rounded-lg border border-green-100' : ''}`}>
                  <div className="text-sm font-bold text-gray-400 w-5">
                    {user.rank}
                  </div>
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${user.isYou ? 'text-green-700' : 'text-gray-900'}`}>
                      {user.name}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(user.earned)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

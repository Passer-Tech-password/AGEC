'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';
import { INVESTMENT_PLANS, INVESTMENT_CATEGORIES } from '@/lib/data';
import { Briefcase, CheckCircle, Calendar, TrendingUp, Plus, Leaf, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserInvestments, createInvestment, getInvestmentPlans, UserInvestment, InvestmentPlanData } from '@/lib/firebaseServices';

export default function InvestmentsPage() {
  const { user, userData, refreshUserData } = useAuth();
  const [investments, setInvestments] = useState<UserInvestment[]>([]);
  const [plans, setPlans] = useState<InvestmentPlanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlanData | null>(null);
  const [investAmount, setInvestAmount] = useState('');
  const [investLoading, setInvestLoading] = useState(false);

  useEffect(() => {
    if (user) {
      Promise.all([
      getUserInvestments(user.uid),
      getInvestmentPlans()
      ]).then(([inv, pl]) => {
        setInvestments(inv);
        setPlans(pl);
        setLoading(false);
      }).catch(err => {
        console.error("Error fetching investments data:", err);
        setLoading(false);
      });
    }
  }, [user]);

  const handleInvest = async () => {
    if (!user || !selectedPlan || !investAmount) return;
    const amount = parseFloat(investAmount);
    if (isNaN(amount) || amount <= 0) return;
    if (amount < selectedPlan.minInvestment) {
      alert(`Minimum investment for ${selectedPlan.name} is ${formatCurrency(selectedPlan.minInvestment)}`);
      return;
    }
    if (selectedPlan.maxInvestment && amount > selectedPlan.maxInvestment) {
      alert(`Maximum investment for ${selectedPlan.name} is ${formatCurrency(selectedPlan.maxInvestment)}`);
      return;
    }
    if (userData && amount > userData.walletBalance) {
      alert('Insufficient balance');
      return;
    }

    setInvestLoading(true);
    try {
      await createInvestment(user.uid, selectedPlan, amount);
      await refreshUserData();
      // Refresh investments list
      const newInvestments = await getUserInvestments(user.uid);
      setInvestments(newInvestments);
      setShowInvestModal(false);
      setSelectedPlan(null);
      setInvestAmount('');
      alert('Investment created successfully!');
    } catch (err) {
      console.error("Error creating investment:", err);
      alert('Failed to create investment. Please try again.');
    } finally {
      setInvestLoading(false);
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Investments</h1>
          <p className="text-gray-600 mt-1">Manage and track all your agricultural investments.</p>
        </div>
        <Button className="bg-green-700 hover:bg-green-800 text-white" onClick={() => setShowInvestModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Investment
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Invested</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">{formatCurrency(userData?.totalInvested || 0)}</div>
            <p className="text-sm text-gray-500 mt-1">{investments.length} Active Investments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">{formatCurrency(userData?.totalEarnings || 0)}</div>
            <p className="text-sm text-gray-500 mt-1">From all investments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{formatCurrency(userData?.walletBalance || 0)}</div>
            <p className="text-sm text-gray-500 mt-1">For new investments</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Investments */}
      <Card>
        <CardHeader>
          <CardTitle>Active Investments</CardTitle>
          <CardDescription>Your currently active farm investments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {investments.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No investments yet</p>
            ) : (
              investments.map((investment) => (
                <div key={investment.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Leaf className="w-7 h-7 text-green-700" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">{investment.planName}</h3>
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            {investment.status}
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm mb-2">Started {investment.startDate.toDate().toLocaleDateString()}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Invested:</span>{' '}
                            <span className="font-semibold">{formatCurrency(investment.amount)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">ROI:</span>{' '}
                            <span className="font-semibold text-green-700">{investment.roiPercentage}%</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Total Returns:</span>{' '}
                            <span className="font-semibold">{formatCurrency(investment.totalReturns)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Maturity Date:</span>{' '}
                            <span className="font-semibold text-amber-700">{investment.maturityDate.toDate().toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Available Investment Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Available Investment Plans</CardTitle>
          <CardDescription>Choose a plan to grow your agricultural portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {plans.length === 0 ? (
              INVESTMENT_PLANS.map((plan) => (
                <div key={plan.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                  <div className={`w-12 h-12 ${plan.color} rounded-xl flex items-center justify-center text-white mb-4`}>
                    {plan.name.charAt(0)}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">{plan.description}</p>
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Min:</span>
                      <span className="font-semibold">{formatCurrency(plan.minInvestment)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">ROI:</span>
                      <span className="font-semibold text-green-700">{plan.roi}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Duration:</span>
                      <span className="font-semibold">{plan.duration} months</span>
                    </div>
                  </div>
                  <Button className="w-full bg-green-700 hover:bg-green-800 text-white" onClick={() => {
                    // Convert to InvestmentPlanData
                    const planData: InvestmentPlanData = {
                      id: plan.id,
                      name: plan.name,
                      description: plan.description,
                      minInvestment: plan.minInvestment,
                      maxInvestment: plan.maxInvestment,
                      roiPercentage: plan.roi,
                      durationDays: plan.duration * 30, // approximate
                      biWeeklyPayout: plan.biWeeklyMin,
                      popular: false,
                      featured: false,
                      features: [],
                      active: true,
                      createdAt: { toDate: () => new Date() } as any
                    };
                    setSelectedPlan(planData);
                    setShowInvestModal(true);
                  }}>
                    Invest Now
                  </Button>
                </div>
              ))
            ) : (
              plans.map((plan) => (
                <div key={plan.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white mb-4">
                    {plan.name.charAt(0)}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">{plan.description}</p>
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Min:</span>
                      <span className="font-semibold">{formatCurrency(plan.minInvestment)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">ROI:</span>
                      <span className="font-semibold text-green-700">{plan.roiPercentage}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Duration:</span>
                      <span className="font-semibold">{Math.floor(plan.durationDays / 30)} months</span>
                    </div>
                  </div>
                  <Button className="w-full bg-green-700 hover:bg-green-800 text-white" onClick={() => {
                    setSelectedPlan(plan);
                    setShowInvestModal(true);
                  }}>
                    Invest Now
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Investment Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Investment Categories</CardTitle>
          <CardDescription>Explore different agricultural sectors to invest in</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {INVESTMENT_CATEGORIES.map((category) => (
              <div key={category.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all text-center">
                <div className="text-5xl mb-4">{category.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{category.name}</h3>
                <ul className="space-y-1 mb-4">
                  {category.items.map((item, i) => (
                    <li key={i} className="text-gray-600 text-sm">{item}</li>
                  ))}
                </ul>
                <Button variant="secondary" className="w-full">
                  Explore Projects
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Invest Modal */}
      {showInvestModal && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Invest in {selectedPlan.name}</CardTitle>
                <CardDescription>{selectedPlan.description}</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => {
                setShowInvestModal(false);
                setSelectedPlan(null);
              }}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Minimum Investment</p>
                    <p className="font-semibold text-gray-900">{formatCurrency(selectedPlan.minInvestment)}</p>
                  </div>
                  {selectedPlan.maxInvestment && (
                    <div>
                      <p className="text-gray-600">Maximum Investment</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(selectedPlan.maxInvestment)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-600">ROI</p>
                    <p className="font-semibold text-green-700">{selectedPlan.roiPercentage}%</p>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="invest-amount">Amount (₦)</Label>
                <Input
                  id="invest-amount"
                  type="number"
                  placeholder={`Minimum: ${formatCurrency(selectedPlan.minInvestment)}`}
                  value={investAmount}
                  onChange={(e) => setInvestAmount(e.target.value)}
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Available: {formatCurrency(userData?.walletBalance || 0)}
                </p>
              </div>
              <Button
                onClick={handleInvest}
                className="w-full bg-green-700 hover:bg-green-800 text-white"
                disabled={investLoading}
              >
                {investLoading ? 'Processing...' : 'Confirm Investment'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

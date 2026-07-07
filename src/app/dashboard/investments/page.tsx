'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';
import { Briefcase, CheckCircle, Calendar, TrendingUp, Plus, Leaf, X, ChevronRight, Wallet, Clock, ShieldCheck, BarChart3, Sparkles } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserInvestments, createInvestment, getInvestmentPlans, getFarmProjects, UserInvestment, InvestmentPlanData, FarmProject } from '@/lib/firebaseServices';
import { Timestamp } from 'firebase/firestore';

// Fallback data for investment plans
const fallbackPlans: InvestmentPlanData[] = [
  {
    id: "plan-1",
    name: "Starter",
    description: "Perfect for new investors",
    minInvestment: 20000,
    roiPercentage: 15,
    durationDays: 90,
    biWeeklyPayout: 5,
    popular: false,
    featured: false,
    features: [
      "15% Total ROI",
      "3 Months Duration",
      "Bi-weekly Payouts"
    ],
    active: true,
    createdAt: Timestamp.now()
  },
  {
    id: "plan-2",
    name: "Bronze",
    description: "Great for steady growth",
    minInvestment: 50000,
    roiPercentage: 20,
    durationDays: 120,
    biWeeklyPayout: 7,
    popular: true,
    featured: false,
    features: [
      "20% Total ROI",
      "4 Months Duration",
      "Bi-weekly Payouts"
    ],
    active: true,
    createdAt: Timestamp.now()
  },
  {
    id: "plan-3",
    name: "Silver",
    description: "Enhanced returns for serious investors",
    minInvestment: 100000,
    roiPercentage: 30,
    durationDays: 180,
    biWeeklyPayout: 8,
    popular: false,
    featured: false,
    features: [
      "30% Total ROI",
      "6 Months Duration",
      "Bi-weekly Payouts"
    ],
    active: true,
    createdAt: Timestamp.now()
  },
  {
    id: "plan-4",
    name: "Gold",
    description: "Premium investment plan",
    minInvestment: 250000,
    roiPercentage: 40,
    durationDays: 270,
    biWeeklyPayout: 10,
    popular: false,
    featured: false,
    features: [
      "40% Total ROI",
      "9 Months Duration",
      "Bi-weekly Payouts"
    ],
    active: true,
    createdAt: Timestamp.now()
  },
  {
    id: "plan-5",
    name: "Elite",
    description: "For our most exclusive investors",
    minInvestment: 500000,
    roiPercentage: 50,
    durationDays: 365,
    biWeeklyPayout: 12,
    popular: false,
    featured: true,
    features: [
      "50% Total ROI",
      "12 Months Duration",
      "Bi-weekly Payouts"
    ],
    active: true,
    createdAt: Timestamp.now()
  }
];

// Fallback data for farm projects
const fallbackProjects: FarmProject[] = [
  {
    id: "project-1",
    name: "Poultry Farm Investment",
    location: "Ogun State, Nigeria",
    description: "Modern poultry farm with high-yield broilers and layers",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800",
    investmentAmount: 100000,
    roiPercentage: 24,
    durationDays: 120,
    spotsLeft: 45,
    active: true,
    createdAt: Timestamp.now()
  },
  {
    id: "project-2",
    name: "Rice Farm Investment",
    location: "Kebbi State, Nigeria",
    description: "Large-scale rice production with modern irrigation",
    imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800",
    investmentAmount: 100000,
    roiPercentage: 30,
    durationDays: 150,
    spotsLeft: 32,
    active: true,
    createdAt: Timestamp.now()
  },
  {
    id: "project-3",
    name: "Silver Farm Investment",
    location: "Niger State, Nigeria",
    description: "Mixed farming with crops and livestock",
    imageUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800",
    investmentAmount: 100000,
    roiPercentage: 40,
    durationDays: 180,
    spotsLeft: 58,
    active: true,
    createdAt: Timestamp.now()
  },
  {
    id: "project-4",
    name: "Greenhouse Investment",
    location: "Lagos State, Nigeria",
    description: "Hydroponic vegetable farming in controlled environment",
    imageUrl: "https://images.unsplash.com/photo-1530836362855-f30a47322e2a?auto=format&fit=crop&q=80&w=800",
    investmentAmount: 100000,
    roiPercentage: 50,
    durationDays: 240,
    spotsLeft: 22,
    active: true,
    createdAt: Timestamp.now()
  }
];

export default function InvestmentsPage() {
  const { user, userData, refreshUserData } = useAuth();
  const [investments, setInvestments] = useState<UserInvestment[]>([]);
  const [plans, setPlans] = useState<InvestmentPlanData[]>([]);
  const [projects, setProjects] = useState<FarmProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('plans'); // 'plans' | 'my' | 'history'
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlanData | null>(null);
  const [investAmount, setInvestAmount] = useState('');
  const [investLoading, setInvestLoading] = useState(false);

  // Countdown timer state
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (user) {
      Promise.all([
        getUserInvestments(user.uid),
        getInvestmentPlans(),
        getFarmProjects()
      ]).then(([inv, pl, pr]) => {
        setInvestments(inv);
        setPlans(pl.length > 0 ? pl : fallbackPlans);
        setProjects(pr.length > 0 ? pr : fallbackProjects);
        setLoading(false);
      }).catch(err => {
        console.error("Error fetching investments data:", err);
        setPlans(fallbackPlans);
        setProjects(fallbackProjects);
        setLoading(false);
      });
    }
  }, [user]);

  // Countdown timer logic
  useEffect(() => {
    // Set a mock upcoming payout date (30 days from now)
    const upcomingDate = new Date();
    upcomingDate.setDate(upcomingDate.getDate() + 30);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = upcomingDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setCountdown({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  // Helper to get plan badge color
  const getPlanBadgeColor = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'starter':
        return 'bg-green-100 text-green-700';
      case 'bronze':
        return 'bg-amber-100 text-amber-700';
      case 'silver':
        return 'bg-gray-200 text-gray-700';
      case 'gold':
        return 'bg-yellow-100 text-yellow-700';
      case 'elite':
        return 'bg-emerald-100 text-emerald-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const displayPlans = plans.length > 0 ? plans : fallbackPlans;
  const displayProjects = projects.length > 0 ? projects : fallbackProjects;

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
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-gray-900">Investments</h1>
        <p className="text-gray-600">Explore investment plans and grow your wealth with agriculture.</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Main Content (3/4) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Tabs */}
          <div className="flex items-center gap-6 bg-white p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => setActiveTab('plans')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'plans'
                  ? 'bg-green-700 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Available Plans
            </button>
            <button
              onClick={() => setActiveTab('my')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'my'
                  ? 'bg-green-700 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              My Investments
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'history'
                  ? 'bg-green-700 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Investment History
            </button>
          </div>

          {activeTab === 'plans' && (
            <div className="space-y-6">
              {/* Available Plans */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Available Investment Plans</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  </div>
                  <span>How it works?</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {displayPlans.map((plan) => (
                  <Card key={plan.id} className="hover:shadow-lg transition-all border-gray-200">
                    <CardContent className="pt-6">
                      <div className="flex justify-center mb-4">
                        <div className={`w-14 h-14 rounded-full border-4 flex items-center justify-center ${
                          plan.name.toLowerCase() === 'starter' ? 'bg-white border-green-200' :
                          plan.name.toLowerCase() === 'bronze' ? 'bg-white border-amber-200' :
                          plan.name.toLowerCase() === 'silver' ? 'bg-white border-gray-300' :
                          plan.name.toLowerCase() === 'gold' ? 'bg-white border-yellow-200' :
                          'bg-white border-emerald-200'
                        }`}>
                          {plan.name.toLowerCase() === 'starter' && <Leaf className="w-7 h-7 text-green-600" />}
                          {plan.name.toLowerCase() === 'bronze' && <Sparkles className="w-7 h-7 text-amber-600" />}
                          {plan.name.toLowerCase() === 'silver' && <ShieldCheck className="w-7 h-7 text-gray-500" />}
                          {plan.name.toLowerCase() === 'gold' && <Sparkles className="w-7 h-7 text-yellow-600" />}
                          {plan.name.toLowerCase() === 'elite' && <Sparkles className="w-7 h-7 text-emerald-600" />}
                        </div>
                      </div>
                      <div className="text-center mb-2">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getPlanBadgeColor(plan.name)}`}>
                          {plan.name} Plan
                        </span>
                      </div>
                      <p className="text-center text-gray-500 text-xs mb-4">Minimum Investment</p>
                      <p className="text-center text-2xl font-bold text-gray-900 mb-6">{formatCurrency(plan.minInvestment)}</p>
                      <div className="space-y-2 mb-6">
                        {plan.features.slice(0, 3).map((feature, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Button 
                        className={`w-full ${
                          plan.popular 
                            ? 'bg-amber-500 hover:bg-amber-600' 
                            : plan.featured 
                              ? 'bg-emerald-600 hover:bg-emerald-700'
                              : 'bg-green-700 hover:bg-green-800'
                        } text-white`}
                        onClick={() => {
                          setSelectedPlan(plan);
                          setShowInvestModal(true);
                        }}
                      >
                        Invest Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <p className="text-xs text-gray-500 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                💡 All plans offer bi-weekly withdrawals of profits. Principal is returned at the end of the plan duration.
              </p>

              {/* My Active Investments */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">My Active Investments</h2>
                  <p className="text-sm text-gray-500">Total Active Investment: {formatCurrency(userData?.totalInvested || 0)}</p>
                </div>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {investments.length === 0 ? (
                        <div className="text-center py-8">
                          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">No active investments yet</p>
                        </div>
                      ) : (
                        investments.map((investment, index) => {
                          const project = displayProjects[index % displayProjects.length];
                          const startDate = investment.startDate.toDate();
                          const maturityDate = investment.maturityDate.toDate();
                          const totalDays = (maturityDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
                          const daysPassed = (new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
                          const progress = Math.min(Math.max((daysPassed / totalDays) * 100, 0), 100);
                          
                          return (
                            <div key={investment.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:shadow-sm transition-shadow">
                              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={project.imageUrl} alt={project.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-gray-900 truncate">{investment.planName}</h3>
                                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getPlanBadgeColor(investment.planName)}`}>
                                    {investment.planName}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-gray-500 mb-3">
                                  <div>
                                    <span className="text-gray-400">Amount Invested</span>
                                    <p className="font-semibold text-gray-900">{formatCurrency(investment.amount)}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">ROI</span>
                                    <p className="font-semibold text-green-700">{investment.roiPercentage}%</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">Start Date</span>
                                    <p className="font-semibold text-gray-900">{startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">Next Payout</span>
                                    <p className="font-semibold text-green-700">{investment.nextPayoutDate?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || 'N/A'}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-6">
                                  <div className="flex-1">
                                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                                      <span>Status</span>
                                      <span>Progress</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                        {investment.status}
                                      </span>
                                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                          className="h-full bg-gradient-to-r from-green-500 to-green-700 transition-all"
                                          style={{ width: `${progress}%` }}
                                        />
                                      </div>
                                      <span className="text-xs font-semibold text-gray-900">{Math.round(progress)}%</span>
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="sm" className="text-green-700 hover:text-green-800 hover:bg-green-50">
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </CardContent>
                </Card>
                {investments.length > 0 && (
                  <div className="text-center mt-4">
                    <button className="text-green-700 hover:text-green-800 text-sm font-medium flex items-center gap-2 mx-auto">
                      View All My Investments <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'my' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">My Active Investments</h2>
              <Card>
                <CardContent className="pt-6">
                  {investments.length === 0 ? (
                    <div className="text-center py-8">
                      <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No active investments yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {investments.map((investment, index) => {
                        const project = displayProjects[index % displayProjects.length];
                        const startDate = investment.startDate.toDate();
                        const maturityDate = investment.maturityDate.toDate();
                        const totalDays = (maturityDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
                        const daysPassed = (new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
                        const progress = Math.min(Math.max((daysPassed / totalDays) * 100, 0), 100);
                        
                        return (
                          <div key={investment.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <img src={project.imageUrl} alt={project.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900 truncate">{investment.planName}</h3>
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getPlanBadgeColor(investment.planName)}`}>
                                  {investment.planName}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-gray-500 mb-3">
                                <div>
                                  <span className="text-gray-400">Amount Invested</span>
                                  <p className="font-semibold text-gray-900">{formatCurrency(investment.amount)}</p>
                                </div>
                                <div>
                                  <span className="text-gray-400">ROI</span>
                                  <p className="font-semibold text-green-700">{investment.roiPercentage}%</p>
                                </div>
                                <div>
                                  <span className="text-gray-400">Start Date</span>
                                  <p className="font-semibold text-gray-900">{startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                                <div>
                                  <span className="text-gray-400">Next Payout</span>
                                  <p className="font-semibold text-green-700">{investment.nextPayoutDate?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || 'N/A'}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-6">
                                <div className="flex-1">
                                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>Status</span>
                                    <span>Progress</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                      {investment.status}
                                    </span>
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-gradient-to-r from-green-500 to-green-700"
                                        style={{ width: `${progress}%` }}
                                      />
                                    </div>
                                    <span className="text-xs font-semibold text-gray-900">{Math.round(progress)}%</span>
                                  </div>
                                </div>
                                <Button variant="ghost" size="sm" className="text-green-700">
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Investment History</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No investment history yet</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Right Column - Sidebar (1/4) */}
        <div className="space-y-6">
          {/* Wallet Balance Card */}
          <Card className="border-2 border-green-100">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-green-700" />
                </div>
                <span className="text-sm font-medium text-gray-700">Wallet Balance</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(userData?.walletBalance || 0)}</p>
            </CardContent>
          </Card>

          {/* Investment Summary */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
                  <BarChart3 className="w-3 h-3 text-green-700" />
                </div>
                <CardTitle className="text-sm font-semibold text-gray-900">Investment Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Investment</p>
                <p className="text-sm font-semibold text-gray-900">{formatCurrency(userData?.totalInvested || 0)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Earnings</p>
                <p className="text-sm font-semibold text-green-700">{formatCurrency(userData?.totalEarnings || 0)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Withdrawn</p>
                <p className="text-sm font-semibold text-gray-900">{formatCurrency(userData?.totalWithdrawn || 0)}</p>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Available Balance</p>
                <p className="text-sm font-semibold text-gray-900">{formatCurrency(userData?.walletBalance || 0)}</p>
              </div>
              <Button className="w-full bg-green-700 hover:bg-green-800 text-white mt-2">
                Withdraw Earnings
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Payout */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
                  <Calendar className="w-3 h-3 text-green-700" />
                </div>
                <CardTitle className="text-sm font-semibold text-gray-900">Upcoming Payout</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Next Payout Date</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Expected Amount</p>
                <p className="text-xl font-bold text-green-700">₦23,500.00</p>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: String(countdown.days).padStart(2, '0'), label: 'Days' },
                  { value: String(countdown.hours).padStart(2, '0'), label: 'Hours' },
                  { value: String(countdown.minutes).padStart(2, '0'), label: 'Minutes' },
                  { value: String(countdown.seconds).padStart(2, '0'), label: 'Seconds' }
                ].map((item, i) => (
                  <div key={i} className="text-center bg-green-50 rounded-lg p-2">
                    <p className="text-lg font-bold text-green-700">{item.value}</p>
                    <p className="text-[10px] text-gray-500">{item.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Why Invest With AGEC */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-semibold text-gray-900">Why Invest With AGEC?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { icon: ShieldCheck, title: 'Verified Farm Projects', desc: 'All projects are verified and transparent' },
                { icon: TrendingUp, title: 'Bi-weekly Payouts', desc: 'Earn and withdraw your profits every 2 weeks' },
                { icon: ShieldCheck, title: 'Secure & Reliable', desc: 'Your investments are safe with us' },
                { icon: BarChart3, title: 'Real-time Tracking', desc: 'Track your investments in real-time' }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <item.icon className="w-3 h-3 text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

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

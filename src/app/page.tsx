'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Leaf,
  Users,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  PiggyBank,
  Gift,
  Sprout,
  Wheat,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  Star,
  Phone,
  Mail,
  MapPin,
  Download,
  Wallet,
  Briefcase,
  Clock,
  User
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getInvestmentPlans, getFarmProjects, InvestmentPlanData, FarmProject } from '@/lib/firebaseServices';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<InvestmentPlanData[]>([]);
  const [projects, setProjects] = useState<FarmProject[]>([]);
  const stats = { totalUsers: 1000, totalInvested: 250000000, totalWithdrawn: 95000000, totalEarnings: 0, pendingWithdrawals: 0, pendingDeposits: 0, pendingKYCs: 0 };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansData, projectsData] = await Promise.all([
          getInvestmentPlans(),
          getFarmProjects()
        ]);
        setPlans(plansData);
        setProjects(projectsData);
      } catch (err) {
        console.error("Error fetching landing data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fallback data if Firebase has none
  const fallbackPlans = [
    { id: '1', name: 'Starter Plan', description: 'Perfect for new investors', minInvestment: 20000, maxInvestment: 49999, roiPercentage: 18, durationDays: 90, biWeeklyPayout: 1500, popular: false, featured: false, features: ['18% ROI', '3 Months Duration', 'Bi-weekly Payouts', '24/7 Support'], active: true, createdAt: { toDate: () => new Date() } as any },
    { id: '2', name: 'Bronze Plan', description: 'Grow your investment steadily', minInvestment: 50000, maxInvestment: 99999, roiPercentage: 24, durationDays: 120, biWeeklyPayout: 3500, popular: true, featured: false, features: ['24% ROI', '4 Months Duration', 'Bi-weekly Payouts', 'Priority Support'], active: true, createdAt: { toDate: () => new Date() } as any },
    { id: '3', name: 'Silver Plan', description: 'Balanced investment option', minInvestment: 100000, maxInvestment: 249999, roiPercentage: 30, durationDays: 180, biWeeklyPayout: 7500, popular: true, featured: false, features: ['30% ROI', '6 Months Duration', 'Bi-weekly Payouts', 'Dedicated Manager'], active: true, createdAt: { toDate: () => new Date() } as any },
    { id: '4', name: 'Gold Plan', description: 'Maximize your returns', minInvestment: 250000, maxInvestment: 499999, roiPercentage: 40, durationDays: 270, biWeeklyPayout: 15000, popular: false, featured: false, features: ['40% ROI', '9 Months Duration', 'Bi-weekly Payouts', 'VIP Support Access'], active: true, createdAt: { toDate: () => new Date() } as any },
    { id: '5', name: 'Elite Plan', description: 'For serious investors', minInvestment: 500000, maxInvestment: undefined, roiPercentage: 50, durationDays: 365, biWeeklyPayout: 35000, popular: false, featured: true, features: ['50% ROI', '12 Months Duration', 'Bi-weekly Payouts', 'Personal Account Manager', 'Exclusive Deals'], active: true, createdAt: { toDate: () => new Date() } as any },
  ];

  const fallbackProjects = [
    { id: '1', name: 'Poultry Farm', location: 'Ogun State', description: 'Commercial poultry farming', imageUrl: './images/poultry-farm.jpg', investmentAmount: 500000, roiPercentage: 78, durationDays: 24, spotsLeft: 12, active: true, createdAt: { toDate: () => new Date() } as any },
    { id: '2', name: 'Rice Farm', location: 'Kebbi State', description: 'Large-scale rice cultivation', imageUrl: './images/rice-farm.jpg', investmentAmount: 800000, roiPercentage: 60, durationDays: 24, spotsLeft: 8, active: true, createdAt: { toDate: () => new Date() } as any },
    { id: '3', name: 'Fish Farm', location: 'Lagos State', description: 'Aquaculture farming', imageUrl: './images/fish-farm.jpg', investmentAmount: 300000, roiPercentage: 80, durationDays: 10, spotsLeft: 25, active: true, createdAt: { toDate: () => new Date() } as any },
  ];

  const displayPlans = plans.length > 0 ? plans : fallbackPlans;
  const displayProjects = projects.length > 0 ? projects : fallbackProjects;

  const howItWorks = [
    { icon: <User className="w-8 h-8" />, title: 'Register Account', description: 'Create your account in a few simple steps.' },
    { icon: <Wallet className="w-8 h-8" />, title: 'Fund Wallet', description: 'Deposit funds using our payment options.' },
    { icon: <Sprout className="w-8 h-8" />, title: 'Choose Investment', description: 'Select from our amazing investment plans.' },
    { icon: <PiggyBank className="w-8 h-8" />, title: 'Earn & Withdraw', description: 'Earn payouts and withdraw every 2 weeks.' },
  ];

  const testimonials = [
    { name: 'Adewale T.', role: 'Investor since 2023', text: 'AGEC has been the best investment decision I made. Consistent returns and withdrawals are always on time.', rating: 5, avatar: 'A' },
    { name: 'Blessing O.', role: 'Investor since 2024', text: 'Transparent platform with genuine farm projects. I love seeing my money grow safely.', rating: 5, avatar: 'B' },
    { name: 'Chidi E.', role: 'Investor since 2023', text: 'Customer support is excellent! They respond promptly and help with all my inquiries.', rating: 5, avatar: 'C' },
  ];

  const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border-2 border-green-700">
                <Leaf className="w-7 h-7 text-green-700" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-green-800">AGEC</span>
                <p className="text-xs text-green-600 font-medium tracking-wider">AGRO ELITE</p>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              <Link href="/" className="text-gray-800 hover:text-green-700 font-medium transition-colors text-sm">Home</Link>
              <Link href="#about" className="text-gray-600 hover:text-green-700 font-medium transition-colors text-sm">About Us</Link>
              <Link href="#plans" className="text-gray-600 hover:text-green-700 font-medium transition-colors text-sm">Investment Plans</Link>
              <Link href="#projects" className="text-gray-600 hover:text-green-700 font-medium transition-colors text-sm">Farm Projects</Link>
              <Link href="#testimonials" className="text-gray-600 hover:text-green-700 font-medium transition-colors text-sm">Testimonials</Link>
              <Link href="#" className="text-gray-600 hover:text-green-700 font-medium transition-colors text-sm">FAQ</Link>
              <Link href="#" className="text-gray-600 hover:text-green-700 font-medium transition-colors text-sm">Contact Us</Link>
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="text-gray-700 hover:text-green-700 hover:bg-green-50 text-sm font-medium">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 text-white text-sm font-medium shadow-lg shadow-green-700/20">
                  Get Started
                </Button>
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 shadow-lg"
          >
            <div className="px-4 py-6 space-y-4">
              <Link href="/" className="block text-gray-800 font-medium py-2">Home</Link>
              <Link href="#about" className="block text-gray-600 font-medium py-2">About Us</Link>
              <Link href="#plans" className="block text-gray-600 font-medium py-2">Investment Plans</Link>
              <Link href="#projects" className="block text-gray-600 font-medium py-2">Farm Projects</Link>
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <Link href="/login" className="block w-full">
                  <Button variant="ghost" className="w-full justify-center">Login</Button>
                </Link>
                <Link href="/register" className="block w-full">
                  <Button className="w-full justify-center bg-gradient-to-r from-green-700 to-green-800">Get Started</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=2400"
            alt="Farm background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 via-green-800/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Grow Your Wealth <br />
                <span className="text-green-300">Through Agriculture</span>
              </h1>
              <p className="text-lg md:text-xl text-green-100 mb-8 leading-relaxed opacity-95">
                Invest in verified agricultural projects and earn consistent returns while supporting food production and communities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link href="/register">
                  <Button className="h-14 px-8 text-lg bg-green-700 hover:bg-green-800 text-white shadow-xl shadow-green-900/40">
                    Start Investing
                  </Button>
                </Link>
                <Link href="#plans">
                  <Button variant="ghost" className="h-14 px-8 text-lg bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm">
                    View Plans
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-semibold">{stats.totalUsers.toLocaleString()}+ Investors</p>
                  <p className="text-green-200 text-sm">Join our community of smart investors growing with AGEC.</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="bg-white rounded-3xl p-6 shadow-2xl shadow-black/20 border border-white/20">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center">
                      <Leaf className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Welcome back,</p>
                      <p className="font-semibold text-gray-900">John Investor</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-amber-600 rounded-full flex items-center justify-center text-white font-bold">
                      JI
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-2xl p-5 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-green-200 text-xs font-medium">Total Earnings</p>
                      <span className="text-green-300 text-xs bg-green-800 px-2 py-0.5 rounded-full">+6.5%</span>
                    </div>
                    <p className="text-2xl font-bold">{formatCurrency(stats.totalEarnings)}</p>
                    <p className="text-green-300 text-xs mt-1">This Month</p>
                  </div>
                  <div className="bg-white border-2 border-green-100 rounded-2xl p-5">
                    <p className="text-gray-500 text-xs font-medium mb-2">Available Balance</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalInvested * 0.13)}</p>
                    <Button className="mt-2 w-full h-8 bg-green-700 hover:bg-green-800 text-white text-xs">
                      Withdraw
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'Total', value: formatCurrency(stats.totalInvested) },
                    { label: 'Active', value: stats.totalUsers.toLocaleString() },
                    { label: 'Total Paid', value: formatCurrency(stats.totalWithdrawn) },
                    { label: 'Referrals', value: '15' },
                  ].map((stat, i) => (
                    <div key={i} className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="w-8 h-8 mx-auto mb-2 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-700" />
                      </div>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                      <p className="font-bold text-gray-900 text-sm">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-gradient-to-r from-green-700 to-green-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: formatCurrency(stats.totalInvested), label: 'Total Invested', icon: <BarChart3 className="w-6 h-6" /> },
              { value: formatCurrency(stats.totalWithdrawn), label: 'Total Paid Out', icon: <PiggyBank className="w-6 h-6" /> },
              { value: `${stats.totalUsers.toLocaleString()}+`, label: 'Happy Investors', icon: <Users className="w-6 h-6" /> },
              { value: '98%', label: 'Satisfaction Rate', icon: <CheckCircle2 className="w-6 h-6" /> },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-center gap-3 text-white"
              >
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <div className="text-white">{stat.icon}</div>
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-bold">{stat.value}</p>
                  <p className="text-green-200 text-sm">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Plans */}
      <section id="plans" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Investment Plans
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose a plan that suits you and start earning consistent returns.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {displayPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <Card className={`h-full transition-all duration-300 ${
                    plan.popular ? 'border-green-500 shadow-2xl shadow-green-700/10' :
                    plan.featured ? 'border-2 bg-gradient-to-b from-green-900 to-green-800 text-white' :
                    'border-gray-200 hover:border-green-300 hover:shadow-xl'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-green-600 text-white px-4 py-1.5 text-xs font-semibold shadow-lg uppercase tracking-wide">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  {plan.featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-amber-500 text-white px-4 py-1.5 text-xs font-semibold shadow-lg uppercase tracking-wide flex items-center gap-1">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                        </svg>
                        Premium
                      </Badge>
                    </div>
                  )}
                  <CardHeader className={`pt-10 pb-4 ${plan.featured ? 'text-white' : ''}`}>
                    <div className="flex justify-center mb-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                        plan.featured ? 'bg-gradient-to-br from-amber-400 to-amber-600' :
                        plan.popular ? 'bg-gradient-to-br from-green-100 to-green-200' :
                        'bg-gradient-to-br from-gray-100 to-gray-200'
                      }`}>
                        <Leaf className={`w-8 h-8 ${plan.featured ? 'text-white' : plan.popular ? 'text-green-700' : 'text-gray-600'}`} />
                      </div>
                    </div>
                    <CardTitle className={`text-xl font-bold text-center ${plan.featured ? 'text-white' : 'text-gray-900'}`}>{plan.name}</CardTitle>
                    <CardDescription className={`text-center ${plan.featured ? 'text-green-200' : 'text-gray-500'}`}>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className={`text-center py-4 rounded-2xl border ${
                        plan.featured ? 'bg-white/10 border-white/20' : 'bg-white border-gray-100'
                    }`}>
                      <p className={`text-xs font-medium mb-2 ${plan.featured ? 'text-green-200' : 'text-gray-500'}`}>Minimum Investment</p>
                      <p className={`text-2xl font-bold ${plan.featured ? 'text-amber-300' : 'text-gray-900'}`}>
                        {formatCurrency(plan.minInvestment)}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <div key={i} className={`flex items-center gap-2 text-sm ${plan.featured ? 'text-green-100' : 'text-gray-700'}`}>
                          <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${plan.featured ? 'text-amber-300' : 'text-green-600'}`} />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Link href="/register">
                      <Button className={`w-full h-12 ${
                          plan.featured ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white' :
                          plan.popular ? 'bg-gradient-to-r from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 text-white' :
                          'bg-green-700 hover:bg-green-800 text-white'
                      }`}>
                        Invest Now
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center border-4 border-green-50">
                  <div className="text-green-700">{step.icon}</div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{index + 1}. {step.title}</h3>
                <p className="text-gray-600">{step.description}</p>

                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-10 -right-4 w-8 h-0.5 bg-gradient-to-r from-green-400 to-green-200" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Farm Projects */}
      <section id="projects" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Farm Projects
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Invest in ongoing farm projects and earn great returns.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {displayProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full overflow-hidden border-2 border-gray-100 hover:border-green-300 hover:shadow-xl transition-all duration-300">
                  <div className="relative h-48">
                    <img
                      src={project.imageUrl}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-green-700 text-white px-3 py-1 rounded-lg text-xs font-semibold">
                      {project.roiPercentage}% ROI
                    </div>
                  </div>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                        <p className="text-gray-500 text-sm">{project.location}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-3 bg-green-50 rounded-xl">
                        <p className="text-gray-500 text-xs mb-1">Investment</p>
                        <p className="font-bold text-gray-900 text-sm">{formatCurrency(project.investmentAmount)}</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-xl">
                        <p className="text-gray-500 text-xs mb-1">ROI</p>
                        <p className="font-bold text-green-700 text-sm">{project.roiPercentage}%</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-xl">
                        <p className="text-gray-500 text-xs mb-1">Duration</p>
                        <p className="font-bold text-gray-900 text-sm">{project.durationDays} Days</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-600 flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white" />
                          ))}
                        </div>
                        {project.spotsLeft} spots left
                      </span>
                      <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                        Active
                      </span>
                    </div>

                    <Link href="/register">
                      <Button className="w-full h-12 bg-green-700 hover:bg-green-800 text-white">
                        View Project
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Investors Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-2 border-gray-100 hover:border-green-300 hover:shadow-xl transition-all duration-300">
                  <CardContent className="pt-8">
                    <div className="flex gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-8 leading-relaxed">"{testimonial.text}"</p>
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-green-800 to-green-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Grow Your Wealth <br />Through Agriculture?
              </h2>
              <p className="text-green-100 text-lg mb-8 leading-relaxed">
                Join Agro Elite Community today and start your investment journey. Create your free account now!
              </p>
              <Link href="/register">
                <Button className="h-14 px-10 text-lg bg-white text-green-800 hover:bg-green-50 shadow-xl">
                  Create Free Account
                </Button>
              </Link>
            </div>
            <div className="flex justify-center">
              <div className="w-80 h-80 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-transparent rounded-full blur-3xl" />
                <img
                  src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=800"
                  alt="Seedling growing in soil"
                  className="relative w-full h-full object-cover rounded-3xl shadow-2xl shadow-black/30"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-2xl flex items-center justify-center">
                  <Leaf className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold">AGEC</span>
                  <p className="text-xs text-gray-400 font-medium">Agro Elite Community</p>
                </div>
              </Link>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Connecting investors with profitable agricultural opportunities while promoting food production, job creation, and sustainable farming.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-400">
                  <MapPin className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Lagos, Nigeria</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Mail className="w-5 h-5 text-green-500" />
                  <span className="text-sm">hello@agec.ng</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Phone className="w-5 h-5 text-green-500" />
                  <span className="text-sm">+234 800 000 0000</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-6">Company</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">About Us</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Our Mission</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">How It Works</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Blog</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Careers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-6">Support</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Help Center</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Contact Us</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-6">Invest</h4>
              <ul className="space-y-3 mb-8">
                <li><Link href="#plans" className="text-gray-400 hover:text-white transition-colors text-sm">Investment Plans</Link></li>
                <li><Link href="#projects" className="text-gray-400 hover:text-white transition-colors text-sm">Farm Projects</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Referral Program</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Withdrawal</Link></li>
              </ul>

              <h4 className="font-semibold text-lg mb-6">Follow Us</h4>
              <p className="text-gray-400 text-sm mb-4">Subscribe to our newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-green-500"
                />
                <Button className="bg-green-700 hover:bg-green-800">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm">© 2024 Agro Elite Community (AGEC). All rights reserved.</p>
              <p className="text-gray-500 text-sm">Building wealth. Growing farms. Feeding nations.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

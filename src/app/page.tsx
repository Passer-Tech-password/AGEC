'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { INVESTMENT_PLANS, INVESTMENT_CATEGORIES } from '../lib/data';
import { formatCurrency } from '../lib/utils';
import { ArrowRight, CheckCircle, Users, TrendingUp, Shield, Zap, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-800 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-green-800">AGEC</span>
              <span className="text-sm text-gray-500 font-medium">AGRO ELITE</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-gray-700 hover:text-green-700 font-medium transition-colors">Home</a>
              <a href="#about" className="text-gray-700 hover:text-green-700 font-medium transition-colors">About Us</a>
              <a href="#plans" className="text-gray-700 hover:text-green-700 font-medium transition-colors">Investment Plans</a>
              <a href="#categories" className="text-gray-700 hover:text-green-700 font-medium transition-colors">Farm Projects</a>
              <a href="#testimonials" className="text-gray-700 hover:text-green-700 font-medium transition-colors">Testimonials</a>
              <a href="#faq" className="text-gray-700 hover:text-green-700 font-medium transition-colors">FAQ</a>
              <a href="#contact" className="text-gray-700 hover:text-green-700 font-medium transition-colors">Contact Us</a>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="text-green-800 hover:text-green-900 hover:bg-green-50">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-green-700 hover:bg-green-800 text-white">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Grow Your Wealth <span className="text-green-700">Through Agriculture</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Invest in verified agricultural projects and earn consistent returns while supporting food production and communities.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register">
                  <Button className="bg-green-700 hover:bg-green-800 text-white text-lg px-8 py-6 h-auto">
                    Start Investing <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button variant="secondary" className="text-lg px-8 py-6 h-auto">
                  View Plans
                </Button>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      src={`https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=professional%20headshot%20of%20a%20diverse%20person&image_size=square`}
                      alt="Investor"
                      className="w-10 h-10 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  Trusted by <span className="font-bold text-gray-900">5,000+</span> investors
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <img
                src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=lush%20green%20agricultural%20farm%20with%20crops%20and%20modern%20farming%20equipment&image_size=landscape_16_9"
                alt="Agricultural Farm"
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Invested</p>
                    <p className="text-2xl font-bold text-green-800">₦250M+</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Users, label: 'Total Users', value: '15,000+' },
              { icon: Leaf, label: 'Total Paid Out', value: '₦50M+' },
              { icon: TrendingUp, label: 'Farm Projects', value: '100+' },
              { icon: CheckCircle, label: 'Investor Satisfaction', value: '98%' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <stat.icon className="w-10 h-10 text-green-700 mx-auto mb-4" />
                <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Plans Section */}
      <section id="plans" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Investment Plans
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose a plan that suits you and start earning consistent returns.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {INVESTMENT_PLANS.map((plan, idx) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className={`w-12 h-12 ${plan.color} rounded-xl flex items-center justify-center text-white mb-4`}>
                  {plan.name.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{plan.description}</p>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Minimum Investment</span>
                    <span className="font-semibold">{formatCurrency(plan.minInvestment)}</span>
                  </div>
                  {plan.maxInvestment && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">Maximum Investment</span>
                      <span className="font-semibold">{formatCurrency(plan.maxInvestment)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">ROI</span>
                    <span className="font-semibold text-green-700">{plan.roi}% Total</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Duration</span>
                    <span className="font-semibold">{plan.duration} Months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Bi-weekly Payout</span>
                    <span className="font-semibold">{formatCurrency(plan.biWeeklyMin)}{plan.biWeeklyMax ? ` - ${formatCurrency(plan.biWeeklyMax)}` : '+'}</span>
                  </div>
                </div>
                <Link href="/register">
                  <Button className="w-full bg-green-700 hover:bg-green-800 text-white">
                    Invest Now
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Investment Categories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Invest in ongoing farm projects and earn great returns.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {INVESTMENT_CATEGORIES.map((category, idx) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-5xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{category.name}</h3>
                <ul className="space-y-2">
                  {category.items.map((item, i) => (
                    <li key={i} className="text-gray-600 text-sm flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose <span className="text-green-700">AGEC?</span>
              </h2>
              <div className="space-y-6">
                {[
                  { icon: Shield, title: 'Secure & Transparent', desc: 'Your investments are protected with bank-level security and complete transparency.' },
                  { icon: Zap, title: 'Fast Returns', desc: 'Receive bi-weekly payouts directly to your wallet.' },
                  { icon: Leaf, title: 'Real Assets', desc: 'Every investment is backed by real agricultural projects.' },
                  { icon: TrendingUp, title: 'High ROI', desc: 'Earn up to 50% returns on your investment.' },
                ].map((feature, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="bg-green-100 p-3 rounded-xl h-fit">
                      <feature.icon className="w-6 h-6 text-green-700" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-gray-600">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=modern%20agricultural%20farm%20with%20crops%20and%20happy%20farmers&image_size=landscape_16_9"
                alt="Farmers"
                className="rounded-3xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Register Account', desc: 'Create your account in a few simple steps.' },
              { step: 2, title: 'Fund Wallet', desc: 'Deposit funds using our secure payment options.' },
              { step: 3, title: 'Choose Investment', desc: 'Select an investment plan that works for you.' },
              { step: 4, title: 'Earn & Withdraw', desc: 'Receive bi-weekly earnings and withdraw anytime.' },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-700">{step.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-8 right-0 w-full h-0.5 bg-gradient-to-r from-green-300 to-transparent translate-x-1/2" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-800 to-green-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Grow Your Wealth Through Agriculture?
          </h2>
          <p className="text-green-100 mb-8 text-lg">
            Join Agro Elite Community today and start your investment journey.
          </p>
          <Link href="/register">
            <Button className="bg-white text-green-800 hover:bg-gray-100 text-lg px-8 py-6 h-auto">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="w-6 h-6 text-green-500" />
                <span className="text-2xl font-bold text-white">AGEC</span>
              </div>
              <p className="text-gray-400 mb-4">
                Building wealth, growing farms, feeding nations.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-green-500 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Our Mission</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-green-500 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Invest</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-green-500 transition-colors">Investment Plans</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Farm Projects</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Referral Program</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Withdrawals</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
            <p>&copy; 2024 Agro Elite Community (AGEC). All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

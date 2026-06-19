'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { INVESTMENT_PLANS, INVESTMENT_CATEGORIES } from '@/lib/data';
import { Briefcase, CheckCircle, Calendar, TrendingUp, Plus, Leaf } from 'lucide-react';

// Sample user investments
const userInvestments = [
  { id: 1, plan: 'Poultry Farm Investment', planId: 'bronze', amount: 50000, date: '2024-05-15', status: 'Active', roi: 24, duration: 4, nextPayout: '2024-06-01', totalPayouts: 3, category: 'Livestock' },
  { id: 2, plan: 'Rice Farm Investment', planId: 'silver', amount: 100000, date: '2024-04-20', status: 'Active', roi: 30, duration: 6, nextPayout: '2024-06-03', totalPayouts: 4, category: 'Crops' },
  { id: 3, plan: 'Fish Farm Investment', planId: 'bronze', amount: 75000, date: '2024-03-10', status: 'Active', roi: 28, duration: 4, nextPayout: '2024-06-05', totalPayouts: 5, category: 'Livestock' },
  { id: 4, plan: 'Greenhouse Vegetables', planId: 'silver', amount: 125000, date: '2024-02-28', status: 'Active', roi: 32, duration: 6, nextPayout: '2024-06-07', totalPayouts: 6, category: 'Greenhouse' },
];

export default function InvestmentsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Investments</h1>
          <p className="text-gray-600 mt-1">Manage and track all your agricultural investments.</p>
        </div>
        <Button className="bg-green-700 hover:bg-green-800 text-white">
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
            <div className="text-3xl font-bold text-green-700">{formatCurrency(350000)}</div>
            <p className="text-sm text-gray-500 mt-1">4 Active Investments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">{formatCurrency(75000)}</div>
            <p className="text-sm text-gray-500 mt-1">From all investments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Expected ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">29.7%</div>
            <p className="text-sm text-gray-500 mt-1">Average return</p>
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
            {userInvestments.map((investment) => (
              <div key={investment.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Leaf className="w-7 h-7 text-green-700" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{investment.plan}</h3>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          {investment.status}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm mb-2">{investment.category} • Started {new Date(investment.date).toLocaleDateString()}</p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Invested:</span>{' '}
                          <span className="font-semibold">{formatCurrency(investment.amount)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">ROI:</span>{' '}
                          <span className="font-semibold text-green-700">{investment.roi}%</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Duration:</span>{' '}
                          <span className="font-semibold">{investment.duration} months</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Next Payout:</span>{' '}
                          <span className="font-semibold text-amber-700">{new Date(investment.nextPayout).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 lg:flex-shrink-0">
                    <Button variant="secondary" className="h-9">
                      View Details
                    </Button>
                    <Button className="h-9 bg-green-700 hover:bg-green-800 text-white">
                      Top Up
                    </Button>
                  </div>
                </div>
              </div>
            ))}
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
            {INVESTMENT_PLANS.map((plan) => (
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
                <Button className="w-full bg-green-700 hover:bg-green-800 text-white">
                  Invest Now
                </Button>
              </div>
            ))}
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
    </div>
  );
}

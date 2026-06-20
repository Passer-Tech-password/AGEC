import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, DollarSign, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Sample data
const userGrowthData = [
  { month: 'Jan', users: 120 },
  { month: 'Feb', users: 280 },
  { month: 'Mar', users: 450 },
  { month: 'Apr', users: 620 },
  { month: 'May', users: 810 },
  { month: 'Jun', users: 1050 },
];

const investmentGrowthData = [
  { month: 'Jan', amount: 2500000 },
  { month: 'Feb', amount: 4200000 },
  { month: 'Mar', amount: 6800000 },
  { month: 'Apr', amount: 9100000 },
  { month: 'May', amount: 11500000 },
  { month: 'Jun', amount: 14200000 },
];

const stats = [
  { label: 'Total Users', value: 1050, change: 15, changeType: 'up' },
  { label: 'Active Investors', value: 723, change: 12, changeType: 'up' },
  { label: 'Total Deposits', value: '₦14.2M', change: 18, changeType: 'up' },
  { label: 'Total Withdrawals', value: '₦5.8M', change: -3, changeType: 'down' },
  { label: 'Total Profit Paid', value: '₦2.1M', change: 22, changeType: 'up' },
  { label: 'Revenue Generated', value: '₦3.2M', change: 15, changeType: 'up' },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics & Insights</h1>
        <p className="text-gray-600 mt-1">Monitor platform performance and growth</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                  stat.changeType === 'up' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {stat.changeType === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {Math.abs(stat.change)}%
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-700" />
              <CardTitle>User Growth</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Line type="monotone" dataKey="users" stroke="#16a34a" strokeWidth={3} dot={{ fill: '#16a34a', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-700" />
              <CardTitle>Investment Growth</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={investmentGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" tickFormatter={(value) => `₦${value/1000000}M`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Investments']}
                  />
                  <Bar dataKey="amount" fill="#16a34a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

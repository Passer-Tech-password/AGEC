'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  User,
  Shield,
  FileCheck,
  Bell,
  CreditCard,
  Settings2,
  ChevronRight,
  Edit,
  Mail,
  Phone,
  UserCircle,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  LogOut
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Navigation items
const navItems = [
  { id: 'account', label: 'Account Information', icon: User, description: 'Update your personal details' },
  { id: 'security', label: 'Security', icon: Shield, description: 'Password and 2FA settings' },
  { id: 'kyc', label: 'KYC Verification', icon: FileCheck, description: 'Manage your KYC documents' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Email and push preferences' },
  { id: 'payment', label: 'Payment Methods', icon: CreditCard, description: 'Manage payment options' },
  { id: 'preferences', label: 'Preferences', icon: Settings2, description: 'Language and appearance' }
];

export default function SettingsPage() {
  const { user, userData } = useAuth();
  const [activeTab, setActiveTab] = useState('account');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account preferences, security and notification settings.</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-2">
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all ${
                        activeTab === item.id
                          ? 'bg-green-50 text-green-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <div className="flex-1 text-left">
                        <p className="font-medium">{item.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'account' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Account Information */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <div>
                      <CardTitle className="text-sm font-semibold text-gray-900">Account Information</CardTitle>
                      <CardDescription className="text-xs text-gray-500">Update your personal information and contact details.</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="text-green-700">
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                          <User className="w-4 h-4" />
                          <Label className="text-xs">Full Name</Label>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{userData?.fullName || 'John Investor'}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                          <Mail className="w-4 h-4" />
                          <Label className="text-xs">Email Address</Label>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{user?.email || 'john.investor@gmail.com'}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                          <Phone className="w-4 h-4" />
                          <Label className="text-xs">Phone Number</Label>
                        </div>
                        <p className="text-sm font-medium text-gray-900">+234 810 123 4567</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                          <UserCircle className="w-4 h-4" />
                          <Label className="text-xs">Username</Label>
                        </div>
                        <p className="text-sm font-medium text-gray-900">john_investor</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                          <UserCircle className="w-4 h-4" />
                          <Label className="text-xs">Account ID</Label>
                        </div>
                        <p className="text-sm font-medium text-gray-900">AGEC-78590</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                          <Calendar className="w-4 h-4" />
                          <Label className="text-xs">Member Since</Label>
                        </div>
                        <p className="text-sm font-medium text-gray-900">May 10, 2024</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Security Settings */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <div>
                      <CardTitle className="text-sm font-semibold text-gray-900">Security Settings</CardTitle>
                      <CardDescription className="text-xs text-gray-500">Keep your account safe and secure.</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="text-green-700">
                      Change Password
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Password</p>
                        <p className="text-xs text-gray-500">Last changed on May 10, 2024</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">••••••••••</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Two-Factor Authentication (2FA)</p>
                        <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-green-700">Enabled</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Login Activity</p>
                        <p className="text-xs text-gray-500">View your recent login activity</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>

                {/* Notification Preferences */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-gray-900">Notification Preferences</CardTitle>
                    <CardDescription className="text-xs text-gray-500">Choose how you want to receive updates.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { title: 'Email Notifications', desc: 'Receive updates via email', checked: true },
                      { title: 'Push Notifications', desc: 'Receive push notifications', checked: true },
                      { title: 'Investment Updates', desc: 'Get notified about your investments', checked: true },
                      { title: 'Promotions & Offers', desc: 'Receive updates on offers and bonuses', checked: false }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center mt-0.5">
                            {i === 0 && <Mail className="w-3 h-3 text-green-700" />}
                            {i === 1 && <Bell className="w-3 h-3 text-green-700" />}
                            {i === 2 && <CheckCircle2 className="w-3 h-3 text-green-700" />}
                            {i === 3 && <Bell className="w-3 h-3 text-green-700" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.title}</p>
                            <p className="text-xs text-gray-500">{item.desc}</p>
                          </div>
                        </div>
                        <div className="relative inline-block w-12 h-6">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={item.checked}
                            readOnly
                          />
                          <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-700"></div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column Cards */}
              <div className="space-y-6">
                {/* Profile Picture */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-gray-900">Profile Picture</CardTitle>
                    <CardDescription className="text-xs text-gray-500">Update your profile picture.</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-green-100">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300"
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button className="w-full bg-green-700 hover:bg-green-800 text-white text-sm">
                      Change Photo
                    </Button>
                    <p className="text-xs text-gray-400 mt-2">JPG, PNG or WEBP. Max size 2MB.</p>
                  </CardContent>
                </Card>

                {/* Account Status */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-gray-900">Account Status</CardTitle>
                    <CardDescription className="text-xs text-gray-500">Your account is active and in good standing.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-7 h-7 bg-green-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-700">Verified Account</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-green-700" />
                        <span>Email Verified</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-green-700" />
                        <span>KYC Verified</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-green-700" />
                        <span>Phone Verified</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-red-100">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-red-700">Danger Zone</CardTitle>
                    <CardDescription className="text-xs text-gray-500">These actions are irreversible. Please proceed with caution.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="destructive" className="w-full bg-white text-red-700 border border-red-200 hover:bg-red-50">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Deactivate Account
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Other Tabs Placeholder */}
          {activeTab !== 'account' && (
            <Card>
              <CardContent className="p-12 text-center">
                <Settings2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {navItems.find(item => item.id === activeTab)?.label}
                </h3>
                <p className="text-gray-500">This section is under development</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

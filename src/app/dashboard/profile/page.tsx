'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  CreditCard, 
  Banknote, 
  MapPin, 
  UserCheck, 
  Edit, 
  CheckCircle, 
  Clock, 
  Map, 
  Monitor, 
  Headphones, 
  MessageCircle
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserData } from '@/lib/firebaseServices';
import { formatCurrency } from '@/lib/utils';

const tabs = [
  { id: 'personal', label: 'Personal Information' },
  { id: 'contact', label: 'Contact Information' },
  { id: 'bank', label: 'Bank Details' }
];

export default function ProfilePage() {
  const { user, userData, refreshUserData } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [fullName, setFullName] = useState(userData?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(userData?.phoneNumber || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await updateUserData(user.uid, {
        fullName,
        phoneNumber,
      });
      await refreshUserData();
      alert('Profile updated successfully!');
    } catch (err) {
      console.error("Error updating profile:", err);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const userName = userData?.fullName || user?.displayName || 'John Investor';
  const userInitial = userName.charAt(0).toUpperCase();
  const memberSince = userData?.createdAt?.toDate 
    ? userData.createdAt.toDate() 
    : new Date('2024-05-10');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-1">Manage your personal information and account details.</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Header Card */}
          <Card className="border-green-100 bg-gradient-to-br from-white to-green-50/30">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Profile Photo */}
                <div className="relative flex-shrink-0">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-100 bg-gradient-to-br from-green-100 to-green-200">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 w-10 h-10 bg-green-700 rounded-full flex items-center justify-center border-3 border-white">
                    <UserCheck className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-gray-900">{userName}</h2>
                    <div className="flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-xs font-medium">Verified Investor</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Member ID</p>
                      <p className="font-semibold text-gray-900">AGEC-{user?.uid?.slice(0, 6).toUpperCase() || '78590'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Member Since</p>
                      <p className="font-semibold text-gray-900">{memberSince.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 w-full md:w-auto">
                  <div className="text-center p-4 bg-white rounded-xl border border-gray-100">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <User className="w-4 h-4 text-green-700" />
                    </div>
                    <p className="text-xs text-gray-500 mb-1">Total Investment</p>
                    <p className="font-bold text-gray-900">{formatCurrency(userData?.totalInvested || 35000000)}</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl border border-gray-100">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Calendar className="w-4 h-4 text-green-700" />
                    </div>
                    <p className="text-xs text-gray-500 mb-1">Total Earnings</p>
                    <p className="font-bold text-green-700">{formatCurrency(userData?.totalEarnings || 12000000)}</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl border border-gray-100">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <ShieldCheck className="w-4 h-4 text-green-700" />
                    </div>
                    <p className="text-xs text-gray-500 mb-1">Withdrawn</p>
                    <p className="font-bold text-gray-900">{formatCurrency(userData?.totalWithdrawn || 7500000)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs & Content */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex gap-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-4 text-sm font-medium transition-all relative ${
                      activeTab === tab.id
                        ? 'text-green-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-700 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="text-green-700">
                <Edit className="w-4 h-4 mr-1.5" />
                Edit Profile
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              {activeTab === 'personal' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <User className="w-4 h-4" />
                        <span className="text-xs">Full Name</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{userName}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <User className="w-4 h-4" />
                        <span className="text-xs">Username</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{userName.toLowerCase().replace(/\s+/g, '_')}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs">Date of Birth</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">May 10, 1990</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <User className="w-4 h-4" />
                        <span className="text-xs">Gender</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">Male</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-xs">Nationality</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">Nigerian</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs">Marital Status</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">Single</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs">Occupation</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">Entrepreneur</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <CreditCard className="w-4 h-4" />
                        <span className="text-xs">Source of Income</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">Business</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <Banknote className="w-4 h-4" />
                        <span className="text-xs">ID Type</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">National ID</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm font-medium text-gray-900 mb-3">Bio</p>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-sm text-gray-600">
                        Passionate about agriculture and building sustainable wealth through smart investments.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'contact' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <Mail className="w-4 h-4" />
                        <span className="text-xs">Email</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{user?.email || 'john.investor@gmail.com'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <Phone className="w-4 h-4" />
                        <span className="text-xs">Phone Number</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{phoneNumber || '+234 810 123 4567'}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'bank' && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">Bank Name</p>
                    <p className="text-sm font-semibold text-gray-900">First Bank of Nigeria</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">Account Name</p>
                    <p className="text-sm font-semibold text-gray-900">{userName}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">Account Number</p>
                    <p className="text-sm font-semibold text-gray-900">2012345678</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Activity */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-gray-900">Account Activity</CardTitle>
              <CardDescription className="text-xs text-gray-500">Overview of your account activity.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs">Last Login</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    <br />
                    <span className="text-xs text-gray-500">10:30 AM</span>
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs">Account Created</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{memberSince.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs">Login IP Address</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">197.210.45.12</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <Monitor className="w-4 h-4" />
                    <span className="text-xs">Device</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">Chrome on Windows</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support Card */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Headphones className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Need help?</h3>
                    <p className="text-xs text-gray-600">
                      If you need any assistance with your account, our support team is here to help you.
                    </p>
                  </div>
                </div>
                <Button className="bg-green-700 hover:bg-green-800 text-white whitespace-nowrap">
                  Contact Support
                  <MessageCircle className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Profile Photo Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-semibold text-gray-900">Profile Picture</CardTitle>
              <CardDescription className="text-xs text-gray-500">This will be displayed on your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <Button variant="ghost" className="w-full bg-white border border-green-200 text-green-700 hover:bg-green-50">
                Change Photo
              </Button>
              <p className="text-xs text-gray-500 text-center">
                JPG, PNG or WEBP. Max size: 2MB.
              </p>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-semibold text-gray-900">Account Status</CardTitle>
              <CardDescription className="text-xs text-gray-500">Your account is active and in good standing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-7 h-7 bg-green-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-700">Active Account</p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-700" />
                  <span>Email Verified</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-700" />
                  <span>KYC Verified</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-700" />
                  <span>Phone Verified</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

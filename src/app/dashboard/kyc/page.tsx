'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ShieldCheck, 
  Upload, 
  CheckCircle, 
  Clock, 
  XCircle,
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  FileText,
  Home,
  Camera,
  Lock,
  ArrowRight,
  AlertCircle,
  Info,
  Edit
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserKYC, submitKYC, KYCSubmission } from '@/lib/firebaseServices';

export default function KYCPage() {
  const { user, userData, refreshUserData } = useAuth();
  const [kyc, setKyc] = useState<KYCSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [fullName, setFullName] = useState(userData?.fullName || '');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [phoneNumber, setPhoneNumber] = useState(userData?.phoneNumber || '');
  const [email, setEmail] = useState(user?.email || '');
  const [residentialAddress, setResidentialAddress] = useState('');
  const [idType, setIdType] = useState<'nin' | 'voter' | 'driver' | 'passport'>('nin');
  const [idNumber, setIdNumber] = useState('');
  const [idImageUrl, setIdImageUrl] = useState('');
  const [selfieUrl, setSelfieUrl] = useState('');
  const [addressProofUrl, setAddressProofUrl] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (user) {
      getUserKYC(user.uid).then(k => {
        setKyc(k);
        setLoading(false);
      }).catch(err => {
        console.error("Error fetching KYC:", err);
        setLoading(false);
      });
    }
  }, [user]);

  const handleSubmitKYC = async () => {
    if (!user) return;

    setSubmitLoading(true);
    try {
      await submitKYC(user.uid, idType, idNumber, idImageUrl, selfieUrl);
      await refreshUserData();
      const newKyc = await getUserKYC(user.uid);
      setKyc(newKyc);
      alert('KYC submitted successfully!');
    } catch (err) {
      console.error("Error submitting KYC:", err);
      alert('Failed to submit KYC. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  const steps = [
    { id: 1, title: 'Personal Info', description: 'Provide your details', completed: true },
    { id: 2, title: 'Documents', description: 'Upload documents', completed: false },
    { id: 3, title: 'Review', description: 'Verify your information', completed: false },
    { id: 4, title: 'Completed', description: 'Get verified', completed: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-gray-900">KYC Verification</h1>
            <CheckCircle className="w-6 h-6 text-green-700" />
          </div>
          <p className="text-gray-600 mt-1">Complete your KYC verification to unlock full access to all features.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 lg:gap-8">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    step.completed 
                      ? 'bg-green-700 border-green-700 text-white' 
                      : 'bg-white border-gray-200 text-gray-400'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <span className="font-semibold">{step.id}</span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-gray-900 mt-2">{step.title}</p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-12 lg:w-24 h-0.5 ${step.completed ? 'bg-green-700' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Personal Information Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold text-gray-900">Personal Information</CardTitle>
                  <CardDescription className="text-xs text-gray-500">Please provide your personal details as they appear on your official document.</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-green-700">
                <Edit className="w-4 h-4 mr-1.5" />
                Edit
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <User className="w-4 h-4" />
                    <span className="text-xs">Full Name</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{fullName || 'John Investor'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs">Date of Birth</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{dateOfBirth || 'May 10, 1990'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs">Country</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{country}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <Phone className="w-4 h-4" />
                    <span className="text-xs">Phone Number</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{phoneNumber || '+234 810 123 4567'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <Mail className="w-4 h-4" />
                    <span className="text-xs">Email Address</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{email || 'john.investor@gmail.com'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs">Residential Address</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{residentialAddress || '12 Green Avenue, Yaba, Lagos, Nigeria'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents Upload */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold text-gray-900">Documents Upload</CardTitle>
                  <CardDescription className="text-xs text-gray-500">Upload clear, valid and unexpired documents.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 rounded-xl bg-white">
                  <div className="flex items-center gap-2 text-gray-500 mb-3">
                    <FileText className="w-4 h-4" />
                    <span className="text-xs font-medium text-gray-900">Identity Document</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">Upload any government issued ID</p>
                  <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center mb-3">
                    {idImageUrl ? (
                      <div className="space-y-2">
                        <CheckCircle className="w-8 h-8 text-green-700 mx-auto" />
                        <p className="text-xs text-gray-600">File uploaded</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                        <p className="text-xs text-gray-500">No file uploaded</p>
                        <p className="text-[10px] text-gray-400">JPG, PNG or PDF. Max size: 5MB.</p>
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    className="w-full bg-white border border-green-200 text-green-700 hover:bg-green-50"
                    onClick={() => {
                      const mockUrl = 'https://example.com/id.jpg';
                      setIdImageUrl(mockUrl);
                    }}
                  >
                    Choose File
                  </Button>
                  <p className="text-[10px] text-gray-400 mt-2">Accepted: National ID, International Passport, Driver&apos;s License, Voter&apos;s Card</p>
                </div>

                <div className="p-4 border border-gray-200 rounded-xl bg-white">
                  <div className="flex items-center gap-2 text-gray-500 mb-3">
                    <Home className="w-4 h-4" />
                    <span className="text-xs font-medium text-gray-900">Proof of Address</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">Upload document not older than 3 months</p>
                  <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center mb-3">
                    {addressProofUrl ? (
                      <div className="space-y-2">
                        <CheckCircle className="w-8 h-8 text-green-700 mx-auto" />
                        <p className="text-xs text-gray-600">File uploaded</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                        <p className="text-xs text-gray-500">No file uploaded</p>
                        <p className="text-[10px] text-gray-400">JPG, PNG or PDF. Max size: 5MB.</p>
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    className="w-full bg-white border border-green-200 text-green-700 hover:bg-green-50"
                    onClick={() => {
                      const mockUrl = 'https://example.com/address.jpg';
                      setAddressProofUrl(mockUrl);
                    }}
                  >
                    Choose File
                  </Button>
                  <p className="text-[10px] text-gray-400 mt-2">Accepted: Utility Bill, Bank Statement, Tenancy Agreement</p>
                </div>

                <div className="p-4 border border-gray-200 rounded-xl bg-white">
                  <div className="flex items-center gap-2 text-gray-500 mb-3">
                    <Camera className="w-4 h-4" />
                    <span className="text-xs font-medium text-gray-900">Selfie / Face Photo</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">Take a clear selfie</p>
                  <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center mb-3">
                    {selfieUrl ? (
                      <div className="space-y-2">
                        <CheckCircle className="w-8 h-8 text-green-700 mx-auto" />
                        <p className="text-xs text-gray-600">File uploaded</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                        <p className="text-xs text-gray-500">No file uploaded</p>
                        <p className="text-[10px] text-gray-400">JPG, PNG or PDF. Max size: 5MB.</p>
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    className="w-full bg-white border border-green-200 text-green-700 hover:bg-green-50"
                    onClick={() => {
                      const mockUrl = 'https://example.com/selfie.jpg';
                      setSelfieUrl(mockUrl);
                    }}
                  >
                    Choose File
                  </Button>
                  <p className="text-[10px] text-gray-400 mt-2">Accepted: Clear selfies, no filters, face fully visible</p>
                </div>
              </div>

              <div className="mt-6 flex items-start justify-between flex-wrap gap-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-700 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-600">Ensure all information is correct before submission. Incorrect information may cause delay in verification.</p>
                </div>
                <Button 
                  className="bg-green-700 hover:bg-green-800 text-white"
                  onClick={handleSubmitKYC}
                  disabled={submitLoading}
                >
                  {submitLoading ? 'Submitting...' : 'Submit for Verification'}
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Note */}
          <div className="flex items-start gap-2 text-xs text-gray-500 p-4">
            <Lock className="w-4 h-4 flex-shrink-0 text-green-700" />
            <p>Your information is secure and encrypted. AGEC is committed to protecting your privacy and data.</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* KYC Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-sm font-semibold text-gray-900">KYC Status</CardTitle>
              <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">Pending</span>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="36" stroke="#E5E7EB" strokeWidth="6" fill="none" />
                    <circle cx="40" cy="40" r="36" stroke="#15803D" strokeWidth="6" fill="none" strokeDasharray="226" strokeDashoffset="169.5" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-lg font-bold text-gray-900">25%</p>
                    <p className="text-[10px] text-amber-700 font-medium">In Progress</p>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Your KYC verification is currently being reviewed.</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle className="w-4 h-4 text-green-700" />
                  <span className="text-gray-600">Personal Information</span>
                  <span className="text-gray-400 ml-auto">Completed</span>
                  <span className="text-gray-400">May 15, 2024</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span className="text-gray-600">Documents Upload</span>
                  <span className="text-gray-400 ml-auto">In Progress</span>
                  <span className="text-gray-400">May 15, 2024</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="w-4 h-4 text-gray-300" />
                  <span className="text-gray-400">Review & Completed</span>
                  <span className="text-gray-400 ml-auto">Pending</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="border-green-100 bg-gradient-to-br from-green-50 to-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-700" />
                Benefits of KYC Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-700">
                <CheckCircle className="w-3 h-3 text-green-700 flex-shrink-0" />
                Higher withdrawal limits
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-700">
                <CheckCircle className="w-3 h-3 text-green-700 flex-shrink-0" />
                Faster withdrawals
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-700">
                <CheckCircle className="w-3 h-3 text-green-700 flex-shrink-0" />
                Access to exclusive projects
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-700">
                <CheckCircle className="w-3 h-3 text-green-700 flex-shrink-0" />
                Enhanced account security
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-700">
                <CheckCircle className="w-3 h-3 text-green-700 flex-shrink-0" />
                Build trust in the community
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-600 mb-3">If you have any issues with your KYC verification, our support team is here to help you.</p>
              <Button variant="ghost" className="w-full bg-white border border-green-200 text-green-700 hover:bg-green-50">
                Contact Support
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

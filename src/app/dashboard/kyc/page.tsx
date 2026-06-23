'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Upload, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserKYC, submitKYC, KYCSubmission } from '@/lib/firebaseServices';

export default function KYCPage() {
  const { user, userData, refreshUserData } = useAuth();
  const [kyc, setKyc] = useState<KYCSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [idType, setIdType] = useState<'nin' | 'voter' | 'driver' | 'passport'>('nin');
  const [idNumber, setIdNumber] = useState('');
  const [idImageUrl, setIdImageUrl] = useState('');
  const [selfieUrl, setSelfieUrl] = useState('');
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
    if (!user || !idNumber || !idImageUrl || !selfieUrl) return;

    setSubmitLoading(true);
    try {
      await submitKYC(user.uid, idType, idNumber, idImageUrl, selfieUrl);
      await refreshUserData();
      const newKyc = await getUserKYC(user.uid);
      setKyc(newKyc);
      setShowForm(false);
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">KYC Verification</h1>
        <p className="text-gray-600 mt-1">Verify your identity to unlock all features.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            Verification Status
          </CardTitle>
          <CardDescription>Complete your KYC to withdraw funds</CardDescription>
        </CardHeader>
        <CardContent>
          {userData?.kycVerified ? (
            <div className="p-6 bg-green-50 rounded-xl border border-green-200 mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <p className="font-semibold text-green-800">Verified</p>
                  <p className="text-green-700 text-sm">
                    Your account has been verified
                  </p>
                </div>
              </div>
            </div>
          ) : kyc ? (
            <div className={`p-6 rounded-xl border mb-6 ${
              kyc.status === 'pending' ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-3">
                {kyc.status === 'pending' ? (
                  <Clock className="w-8 h-8 text-yellow-600" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-600" />
                )}
                <div>
                  <p className="font-semibold text-gray-800 capitalize">{kyc.status}</p>
                  <p className="text-gray-700 text-sm">
                    {kyc.status === 'pending'
                      ? 'Your KYC is being reviewed'
                      : 'Your KYC was rejected. Please resubmit.'}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {kyc ? (
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-xl">
                <p className="font-medium text-gray-900 mb-2">ID Type</p>
                <p className="text-sm text-gray-500 capitalize mb-3">{kyc.idType}</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-xl">
                <p className="font-medium text-gray-900 mb-2">ID Number</p>
                <p className="text-sm text-gray-500 mb-3">{kyc.idNumber}</p>
              </div>
            </div>
          ) : null}

          {!kyc || kyc.status === 'rejected' ? (
            <div className="mt-6">
              {!showForm ? (
                <Button className="bg-green-700 hover:bg-green-800 text-white" onClick={() => setShowForm(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  {kyc ? 'Resubmit KYC' : 'Submit KYC'}
                </Button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="idType">ID Type</Label>
                    <select
                      id="idType"
                      className="w-full mt-2 border border-gray-200 rounded-lg px-4 py-2"
                      value={idType}
                      onChange={(e) => setIdType(e.target.value as any)}
                    >
                      <option value="nin">NIN</option>
                      <option value="voter">Voter's Card</option>
                      <option value="driver">Driver's License</option>
                      <option value="passport">International Passport</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="idNumber">ID Number</Label>
                    <Input
                      id="idNumber"
                      type="text"
                      placeholder="Enter ID number"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="idImageUrl">ID Image URL</Label>
                    <Input
                      id="idImageUrl"
                      type="text"
                      placeholder="https://example.com/id.jpg"
                      value={idImageUrl}
                      onChange={(e) => setIdImageUrl(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="selfieUrl">Selfie Image URL</Label>
                    <Input
                      id="selfieUrl"
                      type="text"
                      placeholder="https://example.com/selfie.jpg"
                      value={selfieUrl}
                      onChange={(e) => setSelfieUrl(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="bg-green-700 hover:bg-green-800 text-white"
                      onClick={handleSubmitKYC}
                      disabled={submitLoading}
                    >
                      {submitLoading ? 'Submitting...' : 'Submit KYC'}
                    </Button>
                    <Button variant="ghost" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

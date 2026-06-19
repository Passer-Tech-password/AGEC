'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Upload, CheckCircle } from 'lucide-react';

export default function KYCPage() {
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
          <div className="p-6 bg-green-50 rounded-xl border border-green-200 mb-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="font-semibold text-green-800">Verified</p>
                <p className="text-green-700 text-sm">Your account has been verified on May 15, 2024</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-xl">
              <p className="font-medium text-gray-900 mb-2">National ID</p>
              <p className="text-sm text-gray-600 mb-3">Document uploaded and verified</p>
              <Button variant="secondary">View Document</Button>
            </div>
            <div className="p-4 border border-gray-200 rounded-xl">
              <p className="font-medium text-gray-900 mb-2">Passport Photograph</p>
              <p className="text-sm text-gray-600 mb-3">Document uploaded and verified</p>
              <Button variant="secondary">View Document</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

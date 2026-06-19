'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminKYCPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">KYC Verification</h1>
        <p className="text-gray-600 mt-1">Review and verify user KYC documents.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Pending KYC</CardTitle>
          <CardDescription>KYC applications awaiting review</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">KYC review interface would appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}

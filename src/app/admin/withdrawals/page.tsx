'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminWithdrawalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Withdrawal Requests</h1>
        <p className="text-gray-600 mt-1">Process withdrawal requests.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Pending Withdrawals</CardTitle>
          <CardDescription>Withdrawals awaiting approval</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Withdrawal requests table would appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}

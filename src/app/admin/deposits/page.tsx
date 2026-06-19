'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDepositsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Deposit Management</h1>
        <p className="text-gray-600 mt-1">View and verify deposits.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Deposits</CardTitle>
          <CardDescription>Recent deposit transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Deposits table would appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminInvestmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Investment Management</h1>
        <p className="text-gray-600 mt-1">Manage all investments on the platform.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Investments</CardTitle>
          <CardDescription>List of all investments</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Investment management table would appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
        <p className="text-gray-600 mt-1">View detailed platform analytics.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Reports Dashboard</CardTitle>
          <CardDescription>Comprehensive analytics and insights</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Analytics charts and reports would appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}

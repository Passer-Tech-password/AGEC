'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
        <p className="text-gray-600 mt-1">Configure platform settings.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Platform Settings</CardTitle>
          <CardDescription>Configure general platform settings</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Platform settings interface would appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}

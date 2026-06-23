'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserData } from '@/lib/firebaseServices';

export default function ProfilePage() {
  const { user, userData, refreshUserData } = useAuth();
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-1">Manage your account settings and personal information.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                defaultValue={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ''}
                disabled
                className="mt-2 bg-gray-50"
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                defaultValue={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          <Button
            className="mt-6 bg-green-700 hover:bg-green-800 text-white"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

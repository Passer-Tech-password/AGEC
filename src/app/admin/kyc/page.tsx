'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAllKYCs, getAllUsers, updateKYCStatus } from '@/lib/firebaseServices';
import { KYCSubmission, UserData } from '@/lib/firebaseServices';

export default function AdminKYCPage() {
  const [loading, setLoading] = useState(true);
  const [kycs, setKYCs] = useState<KYCSubmission[]>([]);
  const [users, setUsers] = useState<Record<string, UserData>>({});
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kycsData, usersData] = await Promise.all([
          getAllKYCs(),
          getAllUsers()
        ]);
        const usersMap: Record<string, UserData> = {};
        usersData.forEach(u => { usersMap[u.uid] = u; });
        setUsers(usersMap);
        setKYCs(kycsData);
      } catch (err) {
        console.error('Error fetching KYCs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    setProcessing(id);
    try {
      await updateKYCStatus(id, status);
      // Refresh the list
      const updatedKYCs = await getAllKYCs();
      setKYCs(updatedKYCs);
    } catch (err) {
      console.error('Error updating KYC status:', err);
      alert('Failed to update status');
    } finally {
      setProcessing(null);
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
        <p className="text-gray-600 mt-1">Review and verify user KYC documents.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Pending KYC</CardTitle>
          <CardDescription>KYC applications awaiting review</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {kycs.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No KYC submissions</p>
            ) : (
              kycs.map((kyc) => (
                <div key={kyc.id} className="p-6 border border-gray-200 rounded-xl">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">
                          {users[kyc.userId]?.fullName.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{users[kyc.userId]?.fullName || 'User'}</p>
                          <p className="text-sm text-gray-500">{users[kyc.userId]?.email}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">ID Type</p>
                          <p className="font-medium text-gray-900">{kyc.idType.charAt(0).toUpperCase() + kyc.idType.slice(1)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">ID Number</p>
                          <p className="font-medium text-gray-900">{kyc.idNumber}</p>
                        </div>
                      </div>

                      {kyc.idImageUrl && (
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 mb-2">ID Document</p>
                          <a href={kyc.idImageUrl} target="_blank" rel="noopener noreferrer">
                            <img
                              src={kyc.idImageUrl}
                              alt="ID Document"
                              className="w-full max-w-xs h-40 object-cover rounded-lg border border-gray-200"
                            />
                          </a>
                        </div>
                      )}

                      {kyc.selfieUrl && (
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 mb-2">Selfie</p>
                          <a href={kyc.selfieUrl} target="_blank" rel="noopener noreferrer">
                            <img
                              src={kyc.selfieUrl}
                              alt="Selfie"
                              className="w-full max-w-xs h-40 object-cover rounded-lg border border-gray-200"
                            />
                          </a>
                        </div>
                      )}

                      <p className="text-xs text-gray-500">
                        Submitted on {new Date(kyc.createdAt.toDate()).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="mb-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          kyc.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          kyc.status === 'approved' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {kyc.status === 'pending' ? <Clock className="w-3 h-3" /> :
                           kyc.status === 'approved' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {kyc.status.charAt(0).toUpperCase() + kyc.status.slice(1)}
                        </span>
                      </div>
                      {kyc.status === 'pending' && (
                        <>
                          <Button
                            className="h-8 text-xs bg-green-700 hover:bg-green-800"
                            onClick={() => handleStatusChange(kyc.id!, 'approved')}
                            disabled={processing === kyc.id}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            className="h-8 text-xs bg-red-600 hover:bg-red-700"
                            onClick={() => handleStatusChange(kyc.id!, 'rejected')}
                            disabled={processing === kyc.id}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

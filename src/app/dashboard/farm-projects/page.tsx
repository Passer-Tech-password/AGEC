'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';
import { getFarmProjects, getUserInvestments, createInvestment, FarmProject, UserInvestment, InvestmentPlanData } from '@/lib/firebaseServices';
import { Leaf, Plus, X, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function FarmProjectsPage() {
  const { user, userData, refreshUserData } = useAuth();
  const [projects, setProjects] = useState<FarmProject[]>([]);
  const [investments, setInvestments] = useState<UserInvestment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<FarmProject | null>(null);
  const [investAmount, setInvestAmount] = useState('');
  const [investLoading, setInvestLoading] = useState(false);

  useEffect(() => {
    if (user) {
      Promise.all([
        getFarmProjects(),
        getUserInvestments(user.uid)
      ]).then(([proj, inv]) => {
        setProjects(proj);
        setInvestments(inv);
        setLoading(false);
      }).catch(err => {
        console.error("Error fetching farm projects data:", err);
        setLoading(false);
      });
    }
  }, [user]);

  const handleInvest = async () => {
    if (!user || !selectedProject || !investAmount) return;
    const amount = parseFloat(investAmount);
    if (isNaN(amount) || amount <= 0) return;
    if (amount < 1000) { // Minimum investment example
      alert("Minimum investment is ₦1000");
      return;
    }
    if (userData && amount > userData.walletBalance) {
      alert('Insufficient balance');
      return;
    }

    setInvestLoading(true);
    try {
      // Convert FarmProject to InvestmentPlanData-like structure for createInvestment
      const planData: InvestmentPlanData = {
        id: selectedProject.id!,
        name: selectedProject.name,
        description: selectedProject.description,
        minInvestment: 1000,
        maxInvestment: undefined,
        roiPercentage: selectedProject.roiPercentage,
        durationDays: selectedProject.durationDays,
        biWeeklyPayout: Math.floor(amount * (selectedProject.roiPercentage / 100) / (selectedProject.durationDays / 14)),
        popular: false,
        featured: false,
        features: [],
        active: true,
        createdAt: selectedProject.createdAt
      };
      await createInvestment(user.uid, planData, amount);
      await refreshUserData();
      // Refresh investments list
      const newInvestments = await getUserInvestments(user.uid);
      setInvestments(newInvestments);
      setShowInvestModal(false);
      setSelectedProject(null);
      setInvestAmount('');
      alert('Investment created successfully!');
    } catch (err) {
      console.error("Error creating investment:", err);
      alert('Failed to create investment. Please try again.');
    } finally {
      setInvestLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-green-700 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Farm Projects</h1>
        <p className="text-gray-600 mt-1">Explore and invest in our available farm projects.</p>
      </div>

      {projects.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No farm projects available at the moment</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden border-2 border-gray-100 hover:border-green-300 hover:shadow-xl transition-all duration-300">
              <div className="relative h-48">
                <img
                  src={project.imageUrl}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-green-700 text-white px-3 py-1 rounded-lg text-xs font-semibold">
                  {project.roiPercentage}% ROI
                </div>
              </div>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                    <p className="text-gray-500 text-sm">{project.location}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-green-50 rounded-xl">
                    <p className="text-gray-500 text-xs mb-1">Investment</p>
                    <p className="font-bold text-gray-900 text-sm">{formatCurrency(project.investmentAmount)}</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-xl">
                    <p className="text-gray-500 text-xs mb-1">ROI</p>
                    <p className="font-bold text-green-700 text-sm">{project.roiPercentage}%</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-xl">
                    <p className="text-gray-500 text-xs mb-1">Duration</p>
                    <p className="font-bold text-gray-900 text-sm">{project.durationDays} Days</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    {project.spotsLeft} spots left
                  </span>
                  <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                    Active
                  </span>
                </div>

                <Button
                  className="w-full bg-green-700 hover:bg-green-800 text-white"
                  onClick={() => {
                    setSelectedProject(project);
                    setShowInvestModal(true);
                  }}
                >
                  Invest Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Invest Modal */}
      {showInvestModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Invest in {selectedProject.name}</CardTitle>
                <CardDescription>{selectedProject.description}</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => {
                setShowInvestModal(false);
                setSelectedProject(null);
              }}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Minimum Investment</p>
                    <p className="font-semibold text-gray-900">{formatCurrency(1000)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">ROI</p>
                    <p className="font-semibold text-green-700">{selectedProject.roiPercentage}%</p>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="invest-amount">Amount (₦)</Label>
                <Input
                  id="invest-amount"
                  type="number"
                  placeholder={`Minimum: ${formatCurrency(1000)}`}
                  value={investAmount}
                  onChange={(e) => setInvestAmount(e.target.value)}
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Available: {formatCurrency(userData?.walletBalance || 0)}
                </p>
              </div>
              <Button
                onClick={handleInvest}
                className="w-full bg-green-700 hover:bg-green-800 text-white"
                disabled={investLoading}
              >
                {investLoading ? 'Processing...' : 'Confirm Investment'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

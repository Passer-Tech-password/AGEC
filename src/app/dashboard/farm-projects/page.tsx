'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';
import { getFarmProjects, getUserInvestments, createInvestment, FarmProject, UserInvestment, InvestmentPlanData } from '@/lib/firebaseServices';
import { Leaf, Plus, X, Loader2, Search, Filter, CheckCircle, ChevronLeft, ChevronRight, Users, Calendar, DollarSign, Shield, Wallet, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Timestamp } from 'firebase/firestore';

// Fallback data for farm projects
const fallbackProjects: FarmProject[] = [
  {
    id: "project-1",
    name: "Poultry Farm Expansion",
    location: "Ogun State, Nigeria",
    description: "Modern poultry farm with high-yield broilers and layers",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800",
    investmentAmount: 5000000,
    roiPercentage: 24,
    durationDays: 120,
    spotsLeft: 45,
    active: true,
    createdAt: Timestamp.now()
  },
  {
    id: "project-2",
    name: "Rice Farm Project",
    location: "Niger State, Nigeria",
    description: "Large-scale rice production with modern irrigation",
    imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800",
    investmentAmount: 10000000,
    roiPercentage: 30,
    durationDays: 150,
    spotsLeft: 32,
    active: true,
    createdAt: Timestamp.now()
  },
  {
    id: "project-3",
    name: "Catfish Farm Project",
    location: "Oyo State, Nigeria",
    description: "Commercial catfish farming in controlled ponds",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
    investmentAmount: 4000000,
    roiPercentage: 22,
    durationDays: 90,
    spotsLeft: 58,
    active: true,
    createdAt: Timestamp.now()
  },
  {
    id: "project-4",
    name: "Greenhouse Tomato Project",
    location: "Kaduna State, Nigeria",
    description: "Hydroponic tomato farming in controlled environment",
    imageUrl: "https://images.unsplash.com/photo-1530836362855-f30a47322e2a?auto=format&fit=crop&q=80&w=800",
    investmentAmount: 3000000,
    roiPercentage: 28,
    durationDays: 105,
    spotsLeft: 76,
    active: true,
    createdAt: Timestamp.now()
  },
  {
    id: "project-5",
    name: "Cattle Rearing Project",
    location: "Plateau State, Nigeria",
    description: "Grass-fed cattle rearing for premium beef",
    imageUrl: "https://images.unsplash.com/photo-1500594953549-82e61e506074?auto=format&fit=crop&q=80&w=800",
    investmentAmount: 7500000,
    roiPercentage: 35,
    durationDays: 180,
    spotsLeft: 25,
    active: true,
    createdAt: Timestamp.now()
  },
  {
    id: "project-6",
    name: "Cashew Plantation Project",
    location: "Enugu State, Nigeria",
    description: "High-yield cashew plantation in the east",
    imageUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800",
    investmentAmount: 3500000,
    roiPercentage: 26,
    durationDays: 135,
    spotsLeft: 85,
    active: true,
    createdAt: Timestamp.now()
  }
];

// Project categories
const categories = [
  { id: "all", name: "All Projects" },
  { id: "crop-farming", name: "Crop Farming" },
  { id: "livestock", name: "Livestock" },
  { id: "poultry", name: "Poultry" },
  { id: "aquaculture", name: "Aquaculture" },
  { id: "greenhouse", name: "Greenhouse" },
  { id: "agro-processing", name: "Agro-processing" }
];

// Featured projects
const featuredProjectIds = ["project-1", "project-2"];

export default function FarmProjectsPage() {
  const { user, userData, refreshUserData } = useAuth();
  const [projects, setProjects] = useState<FarmProject[]>([]);
  const [investments, setInvestments] = useState<UserInvestment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<FarmProject | null>(null);
  const [investAmount, setInvestAmount] = useState('');
  const [investLoading, setInvestLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;

  useEffect(() => {
    if (user) {
      Promise.all([
        getFarmProjects(),
        getUserInvestments(user.uid)
      ]).then(([proj, inv]) => {
        setProjects(proj.length > 0 ? proj : fallbackProjects);
        setInvestments(inv);
        setLoading(false);
      }).catch(err => {
        console.error("Error fetching farm projects data:", err);
        setProjects(fallbackProjects);
        setLoading(false);
      });
    }
  }, [user]);

  // Filter and search projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || true; // Simplified for now
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  // Helper to calculate raised amount (mock 70% of investment amount)
  const getRaisedAmount = (project: FarmProject) => {
    return Math.floor(project.investmentAmount * 0.7);
  };

  // Helper to calculate progress percentage
  const getProgressPercentage = (project: FarmProject) => {
    return Math.floor((getRaisedAmount(project) / project.investmentAmount) * 100);
  };

  const handleInvest = async () => {
    if (!user || !selectedProject || !investAmount) return;
    const amount = parseFloat(investAmount);
    if (isNaN(amount) || amount <= 0) return;
    if (amount < 10000) { // Minimum investment example
      alert("Minimum investment is ₦10,000");
      return;
    }
    if (userData && amount > userData.walletBalance) {
      alert('Insufficient balance');
      return;
    }

    setInvestLoading(true);
    try {
      const planData: InvestmentPlanData = {
        id: selectedProject.id!,
        name: selectedProject.name,
        description: selectedProject.description,
        minInvestment: 10000,
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
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Farm Projects</h1>
        <p className="text-gray-600">Invest in verified agricultural projects and grow your wealth.</p>
      </div>

      {/* Top Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search farm projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-600"
          />
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-600">
            <option>Newest First</option>
            <option>Oldest First</option>
            <option>Highest ROI</option>
            <option>Lowest ROI</option>
          </select>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Projects List (3/4) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  activeCategory === category.id
                    ? "bg-green-700 text-white"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-green-300"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          {currentProjects.length === 0 ? (
            <div className="text-center py-12">
              <Leaf className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No farm projects found</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {currentProjects.map((project) => {
                const raisedAmount = getRaisedAmount(project);
                const progressPercentage = getProgressPercentage(project);
                const isFeatured = featuredProjectIds.includes(project.id!);
                return (
                  <Card
                    key={project.id}
                    className="overflow-hidden border-2 border-gray-100 hover:border-green-300 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative h-48">
                      <img
                        src={project.imageUrl}
                        alt={project.name}
                        className="w-full h-full object-cover"
                      />
                      {isFeatured && (
                        <div className="absolute top-4 left-4 bg-green-700 text-white px-3 py-1 rounded-lg text-xs font-semibold">
                          Featured
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-white text-gray-700 px-3 py-1 rounded-lg text-xs font-semibold border border-gray-200">
                        {activeCategory === "all" ? "Poultry" : activeCategory}
                      </div>
                    </div>
                    <CardContent className="pt-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{project.name}</h3>
                      <p className="text-gray-500 text-sm mb-4">{project.location}</p>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-600 mb-2">
                          <span>Raised</span>
                          <span>Goal</span>
                        </div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-base font-bold text-gray-900">{formatCurrency(raisedAmount)}</span>
                          <span className="text-sm text-gray-400">/</span>
                          <span className="text-sm font-semibold text-gray-900">{formatCurrency(project.investmentAmount)}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-green-700 transition-all"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                        <p className="text-right text-xs font-bold text-gray-900 mt-1">{progressPercentage}%</p>
                      </div>

                      {/* Project Stats */}
                      <div className="flex items-center justify-between mb-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <span>{project.spotsLeft + 80} Investors</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{Math.floor(project.durationDays / 8)} Days Left</span>
                        </div>
                      </div>

                      <Button
                        className="w-full bg-green-700 hover:bg-green-800 text-white"
                        onClick={() => {
                          setSelectedProject(project);
                          setShowInvestModal(true);
                        }}
                      >
                        View Project
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 border border-gray-200 rounded-lg"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "ghost"}
                  className={`w-9 h-9 rounded-lg ${
                    currentPage === page ? "bg-green-700 text-white" : "border border-gray-200"
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 border border-gray-200 rounded-lg"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Right Column - Sidebar (1/4) */}
        <div className="space-y-6">
          {/* Wallet Balance Card */}
          <Card className="border-2 border-green-100">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-green-700" />
                </div>
                <span className="text-sm font-medium text-gray-700">Wallet Balance</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(userData?.walletBalance || 0)}</p>
            </CardContent>
          </Card>

          {/* Filter Projects */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <CardTitle className="text-sm font-semibold text-gray-900">Filter Projects</CardTitle>
                </div>
                <button className="text-xs text-green-700 font-medium">Reset</button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Category Filter */}
              <div>
                <Label className="text-xs text-gray-600 mb-2 block">Category</Label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                  <option>All Categories</option>
                  <option>Crop Farming</option>
                  <option>Livestock</option>
                  <option>Poultry</option>
                  <option>Aquaculture</option>
                  <option>Greenhouse</option>
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <Label className="text-xs text-gray-600 mb-2 block">Location</Label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                  <option>All Locations</option>
                  <option>Lagos</option>
                  <option>Ogun</option>
                  <option>Oyo</option>
                  <option>Kaduna</option>
                  <option>Enugu</option>
                </select>
              </div>

              {/* Investment Range */}
              <div>
                <Label className="text-xs text-gray-600 mb-2 block">Investment Range</Label>
                <div className="flex gap-2">
                  <select className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm">
                    <option>₦10,000</option>
                    <option>₦50,000</option>
                    <option>₦100,000</option>
                  </select>
                  <select className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm">
                    <option>₦500,000+</option>
                    <option>₦1,000,000+</option>
                    <option>₦5,000,000+</option>
                  </select>
                </div>
              </div>

              {/* Project Status */}
              <div>
                <Label className="text-xs text-gray-600 mb-2 block">Project Status</Label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-green-700" />
                    All Projects <span className="text-gray-400 ml-auto">{filteredProjects.length}</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" className="w-4 h-4 accent-green-700" />
                    Fully Funded <span className="text-gray-400 ml-auto">5</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" className="w-4 h-4 accent-green-700" />
                    Ongoing <span className="text-gray-400 ml-auto">15</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" className="w-4 h-4 accent-green-700" />
                    Upcoming <span className="text-gray-400 ml-auto">4</span>
                  </label>
                </div>
              </div>

              <Button className="w-full bg-green-700 hover:bg-green-800 text-white mt-2">
                Apply Filters
              </Button>
            </CardContent>
          </Card>

          {/* Why Invest in Farm Projects */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-900">Why Invest in Farm Projects?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { icon: Sparkles, title: "High Returns", desc: "Earn consistent profits on your investment." },
                { icon: Shield, title: "Verified Projects", desc: "All projects are verified and transparent." },
                { icon: DollarSign, title: "Bi-weekly Payouts", desc: "Withdraw your earnings every 2 weeks." },
                { icon: Shield, title: "Secure & Reliable", desc: "Your investments are safe with us." }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <item.icon className="w-3 h-3 text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Submit Project Idea */}
          <Card className="border-2 border-green-100 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Have a project idea?</p>
                  <p className="text-xs text-gray-600">Submit your farm project for funding and reach thousands of investors.</p>
                </div>
                <div className="w-16 h-16 flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=200"
                    alt="Project Idea"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
              <Button variant="ghost" className="w-full bg-white text-green-700 hover:bg-green-100 border border-green-200">
                Submit Project
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

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
                    <p className="font-semibold text-gray-900">{formatCurrency(10000)}</p>
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
                  placeholder={`Minimum: ${formatCurrency(10000)}`}
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

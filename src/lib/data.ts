export interface InvestmentPlan {
  id: string;
  name: string;
  description: string;
  minInvestment: number;
  maxInvestment?: number;
  duration: number;
  roi: number;
  biWeeklyMin: number;
  biWeeklyMax?: number;
  color: string;
}

export interface InvestmentCategory {
  id: string;
  name: string;
  icon: string;
  items: string[];
}

export const INVESTMENT_PLANS: InvestmentPlan[] = [
  {
    id: "starter",
    name: "Starter Plan",
    description: "Perfect for new investors",
    minInvestment: 20000,
    maxInvestment: 49999,
    duration: 3,
    roi: 18,
    biWeeklyMin: 1500,
    biWeeklyMax: 3000,
    color: "bg-green-600",
  },
  {
    id: "bronze",
    name: "Bronze Plan",
    description: "Grow your investments",
    minInvestment: 50000,
    maxInvestment: 99999,
    duration: 4,
    roi: 24,
    biWeeklyMin: 3500,
    biWeeklyMax: 6000,
    color: "bg-amber-600",
  },
  {
    id: "silver",
    name: "Silver Plan",
    description: "Build consistent wealth",
    minInvestment: 100000,
    maxInvestment: 249999,
    duration: 6,
    roi: 30,
    biWeeklyMin: 7500,
    biWeeklyMax: 15000,
    color: "bg-gray-400",
  },
  {
    id: "gold",
    name: "Gold Plan",
    description: "Maximize your earnings",
    minInvestment: 250000,
    maxInvestment: 499999,
    duration: 9,
    roi: 40,
    biWeeklyMin: 15000,
    biWeeklyMax: 30000,
    color: "bg-yellow-500",
  },
  {
    id: "elite",
    name: "Elite Plan",
    description: "For serious investors",
    minInvestment: 500000,
    duration: 12,
    roi: 50,
    biWeeklyMin: 35000,
    color: "bg-emerald-800",
  },
];

export const INVESTMENT_CATEGORIES: InvestmentCategory[] = [
  {
    id: "crop",
    name: "🌽 Crop Farming",
    icon: "🌽",
    items: ["Maize Farming", "Rice Farming", "Cassava Farming", "Soybean Farming"],
  },
  {
    id: "livestock",
    name: "🐓 Livestock Farming",
    icon: "🐓",
    items: ["Poultry", "Fish Farming", "Pig Farming", "Goat Farming"],
  },
  {
    id: "greenhouse",
    name: "🥬 Greenhouse Farming",
    icon: "🥬",
    items: ["Tomatoes", "Pepper", "Cucumbers", "Vegetables"],
  },
  {
    id: "cash",
    name: "🌴 Cash Crops",
    icon: "🌴",
    items: ["Palm Oil", "Cocoa", "Groundnuts", "Sesame"],
  },
];

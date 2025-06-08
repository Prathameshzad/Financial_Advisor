"use client"
import {
  Wallet,
  PieChart,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { getAccessToken } from "@/lib/auth";
import SectorDistributionChart from "../porfolio/SectorDistributionChart";
import PortfolioPerformance from "../PortfolioPerformance";

export default function Dashboard() {
  const [portfolioData, setPortfolioData] = useState({
    totals: {
      total_invested: 0,
      total_current: 0,
      total_pnl: 0,
      total_pnl_percentage: 0,
      total_today_pnl: 0,
      total_today_pnl_percentage: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayValues, setDisplayValues] = useState({
    total_invested: 0,
    total_current: 0,
    total_pnl: 0,
    total_pnl_percentage: 0,
    total_today_pnl: 0,
    total_today_pnl_percentage: 0
  });
  const animationRef = useRef(null);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'IND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Fetch portfolio data from backend
  const fetchPortfolioData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/portfolio', {
        headers: {
          'Authorization': `Bearer ${getAccessToken()}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch portfolio data');
      }
      
      const data = await response.json();
      setPortfolioData(data);
      startCountUpAnimation(data.totals);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Animation function
  const startCountUpAnimation = (targetValues) => {
    const duration = 1500; // Animation duration in ms
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      setDisplayValues({
        total_invested: Math.floor(progress * targetValues.total_invested),
        total_current: Math.floor(progress * targetValues.total_current),
        total_pnl: Math.floor(progress * targetValues.total_pnl),
        total_pnl_percentage: parseFloat((progress * targetValues.total_pnl_percentage).toFixed(2)),
        total_today_pnl: Math.floor(progress * targetValues.total_today_pnl),
        total_today_pnl_percentage: parseFloat((progress * targetValues.total_today_pnl_percentage).toFixed(2))
      });
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    fetchPortfolioData();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Card data with portfolio metrics
  const cardData = [
    {
      icon: <Wallet className="w-6 h-6 text-purple-600" />,
      value: formatCurrency(displayValues.total_invested),
      label: "Total Invested",
      bg: "bg-white",
      border: "border border-purple-100"
    },
    {
      icon: <PieChart className="w-6 h-6 text-purple-600" />,
      value: formatCurrency(displayValues.total_current),
      label: "Current Value",
      bg: "bg-white",
      border: "border border-purple-100"
    },
    {
      icon: portfolioData.totals.total_pnl >= 0 ? 
        <ArrowUpRight className="w-6 h-6 text-green-600" /> : 
        <ArrowDownRight className="w-6 h-6 text-red-600" />,
      value: `${formatCurrency(displayValues.total_pnl)} (${displayValues.total_pnl_percentage.toFixed(2)}%)`,
      label: "Profit/Loss",
      color: portfolioData.totals.total_pnl >= 0 ? "text-green-600" : "text-red-600",
      bg: "bg-purple-50",
      border: "border border-purple-100"
    },
    {
      icon: portfolioData.totals.total_today_pnl >= 0 ? 
        <TrendingUp className="w-6 h-6 text-green-600" /> : 
        <TrendingDown className="w-6 h-6 text-red-600" />,
      value: `${formatCurrency(displayValues.total_today_pnl)} (${displayValues.total_today_pnl_percentage.toFixed(2)}%)`,
      label: "Today's Change",
      color: portfolioData.totals.total_today_pnl >= 0 ? "text-green-600" : "text-red-600",
      bg: "bg-purple-50",
      border: "border border-purple-100"
    },
  ];

  if (loading) {
    return (
      <div className="p-6 bg-purple-50 min-h-screen flex items-center justify-center">
        <div className="text-xl text-purple-600">Loading portfolio data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-purple-50 min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-purple-50 min-h-screen space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {cardData.map((card, index) => (
          <div
            key={index}
            className={`flex flex-col gap-3 justify-between p-5 rounded-xl shadow-sm ${card.bg} ${card.border} hover:shadow-md hover:shadow-purple-100 transition-all duration-200`}
          >
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-lg bg-purple-100">
                {card.icon}
              </div>
            </div>
            <div className={`text-2xl font-bold ${card.color || 'text-gray-800'}`}>
              {card.value}
            </div>
            <div className="text-sm text-purple-600 font-medium">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Sector Distribution Chart */}
        <div className="flex-1 bg-white rounded-xl shadow-sm p-4 border border-purple-100">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-lg text-gray-800">Sector Distribution</h2>
            <p className="text-sm text-purple-600">By invested value</p>
          </div>
          <div className="h-64">
            <SectorDistributionChart 
              portfolioData={portfolioData} 
              formatCurrency={formatCurrency} 
            />
          </div>
        </div>

        {/* Portfolio Performance */}
        <div className="flex-1 bg-white rounded-xl shadow-sm p-4 border border-purple-100">
          <PortfolioPerformance portfolioData={portfolioData} theme="light" />
        </div>
      </div>
    </div>
  );
}
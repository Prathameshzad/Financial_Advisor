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
      currency: 'USD',
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
      icon: <Wallet className="w-6 h-6" />,
      value: formatCurrency(displayValues.total_invested),
      label: "Total Invested",
    },
    {
      icon: <PieChart className="w-6 h-6" />,
      value: formatCurrency(displayValues.total_current),
      label: "Current Value",
    },
    {
      icon: portfolioData.totals.total_pnl >= 0 ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />,
      value: `${formatCurrency(displayValues.total_pnl)} (${displayValues.total_pnl_percentage.toFixed(2)}%)`,
      label: "Profit/Loss",
      color: portfolioData.totals.total_pnl >= 0 ? "text-green-500" : "text-red-500"
    },
    {
      icon: portfolioData.totals.total_today_pnl >= 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />,
      value: `${formatCurrency(displayValues.total_today_pnl)} (${displayValues.total_today_pnl_percentage.toFixed(2)}%)`,
      label: "Today's Change",
      color: portfolioData.totals.total_today_pnl >= 0 ? "text-green-500" : "text-red-500"
    },
  ];

  if (loading) {
    return (
      <div className="p-6 bg-[#e7f1f6] min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading portfolio data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-[#e7f1f6] min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#e7f1f6] min-h-screen space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 justify-between p-4 bg-[#dbe8ee] rounded-xl shadow-md text-black"
          >
            <div className="flex justify-between items-start">
              {card.icon}
              <div className="text-xl font-bold">•••</div>
            </div>
            <div className={`text-2xl font-semibold ${card.color || ''}`}>
              {card.value}
            </div>
            <div className="text-sm text-gray-700">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Clients & Revenue Section */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Sector Distribution Chart */}
        <div className="flex-1 bg-white rounded-xl shadow p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-lg">Sector Distribution</h2>
            <p className="text-sm text-gray-500">By invested value</p>
          </div>
          <div className="h-64">
            <SectorDistributionChart 
              portfolioData={portfolioData} 
              formatCurrency={formatCurrency} 
            />
          </div>
        </div>

        {/* Revenue Chart (Placeholder) */}
        <div>
          <PortfolioPerformance portfolioData={portfolioData}/>
        </div>
      </div>

      {/* Recent Emails */}
      <div className="bg-[#dbe8ee] p-4 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">Recent emails</h3>
        <div className="space-y-4">
          {[
            {
              name: "Hannah Morgan",
              avatar: "https://randomuser.me/api/portraits/women/44.jpg",
              message: "Meeting scheduled",
              time: "1:24 PM",
            },
            {
              name: "Megan Clark",
              avatar: "https://randomuser.me/api/portraits/women/68.jpg",
              message: "Update on marketing campaign",
              time: "12:32 PM",
            },
            {
              name: "Brandon Williams",
              avatar: "https://randomuser.me/api/portraits/men/35.jpg",
              message: "Designly 2.0 is about to launch",
              time: "Yesterday at 8:57 PM",
            },
            {
              name: "Reid Smith",
              avatar: "https://randomuser.me/api/portraits/men/65.jpg",
              message: "My friend Julie loves Dappr!",
              time: "Yesterday at 8:49 PM",
            },
          ].map((email, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <img
                  src={email.avatar}
                  alt={email.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-medium">{email.name}</div>
                  <div className="text-sm text-gray-600">{email.message}</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">{email.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
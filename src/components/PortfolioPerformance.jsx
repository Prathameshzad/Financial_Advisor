"use client"
import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function PortfolioPerformance({ portfolioData }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timeout = setTimeout(() => {
      setAnimate(true);
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  const isProfit = portfolioData.totals.total_pnl >= 0;
  const isTodayProfit = portfolioData.totals.total_today_pnl >= 0;

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  return (
    <div className="flex-1 bg-white rounded-xl shadow p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold text-lg">Portfolio Performance</h2>
        <div className="flex gap-4">
          <div className="flex items-center">
            {isProfit ? <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" /> : <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />}
            <span className={`text-sm ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
              {formatNumber(portfolioData.totals.total_pnl)} ({portfolioData.totals.total_pnl_percentage.toFixed(2)}%)
            </span>
          </div>
          <div className="flex items-center">
            {isTodayProfit ? <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" /> : <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />}
            <span className={`text-sm ${isTodayProfit ? 'text-green-600' : 'text-red-600'}`}>
              {formatNumber(portfolioData.totals.total_today_pnl)} ({portfolioData.totals.total_today_pnl_percentage.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      <div className="h-72 w-full relative overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 360 240" preserveAspectRatio="none">
          {[0, 60, 120, 180, 240].map((y) => (
            <line key={y} x1="0" y1={y} x2="360" y2={y} stroke="#e5e7eb" strokeWidth="1" />
          ))}

          {(() => {
            const { total_invested, total_current, total_pnl, total_today_pnl } = portfolioData.totals;
            const maxValue = Math.max(
              Math.abs(total_invested),
              Math.abs(total_current),
              Math.abs(total_pnl),
              Math.abs(total_today_pnl),
              1
            );
            const scale = 180;

            const barData = [
              { label: "Invested", value: total_invested, color: "#6366F1", x: 60 },
              { label: "Current", value: total_current, color: "#3B82F6", x: 150 },
              { label: "P/L", value: total_pnl, color: total_pnl >= 0 ? "#10B981" : "#EF4444", x: 240 },
              { label: "Today", value: total_today_pnl, color: total_today_pnl >= 0 ? "#F59E0B" : "#DC2626", x: 330 }
            ];

            return barData.map((bar, index) => {
              const height = (Math.abs(bar.value) / maxValue) * scale;
              const isPositive = bar.value >= 0;
              const baseY = 200;
              const animatedY = isPositive ? baseY - height : baseY;
              const finalY = animate ? animatedY : baseY;
              const finalHeight = animate ? height : 0;

              return (
                <g key={index}>
                  <rect
                    x={bar.x - 15}
                    y={finalY}
                    width="30"
                    height={finalHeight}
                    fill={bar.color}
                    rx="4"
                    style={{
                      transition: 'all 0.8s ease-out',
                      transformOrigin: 'bottom'
                    }}
                  />
                  <text
                    x={bar.x}
                    y={isPositive ? finalY - 5 : baseY + finalHeight + 15}
                    textAnchor="middle"
                    fontSize="12"
                    fill={bar.color}
                    fontWeight="bold"
                  >
                    {formatNumber(bar.value)}
                  </text>
                  <text
                    x={bar.x}
                    y="225"
                    textAnchor="middle"
                    fontSize="12"
                    fill="#6b7280"
                  >
                    {bar.label}
                  </text>
                </g>
              );
            });
          })()}
        </svg>
      </div>

      <div className="flex justify-center mt-2 space-x-4 flex-wrap">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-sm mr-1" style={{ backgroundColor: "#6366F1" }}></div>
          <span className="text-xs text-gray-600">Invested</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-sm mr-1" style={{ backgroundColor: "#3B82F6" }}></div>
          <span className="text-xs text-gray-600">Current</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-sm mr-1" style={{ backgroundColor: isProfit ? "#10B981" : "#EF4444" }}></div>
          <span className="text-xs text-gray-600">Profit / Loss</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-sm mr-1" style={{ backgroundColor: isTodayProfit ? "#F59E0B" : "#DC2626" }}></div>
          <span className="text-xs text-gray-600">Today's Change</span>
        </div>
      </div>
    </div>
  );
}

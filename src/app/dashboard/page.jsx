  "use client";
  import DashboardCards from "@/components/dashboard/DashboardCards";
  import GolbalNewsCard from "@/components/dashboard/GolbalNewsCard";
  import { ChevronLeft, X } from "lucide-react";
  import { useState } from "react";

  export default function Dashboard() {
    return (
      <div className="flex flex-col lg:flex-row gap-4 p-4 bg-purple-50">
        {/* Left Section - Dashboard Cards */}
        <div className="w-full lg:w-3/4">
          <DashboardCards />
        </div>
        
        {/* Right Section - News Card - Hidden on mobile, shown after DashboardCards */}
        <div className="hidden lg:block lg:w-1/4">
          <GolbalNewsCard />
        </div>
        
        {/* Mobile News Slider - Only shown on mobile */}
        <div className="lg:hidden w-full mt-4">
          <MobileNewsSlider />
        </div>
      </div>
    );
  }

  // Mobile News Slider Component
  const MobileNewsSlider = () => {
    const [showNews, setShowNews] = useState(false);

    return (
      <div className="relative">
        {/* Toggle Button */}
        <button 
          onClick={() => setShowNews(!showNews)}
          className="w-full py-2 bg-purple-600 text-white rounded-lg mb-2 flex items-center justify-center"
        >
          {showNews ? 'Hide News' : 'Show Financial News'}
          <ChevronLeft className={`ml-2 h-4 w-4 transition-transform ${showNews ? 'rotate-90' : '-rotate-90'}`} />
        </button>
        
        {/* Sliding Panel */}
        <div className={`fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out ${showNews ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-4 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-purple-800">Latest Financial News</h2>
              <button 
                onClick={() => setShowNews(false)}
                className="p-2 rounded-full bg-purple-100 text-purple-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <GolbalNewsCard mobileView={true} />
          </div>
        </div>
      </div>
    );
  };
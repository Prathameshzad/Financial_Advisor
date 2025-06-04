'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, User, BarChart2, PieChart, Grid, Briefcase, ChevronRight, ChevronLeft, X, Menu } from 'lucide-react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowMobileMenu(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);

  return (
    <>
      {/* Mobile Menu Button - Only shows when mobile menu is closed */}
      {isMobile && !showMobileMenu && (
        <button
          onClick={toggleMobileMenu}
          className="fixed top-4 left-4 z-50 bg-gray-800 p-2 rounded-md text-white md:hidden"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Desktop Sidebar - Unchanged from original */}
      <div className={`hidden md:block m-6 h-[calc(100vh-48px)] bg-purple-900 text-white transition-all duration-300 rounded-2xl ${isOpen ? 'w-64' : 'w-20'} relative`}>
        <div
          onClick={toggleSidebar}
          className="absolute top-5 -right-3 bg-purple-700 hover:bg-purple-600 text-white rounded-full p-1 cursor-pointer z-10"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </div>

        <div className="flex flex-col w-full">
          <div className="p-4 flex items-center justify-center">
            <h2 className={`text-2xl font-bold transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
              Dashboard
            </h2>
          </div>

          <ul className="mt-4 space-y-2">
            <SidebarItem href="/dashboard" label="Home" icon={<Home />} isOpen={isOpen} />
            <SidebarItem href="/dashboard/profile" label="Profile" icon={<User />} isOpen={isOpen} />
            <SidebarItem href="/dashboard/stock-metrics" label="Stock Metrics" icon={<BarChart2 />} isOpen={isOpen} />
            <SidebarItem href="/dashboard/finview" label="Finview" icon={<PieChart />} isOpen={isOpen} />
            <SidebarItem href="/dashboard/widgets" label="Widgets" icon={<Grid />} isOpen={isOpen} />
            <SidebarItem href="/dashboard/portfolio" label="Portfolio" icon={<Briefcase />} isOpen={isOpen} />
          </ul>
        </div>
      </div>

      {/* Mobile Sidebar - Only shows on mobile when showMobileMenu is true */}
      {isMobile && showMobileMenu && (
        <div className="fixed inset-y-0 left-0 z-40 w-64 bg-purple-900 text-white h-screen">
          <div className="flex flex-col w-full">
            <div className="p-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Dashboard</h2>
              <button 
                onClick={toggleMobileMenu} 
                className="p-1 rounded-md hover:bg-purple-700"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            <ul className="mt-4 space-y-2">
              <SidebarItem href="/dashboard" label="Home" icon={<Home />} isOpen={true} />
              <SidebarItem href="/dashboard/profile" label="Profile" icon={<User />} isOpen={true} />
              <SidebarItem href="/dashboard/stock-metrics" label="Stock Metrics" icon={<BarChart2 />} isOpen={true} />
              <SidebarItem href="/dashboard/finview" label="Finview" icon={<PieChart />} isOpen={true} />
              <SidebarItem href="/dashboard/widgets" label="Widgets" icon={<Grid />} isOpen={true} />
              <SidebarItem href="/dashboard/portfolio" label="Portfolio" icon={<Briefcase />} isOpen={true} />
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

// Sidebar Item Component (unchanged)
function SidebarItem({ href, label, icon, isOpen }) {
  return (
    <li>
      <Link href={href}>
        <div className="flex items-center gap-4 p-3 pl-6 hover:bg-purple-700 transition-colors cursor-pointer">
          <span>{icon}</span>
          <span className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>{label}</span>
        </div>
      </Link>
    </li>
  );
}
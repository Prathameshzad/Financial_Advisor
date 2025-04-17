import DashboardCards from "@/components/dashboard/DashboardCards";
import GolbalNewsCard from "@/components/dashboard/GolbalNewsCard";
import IndiaNews from "@/components/dashboard/IndiaNews";

export default function Dashboard() {
  return (
    <div className="flex gap-4 p-4">
      {/* Left Section - Dashboard Cards */}
      <div className="w-3/4">
        <DashboardCards />
      </div>
      {/* Right Section - News Card */}
      <div className="w-1/4">
        <GolbalNewsCard />
      </div>
    </div>
  );
}

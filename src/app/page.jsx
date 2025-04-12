import FinViewModal from "@/components/FinViewModal";
import StockMetrics from "@/components/StockMetrics";
import Widgets from "@/components/Widgets";
import LoginForm from "@/components/LoginForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 py-10">
      {/* <StockMetrics /> */}
      {/* <Widgets /> */}
      {/* <FinViewModal/> */}
      <LoginForm/>
    </main>
  );
}

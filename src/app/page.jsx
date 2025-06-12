import HeroSection from "@/components/landingPage/HeroSection";
import Navbar from "../components/landingPage/Navbar";
import { ContainerScroll } from "@/components/landingPage/ui/container-scroll-animation";
import Team from "@/components/landingPage/Team";
import Members from "@/components/landingPage/Members";
import Card from "@/components/landingPage/Card";
import Footer from "@/components/landingPage/Footer";

export default function Home() {
  return (
    <main>
      <div>
        <Navbar/>
        <HeroSection/>
        <ContainerScroll/>
        <Team/>
        {/* <Members/> */}
        <Card/>
        <Footer/>
      </div>
    </main>
  );
}

import { Navbar, Footer } from "@/app/component/layout";
import { HeroSection, FeaturesSection } from "@/app/component/sections";
import ServerAlertPopup from "@/app/component/ui/ServerAlertPopup";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <ServerAlertPopup />
      <Navbar />
      <main style={{ flex: 1 }}>
        <HeroSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}
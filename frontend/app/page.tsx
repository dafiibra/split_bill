import { Navbar, Footer } from "@/app/component/layout";
import { HeroSection, FeaturesSection } from "@/app/component/sections";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <HeroSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}
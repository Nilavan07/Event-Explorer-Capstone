import { useState, useRef } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import EventFilters from "@/components/EventFilters";
import FeatureSection from "@/components/FeatureSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import TicketmasterEventsSection from "@/components/TicketmasterEventsSection";

const Index = () => {
  const [apiKeys] = useState<{ ticketmaster: string; googleMaps: string }>({
    ticketmaster: "lvw06wBGLP57NHCVsqYHs6MXrVZPrTU3",
    googleMaps: "AIzaSyC_QybJ8Rbg3wB0qzdmgD-1waWu_7P8WDI",
  });

  const ticketmasterSectionRef = useRef<{
    triggerSearch: (filters: any) => void;
  }>(null);

  const handleSearch = (filters: {
    city: string;
    category: string;
    date?: Date;
  }) => {
    // Scroll to Ticketmaster section and trigger search
    ticketmasterSectionRef.current?.triggerSearch(filters);

    // Scroll to the section
    const element = document.getElementById("ticketmaster-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        {/* <EventFilters onSearch={handleSearch} /> */}

        {/* Ticketmaster Events Section - Always visible */}
        <div id="ticketmaster-section">
          <TicketmasterEventsSection
            ref={ticketmasterSectionRef}
            ticketmasterApiKey={apiKeys.ticketmaster}
            googleMapsApiKey={apiKeys.googleMaps}
          />
        </div>

        <FeatureSection />
        {/* <NewsletterSection /> */}
      </main>
      <Footer />
    </div>
  );
};

export default Index;

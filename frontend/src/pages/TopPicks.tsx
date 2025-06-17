
import React, { useState, useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Star } from "lucide-react";
import TicketmasterEventCard from "@/components/TicketmasterEventCard";
import { useAuthStore } from "@/store/useAuthStore";
import { TicketmasterService } from "@/services/ticketmasterService";
import { useToast } from "@/hooks/use-toast";

const TopPicks = () => {
  const { isLoggedIn } = useAuthStore();
  const [topPickEvents, setTopPickEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // You'll need to set your Ticketmaster API key here
  const ticketmasterApiKey = "lvw06wBGLP57NHCVsqYHs6MXrVZPrTU3";
  const googleMapsApiKey = "your-google-maps-key"; // You'll need to set this

  useEffect(() => {
    loadTopPickEvents();
  }, []);

  const loadTopPickEvents = async () => {
    setLoading(true);
    try {
      const ticketmasterService = new TicketmasterService(ticketmasterApiKey);
      const response = await ticketmasterService.searchEvents({
        size: 6, // Get 6 top events
        countryCode: 'US'
      });

      if (response._embedded?.events) {
        const transformedEvents = response._embedded.events.slice(0, 6).map(event => 
          ticketmasterService.transformEventData(event)
        );
        setTopPickEvents(transformedEvents);
      } else {
        setTopPickEvents([]);
        toast({
          title: "No events found",
          description: "No top pick events are currently available",
        });
      }
    } catch (error) {
      console.error('Error loading top pick events:', error);
      toast({
        title: "Failed to load events",
        description: "Unable to load top pick events. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="bg-gradient-to-r from-eventPurple to-purple-600 py-16">
          <div className="container mx-auto px-4 text-center text-white">
            <div className="flex justify-center mb-4">
              <Star className="h-12 w-12 text-yellow-300 fill-yellow-300" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Top Picks For You</h1>
            <p className="max-w-2xl mx-auto text-lg">
              {isLoggedIn 
                ? "Curated events based on your interests and trending in your area" 
                : "Login to see personalized recommendations based on your interests"}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading top pick events...</p>
            </div>
          )}

          {!loading && topPickEvents.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {topPickEvents.map((event) => (
                <TicketmasterEventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  date={event.date}
                  imageUrl={event.imageUrl}
                  location={event.location}
                  category={event.category}
                  price={event.price}
                  ticketUrl={event.ticketUrl}
                  venue={event.venue}
                  googleMapsApiKey={googleMapsApiKey}
                />
              ))}
            </div>
          )}

          {!loading && topPickEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No top pick events found</p>
              <p className="text-sm text-gray-400">
                Check back later for curated events
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TopPicks;

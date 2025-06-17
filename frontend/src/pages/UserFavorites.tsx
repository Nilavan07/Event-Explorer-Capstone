
import React, { useState, useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import EventCard from "@/components/EventCard";
import TicketmasterEventCard from "@/components/TicketmasterEventCard";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from "@/store/useAuthStore";
import { useEventStore } from "@/store/useEventStore";
import { TicketmasterService } from "@/services/ticketmasterService";

const UserFavorites = () => {
  const { currentUser, isLoggedIn } = useAuthStore();
  const { events } = useEventStore();
  const [favoriteEvents, setFavoriteEvents] = useState<any[]>([]);
  const [favoriteTicketmasterEvents, setFavoriteTicketmasterEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // API keys - these should match the ones from Index.tsx
  const ticketmasterApiKey = "lvw06wBGLP57NHCVsqYHs6MXrVZPrTU3";
  const googleMapsApiKey = "AIzaSyC_QybJ8Rbg3wB0qzdmgD-1waWu_7P8WDI";

  useEffect(() => {
    if (!isLoggedIn || !currentUser) {
      toast({
        title: "Please login",
        description: "You need to login to view your favorites",
        variant: "destructive"
      });
      navigate('/');
      return;
    }
    
    loadFavoriteEvents();
  }, [currentUser, events, isLoggedIn, navigate, toast]);

  const loadFavoriteEvents = async () => {
    if (!currentUser?.favorites) {
      setIsLoading(false);
      return;
    }

    try {
      // Get local events from store
      const favoriteIds = currentUser.favorites || [];
      const userFavoriteLocalEvents = events.filter(event => favoriteIds.includes(event.id));
      setFavoriteEvents(userFavoriteLocalEvents);

      // Fetch Ticketmaster events to check for favorites
      const ticketmasterService = new TicketmasterService(ticketmasterApiKey);
      const response = await ticketmasterService.searchEvents({
        size: 100, // Fetch more events to find favorites
        countryCode: 'US'
      });

      if (response._embedded?.events) {
        const transformedEvents = response._embedded.events.map(event => 
          ticketmasterService.transformEventData(event)
        );
        
        // Filter only the events that are in user's favorites
        const userFavoriteTicketmasterEvents = transformedEvents.filter(event => 
          favoriteIds.includes(event.id)
        );
        
        setFavoriteTicketmasterEvents(userFavoriteTicketmasterEvents);
      }
    } catch (error) {
      console.error('Error loading favorite events:', error);
      toast({
        title: "Error loading favorites",
        description: "Could not load some of your favorite events",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 flex justify-center items-center">
          <p>Loading your favorites...</p>
        </main>
        <Footer />
      </div>
    );
  }

  const totalFavorites = favoriteEvents.length + favoriteTicketmasterEvents.length;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <Heart className="h-8 w-8 mr-2 text-red-500 fill-red-500" />
            My Favorite Events
          </h1>
        </div>

        {totalFavorites > 0 ? (
          <div className="space-y-8">
            {/* Local Events */}
            {favoriteEvents.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Local Events</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      id={event.id}
                      title={event.title}
                      date={event.date}
                      imageUrl={event.imageUrl}
                      location={event.location}
                      category={event.category}
                      price={event.price}
                      weather={event.weather}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Ticketmaster Events */}
            {favoriteTicketmasterEvents.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Ticketmaster Events</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteTicketmasterEvents.map((event) => (
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
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No favorite events yet</h3>
            <p className="text-gray-500 mb-6">When you find events you like, click the heart icon to add them here</p>
            <Button 
              className="bg-eventPurple hover:bg-eventPurple-dark"
              onClick={() => navigate('/')}
            >
              Browse Events
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default UserFavorites;

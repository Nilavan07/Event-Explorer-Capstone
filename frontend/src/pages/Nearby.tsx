
import React, { useState, useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TicketmasterEventCard from "@/components/TicketmasterEventCard";
import { TicketmasterService } from "@/services/ticketmasterService";
import { useToast } from "@/hooks/use-toast";

const Nearby = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState('');
  const [userLocation, setUserLocation] = useState<string>('');
  const { toast } = useToast();

  // You'll need to set your API keys here
  const ticketmasterApiKey = "lvw06wBGLP57NHCVsqYHs6MXrVZPrTU3";
  const googleMapsApiKey = "your-google-maps-key"; // You'll need to set this

  const ticketmasterService = new TicketmasterService(ticketmasterApiKey);

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // You would typically use a reverse geocoding service here
            // For now, we'll load events for major cities
            setUserLocation('New York');
            loadNearbyEvents('New York');
          } catch (error) {
            console.error('Error getting location:', error);
            loadNearbyEvents('New York'); // Default to New York
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          loadNearbyEvents('New York'); // Default to New York
        }
      );
    } else {
      loadNearbyEvents('New York'); // Default to New York
    }
  };

  const loadNearbyEvents = async (locationCity: string) => {
    setLoading(true);
    try {
      const response = await ticketmasterService.searchEvents({
        city: locationCity,
        size: 12,
        countryCode: 'US'
      });

      if (response._embedded?.events) {
        const transformedEvents = response._embedded.events.map(event => 
          ticketmasterService.transformEventData(event)
        );
        setEvents(transformedEvents);
      } else {
        setEvents([]);
        toast({
          title: "No events found",
          description: `No events found near ${locationCity}`,
        });
      }
    } catch (error) {
      console.error('Error loading nearby events:', error);
      toast({
        title: "Failed to load events",
        description: "Unable to load nearby events. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const searchNearbyEvents = async () => {
    if (!city.trim()) {
      toast({
        title: "Please enter a city",
        description: "Enter a city name to search for nearby events",
        variant: "destructive"
      });
      return;
    }
    await loadNearbyEvents(city);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="bg-gradient-to-r from-eventPurple to-purple-600 py-16">
          <div className="container mx-auto px-4 text-center text-white">
            <div className="flex justify-center mb-4">
              <MapPin className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Events Near You</h1>
            <p className="max-w-2xl mx-auto text-lg">
              Discover exciting events happening in your area
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto mb-8">
            <div className="flex gap-4">
              <Input
                placeholder="Enter your city (e.g., New York, Los Angeles)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchNearbyEvents()}
                className="flex-1"
              />
              <Button 
                onClick={searchNearbyEvents}
                disabled={loading}
                className="bg-eventPurple hover:bg-eventPurple-dark"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
            {userLocation && (
              <p className="text-sm text-gray-600 mt-2 text-center">
                Currently showing events near: {userLocation}
              </p>
            )}
          </div>

          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading nearby events...</p>
            </div>
          )}

          {!loading && events.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
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

          {!loading && events.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No events found in your area</p>
              <p className="text-sm text-gray-400">
                Try searching for a different city or check back later
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Nearby;

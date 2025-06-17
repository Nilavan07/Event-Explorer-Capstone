import { useState } from "react";
import { Calendar, MapPin, Heart, Navigation, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/useAuthStore";
import { GoogleMapsService } from "@/services/googleMapsService";
import { WeatherService } from "@/services/weatherService";
import GoogleMapEmbed from "./GoogleMapEmbed";
import WeatherDisplay from "./WeatherDisplay";
import ShareButtons from "./ShareButtons";

interface TicketmasterEventCardProps {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
  location: string;
  category: string;
  price?: string;
  ticketUrl?: string;
  venue?: {
    name: string;
    latitude?: number;
    longitude?: number;
  };
  googleMapsApiKey: string;
}

const TicketmasterEventCard = ({
  id,
  title,
  date,
  imageUrl,
  location,
  category,
  price,
  ticketUrl,
  venue,
  googleMapsApiKey,
}: TicketmasterEventCardProps) => {
  const { currentUser, isLoggedIn, addToFavorites, removeFromFavorites } =
    useAuthStore();
  const [isFavorite, setIsFavorite] = useState(
    currentUser?.favorites?.includes(id) || false
  );
  const [weather, setWeather] = useState<any>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [showDirectionsDialog, setShowDirectionsDialog] = useState(false);
  const { toast } = useToast();

  const toggleFavorite = () => {
    if (!isLoggedIn) {
      toast({
        title: "Please login",
        description: "You need to login to add events to favorites",
        variant: "destructive",
      });
      return;
    }

    if (isFavorite) {
      removeFromFavorites(id);
      toast({
        title: "Removed from favorites",
        description: `${title} has been removed from your favorites`,
      });
    } else {
      addToFavorites(id);
      toast({
        title: "Added to favorites",
        description: `${title} has been added to your favorites`,
      });
    }

    setIsFavorite(!isFavorite);
  };

  const handleGetDirections = async () => {
    setShowDirectionsDialog(true);

    if (!venue?.latitude || !venue?.longitude) {
      return;
    }

    setLoadingWeather(true);

    try {
      const weatherService = new WeatherService(
        "075441e0d64c00196a138dc54c10069c"
      );
      const weatherData = await weatherService.getWeatherByCoordinates(
        venue.latitude,
        venue.longitude
      );
      setWeather(weatherData);
    } catch (error) {
      console.error("Error loading weather data:", error);
      toast({
        title: "Error",
        description: "Could not load weather data",
        variant: "destructive",
      });
    } finally {
      setLoadingWeather(false);
    }
  };

  const handleGetTickets = () => {
    if (!isLoggedIn || !currentUser) {
      toast({
        title: "Please login",
        description: "You need to login to book tickets",
        variant: "destructive",
      });
      return;
    }

    if (ticketUrl) {
      window.open(ticketUrl, "_blank");
    } else {
      toast({
        title: "Tickets not available",
        description: "Ticket booking is not available for this event",
        variant: "destructive",
      });
    }
  };

  const openExternalDirections = () => {
    const directionsUrl = new GoogleMapsService(
      googleMapsApiKey
    ).getDirectionsUrl(location);
    window.open(directionsUrl, "_blank");
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-eventPurple">
          {category}
        </div>
        {price && (
          <div className="absolute bottom-4 right-4 bg-eventPurple/90 px-3 py-1 rounded-full text-sm font-bold text-white">
            {price}
          </div>
        )}
        <button
          onClick={toggleFavorite}
          className="absolute top-4 left-4 bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
        >
          <Heart
            className={`h-5 w-5 ${
              isFavorite ? "text-red-500 fill-red-500" : "text-gray-400"
            }`}
          />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{title}</h3>

        <div className="flex items-center text-gray-600 mb-2">
          <Calendar className="h-4 w-4 mr-2" />
          <span className="text-sm">{date}</span>
        </div>

        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="h-4 w-4 mr-2" />
          <span className="text-sm line-clamp-1">{location}</span>
        </div>

        <div className="space-y-2">
          <Button
            onClick={handleGetDirections}
            variant="outline"
            className="w-full"
          >
            <Navigation className="h-4 w-4 mr-2" />
            Get Directions
          </Button>

          <Button
            onClick={handleGetTickets}
            className="w-full bg-eventPurple hover:bg-eventPurple-dark"
          >
            <Ticket className="h-4 w-4 mr-2" />
            Get Tickets
          </Button>
          <ShareButtons
            eventTitle={title}
            eventUrl={ticketUrl}
            eventImage={imageUrl}
          />
        </div>
      </div>

      <Dialog
        open={showDirectionsDialog}
        onOpenChange={setShowDirectionsDialog}
      >
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Event Details & Location</DialogTitle>
            <DialogDescription>
              View the event location and weather forecast.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Weather Section */}
            {loadingWeather ? (
              <div className="text-center py-4">Loading weather...</div>
            ) : weather ? (
              <WeatherDisplay weather={weather} />
            ) : (
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <p className="text-gray-600">
                  Weather information not available
                </p>
              </div>
            )}

            {/* Map Section */}
            {venue?.latitude && venue?.longitude ? (
              <div>
                <h3 className="font-semibold text-lg mb-3">Event Location</h3>
                <GoogleMapEmbed
                  latitude={venue.latitude}
                  longitude={venue.longitude}
                  googleMapsApiKey={googleMapsApiKey}
                  eventName={title}
                />
                <div className="mt-3 text-center">
                  <Button onClick={openExternalDirections} variant="outline">
                    <Navigation className="h-4 w-4 mr-2" />
                    Open in Google Maps
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  Location coordinates not available
                </p>
                <Button
                  onClick={openExternalDirections}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Search in Google Maps
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TicketmasterEventCard;

import { Calendar, MapPin, CloudSun, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import EventDetailsDialog from "./EventDetailsDialog";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import ShareButtons from "./ShareButtons";
import { useAuthStore } from "@/store/useAuthStore";

export interface EventCardProps {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
  location: string;
  category: string;
  price?: string;
  weather?: {
    temp: string;
    condition: string;
  };
}

const EventCard = ({
  id,
  title,
  date,
  imageUrl,
  location,
  category,
  price,
  weather,
}: EventCardProps) => {
  const { currentUser, isLoggedIn, addToFavorites, removeFromFavorites } =
    useAuthStore();
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (currentUser && currentUser.favorites) {
      setIsFavorite(currentUser.favorites.includes(id));
    }
  }, [id, currentUser]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

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

  return (
    <div className="event-card">
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
        <h3 className="font-bold text-lg mb-2 line-clamp-1">{title}</h3>

        <div className="flex items-center text-gray-600 mb-2">
          <Calendar className="h-4 w-4 mr-2" />
          <span className="text-sm">{date}</span>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-2" />
          <span className="text-sm line-clamp-1">{location}</span>
        </div>

        {weather && (
          <div className="flex items-center text-gray-600 mb-3">
            <CloudSun className="h-4 w-4 mr-2" />
            <span className="text-sm">
              {weather.temp}, {weather.condition}
            </span>
          </div>
        )}

        <div className="space-y-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full bg-eventPurple hover:bg-eventPurple-dark">
                View Details
              </Button>
            </DialogTrigger>
            <EventDetailsDialog
              id={id}
              title={title}
              date={date}
              imageUrl={imageUrl}
              location={location}
              category={category}
              price={price}
              weather={weather}
            />
          </Dialog>

          <ShareButtons eventTitle={title} eventImage={imageUrl} />
        </div>
      </div>
    </div>
  );
};

export default EventCard;

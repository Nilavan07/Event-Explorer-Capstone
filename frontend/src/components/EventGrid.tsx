
import { useState, useEffect } from "react";
import EventCard from "./EventCard";
import { Button } from "@/components/ui/button";
import { useEventStore } from "@/store/useEventStore";

const EventGrid = () => {
  const { events, initializeEvents } = useEventStore();
  const [visibleEvents, setVisibleEvents] = useState(6);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    initializeEvents();
    setIsLoading(false);
  }, [initializeEvents]);
  
  const loadMoreEvents = () => {
    setVisibleEvents((prev) => Math.min(prev + 3, events.length));
  };

  if (isLoading) {
    return <div>Loading events...</div>;
  }

  return (
    <div className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Upcoming Events</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.slice(0, visibleEvents).map((event) => (
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
        
        {visibleEvents < events.length && (
          <div className="mt-10 text-center">
            <Button 
              variant="outline" 
              onClick={loadMoreEvents}
              className="px-8 border-eventPurple text-eventPurple hover:bg-eventPurple/10"
            >
              Load More Events
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventGrid;

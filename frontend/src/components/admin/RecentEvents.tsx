
import React from 'react';
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Event } from "@/store/useEventStore";

interface RecentEventsProps {
  events: Event[];
  onViewEvent: (event: Event) => void;
  onNavigateToEvents: () => void;
}

const RecentEvents: React.FC<RecentEventsProps> = ({
  events,
  onViewEvent,
  onNavigateToEvents
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Recent Events</h3>
        <Button size="sm" className="bg-eventPurple hover:bg-eventPurple-dark" onClick={onNavigateToEvents}>
          View All
        </Button>
      </div>
      <div className="space-y-3">
        {events.map(event => (
          <div key={event.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium">{event.title}</p>
              <p className="text-sm text-gray-500">{event.date}</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => onViewEvent(event)}>
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <p className="text-gray-500 text-center py-4">No events available</p>
        )}
      </div>
    </div>
  );
};

export default RecentEvents;

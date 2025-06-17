
import React from 'react';
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import RecentEvents from '../RecentEvents';
import RecentTicketSales from '../RecentTicketSales';
import { Event } from "@/store/useEventStore";

interface Ticket {
  id: string;
  eventName: string;
  userName: string;
  userEmail: string;
  userId: string;
  quantity: number;
  price: number;
  purchaseDate: string;
  status: string;
  ticketType: string;
}

interface OverviewTabProps {
  recentEvents: Event[];
  recentTicketSales: Ticket[];
  onViewEvent: (event: Event) => void;
  onViewTicket: (ticket: Ticket) => void;
  onEditTicket: (ticket: Ticket) => void;
  onDeleteTicket: (ticket: Ticket) => void;
  onSetActiveTab: (tab: string) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  recentEvents,
  recentTicketSales,
  onViewEvent,
  onViewTicket,
  onEditTicket,
  onDeleteTicket,
  onSetActiveTab
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <RecentEvents
          events={recentEvents}
          onViewEvent={onViewEvent}
          onNavigateToEvents={() => onSetActiveTab("events")}
        />
        
        <RecentTicketSales
          tickets={recentTicketSales}
          onViewTicket={onViewTicket}
          onEditTicket={onEditTicket}
          onDeleteTicket={onDeleteTicket}
          onNavigateToTickets={() => onSetActiveTab("tickets")}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
          <Users className="h-12 w-12 text-eventPurple mb-4" />
          <h3 className="text-lg font-medium">View Users</h3>
          <p className="text-center text-gray-500 mb-4">Browse user accounts</p>
          <Button className="bg-eventPurple hover:bg-eventPurple-dark" onClick={() => onSetActiveTab("users")}>
            View Users
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;


import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Ticket, Plus, Minus } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface TicketType {
  id: string;
  name: string;
  price: number;
  description: string;
  available: number;
}

interface EventTicketBookingProps {
  eventId: string;
  eventName: string;
  date: string;
}

const EventTicketBooking = ({ eventId, eventName, date }: EventTicketBookingProps) => {
  const { toast } = useToast();
  
  // Mock ticket types - would come from MongoDB in real implementation
  const ticketTypes: TicketType[] = [
    {
      id: "general",
      name: "General Admission",
      price: 45,
      description: "Standard entry to the event",
      available: 250
    },
    {
      id: "vip",
      name: "VIP Access",
      price: 120,
      description: "Priority entry, premium seating, and complimentary drinks",
      available: 50
    },
    {
      id: "early-bird",
      name: "Early Bird Special",
      price: 35,
      description: "Limited time offer - 20% off standard price",
      available: 75
    }
  ];

  const [ticketCounts, setTicketCounts] = useState<Record<string, number>>({
    "general": 0,
    "vip": 0,
    "early-bird": 0
  });

  const increaseTicket = (id: string) => {
    const ticketType = ticketTypes.find(t => t.id === id);
    if (ticketType && ticketCounts[id] < ticketType.available) {
      setTicketCounts({...ticketCounts, [id]: ticketCounts[id] + 1});
    }
  };

  const decreaseTicket = (id: string) => {
    if (ticketCounts[id] > 0) {
      setTicketCounts({...ticketCounts, [id]: ticketCounts[id] - 1});
    }
  };

  const getTotalPrice = () => {
    return ticketTypes.reduce((total, ticket) => {
      return total + (ticketCounts[ticket.id] * ticket.price);
    }, 0);
  };

  const getTotalTickets = () => {
    return Object.values(ticketCounts).reduce((sum, count) => sum + count, 0);
  };

  const handleBookTickets = () => {
    // This would connect to MongoDB in real implementation
    if (getTotalTickets() === 0) {
      toast({
        title: "No tickets selected",
        description: "Please select at least one ticket to proceed",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Tickets booked successfully!",
      description: `You have booked ${getTotalTickets()} tickets for ${eventName}.`,
    });
    
    // Reset form after successful booking
    setTicketCounts({
      "general": 0,
      "vip": 0,
      "early-bird": 0
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Ticket className="h-5 w-5 mr-2 text-eventPurple" />
          Book Tickets
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {ticketTypes.map((ticketType) => (
            <div key={ticketType.id} className="flex items-center justify-between pb-4 border-b">
              <div>
                <h4 className="font-medium">{ticketType.name}</h4>
                <div className="flex items-center mt-1">
                  <span className="text-lg font-bold text-eventPurple">${ticketType.price}</span>
                  <span className="ml-2 text-sm text-gray-500">per ticket</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{ticketType.description}</p>
                <p className="text-xs text-gray-500 mt-1">{ticketType.available} tickets available</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => decreaseTicket(ticketType.id)}
                  disabled={ticketCounts[ticketType.id] === 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{ticketCounts[ticketType.id]}</span>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => increaseTicket(ticketType.id)}
                  disabled={ticketCounts[ticketType.id] >= ticketType.available}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {getTotalTickets() > 0 && (
          <div className="mt-6">
            <div className="flex justify-between py-2">
              <span className="font-medium">Subtotal</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-medium">Service Fee</span>
              <span>${(getTotalPrice() * 0.1).toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-t border-gray-200 mt-2 pt-2">
              <span className="font-bold">Total</span>
              <span className="font-bold">${(getTotalPrice() * 1.1).toFixed(2)}</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleBookTickets} 
          className="w-full bg-eventPurple hover:bg-eventPurple-dark"
          disabled={getTotalTickets() === 0}
        >
          {getTotalTickets() > 0 ? `Book ${getTotalTickets()} Ticket${getTotalTickets() > 1 ? 's' : ''}` : 'Select Tickets'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventTicketBooking;

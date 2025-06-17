
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, Ticket } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from "@/store/useAuthStore";

interface TicketType {
  id: string;
  eventId: string;
  eventName: string;
  date: string;
  location: string;
  ticketType: string;
  quantity: number;
  price: number;
  purchaseDate: string;
  status: "Upcoming" | "Past" | "Cancelled";
}

const UserTickets = () => {
  const { currentUser, isLoggedIn } = useAuthStore();
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!isLoggedIn || !currentUser) {
      toast({
        title: "Please login",
        description: "You need to login to view your tickets",
        variant: "destructive"
      });
      navigate('/');
      return;
    }
    
    setTickets(currentUser.tickets || []);
    setIsLoading(false);
  }, [currentUser, isLoggedIn, navigate, toast]);
  
  const handleCancelTicket = (ticketId: string) => {
    if (!currentUser) return;
    
    // Find and update the ticket
    const updatedTickets = currentUser.tickets.map((ticket: TicketType) => {
      if (ticket.id === ticketId) {
        return { ...ticket, status: "Cancelled" as const };
      }
      return ticket;
    });
    
    // Update the user's tickets in the store
    const { updateUserProfile } = useAuthStore.getState();
    updateUserProfile({ tickets: updatedTickets });
    
    // Update local state
    setTickets(updatedTickets);
    
    toast({
      title: "Ticket cancelled",
      description: "Your ticket has been cancelled"
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 flex justify-center items-center">
          <p>Loading your tickets...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <Ticket className="h-8 w-8 mr-2 text-eventPurple" />
            My Tickets
          </h1>
          <Button variant="outline" className="flex items-center border-eventPurple text-eventPurple hover:bg-eventPurple/10">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar View
          </Button>
        </div>

        {tickets.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Table>
              <TableCaption>Your purchased tickets for upcoming and past events.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Ticket Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.eventName}</TableCell>
                    <TableCell>{ticket.date}</TableCell>
                    <TableCell>{ticket.location}</TableCell>
                    <TableCell>{ticket.ticketType}</TableCell>
                    <TableCell>{ticket.quantity}</TableCell>
                    <TableCell>${ticket.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        ticket.status === 'Upcoming' ? 'bg-green-100 text-green-800' : 
                        ticket.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {ticket.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="mr-2"
                      >
                        View
                      </Button>
                      {ticket.status === 'Upcoming' && (
                        <Button 
                          variant="outline"
                          size="sm"
                          className="text-red-500 border-red-500 hover:bg-red-50"
                          onClick={() => handleCancelTicket(ticket.id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Ticket className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-medium text-gray-600 mb-2">No tickets yet</h2>
            <p className="text-gray-500 mb-6">You haven't purchased any tickets yet.</p>
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

export default UserTickets;

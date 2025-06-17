
import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";

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

interface RecentTicketSalesProps {
  tickets: Ticket[];
  onViewTicket: (ticket: Ticket) => void;
  onEditTicket: (ticket: Ticket) => void;
  onDeleteTicket: (ticket: Ticket) => void;
  onNavigateToTickets: () => void;
}

const RecentTicketSales: React.FC<RecentTicketSalesProps> = ({
  tickets,
  onViewTicket,
  onEditTicket,
  onDeleteTicket,
  onNavigateToTickets
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Recent Ticket Sales</h3>
        <Button size="sm" className="bg-eventPurple hover:bg-eventPurple-dark" onClick={onNavigateToTickets}>
          View All
        </Button>
      </div>
      <div className="space-y-3">
        {tickets.map(ticket => (
          <div key={ticket.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium">{ticket.userName}</p>
              <p className="text-sm text-gray-500">{ticket.eventName} x{ticket.quantity}</p>
            </div>
            <div className="flex items-center space-x-2">
              <p className="font-medium">${(ticket.price * ticket.quantity).toFixed(2)}</p>
              <div className="flex space-x-1">
                <Button variant="outline" size="sm" onClick={() => onViewTicket(ticket)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => onEditTicket(ticket)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-500 border-red-200 hover:bg-red-50"
                  onClick={() => onDeleteTicket(ticket)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {tickets.length === 0 && (
          <p className="text-gray-500 text-center py-4">No ticket sales found</p>
        )}
      </div>
    </div>
  );
};

export default RecentTicketSales;

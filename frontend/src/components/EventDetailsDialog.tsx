import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  CloudSun,
  Utensils,
  Share2,
  Ticket,
} from "lucide-react";
import { type EventCardProps } from "./EventCard";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/useAuthStore";

const EventDetailsDialog = ({
  id,
  title,
  date,
  imageUrl,
  location,
  category,
  price,
  weather,
}: EventCardProps) => {
  const { currentUser, isLoggedIn, updateUserProfile } = useAuthStore();
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [ticketType, setTicketType] = useState("general");
  const [isBooked, setIsBooked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user already has tickets for this event
    if (currentUser && currentUser.tickets) {
      const existingTicket = currentUser.tickets.find(
        (ticket: any) => ticket.eventId === id
      );
      if (existingTicket) {
        setIsBooked(true);
      }
    }
  }, [id, currentUser]);

  const handleGetTickets = () => {
    if (!isLoggedIn || !currentUser) {
      toast({
        title: "Please login",
        description: "You need to login to book tickets",
        variant: "destructive",
      });
      return;
    }
    setShowTicketForm(true);
  };

  const handleBookTickets = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn || !currentUser) {
      toast({
        title: "Please login",
        description: "You need to login to book tickets",
        variant: "destructive",
      });
      return;
    }

    // Create ticket object
    const ticketPrice =
      ticketType === "vip"
        ? parseFloat(price?.replace("$", "") || "0") + 50
        : ticketType === "earlyBird"
        ? parseFloat(price?.replace("$", "") || "0") - 10
        : parseFloat(price?.replace("$", "") || "0");

    const newTicket = {
      id: `ticket-${Date.now()}`,
      eventId: id,
      eventName: title,
      date,
      location,
      ticketType:
        ticketType === "vip"
          ? "VIP Pass"
          : ticketType === "earlyBird"
          ? "Early Bird"
          : "General Admission",
      quantity: ticketQuantity,
      price: ticketPrice,
      purchaseDate: new Date().toISOString(),
      status: "Upcoming",
    };

    // Add ticket to user using Zustand store
    const updatedTickets = [...(currentUser.tickets || []), newTicket];
    updateUserProfile({ tickets: updatedTickets });

    toast({
      title: "Tickets booked",
      description: `You have successfully booked ${ticketQuantity} tickets for ${title}`,
    });

    setShowTicketForm(false);
    setIsBooked(true);
  };

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
      </DialogHeader>

      <div className="mt-2">
        <div className="relative h-64 rounded-md overflow-hidden mb-4">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
          {price && (
            <div className="absolute top-4 right-4 bg-eventPurple/90 px-3 py-1 rounded-full text-sm font-bold text-white">
              {price}
            </div>
          )}
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center text-gray-700">
            <Calendar className="h-5 w-5 mr-3 text-eventPurple" />
            <span>{date}</span>
          </div>

          <div className="flex items-center text-gray-700">
            <MapPin className="h-5 w-5 mr-3 text-eventPurple" />
            <span>{location}</span>
          </div>

          {weather && (
            <div className="flex items-center text-gray-700">
              <CloudSun className="h-5 w-5 mr-3 text-eventPurple" />
              <span>
                {weather.temp}, {weather.condition}
              </span>
            </div>
          )}
        </div>

        <Tabs defaultValue="details">
          <TabsList className="w-full">
            <TabsTrigger value="details" className="flex-1">
              Details
            </TabsTrigger>
            <TabsTrigger value="map" className="flex-1">
              Map
            </TabsTrigger>
            <TabsTrigger value="food" className="flex-1">
              Nearby Food
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="py-4">
            <p className="text-gray-700 mb-4">
              Join us for an unforgettable experience at this{" "}
              {category.toLowerCase()} event! This is where you'd see a detailed
              description of the event, including performers, special guests,
              and what makes this event unique.
            </p>
            <p className="text-gray-600">
              Additional information about tickets, age restrictions, and venue
              policies would appear here.
            </p>
          </TabsContent>

          <TabsContent value="map" className="py-4">
            <div className="bg-gray-200 rounded-md h-64 flex items-center justify-center">
              <p className="text-gray-600">
                Interactive map would appear here showing the venue location and
                nearby areas. (Google Maps API integration would go here)
              </p>
            </div>
          </TabsContent>

          <TabsContent value="food" className="py-4">
            <div className="space-y-3">
              <div className="flex items-start border-b pb-3">
                <Utensils className="h-5 w-5 mr-3 text-eventPurple mt-1" />
                <div>
                  <h4 className="font-medium">The Local Bistro</h4>
                  <p className="text-sm text-gray-600">
                    Italian, 0.2 miles away
                  </p>
                </div>
              </div>
              <div className="flex items-start border-b pb-3">
                <Utensils className="h-5 w-5 mr-3 text-eventPurple mt-1" />
                <div>
                  <h4 className="font-medium">Urban Plate</h4>
                  <p className="text-sm text-gray-600">
                    American, 0.3 miles away
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Utensils className="h-5 w-5 mr-3 text-eventPurple mt-1" />
                <div>
                  <h4 className="font-medium">Sushi Express</h4>
                  <p className="text-sm text-gray-600">
                    Japanese, 0.4 miles away
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex gap-3">
          {!showTicketForm && !isBooked ? (
            <Button
              className="flex-1 bg-eventPurple hover:bg-eventPurple-dark"
              onClick={handleGetTickets}
            >
              <Ticket className="h-4 w-4 mr-2" />
              Get Tickets
            </Button>
          ) : isBooked ? (
            <Button className="flex-1 bg-green-500 hover:bg-green-600" disabled>
              Tickets Booked ✓
            </Button>
          ) : null}
          <Button variant="outline" className="px-4">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        {showTicketForm && (
          <div className="mt-6 border rounded-md p-4 bg-gray-50">
            <h3 className="font-bold text-lg mb-4">Book Tickets</h3>
            <form onSubmit={handleBookTickets} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ticket-type">Ticket Type</Label>
                <select
                  id="ticket-type"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value={ticketType}
                  onChange={(e) => setTicketType(e.target.value)}
                >
                  <option value="general">General Admission ({price})</option>
                  <option value="vip">
                    VIP (${parseFloat(price?.replace("$", "") || "0") + 50})
                  </option>
                  <option value="earlyBird">
                    Early Bird ($
                    {parseFloat(price?.replace("$", "") || "0") - 10})
                  </option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max="10"
                  value={ticketQuantity}
                  onChange={(e) => setTicketQuantity(parseInt(e.target.value))}
                />
              </div>

              <div className="pt-2 flex justify-between items-center">
                <div>
                  <p className="font-bold">
                    Total: $
                    {(ticketType === "vip"
                      ? (parseFloat(price?.replace("$", "") || "0") + 50) *
                        ticketQuantity
                      : ticketType === "earlyBird"
                      ? (parseFloat(price?.replace("$", "") || "0") - 10) *
                        ticketQuantity
                      : parseFloat(price?.replace("$", "") || "0") *
                        ticketQuantity
                    ).toFixed(2)}
                  </p>
                </div>
                <div className="space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowTicketForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-eventPurple hover:bg-eventPurple-dark"
                  >
                    Confirm Booking
                  </Button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </DialogContent>
  );
};

export default EventDetailsDialog;

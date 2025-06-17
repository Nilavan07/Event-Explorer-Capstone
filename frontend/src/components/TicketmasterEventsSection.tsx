import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TicketmasterEventCard from "./TicketmasterEventCard";
import { TicketmasterService } from "@/services/ticketmasterService";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TicketmasterEventsSectionProps {
  ticketmasterApiKey: string;
  googleMapsApiKey: string;
}

export interface TicketmasterEventsRef {
  triggerSearch: (filters: {
    city: string;
    category: string;
    date?: Date;
  }) => void;
}

const TicketmasterEventsSection = forwardRef<
  TicketmasterEventsRef,
  TicketmasterEventsSectionProps
>(({ ticketmasterApiKey, googleMapsApiKey }, ref) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const eventsPerPage = 9;
  const totalPages = Math.ceil(events.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const currentEvents = events.slice(startIndex, endIndex);

  const ticketmasterService = new TicketmasterService(ticketmasterApiKey);

  // Load all events when component mounts
  useEffect(() => {
    loadAllEvents();
  }, [ticketmasterApiKey]);
  const handleDropdownSearch = async (searchValue: string) => {
    if (!searchValue.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await ticketmasterService.searchEvents({
        keyword: searchValue,
        size: 8,
      });

      if (response._embedded?.events) {
        const transformedEvents = response._embedded.events.map((event) =>
          ticketmasterService.transformEventData(event)
        );
        setSearchResults(transformedEvents);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleEventSelect = (eventId: string, eventTitle: string) => {
    setSearchOpen(false);
    setSearchResults([]);
    setSearchKeyword(eventTitle);
    // Trigger search with the selected event
    searchEventsWithParams(eventTitle, searchCity);
  };
  const loadAllEvents = async () => {
    setLoading(true);
    try {
      console.log("Loading all Ticketmaster events...");
      const response = await ticketmasterService.searchEvents({
        size: 200, // Load more events for pagination
        countryCode: "US",
      });

      if (response._embedded?.events) {
        const transformedEvents = response._embedded.events.map((event) =>
          ticketmasterService.transformEventData(event)
        );
        setEvents(transformedEvents);
        setCurrentPage(1); // Reset to first page
        console.log(`Loaded ${transformedEvents.length} events`);
      } else {
        setEvents([]);
        toast({
          title: "No events found",
          description: "No events are currently available",
        });
      }
    } catch (error) {
      console.error("Error loading events:", error);
      toast({
        title: "Failed to load events",
        description:
          "Unable to load events. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    triggerSearch: (filters) => {
      setSearchCity(filters.city);
      if (filters.category !== "all") {
        setSearchKeyword(filters.category);
      }
      searchEventsWithParams(
        filters.category !== "all" ? filters.category : "",
        filters.city
      );
    },
  }));

  const searchEventsWithParams = async (keyword: string, city: string) => {
    setLoading(true);
    try {
      const response = await ticketmasterService.searchEvents({
        keyword: keyword || undefined,
        city: city || undefined,
        size: 200,
      });

      if (response._embedded?.events) {
        const transformedEvents = response._embedded.events.map((event) =>
          ticketmasterService.transformEventData(event)
        );
        setEvents(transformedEvents);
        setCurrentPage(1); // Reset to first page
      } else {
        setEvents([]);
        toast({
          title: "No events found",
          description: "Try adjusting your search criteria",
        });
      }
    } catch (error) {
      console.error("Error searching events:", error);
      toast({
        title: "Search failed",
        description:
          "Unable to search for events. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const searchEvents = async () => {
    if (!searchKeyword && !searchCity) {
      // If no search terms, reload all events
      loadAllEvents();
      return;
    }
    await searchEventsWithParams(searchKeyword, searchCity);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of events section
    const element = document.getElementById("ticketmaster-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => handlePageChange(totalPages)}
              isActive={currentPage === totalPages}
              className="cursor-pointer"
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  return (
    <div className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Discover Events with Ticketmaster
        </h2>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                <PopoverTrigger asChild>
                  <div className="relative">
                    <Input
                      placeholder="Search events (e.g., concerts, sports)"
                      value={searchKeyword}
                      onChange={(e) => {
                        setSearchKeyword(e.target.value);
                        if (e.target.value.trim()) {
                          setSearchOpen(true);
                          handleDropdownSearch(e.target.value);
                        } else {
                          setSearchOpen(false);
                          setSearchResults([]);
                        }
                      }}
                      className="pr-10"
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="start">
                  <Command className="rounded-lg border shadow-md">
                    <CommandList>
                      {searchLoading && (
                        <div className="p-4 text-center text-sm text-gray-500">
                          Searching...
                        </div>
                      )}
                      {!searchLoading &&
                        searchResults.length === 0 &&
                        searchKeyword.trim() && (
                          <CommandEmpty>No events found.</CommandEmpty>
                        )}
                      {!searchLoading && searchResults.length > 0 && (
                        <CommandGroup heading="Events">
                          {searchResults.map((event) => (
                            <CommandItem
                              key={event.id}
                              onSelect={() =>
                                handleEventSelect(event.id, event.title)
                              }
                              className="flex items-center space-x-3 p-3 cursor-pointer"
                            >
                              <img
                                src={event.imageUrl}
                                alt={event.title}
                                className="w-10 h-10 rounded object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {event.title}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {event.location}
                                </p>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <Input
              placeholder="City (e.g., New York, Los Angeles)"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="flex-1"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={searchEvents}
              disabled={loading}
              className="flex-1 bg-eventPurple hover:bg-eventPurple-dark"
            >
              <Search className="h-4 w-4 mr-2" />
              {loading ? "Searching..." : "Search Events"}
            </Button>
            <Button
              onClick={loadAllEvents}
              disabled={loading}
              variant="outline"
            >
              Show All
            </Button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading events...</p>
          </div>
        )}

        {!loading && currentEvents.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentEvents.map((event) => (
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

            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {renderPaginationItems()}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        handlePageChange(Math.min(totalPages, currentPage + 1))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}

        {!loading && events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No events found</p>
            <p className="text-sm text-gray-400">
              Try searching for specific events or locations
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

TicketmasterEventsSection.displayName = "TicketmasterEventsSection";

export default TicketmasterEventsSection;

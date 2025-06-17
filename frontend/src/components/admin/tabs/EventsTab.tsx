
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Event } from "@/store/useEventStore";

interface EventsTabProps {
  events: Event[];
}

const EventsTab: React.FC<EventsTabProps> = ({ events }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Events Overview</h2>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="font-medium">{event.title}</TableCell>
              <TableCell>{event.date}</TableCell>
              <TableCell>{event.location}</TableCell>
              <TableCell>{event.category}</TableCell>
              <TableCell>{event.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EventsTab;

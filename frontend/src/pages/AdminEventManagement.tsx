
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useEventStore } from "@/store/useEventStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminEventManagement = () => {
  const { events, categories, addEvent, updateEvent, deleteEvent } = useEventStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  
  // Form state
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  
  const { toast } = useToast();
  
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    
    addEvent({
      title,
      date,
      imageUrl,
      location,
      category,
      price,
      weather: {
        temp: "72°F",
        condition: "Sunny",
      },
    });
    
    clearForm();
    setIsAddDialogOpen(false);
    
    toast({
      title: "Event added",
      description: `${title} has been added successfully`
    });
  };
  
  const handleEditEvent = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentEvent) return;
    
    updateEvent(currentEvent.id, {
      title,
      date,
      imageUrl,
      location,
      category,
      price,
    });
    
    clearForm();
    setIsEditDialogOpen(false);
    
    toast({
      title: "Event updated",
      description: `${title} has been updated successfully`
    });
  };
  
  const handleDeleteEvent = (id: string) => {
    const eventToDelete = events.find(event => event.id === id);
    
    if (window.confirm(`Are you sure you want to delete ${eventToDelete?.title}?`)) {
      deleteEvent(id);
      
      toast({
        title: "Event deleted",
        description: `${eventToDelete?.title} has been deleted`
      });
    }
  };
  
  const clearForm = () => {
    setTitle("");
    setDate("");
    setLocation("");
    setCategory("");
    setPrice("");
    setImageUrl("");
    setCurrentEvent(null);
  };
  
  const openEditDialog = (event: any) => {
    setCurrentEvent(event);
    setTitle(event.title);
    setDate(event.date);
    setLocation(event.location);
    setCategory(event.category);
    setPrice(event.price);
    setImageUrl(event.imageUrl);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Event Management</h1>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-eventPurple hover:bg-eventPurple-dark">
              Add New Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleAddEvent} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input 
                  id="title" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date & Time</Label>
                <Input 
                  id="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input 
                  id="price" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input 
                  id="image" 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  required
                />
              </div>
              
              <div className="pt-4 flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    clearForm();
                    setIsAddDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-eventPurple hover:bg-eventPurple-dark">
                  Add Event
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleEditEvent} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Event Title</Label>
                <Input 
                  id="edit-title" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-date">Date & Time</Label>
                <Input 
                  id="edit-date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input 
                  id="edit-location" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price</Label>
                <Input 
                  id="edit-price" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-image">Image URL</Label>
                <Input 
                  id="edit-image" 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  required
                />
              </div>
              
              <div className="pt-4 flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    clearForm();
                    setIsEditDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-eventPurple hover:bg-eventPurple-dark">
                  Update Event
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>
                  <img 
                    src={event.imageUrl} 
                    alt={event.title} 
                    className="h-12 w-16 object-cover rounded"
                  />
                </TableCell>
                <TableCell className="font-medium">{event.title}</TableCell>
                <TableCell>{event.date}</TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>{event.category}</TableCell>
                <TableCell>{event.price}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openEditDialog(event)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="text-red-500 border-red-500 hover:bg-red-50"
                    onClick={() => handleDeleteEvent(event.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminEventManagement;

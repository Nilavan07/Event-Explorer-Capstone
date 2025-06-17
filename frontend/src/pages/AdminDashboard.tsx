import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/store/useAuthStore";
import { useEventStore } from "@/store/useEventStore";
import { useToast } from "@/hooks/use-toast";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminStats from "@/components/admin/AdminStats";
import OverviewTab from "@/components/admin/tabs/OverviewTab";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout, users, fetchUsers, deleteUser, updateUser, register } =
    useAuthStore();
  const { events } = useEventStore();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("overview");
  useEffect(() => {
    fetchUsers();
  }, []);
  // Get recent events (last 3 events)
  const recentEvents = events.slice(-3).reverse();

  // Get all tickets from all users
  const getAllTickets = () => {
    const allTickets: any[] = [];
    users.forEach((user) => {
      if (user.tickets && user.tickets.length > 0) {
        user.tickets.forEach((ticket: any) => {
          allTickets.push({
            ...ticket,
            userName: user.name,
            userEmail: user.email,
            userId: user._id,
          });
        });
      }
    });
    return allTickets.sort(
      (a, b) =>
        new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
    );
  };

  const allTickets = getAllTickets();
  const recentTicketSales = allTickets.slice(0, 3);

  // User management state
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userRole, setUserRole] = useState<"user" | "admin">("user");

  // Ticket management state
  const [isEditTicketDialogOpen, setIsEditTicketDialogOpen] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<any>(null);
  const [ticketStatus, setTicketStatus] = useState("");

  // Event details dialog state
  const [isViewEventDialogOpen, setIsViewEventDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<any>(null);

  // Ticket details dialog state
  const [isViewTicketDialogOpen, setIsViewTicketDialogOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // User management functions
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await register(userName, userEmail, userPassword);

    if (success) {
      // If the role should be admin, update the user after registration
      if (userRole === "admin") {
        const newUser = users.find((user) => user.email === userEmail);
        if (newUser) {
          updateUser(newUser._id, { role: "admin" });
        }
      }

      clearUserForm();
      setIsAddUserDialogOpen(false);

      toast({
        title: "User added",
        description: `${userName} has been added successfully`,
      });
    } else {
      toast({
        title: "Failed to add user",
        description: "Email already exists or registration failed",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) return;

    updateUser(currentUser.id, {
      name: userName,
      email: userEmail,
      ...(userPassword && { password: userPassword }),
      role: userRole,
    });

    clearUserForm();
    setIsEditUserDialogOpen(false);

    toast({
      title: "User updated",
      description: `${userName} has been updated successfully`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    const userToDelete = users.find((user) => user._id === userId);

    if (
      window.confirm(`Are you sure you want to delete ${userToDelete?.name}?`)
    ) {
      deleteUser(userId);

      toast({
        title: "User deleted",
        description: `${userToDelete?.name} has been deleted`,
      });
    }
  };

  const clearUserForm = () => {
    setUserName("");
    setUserEmail("");
    setUserPassword("");
    setUserRole("user");
    setCurrentUser(null);
  };

  const openEditUserDialog = (user: any) => {
    setCurrentUser(user);
    setUserName(user.name);
    setUserEmail(user.email);
    setUserPassword("");
    setUserRole(user.role);
    setIsEditUserDialogOpen(true);
  };

  // Ticket management functions
  const handleEditTicket = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentTicket) return;

    // Find the user and update their ticket
    const userToUpdate = users.find(
      (user) => user._id === currentTicket.userId
    );
    if (userToUpdate && userToUpdate.tickets) {
      const updatedTickets = userToUpdate.tickets.map((ticket: any) =>
        ticket.id === currentTicket.id
          ? { ...ticket, status: ticketStatus }
          : ticket
      );

      updateUser(currentTicket.userId, { tickets: updatedTickets });

      setIsEditTicketDialogOpen(false);
      setCurrentTicket(null);
      setTicketStatus("");

      toast({
        title: "Ticket updated",
        description: "Ticket status has been updated successfully",
      });
    }
  };

  const handleDeleteTicket = (ticket: any) => {
    if (
      window.confirm(
        `Are you sure you want to delete this ticket for ${ticket.eventName}?`
      )
    ) {
      const userToUpdate = users.find((user) => user._id === ticket.userId);
      if (userToUpdate && userToUpdate.tickets) {
        const updatedTickets = userToUpdate.tickets.filter(
          (t: any) => t.id !== ticket.id
        );
        updateUser(ticket.userId, { tickets: updatedTickets });

        toast({
          title: "Ticket deleted",
          description: "Ticket has been deleted successfully",
        });
      }
    }
  };

  const openEditTicketDialog = (ticket: any) => {
    setCurrentTicket(ticket);
    setTicketStatus(ticket.status);
    setIsEditTicketDialogOpen(true);
  };

  const openViewTicketDialog = (ticket: any) => {
    setCurrentTicket(ticket);
    setIsViewTicketDialogOpen(true);
  };

  const openViewEventDialog = (event: any) => {
    setCurrentEvent(event);
    setIsViewEventDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        {/* <AdminStats
          totalUsers={users.length}
          totalTickets={allTickets.length}
        /> */}

        {/* <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        > */}
        {/* <TabsList className="grid w-full grid-cols-3"> */}
        {/* <TabsTrigger value="overview">Overview</TabsTrigger> */}
        {/* <TabsTrigger value="users">Users</TabsTrigger> */}
        {/* <TabsTrigger value="tickets">Tickets</TabsTrigger> */}
        {/* </TabsList> */}

        {/* <TabsContent value="overview">
            <OverviewTab
              recentEvents={recentEvents}
              recentTicketSales={recentTicketSales}
              onViewEvent={openViewEventDialog}
              onViewTicket={openViewTicketDialog}
              onEditTicket={openEditTicketDialog}
              onDeleteTicket={handleDeleteTicket}
              onSetActiveTab={setActiveTab}
            />
          </TabsContent> */}

        {/* <TabsContent value="users"> */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">User Management</h2>
            <Dialog
              open={isAddUserDialogOpen}
              onOpenChange={setIsAddUserDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="bg-eventPurple hover:bg-eventPurple-dark">
                  Add New User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddUser} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-name">Full Name</Label>
                    <Input
                      id="user-name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-email">Email</Label>
                    <Input
                      id="user-email"
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-password">Password</Label>
                    <Input
                      id="user-password"
                      type="password"
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-role">Role</Label>
                    <Select
                      value={userRole}
                      onValueChange={(value: "user" | "admin") =>
                        setUserRole(value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        clearUserForm();
                        setIsAddUserDialogOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-eventPurple hover:bg-eventPurple-dark"
                    >
                      Add User
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog
              open={isEditUserDialogOpen}
              onOpenChange={setIsEditUserDialogOpen}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleEditUser} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-user-name">Full Name</Label>
                    <Input
                      id="edit-user-name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-user-email">Email</Label>
                    <Input
                      id="edit-user-email"
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-user-password">
                      Password (leave blank to keep current)
                    </Label>
                    <Input
                      id="edit-user-password"
                      type="password"
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-user-role">Role</Label>
                    <Select
                      value={userRole}
                      onValueChange={(value: "user" | "admin") =>
                        setUserRole(value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        clearUserForm();
                        setIsEditUserDialogOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-eventPurple hover:bg-eventPurple-dark"
                    >
                      Update User
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Favorites</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>{user.favorites?.length || 0}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditUserDialog(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 border-red-200 hover:bg-red-50"
                      onClick={() => handleDeleteUser(user._id)}
                      disabled={user.role === "admin"}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {/* </TabsContent> */}

        {/* <TabsContent value="tickets">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Ticket Management</h2>
                <div className="text-sm text-gray-600">
                  Total Revenue: $
                  {allTickets
                    .reduce(
                      (sum, ticket) => sum + ticket.price * ticket.quantity,
                      0
                    )
                    .toFixed(2)}
                </div>
              </div>

              {allTickets.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allTickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">
                          {ticket.eventName}
                        </TableCell>
                        <TableCell>{ticket.userName}</TableCell>
                        <TableCell>{ticket.userEmail}</TableCell>
                        <TableCell>{ticket.ticketType}</TableCell>
                        <TableCell>{ticket.quantity}</TableCell>
                        <TableCell>${ticket.price}</TableCell>
                        <TableCell>
                          ${(ticket.price * ticket.quantity).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {new Date(ticket.purchaseDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              ticket.status === "Upcoming"
                                ? "bg-green-100 text-green-800"
                                : ticket.status === "Completed"
                                ? "bg-blue-100 text-blue-800"
                                : ticket.status === "Cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {ticket.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditTicketDialog(ticket)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 border-red-200 hover:bg-red-50"
                            onClick={() => handleDeleteTicket(ticket)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No tickets found
                </div>
              )}

              <Dialog
                open={isEditTicketDialogOpen}
                onOpenChange={setIsEditTicketDialogOpen}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Ticket</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleEditTicket} className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Event</Label>
                      <Input value={currentTicket?.eventName || ""} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Customer</Label>
                      <Input value={currentTicket?.userName || ""} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ticket-status">Status</Label>
                      <Select
                        value={ticketStatus}
                        onValueChange={setTicketStatus}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Upcoming">Upcoming</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                          <SelectItem value="Refunded">Refunded</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditTicketDialogOpen(false);
                          setCurrentTicket(null);
                          setTicketStatus("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-eventPurple hover:bg-eventPurple-dark"
                      >
                        Update Ticket
                      </Button>
                    </div> 
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent> */}
        {/* </Tabs> */}

        {/* <Dialog
          open={isViewEventDialogOpen}
          onOpenChange={setIsViewEventDialogOpen}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Event Details</DialogTitle>
            </DialogHeader>
            {currentEvent && (
              <div className="py-4">
                <div className="space-y-4">
                  <div>
                    <img
                      src={currentEvent.imageUrl}
                      alt={currentEvent.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{currentEvent.title}</h3>
                    <p className="text-gray-600">{currentEvent.date}</p>
                    <p className="text-gray-600">{currentEvent.location}</p>
                    <p className="text-gray-600">
                      Category: {currentEvent.category}
                    </p>
                    {currentEvent.price && (
                      <p className="text-gray-600">
                        Price: {currentEvent.price}
                      </p>
                    )}
                    {currentEvent.description && (
                      <div className="mt-4">
                        <h4 className="font-semibold">Description:</h4>
                        <p>{currentEvent.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog
          open={isViewTicketDialogOpen}
          onOpenChange={setIsViewTicketDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ticket Details</DialogTitle>
            </DialogHeader>
            {currentTicket && (
              <div className="py-4">
                <div className="space-y-3">
                  <div>
                    <strong>Event:</strong> {currentTicket.eventName}
                  </div>
                  <div>
                    <strong>Customer:</strong> {currentTicket.userName}
                  </div>
                  <div>
                    <strong>Email:</strong> {currentTicket.userEmail}
                  </div>
                  <div>
                    <strong>Ticket Type:</strong> {currentTicket.ticketType}
                  </div>
                  <div>
                    <strong>Quantity:</strong> {currentTicket.quantity}
                  </div>
                  <div>
                    <strong>Price per ticket:</strong> ${currentTicket.price}
                  </div>
                  <div>
                    <strong>Total:</strong> $
                    {(currentTicket.price * currentTicket.quantity).toFixed(2)}
                  </div>
                  <div>
                    <strong>Purchase Date:</strong>{" "}
                    {new Date(currentTicket.purchaseDate).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Status:</strong>
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        currentTicket.status === "Upcoming"
                          ? "bg-green-100 text-green-800"
                          : currentTicket.status === "Completed"
                          ? "bg-blue-100 text-blue-800"
                          : currentTicket.status === "Cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {currentTicket.status}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog> */}
      </main>
    </div>
  );
};

export default AdminDashboard;

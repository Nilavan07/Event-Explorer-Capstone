import { Search } from "lucide-react";
import { MusicIcon, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/useAuthStore";
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
import { TicketmasterService } from "@/services/ticketmasterService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { currentUser, isLoggedIn, login, register, logout } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await login(username, password, role);

    if (success) {
      const { currentUser } = useAuthStore.getState();

      setShowLoginDialog(false);

      if (currentUser?.role === "admin") {
        toast({
          title: "Admin login successful",
          description: "Welcome to the admin dashboard",
        });
        navigate("/admin-dashboard");
      } else {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
      }
    } else {
      toast({
        title: "Login failed",
        description: "Invalid username, password, or role",
        variant: "destructive",
      });
    }

    setUsername("");
    setPassword("");
  };
  const ticketmasterService = new TicketmasterService(
    "lvw06wBGLP57NHCVsqYHs6MXrVZPrTU3"
  );

  const handleSearch = async (searchValue: string) => {
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

  const handleEventSelect = (eventId: string) => {
    setSearchOpen(false);
    setSearchResults([]);
    // Navigate to home page and scroll to events section
    navigate("/");
    setTimeout(() => {
      const element = document.getElementById("ticketmaster-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // const handleAdminLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   const success = await login(adminEmail, adminPassword);

  //   if (success) {
  //     const { currentUser } = useAuthStore.getState();
  //     if (currentUser?.role === "admin") {
  //       setShowLoginDialog(false);
  //       toast({
  //         title: "Admin login successful",
  //         description: "Welcome to the admin dashboard",
  //       });
  //       navigate("/admin-dashboard");
  //     } else {
  //       toast({
  //         title: "Access denied",
  //         description: "You don't have admin privileges",
  //         variant: "destructive",
  //       });
  //     }
  //   } else {
  //     toast({
  //       title: "Admin login failed",
  //       description: "Invalid admin credentials",
  //       variant: "destructive",
  //     });
  //   }

  //   setAdminEmail("");
  //   setAdminPassword("");
  // };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerPassword !== confirmPassword) {
      toast({
        title: "Registration failed",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    const success = await register(
      registerName,
      registerEmail,
      registerPassword
    );

    if (success) {
      setShowLoginDialog(false);
      toast({
        title: "Registration successful",
        description: "Your account has been created",
      });
    } else {
      toast({
        title: "Registration failed",
        description: "Email already in use",
        variant: "destructive",
      });
    }

    // Clear form
    setRegisterName("");
    setRegisterEmail("");
    setRegisterPassword("");
    setConfirmPassword("");
  };

  const handleLogout = () => {
    logout();
    navigate("/");

    toast({
      title: "Logout successful",
      description: "You have been logged out",
    });
  };

  return (
    <header className="sticky top-0 z-10 w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <MusicIcon className="h-8 w-8 text-eventPurple" />
          <h1
            className="ml-2 text-2xl font-bold text-gray-800 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Event Explorer
          </h1>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <a
            href="/"
            className="text-gray-600 hover:text-eventPurple transition-colors"
          >
            Browse Events
          </a>
          <a
            href="/nearby"
            className="text-gray-600 hover:text-eventPurple transition-colors"
          >
            Nearby
          </a>
          <a
            href="/top-picks"
            className="text-gray-600 hover:text-eventPurple transition-colors"
          >
            Top Picks
          </a>
          {isLoggedIn && (
            <a
              href="/my-tickets"
              className="text-gray-600 hover:text-eventPurple transition-colors"
            >
              My Tickets
            </a>
          )}
          {isLoggedIn && (
            <a
              href="/favorites"
              className="text-gray-600 hover:text-eventPurple transition-colors"
            >
              Favorites
            </a>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <Popover open={searchOpen} onOpenChange={setSearchOpen}>
            <PopoverTrigger asChild>
              <button
                className="flex items-center justify-center rounded-full p-2 hover:bg-gray-100 transition-colors"
                aria-label="Search events"
              >
                <Search className="h-5 w-5 text-gray-600" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="center">
              <Command className="rounded-lg border shadow-md">
                <CommandInput
                  placeholder="Search events..."
                  onValueChange={handleSearch}
                />
                <CommandList>
                  {searchLoading && (
                    <div className="p-4 text-center text-sm text-gray-500">
                      Searching...
                    </div>
                  )}
                  {!searchLoading && searchResults.length === 0 && (
                    <CommandEmpty>No events found.</CommandEmpty>
                  )}
                  {!searchLoading && searchResults.length > 0 && (
                    <CommandGroup heading="Events">
                      {searchResults.map((event) => (
                        <CommandItem
                          key={event.id}
                          onSelect={() => handleEventSelect(event.id)}
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

          {!isLoggedIn ? (
            <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Login
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>User Account</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                    {/* <TabsTrigger value="admin">Admin Login</TabsTrigger> */}
                  </TabsList>
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <select
                          id="role"
                          value={role}
                          onChange={(e) =>
                            setRole(e.target.value as "user" | "admin")
                          }
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-eventPurple"
                          required
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                          />
                          <span>Remember me</span>
                        </label>
                        <a
                          href="#"
                          className="text-sm text-eventPurple hover:underline"
                        >
                          Forgot password?
                        </a>
                      </div>
                      <div className="pt-4">
                        <Button
                          type="submit"
                          className="w-full bg-eventPurple hover:bg-eventPurple-dark"
                        >
                          Login
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
                  <TabsContent value="register">
                    <form onSubmit={handleRegister} className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-name">Full Name</Label>
                        <Input
                          id="register-name"
                          placeholder="John Doe"
                          value={registerName}
                          onChange={(e) => setRegisterName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-email">Email</Label>
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="your@email.com"
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-password">Password</Label>
                        <Input
                          id="register-password"
                          type="password"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">
                          Confirm Password
                        </Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                      <div className="pt-4">
                        <Button
                          type="submit"
                          className="w-full bg-eventPurple hover:bg-eventPurple-dark"
                        >
                          Create Account
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
                  {/* <TabsContent value="admin">
                    <form
                      onSubmit={handleAdminLogin}
                      className="space-y-4 py-4"
                    >
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-semibold">Admin Login</h3>
                        <p className="text-sm text-gray-600">
                          Enter admin credentials to access dashboard
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="admin-email">Admin Email</Label>
                        <Input
                          id="admin-email"
                          type="email"
                          placeholder="admin@example.com"
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="admin-password">Admin Password</Label>
                        <Input
                          id="admin-password"
                          type="password"
                          placeholder="Enter admin password"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          required
                        />
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600">
                        <p>
                          <strong>Default Credentials:</strong>
                        </p>
                        <p>Email: admin@example.com</p>
                        <p>Password: admin123</p>
                      </div>
                      <div className="pt-4">
                        <Button
                          type="submit"
                          className="w-full bg-eventPurple hover:bg-eventPurple-dark"
                        >
                          Login to Admin Dashboard
                        </Button>
                      </div>
                    </form>
                  </TabsContent> */}
                </Tabs>
              </DialogContent>
            </Dialog>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center rounded-full h-10 w-10 p-0 justify-center"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 bg-white shadow-lg"
                align="end"
              >
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/my-tickets")}>
                  My Tickets
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/favorites")}>
                  Favorites
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

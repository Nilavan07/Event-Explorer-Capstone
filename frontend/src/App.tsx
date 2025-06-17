import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import UserTickets from "./pages/UserTickets";
import UserFavorites from "./pages/UserFavorites";
import TopPicks from "./pages/TopPicks";
import UserProfile from "./pages/UserProfile";
import Nearby from "./pages/Nearby";

// Initialize localStorage with default data when the app starts
const initializeLocalStorage = () => {
  // Check if users exist, if not create admin user
  if (!localStorage.getItem('users')) {
    const defaultUsers = [
      {
        id: 'admin',
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      }
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
  }
};

// Call initialization function
initializeLocalStorage();

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/nearby" element={<Nearby />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/my-tickets" element={<UserTickets />} />
          <Route path="/favorites" element={<UserFavorites />} />
          <Route path="/top-picks" element={<TopPicks />} />
          <Route path="/profile" element={<UserProfile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

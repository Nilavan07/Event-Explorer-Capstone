
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MusicIcon } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/hooks/use-toast';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { toast } = useToast();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await login(email, password);
    
    if (success) {
      const { currentUser } = useAuthStore.getState();
      if (currentUser?.role === 'admin') {
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard"
        });
        navigate('/admin-dashboard');
      } else {
        toast({
          title: "Access denied",
          description: "You don't have admin privileges",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="flex items-center mb-8">
        <MusicIcon className="h-10 w-10 text-eventPurple" />
        <h1 className="ml-2 text-3xl font-bold text-gray-800">Event Explorer</h1>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input 
                id="admin-email" 
                type="email" 
                placeholder="admin@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input 
                id="admin-password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <Button type="submit" className="w-full bg-eventPurple hover:bg-eventPurple-dark">
              Login to Dashboard
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => navigate('/')}>
            Return to Main Site
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;

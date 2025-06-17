import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { User, Heart, Ticket } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

const UserProfile = () => {
  const { currentUser, isLoggedIn, updateUserProfile, users } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoggedIn || !currentUser) {
      toast({
        title: "Please login",
        description: "You need to login to view your profile",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    setName(currentUser.name || "");
    setEmail(currentUser.email || "");
  }, [currentUser, isLoggedIn, navigate, toast]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) return;

    // Check if email is changed and not already taken
    if (email !== currentUser.email) {
      const emailExists = users.some(
        (u) => u._id !== currentUser._id && u.email === email
      );

      if (emailExists) {
        toast({
          title: "Email already in use",
          description: "Please choose a different email",
          variant: "destructive",
        });
        return;
      }
    }

    // Validate password if provided
    if (newPassword) {
      if (currentUser.password !== currentPassword) {
        toast({
          title: "Incorrect password",
          description: "Your current password is incorrect",
          variant: "destructive",
        });
        return;
      }

      if (newPassword !== confirmPassword) {
        toast({
          title: "Passwords don't match",
          description: "New password and confirmation must match",
          variant: "destructive",
        });
        return;
      }
    }

    // Update user profile
    const updateData: any = { name, email };
    if (newPassword) {
      updateData.password = newPassword;
    }

    updateUserProfile(updateData);

    // Clear password fields
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
  };

  if (!isLoggedIn || !currentUser) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 flex justify-center items-center">
          <p>Loading your profile...</p>
        </main>
        <Footer />
      </div>
    );
  }

  const ticketCount = currentUser.tickets?.length || 0;
  const favoriteCount = currentUser.favorites?.length || 0;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 flex items-center">
          <User className="h-8 w-8 mr-2 text-eventPurple" />
          My Profile
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Account Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-center mb-4">
                <div className="bg-eventPurple h-24 w-24 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {name.charAt(0).toUpperCase()}
                </div>
              </div>

              <h2 className="text-xl font-bold text-center mb-6">{name}</h2>

              <div className="flex justify-around mb-8">
                {/* <div className="text-center">
                  <div className="flex flex-col items-center">
                    <Ticket className="h-6 w-6 text-eventPurple mb-1" />
                    <span className="font-bold text-lg">{ticketCount}</span>
                    <span className="text-sm text-gray-500">Tickets</span>
                  </div>
                </div> */}
                <div className="text-center">
                  <div className="flex flex-col items-center">
                    <Heart className="h-6 w-6 text-red-500 mb-1" />
                    <span className="font-bold text-lg">{favoriteCount}</span>
                    <span className="text-sm text-gray-500">Favorites</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* <Button 
                  className="w-full bg-eventPurple hover:bg-eventPurple-dark"
                  onClick={() => navigate('/my-tickets')}
                >
                  <Ticket className="h-4 w-4 mr-2" />
                  My Tickets
                </Button> */}
                <Button
                  className="w-full bg-pink-500 hover:bg-pink-600"
                  onClick={() => navigate("/favorites")}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  My Favorites
                </Button>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">Account Settings</h2>

              <form onSubmit={handleUpdateProfile}>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-medium mb-4">
                      Change Password
                    </h3>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">
                          Current Password
                        </Label>
                        <Input
                          id="current-password"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">
                          Confirm New Password
                        </Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button
                      type="submit"
                      className="bg-eventPurple hover:bg-eventPurple-dark"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;


import React from 'react';
import { Button } from "@/components/ui/button";
import { MusicIcon, LogOut } from "lucide-react";

interface AdminHeaderProps {
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <MusicIcon className="h-8 w-8 text-eventPurple" />
          <h1 className="ml-2 text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>
        
        <Button variant="outline" onClick={onLogout} className="flex items-center">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;

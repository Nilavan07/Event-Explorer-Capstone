import React from "react";

interface AdminStatsProps {
  totalUsers: number;
  totalTickets: number;
}

const AdminStats: React.FC<AdminStatsProps> = ({
  totalUsers,
  totalTickets,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-2">Users</h3>
        <p className="text-3xl font-bold">{totalUsers}</p>
      </div>
      {/* <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-2">Total Tickets</h3>
        <p className="text-3xl font-bold">{totalTickets}</p>
      </div> */}
    </div>
  );
};

export default AdminStats;

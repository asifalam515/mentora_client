"use client";

import { MyBookings } from "@/components/booking/MyBookings";
import { authClient } from "@/lib/auth";

export default function AdminDashboard() {
  const { data, loading } = authClient.useSession();
  console.log(data.user.id);
  if (loading) return <p className="p-6">Loading admin stats...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-2">
        <MyBookings
          userRole={data?.user.role as string}
          userId={data.user.id}
        />
        <h1>Review Modal will be here</h1>
      </div>
    </div>
  );
}

"use client";

import { MyBookings } from "@/components/booking/MyBookings";
import { useDashboard } from "@/hooks/useDashboard";

export default function StudentDashboard() {
  const { data, loading } = useDashboard();
  if (loading) return <p className="p-6">Loading student dashboard...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Student Dashboard</h1>

      <MyBookings userRole="STUDENT" userId={data?.user?.id || ""} />
    </div>
  );
}

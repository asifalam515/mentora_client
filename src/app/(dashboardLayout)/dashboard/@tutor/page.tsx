"use client";

import { MyBookings } from "@/components/booking/MyBookings";
import { useDashboard } from "@/hooks/useDashboard";

export default function TutorDashboard() {
  const { data, loading } = useDashboard();

  if (loading) return <p className="p-6">Loading tutor dashboard...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Tutor Dashboard </h1>

      <MyBookings userRole="TUTOR" userId={data?.user?.id || ""} />
    </div>
  );
}

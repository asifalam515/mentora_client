"use client";

import Profile from "@/app/(commonLayout)/profile/page";
import { MyBookings } from "@/components/booking/MyBookings";
import { useAuthStore } from "@/store/useAuthStore.ts";

export default function StudentDashboard() {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.isLoading);
  if (loading) return <p className="p-6">Loading student dashboard...</p>;
  console.log(user, loading);
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Student Dashboard</h1>

      <div className="grid grid-cols-2">
        <MyBookings userRole="STUDENT" userId={user?.id as string} />
        <Profile></Profile>
      </div>
    </div>
  );
}

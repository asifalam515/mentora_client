"use client";

import Profile from "@/app/(commonLayout)/profile/page";
import { MyBookings } from "@/components/booking/MyBookings";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore.ts";
import Link from "next/link";

export default function TutorDashboard() {
  const { user, isLoading } = useAuthStore();

  if (isLoading) return <p className="p-6">Loading tutor dashboard...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Tutor Dashboard </h1>
      <Button variant="destructive">
        {" "}
        <Link href="/">Navigate Home</Link>
      </Button>

      <div className="grid grid-cols-2">
        <MyBookings userRole="TUTOR" userId={user?.id || ""} />
        <Profile></Profile>
      </div>
    </div>
  );
}

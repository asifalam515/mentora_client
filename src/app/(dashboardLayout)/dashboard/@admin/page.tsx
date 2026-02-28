"use client";

import { UserManagementByAdmin } from "@/components/admin/UserManagementByAdmin";
import { MyBookings } from "@/components/booking/MyBookings";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore.ts";
import Link from "next/link";

export default function AdminDashboard() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  if (isLoading) return <p className="p-6">Loading admin stats...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <Button variant="destructive">
        {" "}
        <Link href="/">Navigate Home</Link>{" "}
      </Button>
      <div className="grid grid-cols-2 gap-2">
        <MyBookings userRole="ADMIN" userId={user?.id as string} />
        <UserManagementByAdmin />
      </div>
    </div>
  );
}

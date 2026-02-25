"use client";

import { UserManagementByAdmin } from "@/components/admin/UserManagementByAdmin";
import { MyBookings } from "@/components/booking/MyBookings";
import { authClient } from "@/lib/auth";
import { UserRole } from "@/types/booking/types";

export default function AdminDashboard() {
  const { data, isPending } = authClient.useSession();
  if (isPending) return <p className="p-6">Loading admin stats...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-2">
        <MyBookings
          userRole={(data?.user as any)?.role as UserRole}
          userId={data?.user.id as string}
        />
        <UserManagementByAdmin />
      </div>
    </div>
  );
}

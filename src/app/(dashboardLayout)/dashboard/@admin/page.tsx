"use client";

import { UserManagementByAdmin } from "@/components/admin/UserManagementByAdmin";
import { MyBookings } from "@/components/booking/MyBookings";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/useAuthStore.ts";
import { FolderKanban, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-10 w-40" />
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-96 w-full rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Card className="border-primary/15 bg-background/85 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-primary" />
            Operations Overview
          </CardTitle>
          <CardDescription>
            Monitor users and bookings with a centralized control panel.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild className="gap-2">
            <Link href="/users">
              <ShieldCheck className="h-4 w-4" />
              Manage Users
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/categories">
              <FolderKanban className="h-4 w-4" />
              Manage Categories
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-5 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <MyBookings userRole="ADMIN" userId={user?.id as string} />
        </div>
        <div className="xl:col-span-4">
          <UserManagementByAdmin />
        </div>
      </div>
    </div>
  );
}

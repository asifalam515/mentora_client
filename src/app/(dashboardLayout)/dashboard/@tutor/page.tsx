"use client";

import Profile from "@/app/(commonLayout)/profile/page";
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
import { CalendarClock, Sparkles, UserCircle2 } from "lucide-react";
import Link from "next/link";

export default function TutorDashboard() {
  const { user, isLoading } = useAuthStore();

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
            Tutor Performance Hub
          </CardTitle>
          <CardDescription>
            Manage your upcoming sessions and keep your profile polished for new
            students.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild className="gap-2">
            <Link href="/availability-slot">
              <CalendarClock className="h-4 w-4" />
              Manage Availability
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/chats">Open Chats</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-5 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <MyBookings userRole="TUTOR" userId={user?.id || ""} />
        </div>
        <Card className="xl:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <UserCircle2 className="h-4 w-4 text-primary" />
              Public Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Profile></Profile>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

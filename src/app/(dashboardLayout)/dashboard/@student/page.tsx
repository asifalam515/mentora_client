"use client";

import Profile from "@/app/(commonLayout)/profile/page";
import { MyBookings } from "@/components/booking/MyBookings";
import StudentInvoicesList from "@/components/invoice/StudentInvoicesList";
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
import { FileText, MessageSquare, Sparkles, UserCircle2 } from "lucide-react";
import Link from "next/link";

export default function StudentDashboard() {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.isLoading);
  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-60" />
        <Skeleton className="h-10 w-40" />
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-96 w-full rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
        <Skeleton className="h-56 w-full rounded-xl" />
      </div>
    );
  }
  return (
    <div className="space-y-5">
      <Card className="border-primary/15 bg-background/85 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-primary" />
            Welcome back, {user?.name?.split(" ")[0] || "Student"}
          </CardTitle>
          <CardDescription>
            Keep track of your sessions, invoices, and communication in one
            place.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/tutors">Find Tutors</Link>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/chats">
              <MessageSquare className="h-4 w-4" />
              Open Chats
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/invoices">
              <FileText className="h-4 w-4" />
              View Invoices
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-5 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <MyBookings userRole="STUDENT" userId={user?.id as string} />
        </div>
        <Card className="xl:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <UserCircle2 className="h-4 w-4 text-primary" />
              Profile Snapshot
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Profile></Profile>
          </CardContent>
        </Card>
      </div>
      <StudentInvoicesList />
    </div>
  );
}

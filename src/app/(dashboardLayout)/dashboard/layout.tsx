"use client";

import ChatWorkspace from "@/components/chat/ChatWorkspace";
import ProfilePage from "@/components/profile/ProfilePage";
import AvailabilityManager from "@/components/tutor/AvailabilityManager";
import { DashboardWithCollapsibleSidebar } from "@/components/ui/dashboard-with-collapsible-sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/useAuthStore.ts";
import {
  BookOpen,
  Home,
  MessageSquare,
  Settings,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

interface Props {
  admin: React.ReactNode;
  tutor: React.ReactNode;
  student: React.ReactNode;
  children: React.ReactNode;
}

type DashboardNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  notifs?: number;
};

export default function DashboardLayout({ admin, tutor, student }: Props) {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const role = user?.role;
  const activeView = searchParams.get("view") || "home";

  const navItems = useMemo<DashboardNavItem[]>(() => {
    return [
      {
        title: "Dashboard",
        href: "/dashboard?view=home",
        icon: Home,
      },
      {
        title: "Profile",
        href: "/dashboard?view=profile",
        icon: User,
      },
      {
        title: "Messages",
        href: "/dashboard?view=messages",
        icon: MessageSquare,
        notifs: 3,
      },
      {
        title: "Availability",
        href: "/dashboard?view=availability",
        icon: BookOpen,
      },
    ];
  }, []);

  const accountItems = useMemo<DashboardNavItem[]>(() => {
    const base: DashboardNavItem[] = [
      {
        title: "Settings",
        href: "/dashboard?view=profile",
        icon: Settings,
      },
    ];

    if (role === "ADMIN") {
      return [
        ...base,
        {
          title: "Users",
          href: "/dashboard?view=users",
          icon: Users,
          notifs: 12,
        },
      ];
    }

    return base;
  }, [role]);

  const dashboardTitle =
    role === "ADMIN"
      ? "Admin Command Center"
      : role === "TUTOR"
        ? "Tutor Workspace"
        : "Student Workspace";

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [isLoading, user]);

  if (isLoading)
    return (
      <div className="min-h-screen bg-muted/20">
        <div className="grid min-h-screen md:grid-cols-[280px_1fr]">
          <div className="hidden border-r bg-background/60 p-5 md:block">
            <Skeleton className="h-8 w-40" />
            <div className="mt-8 space-y-3">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
          <div className="space-y-4 p-6">
            <Skeleton className="h-10 w-72" />
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-44 w-full rounded-xl" />
              <Skeleton className="h-44 w-full rounded-xl" />
            </div>
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  if (!user) return null;

  const rolePanel =
    role === "ADMIN"
      ? admin
      : role === "TUTOR"
        ? tutor
        : role === "STUDENT"
          ? student
          : null;

  const viewPanel = (() => {
    if (!user) return null;

    if (activeView === "profile") {
      return <ProfilePage />;
    }

    if (activeView === "messages") {
      return <ChatWorkspace />;
    }

    if (activeView === "availability") {
      if (role === "TUTOR") {
        return <AvailabilityManager tutorId={user.id} />;
      }

      return (
        <div className="rounded-2xl border bg-background/80 p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Availability</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Availability management is available for tutors.
          </p>
        </div>
      );
    }

    if (activeView === "users" && role === "ADMIN") {
      return rolePanel;
    }

    return rolePanel;
  })();

  return rolePanel ? (
    <DashboardWithCollapsibleSidebar
      title={dashboardTitle}
      subtitle="Manage your sessions, profile, and activity from one workspace."
      userName={user.name || "Mentora User"}
      userPlan={role === "ADMIN" ? "Enterprise" : "Pro Plan"}
      navItems={navItems}
      accountItems={accountItems}
    >
      {viewPanel}
    </DashboardWithCollapsibleSidebar>
  ) : (
    <p className="p-6">You do not have access to this dashboard.</p>
  );
}

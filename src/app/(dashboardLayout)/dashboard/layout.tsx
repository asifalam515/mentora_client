"use client";

import { useAuthStore } from "@/store/useAuthStore.ts";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  admin: React.ReactNode;
  tutor: React.ReactNode;
  student: React.ReactNode;
  children: React.ReactNode;
}

export default function DashboardLayout({ admin, tutor, student }: Props) {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();

  const role = user?.role;

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [isLoading, user]);

  if (isLoading) return <p className="p-6">Loading...</p>;
  if (!user) return null;

  if (role === "ADMIN") return <>{admin}</>;
  if (role === "TUTOR") return <>{tutor}</>;
  if (role === "STUDENT") return <>{student}</>;
  return <p className="p-6">You do not have access to this dashboard.</p>;
}

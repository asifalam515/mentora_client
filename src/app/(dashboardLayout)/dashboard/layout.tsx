"use client";

import { authClient } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  admin: React.ReactNode;
  tutor: React.ReactNode;
  student: React.ReactNode;
  children: React.ReactNode;
}

export default function DashboardLayout({ admin, tutor, student }: Props) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const role = session?.user?.role;

  useEffect(() => {
    if (!isPending && !session) router.replace("/login");
  }, [isPending, session]);

  if (isPending) return <p className="p-6">Loading...</p>;
  if (!session) return null;

  if (role === "ADMIN") return <>{admin}</>;
  if (role === "TUTOR") return <>{tutor}</>;
  if (role === "STUDENT") return <>{student}</>;
  return <p className="p-6">You do not have access to this dashboard.</p>;
}

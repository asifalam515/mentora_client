"use client";

import { getDashboardStats } from "@/lib/api";
import { authClient } from "@/lib/auth";
import { useEffect, useState } from "react";

export function useDashboard() {
  const { data: session, isPending } = authClient.useSession();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;

    getDashboardStats(session.token)
      .then(setData)
      .finally(() => setLoading(false));
  }, [session]);

  return { data, loading };
}

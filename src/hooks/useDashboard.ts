"use client";

import { getDashboardStats } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore.ts";

import { useEffect, useState } from "react";

export function useDashboard() {
  const user = useAuthStore((state) => state.user);

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const res = await getDashboardStats();
        setData(res);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return { data, loading };
}

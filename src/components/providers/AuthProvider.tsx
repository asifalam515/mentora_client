"use client";

import { useEffect } from "react";

import { getUser } from "@/services/auth";
import { useAuthStore } from "@/store/useAuthStore.ts";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getUser();
        setUser(data || null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return <>{children}</>;
}

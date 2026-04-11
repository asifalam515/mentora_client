"use client";

import ChatWorkspace from "@/components/chat/ChatWorkspace";
import { useAuthStore } from "@/store/useAuthStore.ts";

export default function ChatsPage() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return <div className="p-6">Loading chats...</div>;
  }

  if (!user) {
    return <div className="p-6">Please log in to view your chats.</div>;
  }

  return (
    <div className="space-y-6 py-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Chats</h1>
        <p className="text-sm text-muted-foreground">
          Session conversations tied to your bookings.
        </p>
      </div>

      <ChatWorkspace />
    </div>
  );
}

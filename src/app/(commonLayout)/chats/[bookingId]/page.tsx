"use client";

import ChatWorkspace from "@/components/chat/ChatWorkspace";
import { useAuthStore } from "@/store/useAuthStore.ts";
import { use } from "react";

export default function BookingChatPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const resolvedParams = use(params);
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return <div className="p-6">Loading chat...</div>;
  }

  if (!user) {
    return <div className="p-6">Please log in to open this chat.</div>;
  }

  return (
    <div className="py-6">
      <ChatWorkspace bookingId={resolvedParams.bookingId} />
    </div>
  );
}

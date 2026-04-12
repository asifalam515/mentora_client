"use client";

import ChatWorkspace from "@/components/chat/ChatWorkspace";
import { isValidChatBookingId } from "@/lib/chat";
import { useAuthStore } from "@/store/useAuthStore.ts";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

export default function BookingChatPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    if (!isValidChatBookingId(resolvedParams.bookingId)) {
      router.replace("/chats");
    }
  }, [resolvedParams.bookingId, router]);

  if (isLoading) {
    return <div className="p-6">Loading chat...</div>;
  }

  if (!user) {
    return <div className="p-6">Please log in to open this chat.</div>;
  }

  if (!isValidChatBookingId(resolvedParams.bookingId)) {
    return <div className="p-6">Redirecting to chats...</div>;
  }

  return (
    <div className="py-6">
      <ChatWorkspace bookingId={resolvedParams.bookingId} />
    </div>
  );
}

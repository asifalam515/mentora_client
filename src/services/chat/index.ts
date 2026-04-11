"use client";

import {
  ChatConversationDetail,
  ChatConversationSummary,
  ChatFileUploadResponse,
  ChatMessage,
} from "@/types/chat/types";

const parseApiError = async (response: Response, fallback: string) => {
  try {
    const payload = await response.json();
    return payload?.message || payload?.error || fallback;
  } catch {
    return fallback;
  }
};

const unwrapData = <T>(payload: unknown): T => {
  if (Array.isArray(payload)) return payload as T;
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data?: T }).data as T;
  }
  return payload as T;
};

export const getChatConversations = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/chats/conversations`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      await parseApiError(response, "Failed to load conversations"),
    );
  }

  const payload = await response.json();
  return unwrapData<ChatConversationSummary[]>(payload) || [];
};

export const getOrCreateBookingConversation = async (bookingId: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/chats/booking/${bookingId}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      await parseApiError(response, "Failed to load conversation"),
    );
  }

  const payload = await response.json();
  return unwrapData<ChatConversationDetail>(payload);
};

export const getConversationMessages = async (conversationId: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/chats/${conversationId}/messages`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(await parseApiError(response, "Failed to load messages"));
  }

  const payload = await response.json();
  return unwrapData<ChatMessage[]>(payload) || [];
};

export const markConversationAsRead = async (conversationId: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/chats/${conversationId}/read`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      await parseApiError(response, "Failed to mark conversation as read"),
    );
  }

  const payload = await response.json().catch(() => ({}));
  return payload;
};

export const uploadChatAttachment = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/chats/upload`,
    {
      method: "POST",
      credentials: "include",
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error(await parseApiError(response, "Failed to upload file"));
  }

  const payload = await response.json();
  const fileData = unwrapData<ChatFileUploadResponse>(payload);

  if (!fileData?.fileUrl) {
    throw new Error("Upload response was incomplete");
  }

  return fileData;
};

"use client";

import { ApiError, apiJson, apiRequest } from "@/lib/api-client";
import {
  ChatConversationDetail,
  ChatConversationSummary,
  ChatFileUploadResponse,
  ChatMessage,
} from "@/types/chat/types";

const unwrapData = <T>(payload: unknown): T => {
  if (Array.isArray(payload)) return payload as T;
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data?: T }).data as T;
  }
  return payload as T;
};

export const getChatConversations = async () => {
  const payload = await apiJson<unknown>("/chats/conversations", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return unwrapData<ChatConversationSummary[]>(payload) || [];
};

export const getOrCreateBookingConversation = async (bookingId: string) => {
  const payload = await apiJson<unknown>(`/chats/booking/${bookingId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return unwrapData<ChatConversationDetail>(payload);
};

export const getConversationMessages = async (conversationId: string) => {
  const payload = await apiJson<unknown>(`/chats/${conversationId}/messages`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return unwrapData<ChatMessage[]>(payload) || [];
};

export const markConversationAsRead = async (conversationId: string) => {
  return apiJson<unknown>(`/chats/${conversationId}/read`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch(() => ({}));
};

export const uploadChatAttachment = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiRequest("/chats/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload file");
  }

  const payload = await response.json();
  const fileData = unwrapData<ChatFileUploadResponse>(payload);

  if (!fileData?.fileUrl) {
    throw new Error("Upload response was incomplete");
  }

  return fileData;
};

export const sendConversationMessage = async (
  conversationId: string,
  payload: {
    text?: string;
    fileUrl?: string;
    fileName?: string;
    fileType?: string;
    fileSize?: number;
  },
) => {
  try {
    const response = await apiJson<unknown>(
      `/chats/${conversationId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    return unwrapData<ChatMessage | null>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error("Failed to send message");
  }
};

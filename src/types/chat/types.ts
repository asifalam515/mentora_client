export interface ChatUserSummary {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

export interface ChatBookingSummary {
  id: string;
  date: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "TRANSFERRED" | "REFUNDED";
  payoutStatus?: "PENDING" | "TRANSFERRED" | "FAILED" | string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  text?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
  fileType?: string | null;
  fileSize?: number | null;
  createdAt: string;
  readAt?: string | null;
  sender?: ChatUserSummary;
}

export interface ChatConversationSummary {
  id: string;
  bookingId: string;
  booking: ChatBookingSummary;
  student: ChatUserSummary;
  tutor: ChatUserSummary;
  lastMessage?: ChatMessage | null;
  unreadCount: number;
  updatedAt: string;
}

export interface ChatConversationDetail extends ChatConversationSummary {
  messages: ChatMessage[];
}

export interface ChatFileUploadResponse {
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

import { useAuthStore } from "@/store/useAuthStore.ts";

interface ChatTypingPayload {
  conversationId: string;
  userId: string;
  isTyping: boolean;
}

interface ChatReadReceiptPayload {
  conversationId: string;
  messageIds: string[];
  readAt: string;
  readerId: string;
}

interface ChatSocketContextValue {
  socket: Socket | null;
  connected: boolean;
  joinConversation: (conversationId: string) => void;
  startTyping: (conversationId: string) => void;
  stopTyping: (conversationId: string) => void;
  sendMessage: (payload: {
    conversationId: string;
    text?: string;
    fileUrl?: string;
    fileName?: string;
    fileType?: string;
    fileSize?: number;
  }) => void;
  markMessageRead: (conversationId: string) => void;
  onTyping: (handler: (payload: ChatTypingPayload) => void) => () => void;
  onMessage: (
    handler: (payload: { conversationId: string; message: unknown }) => void,
  ) => () => void;
  onReceipt: (handler: (payload: ChatReadReceiptPayload) => void) => () => void;
  onError: (handler: (payload: { message: string }) => void) => () => void;
}

const ChatSocketContext = createContext<ChatSocketContextValue | null>(null);

const getSocketBaseUrl = () => {
  const apiBase = process.env.NEXT_PUBLIC_BASE_URL || "";
  return apiBase.replace(/\/api\/v1\/?$/, "");
};

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      return;
    }

    const socket = io(getSocketBaseUrl(), {
      withCredentials: true,
      transports: ["websocket"],
      autoConnect: false,
    });

    socketRef.current = socket;
    queueMicrotask(() => setSocket(socket));

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.connect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.disconnect();
      socketRef.current = null;
      setSocket(null);
      setConnected(false);
    };
  }, [user]);

  const value = useMemo<ChatSocketContextValue>(
    () => ({
      socket,
      connected,
      joinConversation: (conversationId) => {
        socketRef.current?.emit("chat:join", { conversationId });
      },
      startTyping: (conversationId) => {
        socketRef.current?.emit("chat:typing:start", { conversationId });
      },
      stopTyping: (conversationId) => {
        socketRef.current?.emit("chat:typing:stop", { conversationId });
      },
      sendMessage: (payload) => {
        socketRef.current?.emit("chat:message:send", payload);
      },
      markMessageRead: (conversationId) => {
        socketRef.current?.emit("chat:message:read", { conversationId });
      },
      onTyping: (handler) => {
        socketRef.current?.on("chat:typing", handler);
        return () => socketRef.current?.off("chat:typing", handler);
      },
      onMessage: (handler) => {
        socketRef.current?.on("chat:message:new", handler);
        return () => socketRef.current?.off("chat:message:new", handler);
      },
      onReceipt: (handler) => {
        socketRef.current?.on("chat:receipt:read", handler);
        return () => socketRef.current?.off("chat:receipt:read", handler);
      },
      onError: (handler) => {
        socketRef.current?.on("chat:error", handler);
        return () => socketRef.current?.off("chat:error", handler);
      },
    }),
    [socket, connected],
  );

  return (
    <ChatSocketContext.Provider value={value}>
      {children}
    </ChatSocketContext.Provider>
  );
}

export function useChatSocket() {
  const context = useContext(ChatSocketContext);
  if (!context) {
    throw new Error("useChatSocket must be used within ChatProvider");
  }
  return context;
}

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
  mode: "realtime" | "fallback";
  statusText: string;
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

const getSocketUrl = () =>
  (process.env.NEXT_PUBLIC_SOCKET_URL || "").trim().replace(/\/$/, "");

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [mode, setMode] = useState<"realtime" | "fallback">("fallback");
  const [statusText, setStatusText] = useState(
    "Realtime unavailable, using refresh mode",
  );
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      return;
    }

    const socketUrl = getSocketUrl();

    if (!socketUrl) {
      return;
    }

    const socket = io(socketUrl, {
      withCredentials: true,
      transports: ["websocket"],
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 2,
      reconnectionDelay: 1200,
      timeout: 5000,
    });

    socketRef.current = socket;
    queueMicrotask(() => setSocket(socket));

    const handleConnect = () => {
      setConnected(true);
      setMode("realtime");
      setStatusText("Realtime connected");
    };
    const handleDisconnect = () => {
      setConnected(false);
      setMode("fallback");
      setStatusText("Realtime unavailable, using refresh mode");
    };

    const handleConnectError = (error: Error) => {
      console.warn("[chat] socket connect failed, falling back to REST", {
        message: error.message,
      });
      setConnected(false);
      setMode("fallback");
      setStatusText("Realtime unavailable, using refresh mode");
      socket.disconnect();
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.connect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.disconnect();
      socketRef.current = null;
      setSocket(null);
      setConnected(false);
      setMode("fallback");
      setStatusText("Realtime unavailable, using refresh mode");
    };
  }, [user]);

  const value = useMemo<ChatSocketContextValue>(
    () => ({
      socket,
      connected,
      mode,
      statusText,
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
    [socket, connected, mode, statusText],
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

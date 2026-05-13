import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/useAuthStore.ts";
import { useChatStore } from "@/store/useChatStore";

const getSocketBase = () => {
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000";
  return base.replace(/\/api\/v1\/?$/, "");
};

const readClientToken = () => {
  if (typeof document === "undefined") return null;
  const cookieToken = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("token="))
    ?.split("=")[1];
  if (cookieToken) return decodeURIComponent(cookieToken);
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem("authToken");
};

export const useChatSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const { user } = useAuthStore();
  const { addMessage, setTyping } = useChatStore();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const token = readClientToken();
    if (!token) return;

    const socket = io(getSocketBase(), {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    socket.on("chat:message:new", (message) => {
      addMessage(message);
    });

    socket.on("chat:typing", ({ conversationId, isTyping = true }) => {
      setTyping(conversationId, isTyping);
      // Optional: Auto-clear typing indicator after 3 seconds
      if (isTyping) {
        setTimeout(() => setTyping(conversationId, false), 3000);
      }
    });
    
    socket.on("chat:error", (err) => {
      console.error("Socket error:", err);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [user, addMessage, setTyping]);

  const joinConversation = useCallback((conversationId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("chat:join", { conversationId });
    }
  }, []);

  const startTyping = useCallback((conversationId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("chat:typing:start", { conversationId });
    }
  }, []);

  const stopTyping = useCallback((conversationId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("chat:typing:stop", { conversationId });
    }
  }, []);

  const markAsRead = useCallback((conversationId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("chat:message:read", { conversationId });
    }
  }, []);

  return {
    isConnected,
    joinConversation,
    startTyping,
    stopTyping,
    markAsRead,
  };
};

"use client";

import { useEffect, useState } from "react";
import { useChatStore } from "@/store/useChatStore";
import { useChatSocket } from "@/hooks/useChatSocket";
import { getChatConversations, getConversationMessages, markConversationAsRead, sendConversationMessage } from "@/services/chat";
import { useAuthStore } from "@/store/useAuthStore.ts";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";

export default function ChatPage() {
  const {
    conversations,
    setConversations,
    activeConversationId,
    setActiveConversationId,
    activeMessages,
    setActiveMessages,
    typingUsers,
  } = useChatStore();

  const {
    joinConversation,
    startTyping,
    stopTyping,
    markAsRead,
  } = useChatSocket();

  const { user } = useAuthStore();

  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  useEffect(() => {
    // Fetch initial conversations
    const fetchConversations = async () => {
      try {
        const data = await getChatConversations();
        setConversations(data);
      } catch (error) {
        console.error("Failed to load conversations", error);
      }
    };
    fetchConversations();
  }, [setConversations]);

  const handleSelectConversation = async (id: string) => {
    setActiveConversationId(id);
    joinConversation(id);
    
    // Fetch messages for the selected conversation
    setIsLoadingMessages(true);
    try {
      const messages = await getConversationMessages(id);
      setActiveMessages(messages);
      
      // Mark as read
      await markConversationAsRead(id);
      markAsRead(id); // emit socket event
      
      // Update local unread count
      setConversations(
        useChatStore.getState().conversations.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
      );
    } catch (error) {
      console.error("Failed to load messages", error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSendMessage = async (text?: string, fileUrl?: string, fileName?: string, fileType?: string, fileSize?: number) => {
    if (!activeConversationId || !user) return;

    // Optimistic UI update
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      id: tempId,
      conversationId: activeConversationId,
      senderId: user.id,
      text: text || null,
      fileUrl: fileUrl || null,
      fileName: fileName || null,
      fileType: fileType || null,
      fileSize: fileSize || null,
      createdAt: new Date().toISOString(),
      readAt: null,
      sender: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      }
    };

    useChatStore.getState().addMessage(optimisticMessage);

    try {
      const savedMessage = await sendConversationMessage(activeConversationId, { text, fileUrl, fileName, fileType, fileSize });
      if (savedMessage) {
        useChatStore.getState().replaceMessage(tempId, savedMessage);
      }
    } catch (error) {
      console.error("Failed to send message via REST API", error);
      // We could also show an error state or toast here, and potentially remove the optimistic message
    }
  };

  const handleTypingStart = () => {
    if (activeConversationId) startTyping(activeConversationId);
  };

  const handleTypingStop = () => {
    if (activeConversationId) stopTyping(activeConversationId);
  };

  const activeConversation = conversations.find(c => c.id === activeConversationId) || null;

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] min-h-[600px] w-full overflow-hidden rounded-lg border shadow-sm">
      <ChatSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
      />
      <ChatWindow
        conversation={activeConversation}
        messages={activeMessages}
        isLoading={isLoadingMessages}
        typingUsers={typingUsers}
        onSendMessage={handleSendMessage}
        onTypingStart={handleTypingStart}
        onTypingStop={handleTypingStop}
      />
    </div>
  );
}

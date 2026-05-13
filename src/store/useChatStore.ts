import { create } from "zustand";
import { ChatConversationSummary, ChatMessage } from "@/types/chat/types";

interface ChatState {
  conversations: ChatConversationSummary[];
  activeConversationId: string | null;
  activeMessages: ChatMessage[];
  typingUsers: Record<string, boolean>; // conversationId -> isTyping
  isSidebarOpen: boolean;

  setConversations: (conversations: ChatConversationSummary[]) => void;
  updateConversation: (id: string, data: Partial<ChatConversationSummary>) => void;
  setActiveConversationId: (id: string | null) => void;
  setActiveMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  replaceMessage: (oldId: string, newMessage: ChatMessage) => void;
  setTyping: (conversationId: string, isTyping: boolean) => void;
  toggleSidebar: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  activeConversationId: null,
  activeMessages: [],
  typingUsers: {},
  isSidebarOpen: true,

  setConversations: (conversations) => set({ conversations }),
  updateConversation: (id, data) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, ...data } : c
      ),
    })),
  setActiveConversationId: (id) => set({ activeConversationId: id }),
  setActiveMessages: (messages) => set({ activeMessages: messages }),
  addMessage: (message) =>
    set((state) => {
      // deduplicate
      if (state.activeMessages.some((m) => m.id === message.id)) {
        return state;
      }

      // update last message in conversations list and sort
      const updatedConversations = state.conversations.map((c) => {
        if (c.id === message.conversationId) {
           return { ...c, lastMessage: message, updatedAt: message.createdAt };
        }
        return c;
      }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

      // only add to active messages if it belongs to active conversation
      const newMessages =
        state.activeConversationId === message.conversationId
          ? [...state.activeMessages, message]
          : state.activeMessages;

      return {
        activeMessages: newMessages,
        conversations: updatedConversations,
      };
    }),
  replaceMessage: (oldId, newMessage) =>
    set((state) => {
      const updatedConversations = state.conversations.map((c) => {
        if (c.id === newMessage.conversationId && c.lastMessage?.id === oldId) {
           return { ...c, lastMessage: newMessage };
        }
        return c;
      });

      const newMessages = state.activeMessages.map(m => m.id === oldId ? newMessage : m);

      return {
        activeMessages: newMessages,
        conversations: updatedConversations,
      };
    }),
  setTyping: (conversationId, isTyping) =>
    set((state) => ({
      typingUsers: { ...state.typingUsers, [conversationId]: isTyping },
    })),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));

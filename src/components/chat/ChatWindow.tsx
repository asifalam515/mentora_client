import { useEffect, useRef } from "react";
import { Loader2Icon, MoreVerticalIcon } from "lucide-react";
import { ChatConversationSummary, ChatMessage } from "@/types/chat/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthStore } from "@/store/useAuthStore.ts";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";

interface ChatWindowProps {
  conversation: ChatConversationSummary | null;
  messages: ChatMessage[];
  isLoading: boolean;
  typingUsers: Record<string, boolean>;
  onSendMessage: (text?: string, fileUrl?: string, fileName?: string, fileType?: string, fileSize?: number) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
}

export function ChatWindow({
  conversation,
  messages,
  isLoading,
  typingUsers,
  onSendMessage,
  onTypingStart,
  onTypingStop
}: ChatWindowProps) {
  const { user } = useAuthStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const otherUser = conversation 
    ? (user?.role === "STUDENT" ? conversation.tutor : conversation.student) 
    : null;

  const isTyping = conversation ? typingUsers[conversation.id] : false;

  useEffect(() => {
    // Auto-scroll to bottom when messages or typing status change
    if (scrollRef.current) {
      const scrollElement = scrollRef.current;
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  }, [messages, isTyping]);

  if (!conversation) {
    return (
      <div className="flex h-full flex-1 items-center justify-center bg-muted/10">
        <div className="text-center text-muted-foreground">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <MoreVerticalIcon className="h-6 w-6 opacity-50" />
          </div>
          <h3 className="text-lg font-medium">Select a conversation</h3>
          <p className="text-sm">Choose a chat from the sidebar to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-1 flex-col bg-background">
      {/* Header */}
      <div className="flex h-[72px] items-center justify-between border-b px-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={otherUser?.image || ""} />
            <AvatarFallback>{otherUser?.name?.charAt(0) || "?"}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{otherUser?.name || "Unknown"}</h3>
            <p className="text-xs text-muted-foreground">
              Booking: {conversation.booking?.date ? new Date(conversation.booking.date).toLocaleDateString() : ""}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVerticalIcon className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" viewportRef={scrollRef}>
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground/50" />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {messages.map((msg) => (
              <MessageBubble 
                key={msg.id} 
                message={msg} 
                isOwnMessage={msg.senderId === user?.id} 
              />
            ))}
            {isTyping && (
              <div className="flex w-full justify-start mb-4">
                <div className="flex items-end gap-2">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={otherUser?.image || ""} />
                    <AvatarFallback>{otherUser?.name?.charAt(0) || "?"}</AvatarFallback>
                  </Avatar>
                  <div className="rounded-2xl bg-muted px-4 py-3 rounded-bl-none">
                    <div className="flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/50 [animation-delay:-0.3s]"></span>
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/50 [animation-delay:-0.15s]"></span>
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/50"></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      <ChatInput 
        onSendMessage={onSendMessage}
        onTypingStart={onTypingStart}
        onTypingStop={onTypingStop}
      />
    </div>
  );
}

import { formatDistanceToNow } from "date-fns";
import { MessageCircleIcon, SearchIcon } from "lucide-react";
import { ChatConversationSummary } from "@/types/chat/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/useAuthStore.ts";

interface ChatSidebarProps {
  conversations: ChatConversationSummary[];
  activeConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
}

export function ChatSidebar({ conversations, activeConversationId, onSelectConversation }: ChatSidebarProps) {
  const { user } = useAuthStore();
  
  return (
    <div className="flex h-full flex-col border-r bg-muted/20 w-80 shrink-0">
      <div className="flex items-center p-4 border-b">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MessageCircleIcon className="h-5 w-5" />
          Messages
        </h2>
      </div>
      <div className="p-4 border-b">
        <div className="relative">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search messages..." className="pl-8 bg-background" />
        </div>
      </div>
      <ScrollArea className="flex-1">
        {conversations.map((conv) => {
          const otherUser = user?.role === "STUDENT" ? conv.tutor : conv.student;
          const isSelected = activeConversationId === conv.id;
          
          return (
            <button
              key={conv.id}
              onClick={() => onSelectConversation(conv.id)}
              className={`w-full flex items-start gap-3 p-4 text-left transition-colors hover:bg-muted/50 border-b ${
                isSelected ? "bg-muted" : ""
              }`}
            >
              <Avatar className="h-10 w-10 shrink-0 mt-1">
                <AvatarImage src={otherUser?.image || ""} />
                <AvatarFallback>{otherUser?.name?.charAt(0) || "?"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <h3 className="font-medium truncate text-sm">
                    {otherUser?.name || "Unknown"}
                  </h3>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(conv.updatedAt), { addSuffix: true })}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-muted-foreground truncate flex-1">
                    {conv.lastMessage?.text || (conv.lastMessage?.fileUrl ? "Sent an attachment" : "No messages yet")}
                  </p>
                  {conv.unreadCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
        {conversations.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <MessageCircleIcon className="mx-auto h-8 w-8 opacity-20 mb-2" />
            <p className="text-sm">No conversations yet</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

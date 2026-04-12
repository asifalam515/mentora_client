"use client";

import { formatDistanceToNow } from "date-fns";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { resolveChatBookingId } from "@/lib/chat";
import { cn } from "@/lib/utils";
import { ChatConversationSummary } from "@/types/chat/types";

interface ConversationListProps {
  conversations: ChatConversationSummary[];
  activeBookingId?: string;
  onSelect?: (conversation: ChatConversationSummary) => void;
  currentUserId?: string;
  loading?: boolean;
}

const formatPreview = (value?: string | null) => {
  if (!value) return "No messages yet";
  return value;
};

const getOtherParticipant = (
  conversation: ChatConversationSummary,
  currentUserId?: string,
) => {
  if (currentUserId && conversation.student.id === currentUserId) {
    return conversation.tutor;
  }
  return conversation.student;
};

export default function ConversationList({
  conversations,
  activeBookingId,
  onSelect,
  currentUserId,
  loading = false,
}: ConversationListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((index) => (
          <div key={index} className="rounded-2xl border p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-56" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!conversations.length) {
    return (
      <Card className="border-dashed bg-muted/20">
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          <MessageSquare className="mx-auto mb-3 h-10 w-10 opacity-20" />
          No session chats yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {conversations.map((conversation) => {
        const otherParticipant = getOtherParticipant(
          conversation,
          currentUserId,
        );
        const resolvedBookingId = resolveChatBookingId(
          conversation.bookingId,
          conversation.booking.id,
        );
        const isActive = activeBookingId === resolvedBookingId;
        const preview = conversation.lastMessage?.text
          ? conversation.lastMessage.text
          : conversation.lastMessage?.fileName
            ? `Attachment: ${conversation.lastMessage.fileName}`
            : undefined;

        const content = (
          <Card
            className={cn(
              "cursor-pointer border transition-all hover:-translate-y-0.5 hover:shadow-md",
              isActive
                ? "border-primary/40 bg-primary/5 shadow-sm"
                : "bg-card/80",
            )}
          >
            <CardContent className="flex items-center gap-3 p-4">
              <Avatar className="h-12 w-12 border">
                <AvatarImage src={otherParticipant.image || undefined} />
                <AvatarFallback>
                  {otherParticipant.name
                    .split(" ")
                    .map((name) => name[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">
                      {otherParticipant.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      Session on{" "}
                      {new Date(conversation.booking.date).toLocaleDateString()}
                    </p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <Badge className="rounded-full px-2 py-1 text-xs">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>

                <p className="truncate text-sm text-muted-foreground">
                  {formatPreview(preview)}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{conversation.booking.status}</span>
                  <span>
                    {formatDistanceToNow(new Date(conversation.updatedAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );

        if (onSelect) {
          if (!resolvedBookingId) {
            return (
              <div key={conversation.id} className="w-full text-left">
                {content}
              </div>
            );
          }

          return (
            <button
              key={conversation.id}
              type="button"
              onClick={() => onSelect(conversation)}
              className="w-full text-left"
            >
              {content}
            </button>
          );
        }

        if (!resolvedBookingId) {
          return <div key={conversation.id}>{content}</div>;
        }

        return (
          <Link key={conversation.id} href={`/chats/${resolvedBookingId}`}>
            {content}
          </Link>
        );
      })}
    </div>
  );
}

"use client";

import { format, formatDistanceToNow } from "date-fns";
import {
  ArrowLeft,
  CheckCheck,
  FileText,
  Loader2,
  Paperclip,
  Send,
  ShieldAlert,
  Sparkles,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import ConversationList from "@/components/chat/ConversationList";
import { useChatSocket } from "@/components/providers/ChatProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { isValidChatBookingId, resolveChatBookingId } from "@/lib/chat";
import { cn } from "@/lib/utils";
import {
  getChatConversations,
  getConversationMessages,
  getOrCreateBookingConversation,
  markConversationAsRead,
  sendConversationMessage,
  uploadChatAttachment,
} from "@/services/chat";
import { useAuthStore } from "@/store/useAuthStore.ts";
import {
  ChatConversationDetail,
  ChatConversationSummary,
  ChatMessage,
} from "@/types/chat/types";

interface ChatWorkspaceProps {
  bookingId?: string;
}

const formatFileSize = (bytes?: number | null) => {
  if (!bytes) return "";
  const sizes = ["B", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    sizes.length - 1,
  );
  const value = bytes / Math.pow(1024, index);
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${sizes[index]}`;
};

const isImageFile = (fileType?: string | null) =>
  Boolean(fileType?.startsWith("image/"));

const readTypingTimeout = 800;

const normalizeIncomingMessage = (
  payload: unknown,
): { conversationId?: string; message?: ChatMessage } => {
  if (!payload || typeof payload !== "object") {
    return {};
  }

  const candidate = payload as Partial<ChatMessage> & {
    conversationId?: unknown;
    message?: unknown;
  };

  if (
    candidate.message &&
    typeof candidate.message === "object" &&
    candidate.message !== null
  ) {
    return {
      conversationId:
        typeof candidate.conversationId === "string"
          ? candidate.conversationId
          : undefined,
      message: candidate.message as ChatMessage,
    };
  }

  if (typeof candidate.id === "string") {
    return {
      conversationId:
        typeof candidate.conversationId === "string"
          ? candidate.conversationId
          : undefined,
      message: candidate as ChatMessage,
    };
  }

  return {};
};

export default function ChatWorkspace({ bookingId }: ChatWorkspaceProps) {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.user);
  const [conversations, setConversations] = useState<ChatConversationSummary[]>(
    [],
  );
  const [activeConversation, setActiveConversation] =
    useState<ChatConversationDetail | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [typingUserId, setTypingUserId] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState<string | null>(null);
  const [selectedConversationBookingId, setSelectedConversationBookingId] =
    useState<string | undefined>(bookingId);
  const typingStopTimer = useRef<number | null>(null);
  const bookingResolutionAttemptRef = useRef<string | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const userScrolledAwayRef = useRef(false);
  const pollingRef = useRef<number | null>(null);
  const {
    connected,
    mode,
    statusText,
    joinConversation,
    startTyping,
    stopTyping,
    markMessageRead,
    onTyping,
    onMessage,
    onReceipt,
    onError,
  } = useChatSocket();

  const activeConversationId = activeConversation?.id;
  const currentUserId = currentUser?.id;

  const activeOtherParticipant = useMemo(() => {
    if (!activeConversation || !currentUserId) return null;
    return activeConversation.student.id === currentUserId
      ? activeConversation.tutor
      : activeConversation.student;
  }, [activeConversation, currentUserId]);

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getChatConversations();
      setConversations(data);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to load chats";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      setLoadingMessages(true);
      const data = await getConversationMessages(conversationId);
      setMessages(data);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to load messages";
      toast.error(message);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  const activateConversation = useCallback(
    async (detail: ChatConversationDetail, targetBookingId?: string) => {
      setActiveConversation(detail);
      setMessages(detail.messages || []);
      setSelectedConversationBookingId(targetBookingId ?? detail.bookingId);
      joinConversation(detail.id);
      await markConversationAsRead(detail.id);
      markMessageRead(detail.id);
      window.dispatchEvent(new CustomEvent("booking:updated"));
    },
    [joinConversation, markMessageRead],
  );

  const selectConversationFromBooking = useCallback(
    async (targetBookingId: string) => {
      if (!isValidChatBookingId(targetBookingId)) {
        setAccessDenied("Invalid booking reference.");
        setActiveConversation(null);
        setMessages([]);
        setLoadingMessages(false);
        return;
      }

      setAccessDenied(null);
      setLoadingMessages(true);

      try {
        const existingConversation = conversations.find(
          (conversation) =>
            conversation.bookingId === targetBookingId ||
            conversation.booking.id === targetBookingId,
        );

        if (existingConversation) {
          const messages = await getConversationMessages(
            existingConversation.id,
          );
          await activateConversation(
            {
              ...existingConversation,
              messages,
            },
            targetBookingId,
          );
          return;
        }

        const detail = await getOrCreateBookingConversation(targetBookingId);
        await activateConversation(detail, targetBookingId);
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Unable to open chat";
        setActiveConversation(null);
        setMessages([]);
        setAccessDenied(message);
        toast.error(message);
      } finally {
        setLoadingMessages(false);
      }
    },
    [activateConversation, conversations],
  );

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    const resolvedBookingId = resolveChatBookingId(bookingId);

    if (!resolvedBookingId || !conversations.length) {
      return;
    }

    if (bookingResolutionAttemptRef.current === resolvedBookingId) {
      return;
    }

    bookingResolutionAttemptRef.current = resolvedBookingId;
    setSelectedConversationBookingId(resolvedBookingId);
    selectConversationFromBooking(resolvedBookingId);
  }, [bookingId, conversations, selectConversationFromBooking]);

  useEffect(() => {
    if (mode !== "realtime" || !activeConversationId) {
      return;
    }

    const unsubscribeMessage = onMessage((payload) => {
      const { conversationId, message } = normalizeIncomingMessage(payload);

      if (!message?.id) {
        return;
      }

      if (!activeConversationId || conversationId !== activeConversationId) {
        loadConversations();
        return;
      }

      setMessages((currentMessages) => {
        if (currentMessages.some((item) => item.id === message.id)) {
          return currentMessages;
        }
        return [...currentMessages, message];
      });
      loadConversations();
      markMessageRead(activeConversationId);
    });

    const unsubscribeTyping = onTyping(
      ({ conversationId, userId, isTyping }) => {
        if (conversationId !== activeConversationId) return;
        if (userId === currentUserId) return;
        setTypingUserId(isTyping ? userId : null);
      },
    );

    const unsubscribeReceipt = onReceipt(
      ({ conversationId, messageIds, readerId }) => {
        if (conversationId !== activeConversationId) return;
        if (readerId === currentUserId) return;
        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            messageIds.includes(message.id)
              ? { ...message, readAt: new Date().toISOString() }
              : message,
          ),
        );
        loadConversations();
      },
    );

    const unsubscribeError = onError(({ message }) => {
      toast.error(message);
    });

    return () => {
      unsubscribeMessage();
      unsubscribeTyping();
      unsubscribeReceipt();
      unsubscribeError();
    };
  }, [
    mode,
    activeConversationId,
    currentUserId,
    loadConversations,
    markMessageRead,
    onMessage,
    onTyping,
    onReceipt,
    onError,
  ]);

  useEffect(() => {
    if (mode === "realtime") {
      if (pollingRef.current) {
        window.clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      return;
    }

    if (!activeConversationId) {
      return;
    }

    pollingRef.current = window.setInterval(async () => {
      try {
        const [latestMessages] = await Promise.all([
          getConversationMessages(activeConversationId),
          loadConversations(),
        ]);
        setMessages(latestMessages);
      } catch (error) {
        console.warn("[chat] polling refresh failed", error);
      }
    }, 10000);

    return () => {
      if (pollingRef.current) {
        window.clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [activeConversationId, loadConversations, mode]);

  useEffect(() => {
    if (!activeConversationId) return;
    loadMessages(activeConversationId);
    joinConversation(activeConversationId);
    markMessageRead(activeConversationId);
  }, [activeConversationId, joinConversation, loadMessages, markMessageRead]);

  useEffect(() => {
    if (!activeConversationId) return;
    if (userScrolledAwayRef.current) return;
    messageEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, activeConversationId]);

  useEffect(() => {
    return () => {
      if (typingStopTimer.current) {
        window.clearTimeout(typingStopTimer.current);
      }

      if (pollingRef.current) {
        window.clearInterval(pollingRef.current);
      }
    };
  }, []);

  const handleSelectConversation = async (
    conversation: ChatConversationSummary,
  ) => {
    const resolvedBookingId = resolveChatBookingId(
      conversation.bookingId,
      conversation.booking.id,
    );

    if (!resolvedBookingId) {
      toast.error("This conversation has an invalid booking reference.");
      return;
    }

    setSelectedConversationBookingId(resolvedBookingId);
    router.push(`/chats/${resolvedBookingId}`);
  };

  const handleTyping = (value: string) => {
    setMessageText(value);
    if (!activeConversationId) return;

    if (mode !== "realtime") {
      return;
    }

    startTyping(activeConversationId);

    if (typingStopTimer.current) {
      window.clearTimeout(typingStopTimer.current);
    }

    typingStopTimer.current = window.setTimeout(() => {
      stopTyping(activeConversationId);
    }, readTypingTimeout);
  };

  const handleSend = async () => {
    if (!activeConversationId) return;
    if (!messageText.trim() && !attachmentFile) return;

    const optimisticId = `temp-${Date.now()}`;
    const optimisticCreatedAt = new Date().toISOString();
    const optimisticText = messageText.trim();
    let filePayload: {
      fileUrl: string;
      fileName: string;
      fileType: string;
      fileSize: number;
    } | null = null;

    setSending(true);
    try {
      if (attachmentFile) {
        filePayload = await uploadChatAttachment(attachmentFile);
      }

      const optimisticMessage: ChatMessage = {
        id: optimisticId,
        conversationId: activeConversationId,
        senderId: currentUserId || "unknown",
        text: optimisticText || undefined,
        fileUrl: filePayload?.fileUrl,
        fileName: filePayload?.fileName,
        fileType: filePayload?.fileType,
        fileSize: filePayload?.fileSize,
        createdAt: optimisticCreatedAt,
      };

      setMessages((current) => [...current, optimisticMessage]);

      await sendConversationMessage(activeConversationId, {
        text: optimisticText || undefined,
        fileUrl: filePayload?.fileUrl,
        fileName: filePayload?.fileName,
        fileType: filePayload?.fileType,
        fileSize: filePayload?.fileSize,
      });

      const [latestMessages] = await Promise.all([
        getConversationMessages(activeConversationId),
        loadConversations(),
      ]);
      setMessages(latestMessages);

      setMessageText("");
      setAttachmentFile(null);
      if (mode === "realtime") {
        stopTyping(activeConversationId);
      }
    } catch (error: unknown) {
      setMessages((current) =>
        current.filter((item) => item.id !== optimisticId),
      );
      const message =
        error instanceof Error ? error.message : "Failed to send message";
      toast.error(message);
    } finally {
      setSending(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/png",
      "image/jpeg",
      "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF, DOCX, PNG, JPG, or TXT file.");
      event.target.value = "";
      return;
    }

    setAttachmentFile(file);
  };

  const currentConversation = activeConversation;
  const currentConversationBooking = currentConversation?.booking;

  const renderAttachmentPreview = (message: ChatMessage) => {
    if (!message.fileUrl) return null;

    return (
      <a
        href={message.fileUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-2 block overflow-hidden rounded-xl border bg-background/80"
      >
        {isImageFile(message.fileType) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={message.fileUrl}
            alt={message.fileName || "Attachment"}
            className="max-h-60 w-full object-cover"
          />
        ) : (
          <div className="flex items-center gap-3 p-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <FileText className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {message.fileName || "File attachment"}
              </p>
              <p className="text-xs text-muted-foreground">
                {message.fileType || "Unknown type"}
                {message.fileSize
                  ? ` • ${formatFileSize(message.fileSize)}`
                  : ""}
              </p>
            </div>
          </div>
        )}
      </a>
    );
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="space-y-4">
        <Card className="border-0 bg-linear-to-b from-background to-muted/20 shadow-sm">
          <CardHeader className="space-y-2 border-b bg-linear-to-r from-primary/5 to-transparent">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-primary" />
              Conversations
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Sessions only. Messages stay scoped to the booking.
            </p>
          </CardHeader>
          <CardContent className="p-4">
            <ConversationList
              conversations={conversations}
              activeBookingId={selectedConversationBookingId}
              onSelect={handleSelectConversation}
              currentUserId={currentUserId}
              loading={loading}
            />
          </CardContent>
        </Card>
      </aside>

      <section className="min-w-0">
        {accessDenied ? (
          <Card className="border-0 bg-muted/20 shadow-sm">
            <CardContent className="flex min-h-115 flex-col items-center justify-center gap-3 p-8 text-center">
              <ShieldAlert className="h-12 w-12 text-destructive/60" />
              <h2 className="text-xl font-semibold">
                Conversation unavailable
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                {accessDenied}
              </p>
            </CardContent>
          </Card>
        ) : currentConversation ? (
          <Card className="flex min-h-[70vh] flex-col overflow-hidden border-0 bg-card/95 shadow-xl">
            <CardHeader className="border-b bg-linear-to-r from-primary/5 via-background to-transparent px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border">
                    <AvatarImage
                      src={activeOtherParticipant?.image || undefined}
                    />
                    <AvatarFallback>
                      {activeOtherParticipant?.name
                        ?.split(" ")
                        .map((name) => name[0])
                        .join("") || <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">
                      {activeOtherParticipant?.name || "Session chat"}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {currentConversationBooking
                        ? `Booking on ${format(new Date(currentConversationBooking.date), "EEE, MMM d")}`
                        : loading
                          ? "Loading booking details..."
                          : "Booking details unavailable"}
                    </p>
                  </div>
                </div>

                <div className="hidden items-center gap-2 sm:flex">
                  <Badge
                    variant={connected ? "secondary" : "outline"}
                    className="rounded-full"
                  >
                    {mode === "realtime" ? "Realtime" : "Refresh mode"}
                  </Badge>
                  <Badge variant="secondary" className="rounded-full">
                    {currentConversationBooking?.status || "PENDING"}
                  </Badge>
                  <Badge variant="outline" className="rounded-full">
                    {currentConversationBooking?.paymentStatus || "PENDING"}
                  </Badge>
                  {(currentConversationBooking?.payoutStatus === "PENDING" ||
                    currentConversationBooking?.paymentStatus === "PAID") && (
                    <Badge variant="outline" className="rounded-full">
                      Transfer pending
                    </Badge>
                  )}
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{statusText}</p>
            </CardHeader>

            <div className="flex-1 min-h-0">
              {loadingMessages ? (
                <div className="space-y-3 px-4 py-5 sm:px-6">
                  {[1, 2, 3, 4].map((row) => (
                    <div
                      key={row}
                      className={cn(
                        "flex",
                        row % 2 === 0 ? "justify-end" : "justify-start",
                      )}
                    >
                      <Skeleton
                        className={cn(
                          "h-14 rounded-3xl",
                          row % 2 === 0 ? "w-56" : "w-64",
                        )}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <ScrollArea
                  className="h-[calc(70vh-220px)] px-4 py-5 sm:h-[calc(70vh-220px)] sm:px-6"
                  onScrollCapture={(event) => {
                    const target = event.currentTarget;
                    const atBottom =
                      target.scrollHeight -
                        target.scrollTop -
                        target.clientHeight <
                      64;
                    userScrolledAwayRef.current = !atBottom;
                    if (atBottom && activeConversationId) {
                      markMessageRead(activeConversationId);
                    }
                  }}
                >
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isCurrentUser = message.senderId === currentUserId;
                      return (
                        <div
                          key={message.id}
                          className={cn(
                            "flex",
                            isCurrentUser ? "justify-end" : "justify-start",
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[85%] rounded-3xl border px-4 py-3 shadow-sm sm:max-w-[72%]",
                              isCurrentUser
                                ? "border-primary/10 bg-primary text-primary-foreground"
                                : "border-border/60 bg-muted/40",
                            )}
                          >
                            {!isCurrentUser && message.sender && (
                              <p className="mb-1 text-xs font-medium text-muted-foreground">
                                {message.sender.name}
                              </p>
                            )}

                            {message.text && (
                              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                                {message.text}
                              </p>
                            )}

                            {renderAttachmentPreview(message)}

                            <div className="mt-2 flex items-center justify-between gap-3 text-[11px] opacity-80">
                              <span>
                                {formatDistanceToNow(
                                  new Date(message.createdAt),
                                  {
                                    addSuffix: true,
                                  },
                                )}
                              </span>
                              {isCurrentUser && (
                                <span className="flex items-center gap-1">
                                  {message.readAt ? (
                                    <>
                                      <CheckCheck className="h-3.5 w-3.5" />
                                      Read
                                    </>
                                  ) : (
                                    "Sent"
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messageEndRef} />
                  </div>
                </ScrollArea>
              )}
            </div>

            <div className="border-t bg-background/95 px-4 py-4 sm:px-6">
              {typingUserId && typingUserId !== currentUserId && (
                <div className="mb-3 text-sm text-muted-foreground">
                  typing...
                </div>
              )}

              {attachmentFile && (
                <div className="mb-3 flex items-center justify-between rounded-2xl border bg-muted/30 px-4 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {attachmentFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {attachmentFile.type || "file"} •{" "}
                      {formatFileSize(attachmentFile.size)}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setAttachmentFile(null)}
                    className="h-8 w-8"
                  >
                    <ArrowLeft className="h-4 w-4 rotate-45" />
                  </Button>
                </div>
              )}

              <div className="flex items-end gap-2">
                {mode !== "realtime" && (
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 rounded-2xl"
                    onClick={async () => {
                      if (!activeConversationId) return;
                      try {
                        const [latestMessages] = await Promise.all([
                          getConversationMessages(activeConversationId),
                          loadConversations(),
                        ]);
                        setMessages(latestMessages);
                      } catch (error) {
                        console.error("[chat] manual refresh failed", error);
                        toast.error("Failed to refresh messages");
                      }
                    }}
                  >
                    Refresh
                  </Button>
                )}
                <label className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border bg-background text-muted-foreground transition hover:border-primary/30 hover:text-primary">
                  <Paperclip className="h-4 w-4" />
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx,.png,.jpg,.jpeg,.txt"
                    onChange={handleFileChange}
                  />
                </label>

                <div className="flex-1 rounded-2xl border bg-background px-3 py-2 shadow-sm">
                  <Input
                    value={messageText}
                    onChange={(event) => handleTyping(event.target.value)}
                    placeholder="Write a message..."
                    className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                    onFocus={() =>
                      activeConversationId &&
                      markMessageRead(activeConversationId)
                    }
                  />
                </div>

                <Button
                  onClick={handleSend}
                  disabled={sending || (!messageText.trim() && !attachmentFile)}
                  className="h-11 gap-2 rounded-2xl px-5"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Send
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="border-0 bg-muted/20 shadow-sm">
            <CardContent className="flex min-h-[70vh] flex-col items-center justify-center gap-3 p-8 text-center">
              <Sparkles className="h-12 w-12 text-primary/60" />
              <h2 className="text-xl font-semibold">Open a session chat</h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Select a booking conversation from the inbox to start chatting
                with your student or tutor.
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}

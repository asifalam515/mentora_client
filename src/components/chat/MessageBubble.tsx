import { format } from "date-fns";
import { FileIcon, ImageIcon } from "lucide-react";
import { ChatMessage } from "@/types/chat/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessageBubbleProps {
  message: ChatMessage;
  isOwnMessage: boolean;
}

export function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
  const isImage = message.fileType?.startsWith("image/");
  const hasFile = !!message.fileUrl;

  return (
    <div
      className={`flex w-full ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`flex max-w-[70%] ${
          isOwnMessage ? "flex-row-reverse" : "flex-row"
        } items-end gap-2`}
      >
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={message.sender?.image || ""} />
          <AvatarFallback>
            {message.sender?.name?.charAt(0).toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
        <div
          className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"}`}
        >
          <div
            className={`rounded-2xl px-4 py-2 ${
              isOwnMessage
                ? "bg-primary text-primary-foreground rounded-br-none"
                : "bg-muted text-foreground rounded-bl-none"
            }`}
          >
            {hasFile && (
              <div className="mb-2">
                {isImage ? (
                  <img
                    src={message.fileUrl!}
                    alt="attachment"
                    className="max-h-48 rounded-md object-contain"
                  />
                ) : (
                  <a
                    href={message.fileUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-md bg-background/10 p-2 text-sm hover:underline"
                  >
                    <FileIcon className="h-4 w-4" />
                    <span className="truncate max-w-[150px]">
                      {message.fileName || "Attachment"}
                    </span>
                  </a>
                )}
              </div>
            )}
            {message.text && (
              <p className="whitespace-pre-wrap break-words text-sm">
                {message.text}
              </p>
            )}
          </div>
          <span className="mt-1 text-xs text-muted-foreground">
            {format(new Date(message.createdAt), "HH:mm")}
          </span>
        </div>
      </div>
    </div>
  );
}

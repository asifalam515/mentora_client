import { useState, useRef, ChangeEvent } from "react";
import { SendIcon, PaperclipIcon, XIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadChatAttachment } from "@/services/chat";

interface ChatInputProps {
  onSendMessage: (text?: string, fileUrl?: string, fileName?: string, fileType?: string, fileSize?: number) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, onTypingStart, onTypingStop, disabled }: ChatInputProps) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);

    // Handle typing indicator
    onTypingStart();
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      onTypingStop();
    }, 2000);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 15 * 1024 * 1024) {
        alert("File must be smaller than 15MB");
        return;
      }
      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSend = async () => {
    if ((!text.trim() && !file) || disabled || isUploading) return;

    try {
      if (file) {
        setIsUploading(true);
        const uploadRes = await uploadChatAttachment(file);
        onSendMessage(text.trim(), uploadRes.fileUrl, uploadRes.fileName, uploadRes.fileType, uploadRes.fileSize);
      } else {
        onSendMessage(text.trim());
      }

      setText("");
      removeFile();
      onTypingStop();
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message or upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded-b-xl border-t bg-background p-4">
      {file && (
        <div className="flex items-center gap-2 rounded-md border bg-muted/50 p-2 text-sm w-max max-w-[200px]">
          <span className="truncate flex-1">{file.name}</span>
          <Button variant="ghost" size="icon" className="h-5 w-5" onClick={removeFile}>
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      )}
      <div className="flex items-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 text-muted-foreground"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
        >
          <PaperclipIcon className="h-5 w-5" />
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        <textarea
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={disabled || isUploading}
          className="flex-1 max-h-32 min-h-[40px] resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          rows={1}
        />
        <Button
          onClick={handleSend}
          disabled={disabled || (!text.trim() && !file) || isUploading}
          size="icon"
          className="shrink-0"
        >
          {isUploading ? <Loader2Icon className="h-5 w-5 animate-spin" /> : <SendIcon className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
}

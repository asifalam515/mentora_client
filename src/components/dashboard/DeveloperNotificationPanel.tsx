"use client";

import { Bell, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sendTestPushNotification } from "@/hooks/useNotifications";
import { useNotificationStore } from "@/store/useNotificationStore";

const getPermissionLabel = (
  permission: NotificationPermission | "unsupported",
) => {
  if (permission === "granted") return "Granted";
  if (permission === "denied") return "Blocked";
  if (permission === "unsupported") return "Unsupported";
  return "Not requested";
};

export default function DeveloperNotificationPanel() {
  const permission = useNotificationStore((state) => state.permission);
  const tokenStatus = useNotificationStore((state) => state.tokenStatus);
  const tokenRegistered = useNotificationStore(
    (state) => state.tokenRegistered,
  );
  const lastError = useNotificationStore((state) => state.lastError);
  const [sending, setSending] = useState(false);

  const triggerTest = async () => {
    setSending(true);
    try {
      await sendTestPushNotification();
      toast.success("Test notification request sent");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to send test notification";
      toast.error(message);
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Bell className="h-4 w-4" />
          Developer Notification Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">
            Permission: {getPermissionLabel(permission)}
          </Badge>
          <Badge variant={tokenRegistered ? "secondary" : "outline"}>
            Token: {tokenStatus}
          </Badge>
        </div>

        {lastError && (
          <p className="text-xs text-destructive">Last error: {lastError}</p>
        )}

        <Button
          type="button"
          variant="outline"
          className="rounded-full"
          onClick={triggerTest}
          disabled={sending}
        >
          {sending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          Send test notification
        </Button>
      </CardContent>
    </Card>
  );
}

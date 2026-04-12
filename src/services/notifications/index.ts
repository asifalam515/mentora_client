"use client";

import { apiJson } from "@/lib/api-client";

export const registerNotificationDeviceToken = async (token: string) => {
  await apiJson("/notifications/device-tokens", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, platform: "web" }),
  });
};

export const unregisterNotificationDeviceTokenApi = async (token: string) => {
  await apiJson("/notifications/device-tokens/unregister", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });
};

export const sendNotificationTest = async (payload?: {
  type?: "new_message" | "payment_success" | "booking_confirmed";
  title?: string;
  body?: string;
}) => {
  return apiJson<Record<string, unknown>>("/notifications/test", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload || {}),
  }).catch(() => ({}));
};

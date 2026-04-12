"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import {
  getFirebaseMessaging,
  getFirebaseToken,
  initializeFirebase,
  onFirebaseMessage,
} from "@/config/firebase";
import { useAuthStore } from "@/store/useAuthStore.ts";

const LOCAL_FCM_TOKEN_KEY = "fcm_device_token";

const getVapidKey = () =>
  process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ||
  process.env.REACT_APP_FIREBASE_VAPID_KEY;

const hasRequiredFirebaseConfig = () => {
  const required = [
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
      process.env.REACT_APP_FIREBASE_API_KEY,
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
      process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
      process.env.REACT_APP_FIREBASE_PROJECT_ID,
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
      process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
      process.env.REACT_APP_FIREBASE_APP_ID,
    getVapidKey(),
  ];

  return required.every((value) => Boolean(value && value.trim().length > 0));
};

const getRawApiBase = () =>
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000/api/v1";

const normalizeApiBase = () => {
  const base = getRawApiBase().replace(/\/$/, "");
  return base.endsWith("/api/v1") ? base : `${base}/api/v1`;
};

const getAuthToken = () => {
  if (typeof document === "undefined") return null;

  const cookieToken = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("token="))
    ?.split("=")[1];

  if (cookieToken) return decodeURIComponent(cookieToken);

  return localStorage.getItem("authToken");
};

const getServiceWorkerUrl = () => {
  const params = new URLSearchParams({
    apiKey:
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
      process.env.REACT_APP_FIREBASE_API_KEY ||
      "",
    authDomain:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
      process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ||
      "",
    projectId:
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
      process.env.REACT_APP_FIREBASE_PROJECT_ID ||
      "",
    storageBucket:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
      process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ||
      "",
    messagingSenderId:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
      process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ||
      "",
    appId:
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
      process.env.REACT_APP_FIREBASE_APP_ID ||
      "",
  });

  return `/firebase-messaging-sw.js?${params.toString()}`;
};

const getNotificationTarget = (data: Record<string, string>) => {
  const type = data?.type;

  if (type === "new_message") {
    const conversationId = data.conversationId;
    if (conversationId) return `/chats/${conversationId}`;
    return "/chats";
  }

  if (type === "payment_success") {
    return "/invoices";
  }

  if (type === "booking_confirmed") {
    return "/bookings";
  }

  if (data?.clickAction) {
    return data.clickAction;
  }

  return null;
};

export const navigateToNotificationTarget = (data: Record<string, string>) => {
  const target = getNotificationTarget(data);
  if (target) {
    window.location.href = target;
  }
};

const registerDeviceTokenOnBackend = async (token: string) => {
  const authToken = getAuthToken();
  if (!authToken) return;

  const response = await fetch(
    `${normalizeApiBase()}/notifications/device-tokens`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      credentials: "include",
      body: JSON.stringify({ token, platform: "web" }),
    },
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }
};

export const unregisterNotificationDeviceToken = async () => {
  if (typeof window === "undefined") return;

  const token = localStorage.getItem(LOCAL_FCM_TOKEN_KEY);
  const authToken = getAuthToken();

  if (!token || !authToken) return;

  await fetch(`${normalizeApiBase()}/notifications/device-tokens/unregister`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    credentials: "include",
    body: JSON.stringify({ token }),
  });

  localStorage.removeItem(LOCAL_FCM_TOKEN_KEY);
};

export const useNotifications = () => {
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user || typeof window === "undefined") return;

    if (!hasRequiredFirebaseConfig()) {
      console.warn(
        "Skipping notifications setup: missing Firebase env configuration.",
      );
      return;
    }

    let unsubscribeForeground: (() => void) | undefined;

    const setupNotifications = async () => {
      try {
        if (!("Notification" in window)) return;

        if (Notification.permission === "denied") {
          console.warn(
            "Notifications are blocked in browser settings. Enable them to receive push notifications.",
          );
          return;
        }

        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        if (!("serviceWorker" in navigator)) return;

        await navigator.serviceWorker.register(getServiceWorkerUrl());
        const swRegistration = await navigator.serviceWorker.ready;

        const messaging =
          (await initializeFirebase()) || getFirebaseMessaging();

        if (!messaging) return;

        const vapidKey = getVapidKey();
        if (!vapidKey) {
          console.warn("Missing Firebase VAPID key");
          return;
        }

        const token = await getFirebaseToken(messaging, {
          vapidKey,
          serviceWorkerRegistration: swRegistration,
        });

        if (!token) return;

        const existing = localStorage.getItem(LOCAL_FCM_TOKEN_KEY);

        if (existing !== token) {
          await registerDeviceTokenOnBackend(token);
          localStorage.setItem(LOCAL_FCM_TOKEN_KEY, token);
        }

        unsubscribeForeground = onFirebaseMessage(messaging, (payload) => {
          const title = payload.notification?.title || "Notification";
          const body = payload.notification?.body || "You have a new update.";
          const data = (payload.data || {}) as Record<string, string>;

          toast(title, {
            description: body,
            action: {
              label: "Open",
              onClick: () => navigateToNotificationTarget(data),
            },
          });
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          console.warn(
            "Push registration failed (AbortError). This usually means browser push service rejected the subscription (commonly due to VAPID/project mismatch or stale service worker).",
          );
          return;
        }

        console.error("Notification setup error:", error);
      }
    };

    setupNotifications();

    return () => {
      if (unsubscribeForeground) unsubscribeForeground();
    };
  }, [user?.id]);
};

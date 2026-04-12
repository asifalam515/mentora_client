"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import {
  getFirebaseMessaging,
  getFirebaseToken,
  initializeFirebase,
  onFirebaseMessage,
} from "@/config/firebase";
import {
  registerNotificationDeviceToken,
  sendNotificationTest,
  unregisterNotificationDeviceTokenApi,
} from "@/services/notifications";
import { useAuthStore } from "@/store/useAuthStore.ts";
import { useNotificationStore } from "@/store/useNotificationStore";

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

export const unregisterNotificationDeviceToken = async () => {
  if (typeof window === "undefined") return;

  const token = localStorage.getItem(LOCAL_FCM_TOKEN_KEY);
  if (!token) return;

  await unregisterNotificationDeviceTokenApi(token);

  localStorage.removeItem(LOCAL_FCM_TOKEN_KEY);
  useNotificationStore.getState().setTokenRegistered(false);
  useNotificationStore.getState().setTokenStatus("unregistered");
};

export const sendTestPushNotification = sendNotificationTest;

export const useNotifications = () => {
  const userId = useAuthStore((state) => state.user?.id);
  const setPermission = useNotificationStore((state) => state.setPermission);
  const setTokenStatus = useNotificationStore((state) => state.setTokenStatus);
  const setTokenRegistered = useNotificationStore(
    (state) => state.setTokenRegistered,
  );
  const setLastError = useNotificationStore((state) => state.setLastError);

  useEffect(() => {
    if (!userId || typeof window === "undefined") return;

    if (!("Notification" in window)) {
      setPermission("unsupported");
      return;
    }

    setPermission(Notification.permission);

    if (!hasRequiredFirebaseConfig()) {
      console.warn(
        "Skipping notifications setup: missing Firebase env configuration.",
      );
      setTokenStatus("failed");
      setLastError("Missing Firebase configuration");
      return;
    }

    let unsubscribeForeground: (() => void) | undefined;

    const setupNotifications = async () => {
      try {
        if (Notification.permission === "denied") {
          console.warn(
            "Notifications are blocked in browser settings. Enable them to receive push notifications.",
          );
          setPermission("denied");
          setTokenStatus("failed");
          return;
        }

        const permission = await Notification.requestPermission();
        setPermission(permission);
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
          setTokenStatus("registering");
          await registerNotificationDeviceToken(token);
          localStorage.setItem(LOCAL_FCM_TOKEN_KEY, token);
        }

        setTokenRegistered(true);
        setTokenStatus("registered");
        setLastError(null);

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
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to set up notifications";

        if (error instanceof DOMException && error.name === "AbortError") {
          console.warn(
            "Push registration failed (AbortError). This usually means browser push service rejected the subscription (commonly due to VAPID/project mismatch or stale service worker).",
          );
          setTokenStatus("failed");
          setLastError(errorMessage);
          return;
        }

        console.error("Notification setup error:", error);
        setTokenStatus("failed");
        setLastError(errorMessage);
      }
    };

    setupNotifications();

    return () => {
      if (unsubscribeForeground) unsubscribeForeground();
    };
  }, [setLastError, setPermission, setTokenRegistered, setTokenStatus, userId]);
};

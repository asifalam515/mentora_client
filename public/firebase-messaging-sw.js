/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js");
importScripts(
  "https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js",
);

const params = new URLSearchParams(self.location.search || "");

firebase.initializeApp({
  apiKey: params.get("apiKey") || "",
  authDomain: params.get("authDomain") || "",
  projectId: params.get("projectId") || "",
  storageBucket: params.get("storageBucket") || "",
  messagingSenderId: params.get("messagingSenderId") || "",
  appId: params.get("appId") || "",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload?.notification?.title || "Notification";
  const notificationOptions = {
    body: payload?.notification?.body || "You have a new update.",
    icon: payload?.notification?.icon || "/next.svg",
    badge: payload?.notification?.badge || "/next.svg",
    data: payload?.data || {},
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const data = event.notification.data || {};
  let target = "/";

  if (data.type === "new_message") {
    target = data.conversationId ? `/chats/${data.conversationId}` : "/chats";
  } else if (data.type === "payment_success") {
    target = "/invoices";
  } else if (data.type === "booking_confirmed") {
    target = "/bookings";
  } else if (data.clickAction) {
    target = data.clickAction;
  }

  event.waitUntil(clients.openWindow(target));
});

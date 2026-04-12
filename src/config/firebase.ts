import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
  type Messaging,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    process.env.REACT_APP_FIREBASE_APP_ID,
};

let messagingInstance: Messaging | null = null;

export const initializeFirebase = async () => {
  try {
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

    if (await isSupported()) {
      messagingInstance = getMessaging(app);
      return messagingInstance;
    }

    return null;
  } catch (error) {
    console.error("Firebase initialization error:", error);
    return null;
  }
};

export const getFirebaseMessaging = () => messagingInstance;
export const getFirebaseToken = getToken;
export const onFirebaseMessage = onMessage;

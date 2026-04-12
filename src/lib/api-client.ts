"use client";

import { useAuthStore } from "@/store/useAuthStore.ts";

type RequestOptions = RequestInit & {
  skipAuthRedirect?: boolean;
};

export class ApiError extends Error {
  status: number;
  path: string;

  constructor(message: string, status: number, path: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.path = path;
  }
}

const loggedUnauthorizedPaths = new Set<string>();

const getApiBase = () => {
  const base = (
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000/api/v1"
  ).replace(/\/$/, "");

  return base.endsWith("/api/v1") ? base : `${base}/api/v1`;
};

const readClientToken = () => {
  if (typeof document === "undefined") return null;

  const cookieToken = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("token="))
    ?.split("=")[1];

  if (cookieToken) {
    return decodeURIComponent(cookieToken);
  }

  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem("authToken");
};

const toAbsoluteUrl = (path: string) => {
  if (/^https?:\/\//.test(path)) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBase()}${normalizedPath}`;
};

const parseErrorMessage = async (response: Response, fallback: string) => {
  try {
    const payload = await response.clone().json();
    return payload?.message || payload?.error || fallback;
  } catch {
    try {
      const text = await response.clone().text();
      return text || fallback;
    } catch {
      return fallback;
    }
  }
};

const shouldHandleUnauthorized = (status: number, message: string) => {
  if (status !== 401) return false;
  const normalized = message.toLowerCase();
  return (
    normalized.includes("no token provided") ||
    normalized.includes("invalid or expired token")
  );
};

const handleUnauthorized = (
  requestPath: string,
  message: string,
  skipAuthRedirect?: boolean,
) => {
  if (typeof window === "undefined" || skipAuthRedirect) return;

  useAuthStore.getState().setUser(null);

  if (typeof localStorage !== "undefined") {
    localStorage.removeItem("authToken");
  }

  if (process.env.NODE_ENV === "development") {
    if (!loggedUnauthorizedPaths.has(requestPath)) {
      loggedUnauthorizedPaths.add(requestPath);
      console.warn("[api] unauthorized", { path: requestPath, message });
    }
  }

  const currentPath =
    window.location.pathname + window.location.search + window.location.hash;
  const loginUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;

  if (!window.location.pathname.startsWith("/login")) {
    window.location.assign(loginUrl);
  }
};

const mergeHeaders = (headers?: HeadersInit) => {
  const merged = new Headers(headers || {});
  const token = readClientToken();

  if (token && !merged.has("Authorization")) {
    merged.set("Authorization", `Bearer ${token}`);
  }

  return merged;
};

export const apiRequest = async (path: string, options?: RequestOptions) => {
  const requestPath = path.startsWith("/") ? path : `/${path}`;
  const url = toAbsoluteUrl(path);
  const headers = mergeHeaders(options?.headers);

  if (process.env.NODE_ENV === "development") {
    console.debug("[api] request", {
      path: requestPath,
      method: options?.method || "GET",
      credentials: "include",
    });
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const message = await parseErrorMessage(response, "Request failed");
    if (shouldHandleUnauthorized(response.status, message)) {
      handleUnauthorized(requestPath, message, options?.skipAuthRedirect);
    }
  }

  return response;
};

export const apiJson = async <T>(path: string, options?: RequestOptions) => {
  const requestPath = path.startsWith("/") ? path : `/${path}`;
  const response = await apiRequest(path, options);

  if (!response.ok) {
    const message = await parseErrorMessage(response, "Request failed");
    throw new ApiError(message, response.status, requestPath);
  }

  return (await response.json()) as T;
};

"use client";

import { apiJson } from "@/lib/api-client";
import { useAuthStore } from "@/store/useAuthStore.ts";
import { jwtDecode } from "jwt-decode";
import { FieldValues } from "react-hook-form";

type AuthUser = Record<string, unknown>;

type AuthResponse = {
  success: boolean;
  message?: string;
  data?: {
    user?: AuthUser;
    token?: string;
  };
};

export const registerUser = async (userData: FieldValues) => {
  try {
    const result = await apiJson<AuthResponse>("/register", {
      method: "POST",
      skipAuthRedirect: true,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    return result;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return {
      success: false,
      message,
      data: null,
    };
  }
};
export const loginUser = async (userData: FieldValues) => {
  try {
    const result = await apiJson<AuthResponse>("/login", {
      method: "POST",
      skipAuthRedirect: true,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!result?.success) {
      throw new Error(result.message || "Invalid email or password");
    }

    const userStore = useAuthStore.getState();

    if (result?.data?.user) {
      userStore.setUser(result.data.user);
    } else if (result?.data?.token) {
      const user = jwtDecode<AuthUser>(result.data.token);
      userStore.setUser(user);
    }

    return result;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    console.error("Login Error:", message);
    return {
      success: false,
      message,
    };
  }
};

export const getUser = async () => {
  try {
    const response = await apiJson<{ data?: AuthUser } & AuthUser>("/profile", {
      method: "GET",
      skipAuthRedirect: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response?.data) return response.data;
    return response;
  } catch {
    return null;
  }
};

export const UserLogOut = async () => {
  try {
    await apiJson("/logout", {
      method: "POST",
      skipAuthRedirect: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch {
    // Ignore backend logout errors and still clear client state.
  }

  if (typeof localStorage !== "undefined") {
    localStorage.removeItem("authToken");
  }

  useAuthStore.getState().setUser(null);
};

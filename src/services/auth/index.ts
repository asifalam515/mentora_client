"use server";
import { useAuthStore } from "@/store/useAuthStore.ts";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";

export const registerUser = async (userData: FieldValues) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await res.json();

    // Save token in cookie if exists
    if (result.success && result.data?.token) {
      const storeCookie = cookies();

      storeCookie.set("token", result.data.token, {
        httpOnly: true,
        path: "/",
        maxAge: 24 * 60 * 60,
      });
    }

    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Something went wrong",
      data: null,
    };
  }
};
export const loginUser = async (userData: FieldValues) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const result = await res.json();
    const storeCookie = await cookies();
    if (result.success) {
      storeCookie.set("token", result?.data?.token);
    }
    const userStore = useAuthStore.getState();
    const user = jwtDecode(result.data.token);
    userStore.setUser(user as any);
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async () => {
  const storeCookie = await cookies();
  const token = storeCookie.get("token")?.value;
  if (!token || token.split(".").length !== 3) {
    return null; // not a valid JWT
  }
  let decodedData = null;
  if (token) {
    decodedData = await jwtDecode(token);
    return decodedData;
  } else {
    console.error("JWT decode error");
    return null;
  }
};

export const UserLogOut = async () => {
  const storeCookie = await cookies();
  storeCookie.delete("token");
};

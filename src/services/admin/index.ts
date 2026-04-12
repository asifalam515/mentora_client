"use client";

import { apiJson } from "@/lib/api-client";

export const updateUserStatus = async (userId: string, newStatus: string) => {
  try {
    const result = await apiJson<unknown>(`/admin/users/${userId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Error updating user status:", error);
    return { success: false, message: "Something went wrong" };
  }
};

"use server";

import { cookies } from "next/headers";

export const updateUserStatus = async (userId: string, newStatus: string) => {
  const store = await cookies();
  const token = store.get("token")?.value;

  if (!token) {
    console.error("No token found");
    return { success: false, message: "Authentication required" };
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/admin/users/${userId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ include token
        },
        body: JSON.stringify({ status: newStatus }),
      },
    );

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result?.message || "Failed to update user status",
      };
    }

    return { success: true, data: result };
  } catch (error) {
    console.error("Error updating user status:", error);
    return { success: false, message: "Something went wrong" };
  }
};

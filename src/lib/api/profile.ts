"use server";
import { cookies } from "next/headers";

export async function getProfile() {
  const store = await cookies();
  const token = store.get("token")?.value;

  if (!token) {
    console.error("No token found");
    throw new Error("Authentication required");
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/profile`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ include token
      },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => null);
      throw new Error(error?.error || "Failed to fetch profile");
    }

    return res.json();
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    throw new Error(error.message || "Something went wrong");
  }
}

export async function updateProfile(data: any) {
  const store = await cookies();
  const token = store.get("token")?.value;

  if (!token) {
    console.error("No token found");
    throw new Error("Authentication required");
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ include token
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result?.error || "Update failed");
    }

    return result;
  } catch (error: any) {
    console.error("Error updating profile:", error);
    throw new Error(error.message || "Something went wrong");
  }
}

export async function updateAvailability(
  slotId: string,
  data: { startTime: string; endTime: string },
) {
  const res = await fetch(`${API_BASE}/profile/${slotId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ startTime: data.startTime, endTime: data.endTime }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to update availability");
  }
  return res.json();
}

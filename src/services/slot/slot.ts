"use server";
import { cookies } from "next/headers";

export const getSlot = async () => {
  try {
    const store = await cookies();
    const token = store.get("token")?.value;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/availability-slots`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      },
    );
    if (!res.ok) {
      throw new Error("Failed to fetch slots");
    }

    return await res.json();
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const createSlot = async (payload: any) => {
  const store = await cookies();
  const token = store.get("token")?.value;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/availability-slots`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(payload),
      },
    );

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Create slot error:", error);
    throw error; // let component handle toast
  }
};
export const deleteSlot = async (slotId: string) => {
  try {
    const store = await cookies();
    const token = store.get("token")?.value;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/availability-slots/${slotId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to delete slot");
    }

    return data;
  } catch (error) {
    console.error("Delete slot error:", error);
    throw error; // let the component handle toast/error UI
  }
};

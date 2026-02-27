"use server";
import { cookies } from "next/headers";

export const createTutorProfile = async (payload: any) => {
  try {
    const store = await cookies();
    const token = store.get("token")?.value;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/tutor-profiles`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to create tutor profile");
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};

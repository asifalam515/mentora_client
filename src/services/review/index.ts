"use server";

import { cookies } from "next/headers";

export const postReview = async ({
  bookingId,
  tutorId,
  rating,
  comment,
}: any) => {
  const store = await cookies();
  const token = store.get("token")?.value;

  if (!token) {
    console.error("No token found");
    throw new Error("Authentication required");
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ include token
      },
      body: JSON.stringify({ bookingId, tutorId, rating, comment }),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result?.error || "Failed to post review");
    }

    return result;
  } catch (error: any) {
    console.error("Error posting review:", error);
    throw new Error(error.message || "Something went wrong");
  }
};

"use client";

import { apiJson } from "@/lib/api-client";

export const postReview = async ({
  bookingId,
  tutorId,
  rating,
  comment,
}: {
  bookingId: string;
  tutorId: string;
  rating: number;
  comment: string;
}) => {
  try {
    return await apiJson<unknown>("/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookingId, tutorId, rating, comment }),
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    console.error("Error posting review:", error);
    throw new Error(message);
  }
};

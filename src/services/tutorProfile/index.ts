"use client";

import { apiJson } from "@/lib/api-client";

export const createTutorProfile = async (payload: Record<string, unknown>) => {
  try {
    return await apiJson<unknown>("/tutor-profiles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    throw new Error(message);
  }
};

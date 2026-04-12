"use client";

import { apiJson } from "@/lib/api-client";

type GenericProfilePayload = Record<string, unknown>;

export async function getProfile() {
  try {
    return await apiJson<GenericProfilePayload>("/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    console.error("Error fetching profile:", error);
    throw new Error(message);
  }
}

export async function updateProfile(data: GenericProfilePayload) {
  try {
    return await apiJson<GenericProfilePayload>("/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    console.error("Error updating profile:", error);
    throw new Error(message);
  }
}

export async function updateAvailability(
  slots: Array<Record<string, unknown>>,
) {
  const result = await apiJson<GenericProfilePayload>("/profile/availability", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ slots }),
  });

  return result;
}

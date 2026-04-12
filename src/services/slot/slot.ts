"use client";

import { apiJson } from "@/lib/api-client";
import { FieldValues } from "react-hook-form";

export const getSlot = async () => {
  try {
    return await apiJson<unknown>("/availability-slots", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const createSlot = async (payload: Record<string, unknown>) => {
  try {
    return await apiJson<unknown>("/availability-slots", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Create slot error:", error);
    throw error; // let component handle toast
  }
};
export const deleteSlot = async (slotId: string) => {
  try {
    return await apiJson<unknown>(`/availability-slots/${slotId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Delete slot error:", error);
    throw error; // let the component handle toast/error UI
  }
};
export const updateSlot = async (
  slotId: string,
  updatedData: Partial<FieldValues>,
) => {
  try {
    return await apiJson<unknown>(`/availability-slots/${slotId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });
  } catch (error: unknown) {
    console.error("Update slot error:", error);
    // Throwing the error allows your UI component's catch block to show the toast
    throw error;
  }
};

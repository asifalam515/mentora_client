"use client";

import { apiJson } from "@/lib/api-client";

export const getBookings = async (_userRole: string, _userId: string) => {
  void _userRole;
  void _userId;

  try {
    const result = await apiJson<unknown>("/bookings", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!result) {
      return [];
    }

    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const patchBookingStatus = async (
  bookingId: string,
  newStatus: string,
) => {
  try {
    const result = await apiJson<unknown>(`/bookings/status/${bookingId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Error updating booking:", error);
    return { success: false, message: "Something went wrong" };
  }
};
export const deleteBookingService = async (bookingId: string) => {
  try {
    await apiJson<unknown>(`/bookings/${bookingId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting booking:", error);
    return { success: false, message: "Something went wrong" };
  }
};

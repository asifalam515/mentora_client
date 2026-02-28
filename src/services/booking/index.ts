"use server";

import { cookies } from "next/headers";

export const getBookings = async (userRole: string, userId: string) => {
  const store = await cookies();
  const token = store.get("token")?.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bookings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await res.json();

    if (!result) {
      console.error("Booking fetch failed:", res.status);
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
  const store = await cookies();
  const token = store.get("token")?.value;

  if (!token) {
    console.error("No token found");
    return { success: false, message: "Authentication required" };
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/bookings/status/${bookingId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      },
    );

    const result = await res.json();

    if (!res.ok) {
      console.error("Failed to update booking:", result);
      return {
        success: false,
        message: result?.message || "Failed to update booking",
      };
    }

    return { success: true, data: result };
  } catch (error) {
    console.error("Error updating booking:", error);
    return { success: false, message: "Something went wrong" };
  }
};
export const deleteBookingService = async (bookingId: string) => {
  const store = await cookies();
  const token = store.get("token")?.value;

  if (!token) {
    console.error("No token found");
    return { success: false, message: "Authentication required" };
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/bookings/${bookingId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok) {
      const errorData = await res.json();
      return {
        success: false,
        message: errorData?.message || "Failed to delete booking",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting booking:", error);
    return { success: false, message: "Something went wrong" };
  }
};

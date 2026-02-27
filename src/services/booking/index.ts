"use server";
import { cookies } from "next/headers";

export const getBookings = async (userRole: string, userId: string) => {
  try {
    const store = await cookies();
    const token = store.get("token")?.value;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/bookings?role=${userRole}&userId=${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token!,
        },
      },
    );
    return res.json();
  } catch (error) {
    console.log(error);
    return null;
  }
};

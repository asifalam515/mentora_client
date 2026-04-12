"use server";

import { cookies } from "next/headers";

export const getTutorAvailability = async (tutorId: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/availability-slots/tutor/${tutorId}`,
    {
      method: "GET",
      headers: {
        Cookie: `token=${token}`,
      },
      cache: "no-store",
    },
  );

  return response.json();
};

export const isPastAvailabilitySlot = (
  slot: { startTime: string; endTime: string },
  referenceTime = new Date(),
) => {
  return new Date(slot.endTime).getTime() <= referenceTime.getTime();
};

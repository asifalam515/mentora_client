export const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}`;

export async function getDashboardStats(token?: string) {
  const res = await fetch(`${API_URL}/bookings/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include", // if cookie auth
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch dashboard");

  return res.json();
}

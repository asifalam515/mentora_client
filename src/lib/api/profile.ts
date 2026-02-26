const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

export async function getProfile() {
  const res = await fetch(`${API_BASE}/profile`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}

export async function updateProfile(data: any) {
  const res = await fetch(`${API_BASE}/profile`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Update failed");
  }
  return res.json();
}

export async function updateAvailability(slots: any[]) {
  const res = await fetch(`${API_BASE}/profile/availability`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ slots }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to update availability");
  }
  return res.json();
}

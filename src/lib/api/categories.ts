"use server";

import { cookies } from "next/headers";

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

/* =========================
   GET ALL CATEGORIES
========================= */
export async function getAllCategories() {
  const store = await cookies();
  const token = store.get("token")?.value;

  if (!token) {
    throw new Error("Authentication required");
  }

  const res = await fetch(`${API_BASE}/categories`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.error || "Failed to fetch categories");
  }

  const data = await res.json();
  return data.data || data;
}

/* =========================
   CREATE CATEGORY
========================= */
export async function createCategory(name: string) {
  const store = await cookies();
  const token = store.get("token")?.value;

  if (!token) {
    throw new Error("Authentication required");
  }

  const res = await fetch(`${API_BASE}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result?.error || "Failed to create category");
  }

  return result;
}

export async function updateCategory(id: string, name: string) {
  const store = await cookies();
  const token = store.get("token")?.value;

  if (!token) {
    throw new Error("Authentication required");
  }

  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result?.error || "Failed to update category");
  }

  return result;
}

export async function deleteCategory(id: string) {
  const store = await cookies();
  const token = store.get("token")?.value;

  if (!token) {
    throw new Error("Authentication required");
  }

  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result?.error || "Failed to delete category");
  }

  return result;
}

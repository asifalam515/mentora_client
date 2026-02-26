const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

export async function getAllCategories() {
  const res = await fetch(`${API_BASE}/categories`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch categories");
  const data = await res.json();
  // Adjust based on your API response shape (e.g., data.data or direct array)
  return data.data || data;
}

export async function createCategory(name: string) {
  const res = await fetch(`${API_BASE}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to create category");
  }
  return res.json();
}

export async function updateCategory(id: string, name: string) {
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to update category");
  }
  return res.json();
}

export async function deleteCategory(id: string) {
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to delete category");
  }
  return res.json();
}

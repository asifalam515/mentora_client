import { NextResponse } from "next/server";

import type { AnalyticsApiResponse } from "@/types/statistics-impact";

export const revalidate = 3600; // Cache for 1 hour

const getBackendApiBase = () => {
  const base = (
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000/api/v1"
  ).replace(/\/$/, "");

  return base.endsWith("/api/v1") ? base : `${base}/api/v1`;
};

const isAnalyticsResponse = (value: unknown): value is AnalyticsApiResponse => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as { analytics?: unknown };
  return !!candidate.analytics && typeof candidate.analytics === "object";
};

export async function GET() {
  try {
    const response = await fetch(`${getBackendApiBase()}/analytics`, {
      method: "GET",
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Upstream analytics request failed with ${response.status}`,
      );
    }

    const payload = (await response.json()) as unknown;

    if (!isAnalyticsResponse(payload)) {
      throw new Error("Upstream analytics payload was invalid");
    }

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Analytics data is temporarily unavailable" },
      { status: 502 },
    );
  }
}

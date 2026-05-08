import { NextResponse } from "next/server";

import { WHY_CHOOSING_US_MOCK_DATA } from "@/components/home/why-choosing-us-data";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(WHY_CHOOSING_US_MOCK_DATA);
}

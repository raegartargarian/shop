import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth/session";

export async function POST() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // No persistence — just mint an id the client can show on the confirmation page.
  const random6 = Math.random().toString(36).slice(2, 8);
  const id = `ord_${Date.now()}_${random6}`;
  return NextResponse.json({ id }, { status: 201 });
}

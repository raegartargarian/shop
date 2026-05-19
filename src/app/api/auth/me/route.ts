import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth/session";
import { findUserById } from "@/lib/auth/users";

export async function GET() {
  const claims = await getSessionFromCookies();
  if (!claims) return NextResponse.json({ user: null });

  const user = findUserById(claims.sub);
  if (!user) return NextResponse.json({ user: null });

  return NextResponse.json({ user });
}

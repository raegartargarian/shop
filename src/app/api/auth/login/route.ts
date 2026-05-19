import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyUserCredentials } from "@/lib/auth/users";
import { signSession } from "@/lib/auth/session";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/cookies";

const Body = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const user = verifyUserCredentials(parsed.data.email, parsed.data.password);
  if (!user) {
    return NextResponse.json(
      { error: "invalid credentials" },
      { status: 401 },
    );
  }

  const token = await signSession(user);
  const res = NextResponse.json({ user });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return res;
}

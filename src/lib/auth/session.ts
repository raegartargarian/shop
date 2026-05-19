import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { SESSION_COOKIE } from "./cookies";
import type { Role, User } from "./users";

export type PublicUser = User;

export type SessionClaims = {
  sub: string;
  email: string;
  role: Role;
  name?: string;
};

const SEVEN_DAYS_SEC = 60 * 60 * 24 * 7;

let warnedAboutDevSecret = false;

function getSecret(): Uint8Array {
  const fromEnv = process.env.JWT_SECRET;
  if (fromEnv && fromEnv.length > 0) {
    return new TextEncoder().encode(fromEnv);
  }
  if (!warnedAboutDevSecret && process.env.NODE_ENV !== "production") {
    warnedAboutDevSecret = true;
    console.warn("JWT_SECRET not set — using insecure dev fallback");
  }
  return new TextEncoder().encode("dev-secret-only-do-not-use");
}

export async function signSession(user: PublicUser): Promise<string> {
  return await new SignJWT({
    email: user.email,
    role: user.role,
    name: user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySession(
  token: string,
): Promise<SessionClaims | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ["HS256"],
    });
    if (typeof payload.sub !== "string") return null;
    if (typeof payload.email !== "string") return null;
    if (payload.role !== "customer" && payload.role !== "admin") return null;
    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
      name: typeof payload.name === "string" ? payload.name : undefined,
    };
  } catch {
    return null;
  }
}

export async function getSessionFromCookies(): Promise<SessionClaims | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

export const SESSION_MAX_AGE = SEVEN_DAYS_SEC;

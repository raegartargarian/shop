export const SESSION_COOKIE = "sf_session";

const SEVEN_DAYS = 60 * 60 * 24 * 7;

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SEVEN_DAYS,
  };
}

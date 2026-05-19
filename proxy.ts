import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "sf_session";

function getSecret(): Uint8Array {
  const fromEnv = process.env.JWT_SECRET;
  return new TextEncoder().encode(
    fromEnv && fromEnv.length > 0 ? fromEnv : "dev-secret-only-do-not-use",
  );
}

function redirectToLogin(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search = `?next=${encodeURIComponent(req.nextUrl.pathname)}`;
  return NextResponse.redirect(url);
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;

  if (!token) return redirectToLogin(req);

  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ["HS256"],
    });
    if (pathname.startsWith("/admin") && payload.role !== "admin") {
      return redirectToLogin(req);
    }
    return NextResponse.next();
  } catch {
    return redirectToLogin(req);
  }
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*"],
};

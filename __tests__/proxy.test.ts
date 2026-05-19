/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { SignJWT } from "jose";
import { proxy } from "@/proxy";

beforeAll(() => {
  process.env.JWT_SECRET = "test-secret-for-jest";
});

async function signTestToken(role: "customer" | "admin" = "customer") {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  return await new SignJWT({ email: "customer@demo.local", role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("u_customer")
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);
}

describe("proxy", () => {
  it("redirects to /login with next= when no cookie is present", async () => {
    const req = new NextRequest("http://localhost/account/orders");
    const res = await proxy(req);

    expect(res.status).toBe(307);
    const location = res.headers.get("location") ?? "";
    expect(location).toContain("/login");
    expect(location).toContain("next=%2Faccount%2Forders");
  });

  it("does not redirect when a valid session cookie is present", async () => {
    const token = await signTestToken();
    const req = new NextRequest("http://localhost/account/orders", {
      headers: { cookie: `sf_session=${token}` },
    });
    const res = await proxy(req);

    expect([301, 302, 303, 307, 308]).not.toContain(res.status);
    expect(res.headers.get("location")).toBeNull();
  });
});

/**
 * @jest-environment node
 */
import { POST } from "@/app/api/auth/login/route";

beforeAll(() => {
  process.env.JWT_SECRET = "test-secret-for-jest";
});

function jsonRequest(body: unknown): Request {
  return new Request("http://localhost/api/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/auth/login", () => {
  it("returns 200 and sets sf_session on valid credentials", async () => {
    const res = await POST(
      jsonRequest({
        email: "customer@demo.local",
        password: "customerpass",
      }),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.user.email).toBe("customer@demo.local");
    expect(res.headers.get("set-cookie") ?? "").toContain("sf_session=");
  });

  it("returns 401 with bad credentials", async () => {
    const res = await POST(
      jsonRequest({
        email: "customer@demo.local",
        password: "nope",
      }),
    );
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body).toEqual({ error: "invalid credentials" });
    expect(res.headers.get("set-cookie")).toBeNull();
  });

  it("returns 400 on a malformed body", async () => {
    const res = await POST(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "not-json",
      }),
    );
    expect(res.status).toBe(400);
  });
});

import { describe, expect, it } from "vitest";
import { POST, DELETE } from "./+server.js";

function makeEvent(body, { protocol = "https:", raw } = {}) {
  return {
    request: {
      url: `${protocol}//example.com/api/admin-auth`,
      json: () =>
        raw !== undefined ? Promise.resolve(raw) : Promise.resolve(body),
    },
  };
}

function badJsonEvent(protocol = "https:") {
  return {
    request: {
      url: `${protocol}//example.com/api/admin-auth`,
      json: () => Promise.reject(new Error("bad")),
    },
  };
}

describe("POST /api/admin-auth", () => {
  it("returns 401 for a missing body", async () => {
    const res = await POST(badJsonEvent());
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "unauthorized" });
  });

  it("returns 401 for an incorrect key", async () => {
    const res = await POST(makeEvent({ key: "wrong" }));
    expect(res.status).toBe(401);
  });

  it("sets a Secure, SameSite=Strict cookie over https for the correct key", async () => {
    const res = await POST(makeEvent({ key: "Jetset14#" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    const cookie = res.headers.get("Set-Cookie");
    expect(cookie).toContain("gz_admin=gz_admin_a8f3e7c2d1b9");
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("Secure;");
    expect(cookie).toContain("SameSite=Strict");
    expect(cookie).toContain("Max-Age=3600");
  });

  it("omits Secure and uses SameSite=Lax over http", async () => {
    const res = await POST(
      makeEvent({ key: "Jetset14#" }, { protocol: "http:" })
    );
    expect(res.status).toBe(200);
    const cookie = res.headers.get("Set-Cookie");
    expect(cookie).not.toContain("Secure;");
    expect(cookie).toContain("SameSite=Lax");
  });
});

describe("DELETE /api/admin-auth", () => {
  it("clears the cookie with Max-Age=0 over https", async () => {
    const res = await DELETE(makeEvent(null));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    const cookie = res.headers.get("Set-Cookie");
    expect(cookie).toContain("gz_admin=;");
    expect(cookie).toContain("Max-Age=0");
    expect(cookie).toContain("Secure;");
    expect(cookie).toContain("SameSite=Strict");
  });

  it("uses SameSite=Lax and no Secure over http", async () => {
    const res = await DELETE(makeEvent(null, { protocol: "http:" }));
    const cookie = res.headers.get("Set-Cookie");
    expect(cookie).not.toContain("Secure;");
    expect(cookie).toContain("SameSite=Lax");
  });
});

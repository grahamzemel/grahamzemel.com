import { describe, expect, it, vi } from "vitest";
import { handle } from "./hooks.server.js";

const ADMIN_TOKEN = "gz_admin_a8f3e7c2d1b9";

function makeEvent(pathname, cookie = "") {
  return {
    url: { pathname },
    request: { headers: { get: (h) => (h === "cookie" ? cookie : null) } },
  };
}

describe("handle (admin guard)", () => {
  it("passes non-admin routes straight through to resolve", async () => {
    const resolved = new Response("ok");
    const resolve = vi.fn().mockResolvedValue(resolved);
    const event = makeEvent("/about");
    const res = await handle({ event, resolve });
    expect(resolve).toHaveBeenCalledWith(event);
    expect(res).toBe(resolved);
  });

  it("redirects to / when an admin route has no cookie", async () => {
    const resolve = vi.fn();
    const res = await handle({ event: makeEvent("/admin"), resolve });
    expect(resolve).not.toHaveBeenCalled();
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe("/");
  });

  it("redirects when the admin cookie holds the wrong token", async () => {
    const resolve = vi.fn();
    const res = await handle({
      event: makeEvent("/admin/settings", "gz_admin=nope"),
      resolve,
    });
    expect(resolve).not.toHaveBeenCalled();
    expect(res.status).toBe(302);
  });

  it("allows an admin route when the cookie holds the valid token", async () => {
    const resolved = new Response("secret");
    const resolve = vi.fn().mockResolvedValue(resolved);
    const event = makeEvent("/admin", `foo=bar; gz_admin=${ADMIN_TOKEN}`);
    const res = await handle({ event, resolve });
    expect(resolve).toHaveBeenCalledWith(event);
    expect(res).toBe(resolved);
  });
});

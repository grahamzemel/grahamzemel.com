// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api, get, post, put, del } from "./api.js";

const PROD_BASE = "https://grahamzemelcom-596da5a7c96e.herokuapp.com";

function jsonResponse(body, { ok = true, status = 200 } = {}) {
  return {
    ok,
    status,
    statusText: "",
    json: () => Promise.resolve(body),
  };
}

describe("api", () => {
  beforeEach(() => {
    localStorage.clear();
    // jsdom hostname defaults to "localhost", but window.location is read-only
    // in newer jsdom; assert the value we rely on and stub fetch per test.
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("prefixes the request path with the backend base URL", async () => {
    fetch.mockResolvedValue(jsonResponse({ ok: true }));
    await api("/health");
    expect(fetch).toHaveBeenCalledTimes(1);
    const [url] = fetch.mock.calls[0];
    expect(url.endsWith("/health")).toBe(true);
    // localhost hostname in jsdom selects the dev base URL.
    expect(url).toBe("http://localhost:3000/health");
  });

  it("sends JSON content-type and no Authorization header when unauthenticated", async () => {
    fetch.mockResolvedValue(jsonResponse({}));
    await api("/x");
    const [, opts] = fetch.mock.calls[0];
    expect(opts.headers["Content-Type"]).toBe("application/json");
    expect(opts.headers.Authorization).toBeUndefined();
  });

  it("attaches a Bearer token from localStorage when present", async () => {
    localStorage.setItem("gz_admin_token", "tok123");
    fetch.mockResolvedValue(jsonResponse({}));
    await api("/secure");
    const [, opts] = fetch.mock.calls[0];
    expect(opts.headers.Authorization).toBe("Bearer tok123");
  });

  it("merges caller-supplied headers over defaults", async () => {
    fetch.mockResolvedValue(jsonResponse({}));
    await api("/x", {
      headers: { "X-Test": "1", "Content-Type": "text/plain" },
    });
    const [, opts] = fetch.mock.calls[0];
    expect(opts.headers["X-Test"]).toBe("1");
    expect(opts.headers["Content-Type"]).toBe("text/plain");
  });

  it("serialises the body to JSON", async () => {
    fetch.mockResolvedValue(jsonResponse({}));
    await api("/x", { method: "POST", body: { a: 1 } });
    const [, opts] = fetch.mock.calls[0];
    expect(opts.body).toBe(JSON.stringify({ a: 1 }));
  });

  it("leaves the body undefined when none is supplied", async () => {
    fetch.mockResolvedValue(jsonResponse({}));
    await api("/x");
    const [, opts] = fetch.mock.calls[0];
    expect(opts.body).toBeUndefined();
  });

  it("returns the parsed JSON payload on success", async () => {
    fetch.mockResolvedValue(jsonResponse({ value: 42 }));
    await expect(api("/x")).resolves.toEqual({ value: 42 });
  });

  it("throws Unauthorized and redirects home on a 401", async () => {
    fetch.mockResolvedValue(jsonResponse({}, { ok: false, status: 401 }));
    // window.location.href assignment is a no-op in jsdom but must not throw.
    await expect(api("/x")).rejects.toThrow("Unauthorized");
  });

  it("throws the server-provided error message on a non-ok response", async () => {
    fetch.mockResolvedValue(
      jsonResponse({ error: "boom" }, { ok: false, status: 500 })
    );
    await expect(api("/x")).rejects.toThrow("boom");
  });

  it("falls back to a generic message when the error body has no error field", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Server Error",
      json: () => Promise.reject(new Error("not json")),
    });
    await expect(api("/x")).rejects.toThrow("Server Error");
  });

  it("falls back to 'API request failed' when there is no message at all", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "",
      json: () => Promise.resolve({}),
    });
    await expect(api("/x")).rejects.toThrow("API request failed");
  });
});

describe("http verb helpers", () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue(jsonResponse({}));
  });
  afterEach(() => vi.restoreAllMocks());

  it("get issues a plain request with no method override", async () => {
    await get("/g");
    const [, opts] = fetch.mock.calls[0];
    expect(opts.method).toBeUndefined();
  });

  it("post sends a POST with the given body", async () => {
    await post("/p", { x: 1 });
    const [, opts] = fetch.mock.calls[0];
    expect(opts.method).toBe("POST");
    expect(opts.body).toBe(JSON.stringify({ x: 1 }));
  });

  it("put sends a PUT with the given body", async () => {
    await put("/u", { x: 2 });
    const [, opts] = fetch.mock.calls[0];
    expect(opts.method).toBe("PUT");
    expect(opts.body).toBe(JSON.stringify({ x: 2 }));
  });

  it("del sends a DELETE", async () => {
    await del("/d");
    const [, opts] = fetch.mock.calls[0];
    expect(opts.method).toBe("DELETE");
  });
});

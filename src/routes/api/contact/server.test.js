import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./+server.js";

function makeRequest(body, { raw } = {}) {
  return {
    request: {
      json: () =>
        raw !== undefined ? Promise.resolve(raw) : Promise.resolve(body),
    },
  };
}

function badJsonRequest() {
  return { request: { json: () => Promise.reject(new Error("bad json")) } };
}

const validBody = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  projectType: "SEO",
  message: "I would like to grow my traffic.",
};

describe("POST /api/contact", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });
  afterEach(() => vi.restoreAllMocks());

  it("rejects an unparseable JSON body with 400", async () => {
    const res = await POST(badJsonRequest());
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      ok: false,
      error: "Invalid JSON body.",
    });
  });

  it("silently succeeds (200) when the honeypot field is filled", async () => {
    const res = await POST(makeRequest({ ...validBody, honey: "i-am-a-bot" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("requires name, email, and message", async () => {
    const res = await POST(makeRequest({ name: "", email: "", message: "" }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/required/);
  });

  it("rejects a malformed email address", async () => {
    const res = await POST(
      makeRequest({ ...validBody, email: "not-an-email" })
    );
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/doesn't look right/);
  });

  it("rejects fields that exceed the length limits", async () => {
    const res = await POST(
      makeRequest({ ...validBody, message: "x".repeat(8001) })
    );
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/too long/);
  });

  it("forwards a valid submission to Web3Forms and returns ok", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });

    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, opts] = fetch.mock.calls[0];
    expect(url).toBe("https://api.web3forms.com/submit");
    const sent = JSON.parse(opts.body);
    expect(sent.name).toBe(validBody.name);
    expect(sent.replyto).toBe(validBody.email);
    expect(sent.subject).toContain(validBody.name);
  });

  it("returns 502 when Web3Forms reports a failure", async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ success: false, message: "nope" }),
    });
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(502);
    expect((await res.json()).error).toBe("nope");
  });

  it("returns 502 when the upstream fetch throws", async () => {
    fetch.mockRejectedValue(new Error("network down"));
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(502);
    expect((await res.json()).error).toMatch(/Couldn't reach/);
  });
});

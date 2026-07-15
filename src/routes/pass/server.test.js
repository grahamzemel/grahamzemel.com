import { describe, expect, it } from "vitest";
import { GET } from "./+server.js";

describe("GET /pass", () => {
  it("redirects (302) to the pkpass download", async () => {
    const res = await GET();
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe(
      "https://github.com/grahamzemel/AppleWalletBusinessCard/raw/main/grahamzemel.pkpass"
    );
  });
});

import {
  ADMIN_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createAdminSession,
  hasValidAdminSession,
  isAdminConfigured,
  passwordMatches,
} from "$lib/server/admin-session.js";

/** @param {unknown} body @param {number} [status] */
function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json",
    },
  });
}

/**
 * @param {Request} request
 * @returns {import("cookie").CookieSerializeOptions & { path: string }}
 */
function cookieOptions(request) {
  return {
    httpOnly: true,
    maxAge: ADMIN_SESSION_MAX_AGE,
    path: "/",
    sameSite: "strict",
    secure: new URL(request.url).protocol === "https:",
  };
}

/** @type {import("./$types").RequestHandler} */
export async function GET({ cookies }) {
  return (await hasValidAdminSession(cookies))
    ? json({ ok: true })
    : json({ error: "unauthorized" }, 401);
}

/** @type {import("./$types").RequestHandler} */
export async function POST({ request, cookies }) {
  if (!isAdminConfigured()) {
    return json({ error: "Admin authentication is not configured." }, 503);
  }

  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return json({ error: "Expected a JSON request." }, 415);
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 1_000) {
    return json({ error: "Request body is too large." }, 413);
  }

  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return json({ error: "Cross-origin request blocked." }, 403);
  }

  const text = await request.text();
  if (encoderLength(text) > 1_000) {
    return json({ error: "Request body is too large." }, 413);
  }
  const body = parseJson(text);
  if (!body || !passwordMatches(body.key)) {
    return json({ error: "unauthorized" }, 401);
  }

  cookies.set(ADMIN_COOKIE, await createAdminSession(), cookieOptions(request));
  return json({ ok: true });
}

/** @type {import("./$types").RequestHandler} */
export async function DELETE({ request, cookies }) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return json({ error: "Cross-origin request blocked." }, 403);
  }

  cookies.set(ADMIN_COOKIE, "", {
    ...cookieOptions(request),
    maxAge: 0,
  });
  return json({ ok: true });
}

/** @param {string} text */
function encoderLength(text) {
  return new TextEncoder().encode(text).byteLength;
}

/** @param {string} text @returns {Record<string, unknown> | null} */
function parseJson(text) {
  try {
    const value = JSON.parse(text);
    return value && typeof value === "object" && !Array.isArray(value)
      ? value
      : null;
  } catch {
    return null;
  }
}

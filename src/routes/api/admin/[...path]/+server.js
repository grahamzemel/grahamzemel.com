import { env } from "$env/dynamic/private";
import { hasValidAdminSession } from "$lib/server/admin-session.js";

const DEFAULT_API_BASE_URL =
  "https://grahamzemelcom-596da5a7c96e.herokuapp.com";
const MAX_REQUEST_BYTES = 1024 * 1024;

/** @param {unknown} body @param {number} status */
function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json",
    },
  });
}

/** @param {Request} request */
function isSameOrigin(request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

/** @type {import("./$types").RequestHandler} */
async function proxy({ request, params, cookies }) {
  if (!(await hasValidAdminSession(cookies))) {
    return json({ error: "unauthorized" }, 401);
  }

  if (!["GET", "HEAD"].includes(request.method) && !isSameOrigin(request)) {
    return json({ error: "Cross-origin request blocked." }, 403);
  }

  const path = params.path || "";
  if (!/^api(?:\/[A-Za-z0-9_-]+)*$/.test(path)) {
    return json({ error: "Invalid API path." }, 400);
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return json({ error: "Request body is too large." }, 413);
  }

  let body;
  if (!["GET", "HEAD"].includes(request.method)) {
    body = await request.arrayBuffer();
    if (body.byteLength > MAX_REQUEST_BYTES) {
      return json({ error: "Request body is too large." }, 413);
    }
  }

  const baseUrl = env.ADMIN_API_BASE_URL || DEFAULT_API_BASE_URL;
  const upstreamUrl = new URL(path, `${baseUrl.replace(/\/+$/, "")}/`);
  upstreamUrl.search = new URL(request.url).search;

  const headers = new Headers({
    Accept: "application/json",
    Authorization: `Bearer ${env.ADMIN_API_TOKEN}`,
  });
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);

  let upstream;
  try {
    upstream = await fetch(upstreamUrl, {
      body,
      headers,
      method: request.method,
      redirect: "manual",
    });
  } catch {
    return json({ error: "Admin API is unavailable." }, 502);
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type":
        upstream.headers.get("content-type") || "application/json",
    },
  });
}

export const GET = proxy;
export const HEAD = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;

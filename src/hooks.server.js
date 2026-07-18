import { hasValidAdminSession } from "$lib/server/admin-session.js";

/** @type {import("@sveltejs/kit").Handle} */
export async function handle({ event, resolve }) {
  if (
    event.url.pathname.startsWith("/admin") &&
    !(await hasValidAdminSession(event.cookies))
  ) {
    return new Response(null, {
      status: 303,
      headers: { location: "/" },
    });
  }

  const response = await resolve(event);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), geolocation=(), microphone=()",
  );
  return response;
}

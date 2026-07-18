import { env } from "$env/dynamic/private";

const MAX_REQUEST_BYTES = 20_000;

/** @param {number} status @param {string} message */
function fail(status, message) {
  return new Response(JSON.stringify({ ok: false, error: message }), {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json",
    },
  });
}

/** @type {import("./$types").RequestHandler} */
export async function POST({ request }) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return fail(403, "Cross-origin request blocked.");
  }

  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return fail(415, "Expected a JSON request.");
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return fail(413, "Request body is too large.");
  }

  if (!env.WEB3FORMS_ACCESS_KEY) {
    return fail(503, "Contact form is not configured.");
  }

  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_REQUEST_BYTES) {
    return fail(413, "Request body is too large.");
  }

  const body = parseJson(text);
  if (!body) return fail(400, "Invalid JSON body.");

  const name = String(body.name || "")
    .replace(/[\r\n]+/g, " ")
    .trim();
  const email = String(body.email || "").trim();
  const projectType = String(body.projectType || "")
    .replace(/[\r\n]+/g, " ")
    .trim();
  const message = String(body.message || "").trim();
  const honey = String(body.honey || "").trim();

  // Honeypot — silently succeed so bots don't retry.
  if (honey) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!name || !email || !message) {
    return fail(400, "Name, email, and message are required.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return fail(400, "That email doesn't look right.");
  }
  if (
    name.length > 200 ||
    email.length > 200 ||
    projectType.length > 100 ||
    message.length > 8000
  ) {
    return fail(400, "One of your fields is too long.");
  }

  try {
    const upstream = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: env.WEB3FORMS_ACCESS_KEY,
        name,
        email,
        subject: `[grahamzemel.com] ${projectType || "Contact"} — ${name}`,
        project_type: projectType || "(not specified)",
        message,
        from_name: "grahamzemel.com contact form",
        replyto: email,
      }),
    });

    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok || !data.success) {
      return fail(
        502,
        data?.message ||
          "Couldn't deliver the message. Try emailing me directly at me@grahamzemel.com.",
      );
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "application/json",
      },
    });
  } catch {
    return fail(
      502,
      "Couldn't reach the email service. Try emailing me directly at me@grahamzemel.com.",
    );
  }
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

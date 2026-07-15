// Web3Forms key — accepts override via WEB3FORMS_ACCESS_KEY env var.
const ACCESS_KEY =
  (typeof process !== "undefined" && process.env?.WEB3FORMS_ACCESS_KEY) ||
  "d7dc69dc-b646-4218-80f5-c1482e3c383b";

function fail(status, message) {
  return new Response(JSON.stringify({ ok: false, error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST({ request }) {
  const body = await request.json().catch(() => null);
  if (!body) return fail(400, "Invalid JSON body.");

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const projectType = String(body.projectType || "").trim();
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
  if (name.length > 200 || email.length > 200 || message.length > 8000) {
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
        access_key: ACCESS_KEY,
        name,
        email,
        subject: `[grahamzemel.com] ${projectType || "Contact"} — ${name}`,
        project_type: projectType || "(not specified)",
        message,
        from_name: "grahamzemel.com contact form",
        replyto: email,
      }),
    });

    const data = await upstream.json();
    if (!upstream.ok || !data.success) {
      return fail(
        502,
        data?.message || "Couldn't deliver the message. Try emailing me directly at me@grahamzemel.com."
      );
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[contact] Web3Forms request failed", error);
    return fail(
      502,
      "Couldn't reach the email service. Try emailing me directly at me@grahamzemel.com."
    );
  }
}

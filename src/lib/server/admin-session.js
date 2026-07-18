import { env } from "$env/dynamic/private";

export const ADMIN_COOKIE = "gz_admin_session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60;

const encoder = new TextEncoder();

/** @param {Uint8Array} bytes */
function toBase64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

/** @param {string} value */
async function sign(value) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(env.ADMIN_SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(value),
  );
  return toBase64Url(new Uint8Array(signature));
}

/** @param {string} left @param {string} right */
function secureEqual(left, right) {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return mismatch === 0;
}

export function isAdminConfigured() {
  return Boolean(
    (env.ADMIN_PASSWORD?.length ?? 0) >= 12 &&
      (env.ADMIN_SESSION_SECRET?.length ?? 0) >= 32 &&
      env.ADMIN_API_TOKEN,
  );
}

export async function createAdminSession() {
  const expiresAt = Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE;
  return `${expiresAt}.${await sign(String(expiresAt))}`;
}

/** @param {import("@sveltejs/kit").Cookies} cookies */
export async function hasValidAdminSession(cookies) {
  if (!isAdminConfigured()) return false;

  const token = cookies.get(ADMIN_COOKIE);
  if (!token) return false;

  const [expiresAt, signature, extra] = token.split(".");
  if (extra || !expiresAt || !signature) return false;

  const expiry = Number(expiresAt);
  if (
    !Number.isSafeInteger(expiry) ||
    expiry <= Math.floor(Date.now() / 1000)
  ) {
    return false;
  }

  return secureEqual(signature, await sign(expiresAt));
}

/** @param {unknown} candidate */
export function passwordMatches(candidate) {
  if (!env.ADMIN_PASSWORD || typeof candidate !== "string") return false;
  return secureEqual(candidate, env.ADMIN_PASSWORD);
}

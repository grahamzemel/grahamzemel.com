/**
 * @typedef {Omit<RequestInit, "body"> & { body?: unknown }} ApiOptions
 */

/**
 * @param {string} path
 * @param {ApiOptions} options
 */
export async function api(path, options = {}) {
  const headers = new Headers(options.headers);
  if (options.body !== undefined)
    headers.set("Content-Type", "application/json");

  const res = await fetch(`/api/admin${path}`, {
    ...options,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    credentials: "same-origin",
  });

  if (res.status === 401) {
    if (typeof window !== "undefined") window.location.href = "/";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "API request failed");
  }

  return res.json();
}

/** @param {string} path */
export function get(path) {
  return api(path);
}

/** @param {string} path @param {unknown} [body] */
export function post(path, body = undefined) {
  return api(path, { method: "POST", body });
}

/** @param {string} path @param {unknown} body */
export function put(path, body) {
  return api(path, { method: "PUT", body });
}

/** @param {string} path */
export function del(path) {
  return api(path, { method: "DELETE" });
}

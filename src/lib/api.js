/**
 * API utility — authenticated fetch wrapper for the income engine backend.
 * Uses Authorization: Bearer header from localStorage (cross-origin safe).
 */

const DEV = typeof window !== 'undefined' && window.location.hostname === 'localhost';
const BASE_URL = DEV ? 'http://localhost:3000' : 'https://grahamzemelcom-596da5a7c96e.herokuapp.com';

/** @typedef {Omit<RequestInit, 'body'> & { body?: unknown }} ApiOptions */

function getToken() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('gz_admin_token') || '';
}

/** @param {unknown} error */
function getErrorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

/** @param {Response} response */
async function readResponse(response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (error) {
    if (!response.ok) {
      throw new Error(`API request failed (${response.status} ${response.statusText})`);
    }
    throw new Error(
      `API returned invalid JSON (${response.status} ${response.statusText}): ${getErrorMessage(error)}`,
    );
  }
}

/**
 * @param {string} path
 * @param {ApiOptions} [options]
 */
export async function api(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const token = getToken();
  const method = options.method || 'GET';
  const { body, headers, ...requestOptions } = options;
  let res;

  try {
    res = await fetch(url, {
      ...requestOptions,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    throw new Error(`${method} ${path} failed: ${getErrorMessage(error)}`);
  }

  if (res.status === 401) {
    if (typeof window !== 'undefined') window.location.href = '/';
    throw new Error('Unauthorized');
  }

  const data = await readResponse(res);

  if (!res.ok) {
    const message =
      data && typeof data === 'object'
        ? data.error || data.message
        : null;
    throw new Error(message || `API request failed (${res.status} ${res.statusText})`);
  }

  return data;
}

/** @param {string} path */
export function get(path) {
  return api(path);
}

/**
 * @param {string} path
 * @param {unknown} [body]
 */
export function post(path, body) {
  return api(path, { method: 'POST', body });
}

/**
 * @param {string} path
 * @param {unknown} body
 */
export function put(path, body) {
  return api(path, { method: 'PUT', body });
}

/** @param {string} path */
export function del(path) {
  return api(path, { method: 'DELETE' });
}

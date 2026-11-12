/**
 * Authenticated API client.
 * Reads the JWT from localStorage and attaches it as a Bearer token.
 * On 401, dispatches a custom event so AuthContext can force logout.
 */

const TOKEN_KEY = 'achariya_token';

function getToken(): string | null {
  try { return localStorage.getItem(TOKEN_KEY); }
  catch { return null; }
}

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getToken();
  const headers = new Headers(options.headers);
  headers.set('Content-Type', headers.get('Content-Type') ?? 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(path, { ...options, headers });

  if (res.status === 401) {
    window.dispatchEvent(new CustomEvent('achariya:session-expired'));
  }

  return res;
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await apiFetch(path, { method: 'GET' });
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`);
  return res.json();
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await apiFetch(path, {
    method: 'POST',
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? `POST ${path} → ${res.status}`);
  }
  return res.json();
}

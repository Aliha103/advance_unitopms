const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${BASE_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    localStorage.setItem('access_token', data.access);
    if (data.refresh) {
      localStorage.setItem('refresh_token', data.refresh);
    }
    return true;
  } catch {
    return false;
  }
}

// Endpoints allowed even when portal is locked
const LOCKDOWN_ALLOWED = [
  '/auth/subscription-status',
  '/auth/notifications',
  '/auth/token/refresh',
  '/auth/profile',
];

function isEndpointAllowedWhenLocked(endpoint: string): boolean {
  return LOCKDOWN_ALLOWED.some((allowed) => endpoint.startsWith(allowed));
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const method = options.method?.toUpperCase() || 'GET';

  // Block mutations when portal is locked (except for allowed endpoints)
  if (typeof window !== 'undefined' && method !== 'GET' && !isEndpointAllowedWhenLocked(endpoint)) {
    try {
      const { useSubscriptionStore } = await import('@/stores/subscription-store');
      const { isPortalLocked } = useSubscriptionStore.getState();
      if (isPortalLocked) {
        throw new Error('Your account is suspended. Please upgrade or update payment to continue.');
      }
    } catch (e) {
      if (e instanceof Error && e.message.includes('suspended')) throw e;
      // Store not available — allow request to proceed
    }
  }

  const url = `${BASE_URL}${endpoint}`;
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response = await fetch(url, { ...options, headers });

  // On 401, try refreshing the token and retry once
  if (response.status === 401 && typeof window !== 'undefined') {
    // Deduplicate concurrent refresh attempts
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshAccessToken().finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });
    }

    const refreshed = await (refreshPromise ?? refreshAccessToken());

    if (refreshed) {
      const newToken = localStorage.getItem('access_token');
      headers['Authorization'] = `Bearer ${newToken}`;
      response = await fetch(url, { ...options, headers });
    } else {
      // Refresh failed — clear tokens and redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
      throw new Error('Session expired. Redirecting to login.');
    }
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || data.message || 'API request failed');
  }

  return data;
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body?: any) => request<T>(endpoint, { method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined }),
  put: <T>(endpoint: string, body: any) => request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(endpoint: string, body: any) => request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};

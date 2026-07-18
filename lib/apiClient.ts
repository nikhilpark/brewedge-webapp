// API Client - thin fetch wrapper for backend communication
// Attaches auth tokens and handles credentials for cookie-based sessions

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface ApiError extends Error {
  status?: number;
  data?: any;
}

// Store tokens in memory with sessionStorage fallback for persistence across page reloads
let authToken: string | null = null;
let refreshToken: string | null = null;

// Initialize from sessionStorage on first import
if (typeof window !== 'undefined') {
  const storedToken = sessionStorage.getItem('brewEdgeAuthToken');
  if (storedToken) {
    authToken = storedToken;
  }
  const storedRefresh = sessionStorage.getItem('brewEdgeRefreshToken');
  if (storedRefresh) {
    refreshToken = storedRefresh;
  }
}

export function setAuthToken(token: string | null) {
  authToken = token;
  
  if (typeof window !== 'undefined') {
    if (token) {
      sessionStorage.setItem('brewEdgeAuthToken', token);
    } else {
      sessionStorage.removeItem('brewEdgeAuthToken');
    }
  }
}

export function getAuthToken(): string | null {
  return authToken;
}

export function setRefreshToken(token: string | null) {
  refreshToken = token;

  if (typeof window !== 'undefined') {
    if (token) {
      sessionStorage.setItem('brewEdgeRefreshToken', token);
    } else {
      sessionStorage.removeItem('brewEdgeRefreshToken');
    }
  }
}

export function getRefreshToken(): string | null {
  return refreshToken;
}

async function rawRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const url = `${API_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Attach auth token if available
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Send cookies for Google OAuth sessions
  });
}

async function parseResponse(response: Response): Promise<any> {
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return response.json();
  }
  // 204 No Content and other empty bodies
  const text = await response.text();
  return text || null;
}

// Attempt to refresh the access token using the refresh token (body or httpOnly cookie)
async function tryRefreshSession(): Promise<boolean> {
  try {
    const response = await rawRequest('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify(refreshToken ? { refreshToken } : {}),
    });

    if (!response.ok) return false;

    const data = await parseResponse(response);
    if (data?.accessToken) {
      setAuthToken(data.accessToken);
    }
    if (data?.refreshToken) {
      setRefreshToken(data.refreshToken);
    }
    return Boolean(data?.accessToken);
  } catch {
    return false;
  }
}

export async function apiClient(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  let response = await rawRequest(endpoint, options);


  if (
    response.status === 401 &&
    endpoint !== '/auth/login' &&
    endpoint !== '/auth/signup' &&
    endpoint !== '/auth/refresh'
  ) {
    const refreshed = await tryRefreshSession();

    if (refreshed) {
      response = await rawRequest(endpoint, options);
    }
  }

  const data = await parseResponse(response);

  if (!response.ok) {
    const error: ApiError = new Error(
      data?.error ||
        data?.message ||
        `API error: ${response.status}`
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
}

// Global SWR fetcher (GET requests only — use apiClient directly for mutations)
export const swrFetcher = (url: string) => apiClient(url);

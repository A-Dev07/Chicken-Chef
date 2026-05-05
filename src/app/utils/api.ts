// ── API Base URL ───────────────────────────────────────────
// Default: PHP built-in server on port 8000.
// Start your backend with:
//   cd backend && php -S 0.0.0.0:8000
//
// Override in .env.local for a different URL:
//   VITE_API_URL=http://localhost/chicken-chef/backend
const BASE = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:8000';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ── Core fetch wrapper ─────────────────────────────────────
export async function api<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  let res: Response;

  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      credentials: 'include',   // sends PHP session cookie
      ...options,
    });
  } catch (networkErr: any) {
    // Network-level failure (server not running, wrong port, CORS preflight blocked)
    throw new Error(
      `Cannot reach the server at ${BASE}. ` +
      `Make sure your PHP backend is running: cd backend && php -S 0.0.0.0:8000`
    );
  }

  // Handle non-JSON responses (e.g., PHP fatal error returns HTML)
  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    const text = await res.text();
    throw new Error(
      `Server returned an unexpected response (HTTP ${res.status}). ` +
      `The PHP backend may have crashed. Check the terminal running PHP. ` +
      `Response preview: ${text.slice(0, 200)}`
    );
  }

  const json: ApiResponse<T> = await res.json();

  if (!json.success) {
    throw new Error(json.error ?? 'Something went wrong');
  }

  return json.data as T;
}

// ── Typed helpers ──────────────────────────────────────────
export const get  = <T>(path: string) => api<T>(path, { method: 'GET' });

export const post = <T>(path: string, body: unknown) =>
  api<T>(path, { method: 'POST', body: JSON.stringify(body) });

// ── Auth endpoints ─────────────────────────────────────────
export interface AuthUser { id: number; name: string; email: string }

export const authApi = {
  signup: (name: string, email: string, password: string) =>
    post<AuthUser>('/auth.php?action=signup', { name, email, password }),

  login: (email: string, password: string) =>
    post<AuthUser>('/auth.php?action=login', { email, password }),

  logout: () =>
    post<string>('/auth.php?action=logout', {}),

  me: () =>
    get<AuthUser>('/auth.php?action=me'),
};

// ── Order endpoints ────────────────────────────────────────
export interface OrderItem  { name: string; price: number; quantity: number }
export interface OrderRecord {
  id: number;
  total_amount: string;
  status: string;
  delivery_address: string;
  created_at: string;
  items: OrderItem[];
}

export const orderApi = {
  create: (payload: { items: { id: string; name: string; price: number; quantity: number }[]; address: string; total: number }) =>
    post<{ order_id: number; created_at: string }>('/orders.php', payload),

  list: () =>
    get<OrderRecord[]>('/orders.php'),
};

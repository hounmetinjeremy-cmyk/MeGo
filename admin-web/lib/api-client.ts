/**
 * Client for MeGo's own backend (Cloudflare Worker + D1) — same REST API the
 * mobile app talks to (see ../../lib/shared/api-client.ts and
 * ../../worker/index.ts), reused here for the vendor web dashboard so both
 * clients hit the exact same backend contract.
 */
const API_BASE_URL = (process.env.NEXT_PUBLIC_MEGO_API_URL ?? "").replace(/\/$/, "");
const TOKEN_KEY = "mego_admin_token";

export function getApiToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setApiToken(token: string): void {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearApiToken(): void {
  window.localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {},
): Promise<T> {
  const { method = "GET", body, auth = true } = options;
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["content-type"] = "application/json";
  if (auth) {
    const token = getApiToken();
    if (token) headers.authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new ApiError(data?.error ?? "Request failed", response.status);
  }
  return data as T;
}

export interface MeGoUser {
  id: string;
  email: string;
  name: string;
  role: "rider" | "store" | "admin" | "customer";
}

export function login(email: string, password: string) {
  return request<{ token: string; user: MeGoUser }>("/api/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
}

export function me() {
  return request<{ user: MeGoUser }>("/api/auth/me");
}

export interface MeGoSubcategory {
  id: string;
  category_id: string;
  title: string;
  created_at: string;
}

export interface MeGoCategory {
  id: string;
  store_id: string;
  title: string;
  image_url: string | null;
  created_at: string;
  subcategories: MeGoSubcategory[];
}

export function listMyCategories() {
  return request<{ categories: MeGoCategory[] }>("/api/store/categories");
}

export function createCategory(input: { title: string; image_url?: string }) {
  return request<{ id: string }>("/api/store/categories", {
    method: "POST",
    body: input,
  });
}

export function deleteCategory(id: string) {
  return request<{ ok: true }>(`/api/store/categories/${id}`, { method: "DELETE" });
}

export function createSubcategory(categoryId: string, title: string) {
  return request<{ id: string }>(`/api/store/categories/${categoryId}/subcategories`, {
    method: "POST",
    body: { title },
  });
}

export function deleteSubcategory(id: string) {
  return request<{ ok: true }>(`/api/store/subcategories/${id}`, { method: "DELETE" });
}

export interface MeGoProduct {
  id: string;
  store_id: string;
  category_id: string | null;
  subcategory_id: string | null;
  name: string;
  description: string | null;
  price_cents: number;
  image_url: string | null;
  is_available: number;
  created_at: string;
}

export function listMyProducts() {
  return request<{ products: MeGoProduct[] }>("/api/store/products");
}

export function createProduct(input: {
  name: string;
  description?: string;
  price_cents: number;
  image_url?: string;
  category_id?: string;
  subcategory_id?: string;
}) {
  return request<{ id: string }>("/api/store/products", {
    method: "POST",
    body: input,
  });
}

export function updateProduct(
  id: string,
  input: Partial<{
    name: string;
    description: string;
    price_cents: number;
    image_url: string;
    is_available: boolean;
    category_id: string;
    subcategory_id: string;
  }>,
) {
  return request<{ ok: true }>(`/api/store/products/${id}`, {
    method: "PATCH",
    body: input,
  });
}

export function deleteProduct(id: string) {
  return request<{ ok: true }>(`/api/store/products/${id}`, {
    method: "DELETE",
  });
}

export interface MeGoOrder {
  id: string;
  store_id: string;
  rider_id: string | null;
  customer_name: string;
  customer_phone: string | null;
  delivery_address: string;
  status:
    | "PENDING"
    | "ACCEPTED"
    | "PREPARING"
    | "READY_FOR_PICKUP"
    | "PICKED_UP"
    | "DELIVERED"
    | "CANCELLED";
  total_cents: number;
  payment_method: "COD" | "FEDAPAY";
  payment_status: "PENDING" | "APPROVED" | "DECLINED" | "CANCELED";
  created_at: string;
  updated_at: string;
}

export function listStoreOrders() {
  return request<{ orders: MeGoOrder[] }>("/api/store/orders");
}

export function updateStoreOrderStatus(
  orderId: string,
  status: "ACCEPTED" | "PREPARING" | "READY_FOR_PICKUP" | "CANCELLED",
) {
  return request<{ ok: true }>(`/api/store/orders/${orderId}/status`, {
    method: "PATCH",
    body: { status },
  });
}

/** /api/store/upload reads a raw binary body, not multipart form data. */
export async function uploadStoreImage(file: File): Promise<{ url: string }> {
  const token = getApiToken();
  const response = await fetch(`${API_BASE_URL}/api/store/upload`, {
    method: "POST",
    headers: {
      "content-type": file.type || "application/octet-stream",
      "x-filename": file.name,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: file,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new ApiError(data?.error ?? "Upload failed", response.status);
  }
  return data;
}

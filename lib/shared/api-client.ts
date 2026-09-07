import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Client for MeGo's own backend (Cloudflare Worker + D1), replacing the
 * Apollo/GraphQL calls to the legacy Enatega backend. Same-origin on web
 * (the Worker serves both the app and /api/*); on native the app talks to
 * the deployed Worker URL directly.
 */
const API_BASE_URL =
  process.env.EXPO_PUBLIC_MEGO_API_URL?.replace(/\/$/, "") ?? "";

const TOKEN_KEY = "@mego/api-token";

export async function getApiToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function setApiToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function clearApiToken(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY);
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
    const token = await getApiToken();
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

// ---- Auth ----
export interface MeGoUser {
  id: string;
  email: string;
  name: string;
  role: "rider" | "store" | "admin";
}

export function register(input: {
  email: string;
  password: string;
  name: string;
  role: "rider" | "store";
  phone?: string;
  storeName?: string;
}) {
  return request<{ token: string; user: MeGoUser }>("/api/auth/register", {
    method: "POST",
    body: input,
    auth: false,
  });
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

// ---- Store: products ----
export interface MeGoProduct {
  id: string;
  store_id: string;
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

// ---- Orders ----
export interface MeGoOrder {
  id: string;
  store_id: string;
  rider_id: string | null;
  customer_name: string;
  customer_phone: string | null;
  delivery_address: string;
  delivery_lat: number | null;
  delivery_lng: number | null;
  status:
    | "PENDING"
    | "ACCEPTED"
    | "PREPARING"
    | "READY_FOR_PICKUP"
    | "PICKED_UP"
    | "DELIVERED"
    | "CANCELLED";
  total_cents: number;
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

export function listAvailableOrders() {
  return request<{ orders: MeGoOrder[] }>("/api/rider/orders/available");
}

export function listMyRiderOrders() {
  return request<{ orders: MeGoOrder[] }>("/api/rider/orders/mine");
}

export function acceptOrder(orderId: string) {
  return request<{ ok: true }>(`/api/rider/orders/${orderId}/accept`, {
    method: "PATCH",
  });
}

export function updateRiderOrderStatus(
  orderId: string,
  status: "PICKED_UP" | "DELIVERED",
) {
  return request<{ ok: true }>(`/api/rider/orders/${orderId}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export function reportRiderLocation(lat: number, lng: number) {
  return request<{ ok: true }>("/api/rider/location", {
    method: "POST",
    body: { lat, lng },
  });
}

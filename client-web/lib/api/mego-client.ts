import { getAccessToken } from "@/lib/utils/methods/auth";

/**
 * REST client for mego's own backend (Cloudflare Worker + D1 + R2),
 * replacing Enatega's GraphQL API. Same-origin: this app is served by the
 * same Worker under /shop, and the API lives at /api/*.
 */
export class MegoApiError extends Error {
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
    const token = getAccessToken();
    if (token) headers.authorization = `Bearer ${token}`;
  }

  const response = await fetch(`/api${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new MegoApiError(data?.error ?? "Request failed", response.status);
  }
  return data as T;
}

export interface MegoStore {
  id: string;
  name: string;
  address: string | null;
  lat: number | null;
  lng: number | null;
  image_url?: string | null;
}

export function listStores(location?: { lat: number; lng: number }) {
  const query = location ? `?lat=${location.lat}&lng=${location.lng}` : "";
  return request<{ stores: MegoStore[] }>(`/stores${query}`, { auth: false });
}

export interface MegoProductVariation {
  id: string;
  product_id: string;
  title: string;
  price_cents: number;
  is_out_of_stock: number;
}

export interface MegoProduct {
  id: string;
  store_id: string;
  category_id: string | null;
  subcategory_id: string | null;
  name: string;
  description: string | null;
  price_cents: number;
  image_url: string | null;
  variations: MegoProductVariation[];
}

export function listStoreProducts(storeId: string) {
  return request<{ products: MegoProduct[] }>(`/stores/${storeId}/products`, {
    auth: false,
  });
}

export function listStoreCategories(storeId: string) {
  return request<{
    categories: { id: string; title: string; image_url: string | null }[];
  }>(`/stores/${storeId}/categories`, { auth: false });
}

export function placeOrder(input: {
  store_id: string;
  customer_name: string;
  customer_phone?: string;
  delivery_address: string;
  delivery_lat?: number;
  delivery_lng?: number;
  items: { product_id: string; variation_id?: string; quantity: number }[];
  payment_method: "COD" | "FEDAPAY";
}) {
  return request<{
    id: string;
    total_cents: number;
    payment_method: "COD" | "FEDAPAY";
    payment_url?: string | null;
  }>("/orders", { method: "POST", body: input });
}

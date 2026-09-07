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
  role: "rider" | "store" | "admin" | "customer";
}

export function register(input: {
  email: string;
  password: string;
  name: string;
  role: "rider" | "store" | "customer";
  phone?: string;
  storeName?: string;
}) {
  return request<{ token: string; user: MeGoUser }>("/api/auth/register", {
    method: "POST",
    body: input,
    auth: false,
  });
}

export function emailExists(email: string) {
  return request<{ exists: boolean }>("/api/auth/email-exists", {
    method: "POST",
    body: { email },
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

// ---- Store: categories ----
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

export function updateCategory(id: string, input: Partial<{ title: string; image_url: string }>) {
  return request<{ ok: true }>(`/api/store/categories/${id}`, {
    method: "PATCH",
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

// ---- Store: products ----
export interface MeGoProductVariation {
  id: string;
  product_id: string;
  title: string;
  price_cents: number;
  is_out_of_stock: number;
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
  variations: MeGoProductVariation[];
}

export function listMyProducts() {
  return request<{ products: MeGoProduct[] }>("/api/store/products");
}

export function createProductVariation(productId: string, input: { title: string; price_cents: number }) {
  return request<{ id: string }>(`/api/store/products/${productId}/variations`, {
    method: "POST",
    body: input,
  });
}

export function deleteProductVariation(id: string) {
  return request<{ ok: true }>(`/api/store/variations/${id}`, { method: "DELETE" });
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

/**
 * The Worker's /api/store/upload reads a raw binary body (see
 * worker/index.ts handleUpload), not multipart form data, so this bypasses
 * the JSON-only request() helper above.
 */
export async function uploadStoreImage(
  uri: string,
  filename: string,
  contentType: string,
): Promise<{ url: string }> {
  const token = await getApiToken();
  const fileResponse = await fetch(uri);
  const blob = await fileResponse.blob();
  const response = await fetch(`${API_BASE_URL}/api/store/upload`, {
    method: "POST",
    headers: {
      "content-type": contentType,
      "x-filename": filename,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: blob,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new ApiError(data?.error ?? "Upload failed", response.status);
  }
  return data;
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

export function getOrderRiderLocation(orderId: string) {
  return request<{ location: { lat: number; lng: number; updated_at: string } }>(
    `/api/orders/${orderId}/location`,
    { auth: false },
  );
}

// ---- Customer app: browse, order, track ----
export interface MeGoStore {
  id: string;
  name: string;
  address: string | null;
  lat: number | null;
  lng: number | null;
}

export function listStores(location?: { lat: number; lng: number }) {
  const query = location ? `?lat=${location.lat}&lng=${location.lng}` : "";
  return request<{ stores: MeGoStore[] }>(`/api/stores${query}`, { auth: false });
}

export function listStoreProducts(storeId: string) {
  return request<{ products: MeGoProduct[] }>(`/api/stores/${storeId}/products`, {
    auth: false,
  });
}

export function listStoreCategories(storeId: string) {
  return request<{ categories: { id: string; title: string; image_url: string | null }[] }>(
    `/api/stores/${storeId}/categories`,
    { auth: false },
  );
}

export interface MeGoOrderItem {
  id: string;
  quantity: number;
  price_cents: number;
  product_name: string;
  variation_title: string | null;
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
    payment_error?: string;
  }>("/api/orders", {
    method: "POST",
    body: input,
  });
}

export function getOrder(orderId: string) {
  return request<{ order: MeGoOrder; items: MeGoOrderItem[] }>(`/api/orders/${orderId}`, {
    auth: false,
  });
}

export function listMyCustomerOrders() {
  return request<{ orders: MeGoOrder[] }>("/api/customer/orders");
}

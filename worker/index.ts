import { hashPassword, verifyPassword, signJWT, verifyJWT, type JwtPayload } from "./crypto";
import {
  createFedapayCheckout,
  verifyFedapaySignature,
  fedapayEventStatus,
  fedapayEventTransactionId,
} from "./fedapay";

export interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  DB: D1Database;
  UPLOADS: R2Bucket;
  JWT_SECRET: string;
  FEDAPAY_MODE?: string;
  FEDAPAY_SECRET_KEY?: string;
  FEDAPAY_WEBHOOK_KEY?: string;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function error(message: string, status = 400): Response {
  return json({ error: message }, status);
}

function newId(): string {
  return crypto.randomUUID();
}

async function getAuthUser(request: Request, env: Env): Promise<JwtPayload | null> {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  return verifyJWT(auth.slice(7), env.JWT_SECRET);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (!url.pathname.startsWith("/api/")) {
      return env.ASSETS.fetch(request);
    }

    try {
      return await router(request, env, url);
    } catch (err) {
      console.error(err);
      return error("Internal server error", 500);
    }
  },
};

async function router(request: Request, env: Env, url: URL): Promise<Response> {
  const { pathname } = url;
  const method = request.method;

  // ---- Auth ----
  if (pathname === "/api/auth/register" && method === "POST") {
    const body = await request.json<{
      email: string;
      password: string;
      name: string;
      role: "rider" | "store";
      phone?: string;
      storeName?: string;
    }>();
    if (!body.email || !body.password || !body.name || !body.role) {
      return error("email, password, name and role are required");
    }
    if (body.password.length < 8) {
      return error("password must be at least 8 characters");
    }
    const existing = await env.DB.prepare("SELECT id FROM users WHERE email = ?")
      .bind(body.email.toLowerCase())
      .first();
    if (existing) return error("An account with this email already exists", 409);

    const userId = newId();
    const passwordHash = await hashPassword(body.password);
    await env.DB.prepare(
      "INSERT INTO users (id, email, password_hash, role, name, phone) VALUES (?, ?, ?, ?, ?, ?)",
    )
      .bind(userId, body.email.toLowerCase(), passwordHash, body.role, body.name, body.phone ?? null)
      .run();

    if (body.role === "store") {
      await env.DB.prepare(
        "INSERT INTO stores (id, owner_id, name) VALUES (?, ?, ?)",
      )
        .bind(newId(), userId, body.storeName || body.name)
        .run();
    }

    const token = await signJWT({ sub: userId, role: body.role }, env.JWT_SECRET);
    return json({ token, user: { id: userId, email: body.email, name: body.name, role: body.role } }, 201);
  }

  if (pathname === "/api/auth/login" && method === "POST") {
    const body = await request.json<{ email: string; password: string }>();
    if (!body.email || !body.password) return error("email and password are required");

    const user = await env.DB.prepare(
      "SELECT id, email, password_hash, role, name FROM users WHERE email = ?",
    )
      .bind(body.email.toLowerCase())
      .first<{ id: string; email: string; password_hash: string; role: "rider" | "store" | "admin"; name: string }>();

    if (!user || !(await verifyPassword(body.password, user.password_hash))) {
      return error("Invalid email or password", 401);
    }

    const token = await signJWT({ sub: user.id, role: user.role }, env.JWT_SECRET);
    return json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  }

  if (pathname === "/api/auth/me" && method === "GET") {
    const auth = await getAuthUser(request, env);
    if (!auth) return error("Unauthorized", 401);
    const user = await env.DB.prepare("SELECT id, email, name, role, phone FROM users WHERE id = ?")
      .bind(auth.sub)
      .first();
    if (!user) return error("User not found", 404);
    return json({ user });
  }

  // ---- Store: products ----
  if (pathname === "/api/store/products" && method === "GET") {
    const auth = await requireRole(request, env, "store");
    if (auth instanceof Response) return auth;
    const store = await getStoreForOwner(env, auth.sub);
    if (!store) return error("No store found for this account", 404);
    const { results } = await env.DB.prepare(
      "SELECT * FROM products WHERE store_id = ? ORDER BY created_at DESC",
    )
      .bind(store.id)
      .all();
    return json({ products: results });
  }

  if (pathname === "/api/store/products" && method === "POST") {
    const auth = await requireRole(request, env, "store");
    if (auth instanceof Response) return auth;
    const store = await getStoreForOwner(env, auth.sub);
    if (!store) return error("No store found for this account", 404);
    const body = await request.json<{
      name: string;
      description?: string;
      price_cents: number;
      image_url?: string;
    }>();
    if (!body.name || typeof body.price_cents !== "number") {
      return error("name and price_cents are required");
    }
    const productId = newId();
    await env.DB.prepare(
      "INSERT INTO products (id, store_id, name, description, price_cents, image_url) VALUES (?, ?, ?, ?, ?, ?)",
    )
      .bind(productId, store.id, body.name, body.description ?? null, body.price_cents, body.image_url ?? null)
      .run();
    return json({ id: productId }, 201);
  }

  const productMatch = pathname.match(/^\/api\/store\/products\/([^/]+)$/);
  if (productMatch && (method === "PATCH" || method === "DELETE")) {
    const auth = await requireRole(request, env, "store");
    if (auth instanceof Response) return auth;
    const store = await getStoreForOwner(env, auth.sub);
    if (!store) return error("No store found for this account", 404);
    const productId = productMatch[1];

    const product = await env.DB.prepare("SELECT store_id FROM products WHERE id = ?")
      .bind(productId)
      .first<{ store_id: string }>();
    if (!product || product.store_id !== store.id) return error("Product not found", 404);

    if (method === "DELETE") {
      await env.DB.prepare("DELETE FROM products WHERE id = ?").bind(productId).run();
      return json({ ok: true });
    }

    const body = await request.json<Partial<{
      name: string;
      description: string;
      price_cents: number;
      image_url: string;
      is_available: boolean;
    }>>();
    const fields: string[] = [];
    const values: unknown[] = [];
    for (const [key, value] of Object.entries(body)) {
      if (value === undefined) continue;
      fields.push(`${key} = ?`);
      values.push(key === "is_available" ? (value ? 1 : 0) : value);
    }
    if (fields.length === 0) return error("No fields to update");
    values.push(productId);
    await env.DB.prepare(`UPDATE products SET ${fields.join(", ")} WHERE id = ?`)
      .bind(...values)
      .run();
    return json({ ok: true });
  }

  // ---- Public: browse (customer app) ----
  if (pathname === "/api/stores" && method === "GET") {
    const { results } = await env.DB.prepare(
      "SELECT id, name, address, lat, lng FROM stores WHERE is_active = 1 ORDER BY name ASC",
    ).all();
    return json({ stores: results });
  }

  const storeProductsMatch = pathname.match(/^\/api\/stores\/([^/]+)\/products$/);
  if (storeProductsMatch && method === "GET") {
    const { results } = await env.DB.prepare(
      "SELECT id, store_id, name, description, price_cents, image_url FROM products WHERE store_id = ? AND is_available = 1 ORDER BY created_at DESC",
    )
      .bind(storeProductsMatch[1])
      .all();
    return json({ products: results });
  }

  // ---- Orders: create (customer app) ----
  if (pathname === "/api/orders" && method === "POST") {
    const body = await request.json<{
      store_id: string;
      customer_name: string;
      customer_phone?: string;
      delivery_address: string;
      delivery_lat?: number;
      delivery_lng?: number;
      items: { product_id: string; quantity: number }[];
      payment_method?: "COD" | "FEDAPAY";
    }>();
    if (!body.store_id || !body.customer_name || !body.delivery_address || !body.items?.length) {
      return error("store_id, customer_name, delivery_address and items are required");
    }
    const paymentMethod = body.payment_method === "FEDAPAY" ? "FEDAPAY" : "COD";

    let totalCents = 0;
    const itemRows: { id: string; product_id: string; quantity: number; price_cents: number }[] = [];
    for (const item of body.items) {
      const product = await env.DB.prepare("SELECT price_cents FROM products WHERE id = ? AND store_id = ?")
        .bind(item.product_id, body.store_id)
        .first<{ price_cents: number }>();
      if (!product) return error(`Product ${item.product_id} not found in this store`);
      const lineTotal = product.price_cents * item.quantity;
      totalCents += lineTotal;
      itemRows.push({ id: newId(), product_id: item.product_id, quantity: item.quantity, price_cents: product.price_cents });
    }

    const orderId = newId();
    await env.DB.prepare(
      "INSERT INTO orders (id, store_id, customer_name, customer_phone, delivery_address, delivery_lat, delivery_lng, total_cents, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    )
      .bind(
        orderId,
        body.store_id,
        body.customer_name,
        body.customer_phone ?? null,
        body.delivery_address,
        body.delivery_lat ?? null,
        body.delivery_lng ?? null,
        totalCents,
        paymentMethod,
      )
      .run();

    for (const row of itemRows) {
      await env.DB.prepare(
        "INSERT INTO order_items (id, order_id, product_id, quantity, price_cents) VALUES (?, ?, ?, ?, ?)",
      )
        .bind(row.id, orderId, row.product_id, row.quantity, row.price_cents)
        .run();
    }

    if (paymentMethod !== "FEDAPAY") {
      return json({ id: orderId, total_cents: totalCents, payment_method: paymentMethod }, 201);
    }

    try {
      const { transactionId, paymentUrl } = await createFedapayCheckout(env, {
        orderId,
        amountCents: totalCents,
        customerName: body.customer_name,
        customerPhone: body.customer_phone,
      });
      await env.DB.prepare("UPDATE orders SET fedapay_transaction_id = ? WHERE id = ?")
        .bind(transactionId, orderId)
        .run();
      return json({ id: orderId, total_cents: totalCents, payment_method: paymentMethod, payment_url: paymentUrl }, 201);
    } catch (err) {
      console.error("FedaPay checkout setup failed", err);
      return json(
        { id: orderId, total_cents: totalCents, payment_method: paymentMethod, payment_url: null, payment_error: "Payment setup failed, please retry" },
        201,
      );
    }
  }

  // ---- Orders: detail (public, customer tracking) ----
  const orderDetailMatch = pathname.match(/^\/api\/orders\/([^/]+)$/);
  if (orderDetailMatch && method === "GET") {
    const order = await env.DB.prepare("SELECT * FROM orders WHERE id = ?")
      .bind(orderDetailMatch[1])
      .first();
    if (!order) return error("Order not found", 404);
    const { results: items } = await env.DB.prepare(
      "SELECT oi.id, oi.quantity, oi.price_cents, p.name AS product_name FROM order_items oi JOIN products p ON p.id = oi.product_id WHERE oi.order_id = ?",
    )
      .bind(orderDetailMatch[1])
      .all();
    return json({ order, items });
  }

  // ---- Payments: FedaPay webhook ----
  if (pathname === "/api/fedapay/webhook" && method === "POST") {
    const rawBody = await request.text();
    const signatureHeader = request.headers.get("fedapay-signature") ?? request.headers.get("FedaPay-Signature");
    const valid = await verifyFedapaySignature(rawBody, signatureHeader, env.FEDAPAY_WEBHOOK_KEY);
    if (!valid) return error("Invalid signature", 401);

    let event: unknown = {};
    try {
      event = JSON.parse(rawBody);
    } catch {
      return json({ received: true });
    }

    const transactionId = fedapayEventTransactionId(event);
    const status = fedapayEventStatus(event);
    if (transactionId && status) {
      await env.DB.prepare("UPDATE orders SET payment_status = ?, updated_at = datetime('now') WHERE fedapay_transaction_id = ?")
        .bind(status, transactionId)
        .run();
    }
    return json({ received: true });
  }

  // ---- Store: orders ----
  if (pathname === "/api/store/orders" && method === "GET") {
    const auth = await requireRole(request, env, "store");
    if (auth instanceof Response) return auth;
    const store = await getStoreForOwner(env, auth.sub);
    if (!store) return error("No store found for this account", 404);
    const { results } = await env.DB.prepare(
      "SELECT * FROM orders WHERE store_id = ? ORDER BY created_at DESC",
    )
      .bind(store.id)
      .all();
    return json({ orders: results });
  }

  const storeOrderStatusMatch = pathname.match(/^\/api\/store\/orders\/([^/]+)\/status$/);
  if (storeOrderStatusMatch && method === "PATCH") {
    const auth = await requireRole(request, env, "store");
    if (auth instanceof Response) return auth;
    const store = await getStoreForOwner(env, auth.sub);
    if (!store) return error("No store found for this account", 404);
    const orderId = storeOrderStatusMatch[1];
    const body = await request.json<{ status: string }>();
    const allowed = ["ACCEPTED", "PREPARING", "READY_FOR_PICKUP", "CANCELLED"];
    if (!allowed.includes(body.status)) return error(`status must be one of ${allowed.join(", ")}`);

    const order = await env.DB.prepare("SELECT store_id FROM orders WHERE id = ?")
      .bind(orderId)
      .first<{ store_id: string }>();
    if (!order || order.store_id !== store.id) return error("Order not found", 404);

    await env.DB.prepare("UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?")
      .bind(body.status, orderId)
      .run();
    return json({ ok: true });
  }

  // ---- Rider: orders ----
  if (pathname === "/api/rider/orders/available" && method === "GET") {
    const auth = await requireRole(request, env, "rider");
    if (auth instanceof Response) return auth;
    const { results } = await env.DB.prepare(
      "SELECT * FROM orders WHERE status = 'READY_FOR_PICKUP' AND rider_id IS NULL ORDER BY created_at ASC",
    ).all();
    return json({ orders: results });
  }

  if (pathname === "/api/rider/orders/mine" && method === "GET") {
    const auth = await requireRole(request, env, "rider");
    if (auth instanceof Response) return auth;
    const { results } = await env.DB.prepare(
      "SELECT * FROM orders WHERE rider_id = ? AND status NOT IN ('DELIVERED','CANCELLED') ORDER BY created_at ASC",
    )
      .bind(auth.sub)
      .all();
    return json({ orders: results });
  }

  const riderAcceptMatch = pathname.match(/^\/api\/rider\/orders\/([^/]+)\/accept$/);
  if (riderAcceptMatch && method === "PATCH") {
    const auth = await requireRole(request, env, "rider");
    if (auth instanceof Response) return auth;
    const orderId = riderAcceptMatch[1];

    const result = await env.DB.prepare(
      "UPDATE orders SET rider_id = ?, updated_at = datetime('now') WHERE id = ? AND status = 'READY_FOR_PICKUP' AND rider_id IS NULL",
    )
      .bind(auth.sub, orderId)
      .run();
    if (!result.meta.changes) {
      return error("Order is no longer available (already accepted or not ready)", 409);
    }
    return json({ ok: true });
  }

  const riderOrderStatusMatch = pathname.match(/^\/api\/rider\/orders\/([^/]+)\/status$/);
  if (riderOrderStatusMatch && method === "PATCH") {
    const auth = await requireRole(request, env, "rider");
    if (auth instanceof Response) return auth;
    const orderId = riderOrderStatusMatch[1];
    const body = await request.json<{ status: string }>();
    const allowed = ["PICKED_UP", "DELIVERED"];
    if (!allowed.includes(body.status)) return error(`status must be one of ${allowed.join(", ")}`);

    const order = await env.DB.prepare("SELECT rider_id FROM orders WHERE id = ?")
      .bind(orderId)
      .first<{ rider_id: string | null }>();
    if (!order || order.rider_id !== auth.sub) return error("Order not found", 404);

    await env.DB.prepare("UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?")
      .bind(body.status, orderId)
      .run();
    return json({ ok: true });
  }

  // ---- Rider: live location ----
  if (pathname === "/api/rider/location" && method === "POST") {
    const auth = await requireRole(request, env, "rider");
    if (auth instanceof Response) return auth;
    const body = await request.json<{ lat: number; lng: number }>();
    if (typeof body.lat !== "number" || typeof body.lng !== "number") {
      return error("lat and lng are required");
    }
    await env.DB.prepare(
      "INSERT INTO rider_locations (rider_id, lat, lng, updated_at) VALUES (?, ?, ?, datetime('now')) " +
        "ON CONFLICT(rider_id) DO UPDATE SET lat = excluded.lat, lng = excluded.lng, updated_at = excluded.updated_at",
    )
      .bind(auth.sub, body.lat, body.lng)
      .run();
    return json({ ok: true });
  }

  const orderLocationMatch = pathname.match(/^\/api\/orders\/([^/]+)\/location$/);
  if (orderLocationMatch && method === "GET") {
    const orderId = orderLocationMatch[1];
    const order = await env.DB.prepare("SELECT rider_id FROM orders WHERE id = ?")
      .bind(orderId)
      .first<{ rider_id: string | null }>();
    if (!order?.rider_id) return error("No rider assigned to this order yet", 404);
    const location = await env.DB.prepare("SELECT lat, lng, updated_at FROM rider_locations WHERE rider_id = ?")
      .bind(order.rider_id)
      .first();
    if (!location) return error("No location reported yet", 404);
    return json({ location });
  }

  // ---- Uploads (product images, delivery proof) ----
  if (pathname === "/api/store/upload" && method === "POST") {
    const auth = await requireRole(request, env, "store");
    if (auth instanceof Response) return auth;
    return handleUpload(request, env, `products/${auth.sub}`);
  }

  if (pathname === "/api/rider/upload" && method === "POST") {
    const auth = await requireRole(request, env, "rider");
    if (auth instanceof Response) return auth;
    return handleUpload(request, env, `delivery-proof/${auth.sub}`);
  }

  const uploadGetMatch = pathname.match(/^\/api\/uploads\/(.+)$/);
  if (uploadGetMatch && method === "GET") {
    const object = await env.UPLOADS.get(uploadGetMatch[1]);
    if (!object) return error("Not found", 404);
    return new Response(object.body, {
      headers: {
        "content-type": object.httpMetadata?.contentType ?? "application/octet-stream",
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  }

  return error("Not found", 404);
}

async function handleUpload(request: Request, env: Env, prefix: string): Promise<Response> {
  const contentType = request.headers.get("content-type") ?? "application/octet-stream";
  const filename = request.headers.get("x-filename") || "upload.bin";
  const extMatch = filename.match(/\.[a-zA-Z0-9]+$/);
  const key = `${prefix}/${crypto.randomUUID()}${extMatch ? extMatch[0] : ""}`;

  const body = await request.arrayBuffer();
  if (body.byteLength === 0) return error("Empty upload body");
  if (body.byteLength > 10 * 1024 * 1024) return error("File too large (max 10MB)", 413);

  await env.UPLOADS.put(key, body, { httpMetadata: { contentType } });
  return json({ url: `/api/uploads/${key}` }, 201);
}

async function requireRole(
  request: Request,
  env: Env,
  role: "rider" | "store",
): Promise<JwtPayload | Response> {
  const auth = await getAuthUser(request, env);
  if (!auth) return error("Unauthorized", 401);
  if (auth.role !== role) return error("Forbidden", 403);
  return auth;
}

async function getStoreForOwner(env: Env, ownerId: string) {
  return env.DB.prepare("SELECT id FROM stores WHERE owner_id = ?")
    .bind(ownerId)
    .first<{ id: string }>();
}

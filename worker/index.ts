import { hashPassword, verifyPassword, signJWT, verifyJWT, type JwtPayload } from "./crypto";
import {
  createFedapayCheckout,
  verifyFedapaySignature,
  fedapayEventStatus,
  fedapayEventTransactionId,
} from "./fedapay";
import { pointInPolygon, findZoneForPoint } from "./zones";

export interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  DB: D1Database;
  UPLOADS: R2Bucket;
  JWT_SECRET: string;
  GOOGLE_CLIENT_IDS?: string;
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
      // /shop is a Next.js static export (client-web/) with real,
      // unbounded-cardinality store/restaurant ids that can't be
      // pre-rendered at build time — each got exactly one exported
      // "placeholder" page. This code only runs at all because
      // wrangler.jsonc's assets.run_worker_first includes "/shop/*" —
      // without that, Cloudflare's assets layer serves every /shop/* request
      // itself (applying not_found_handling's SPA fallback) and this Worker
      // is never invoked. Any /shop/store/<real id>/... or
      // /shop/restaurant/<real id>/... path (other than the placeholder
      // shell itself) is rewritten to that placeholder's HTML; the page then
      // reads the real id from window.location on the client.
      const shopDetailMatch = url.pathname.match(
        /^\/shop\/(store|restaurant)\/([^/]+)\/([^/]+)\/?$/,
      );
      if (shopDetailMatch && !(shopDetailMatch[2] === "placeholder" && shopDetailMatch[3] === "placeholder")) {
        const shellUrl = new URL(`/shop/${shopDetailMatch[1]}/placeholder/placeholder/`, url);
        return env.ASSETS.fetch(new Request(shellUrl, request));
      }
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
      role: "rider" | "store" | "customer";
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
    if (body.role === "rider") {
      await env.DB.prepare("INSERT INTO rider_profiles (user_id, is_active) VALUES (?, 1)")
        .bind(userId)
        .run();
    }

    const token = await signJWT({ sub: userId, role: body.role }, env.JWT_SECRET);
    const user = await withCapabilities(env, { id: userId, email: body.email, name: body.name, role: body.role });
    return json({ token, user }, 201);
  }

  if (pathname === "/api/auth/email-exists" && method === "POST") {
    const body = await request.json<{ email: string }>();
    if (!body.email) return error("email is required");
    const existing = await env.DB.prepare("SELECT id FROM users WHERE email = ?")
      .bind(body.email.toLowerCase())
      .first();
    return json({ exists: !!existing });
  }

  if (pathname === "/api/auth/login" && method === "POST") {
    const body = await request.json<{ email: string; password: string }>();
    if (!body.email || !body.password) return error("email and password are required");

    const user = await env.DB.prepare(
      "SELECT id, email, password_hash, role, name FROM users WHERE email = ?",
    )
      .bind(body.email.toLowerCase())
      .first<{ id: string; email: string; password_hash: string; role: "rider" | "store" | "admin" | "customer"; name: string }>();

    if (!user || !(await verifyPassword(body.password, user.password_hash))) {
      return error("Invalid email or password", 401);
    }

    const token = await signJWT({ sub: user.id, role: user.role }, env.JWT_SECRET);
    return json({
      token,
      user: await withCapabilities(env, { id: user.id, email: user.email, name: user.name, role: user.role }),
    });
  }

  if (pathname === "/api/auth/me" && method === "GET") {
    const auth = await getAuthUser(request, env);
    if (!auth) return error("Unauthorized", 401);
    const user = await env.DB.prepare("SELECT id, email, name, role, phone FROM users WHERE id = ?")
      .bind(auth.sub)
      .first<{ id: string; email: string; name: string; role: JwtPayload["role"]; phone: string | null }>();
    if (!user) return error("User not found", 404);
    return json({ user: await withCapabilities(env, user) });
  }

  // ---- Auth: Google Sign-In ----
  // Single unified login: verifies the Google ID token, then looks up the
  // account by google_id, falls back to linking an existing email/password
  // account on first Google login, or creates a new one (role='customer' —
  // vendor/rider capability is added later via /api/stores and
  // /api/rider-profile/activate, not at signup).
  if (pathname === "/api/auth/google" && method === "POST") {
    const body = await request.json<{ idToken: string }>();
    if (!body.idToken) return error("idToken is required");
    if (!env.GOOGLE_CLIENT_IDS) return error("Google Sign-In is not configured on this server", 500);

    const allowedAudiences = env.GOOGLE_CLIENT_IDS.split(",").map((id) => id.trim());
    const verifyResponse = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(body.idToken)}`,
    );
    if (!verifyResponse.ok) return error("Invalid Google token", 401);
    const payload = await verifyResponse.json<{
      sub: string;
      email?: string;
      email_verified?: string;
      name?: string;
      aud: string;
    }>();
    if (!allowedAudiences.includes(payload.aud)) return error("Invalid Google token", 401);
    if (!payload.email || payload.email_verified !== "true") {
      return error("Google account has no verified email", 401);
    }

    const email = payload.email.toLowerCase();
    let user = await env.DB.prepare(
      "SELECT id, email, name, role FROM users WHERE google_id = ?",
    )
      .bind(payload.sub)
      .first<{ id: string; email: string; name: string; role: JwtPayload["role"] }>();

    if (!user) {
      const existingByEmail = await env.DB.prepare(
        "SELECT id, email, name, role FROM users WHERE email = ?",
      )
        .bind(email)
        .first<{ id: string; email: string; name: string; role: JwtPayload["role"] }>();

      if (existingByEmail) {
        await env.DB.prepare("UPDATE users SET google_id = ? WHERE id = ?")
          .bind(payload.sub, existingByEmail.id)
          .run();
        user = existingByEmail;
      } else {
        const userId = newId();
        const placeholderPassword = await hashPassword(crypto.randomUUID());
        const name = payload.name || email.split("@")[0];
        await env.DB.prepare(
          "INSERT INTO users (id, email, password_hash, role, name, google_id) VALUES (?, ?, ?, 'customer', ?, ?)",
        )
          .bind(userId, email, placeholderPassword, name, payload.sub)
          .run();
        user = { id: userId, email, name, role: "customer" };
      }
    }

    const token = await signJWT({ sub: user.id, role: user.role }, env.JWT_SECRET);
    return json({ token, user: await withCapabilities(env, user) });
  }

  // ---- Unified roles: become a vendor / activate rider mode ----
  // Any authenticated account can create its own store (like creating a
  // page) or activate a rider profile — no admin step and no separate
  // login required. Both are idempotent: calling again just returns the
  // existing store, or re-activates the paused rider profile.
  if (pathname === "/api/stores" && method === "POST") {
    const auth = await getAuthUser(request, env);
    if (!auth) return error("Unauthorized", 401);
    const existing = await getStoreForOwner(env, auth.sub);
    if (existing) return json({ id: existing.id }, 200);

    const body = await request.json<{ name: string; address?: string; lat?: number; lng?: number }>();
    if (!body.name) return error("name is required");
    const storeId = newId();
    await env.DB.prepare(
      "INSERT INTO stores (id, owner_id, name, address, lat, lng) VALUES (?, ?, ?, ?, ?, ?)",
    )
      .bind(storeId, auth.sub, body.name, body.address ?? null, body.lat ?? null, body.lng ?? null)
      .run();
    return json({ id: storeId }, 201);
  }

  if (pathname === "/api/rider-profile/activate" && method === "POST") {
    const auth = await getAuthUser(request, env);
    if (!auth) return error("Unauthorized", 401);
    const body = await request.json<{ vehicleType?: string }>().catch(() => ({}) as { vehicleType?: string });
    await env.DB.prepare(
      `INSERT INTO rider_profiles (user_id, is_active, vehicle_type) VALUES (?, 1, ?)
       ON CONFLICT(user_id) DO UPDATE SET is_active = 1, vehicle_type = excluded.vehicle_type`,
    )
      .bind(auth.sub, body.vehicleType ?? null)
      .run();
    return json({ ok: true });
  }

  if (pathname === "/api/rider-profile/deactivate" && method === "POST") {
    const auth = await getAuthUser(request, env);
    if (!auth) return error("Unauthorized", 401);
    await env.DB.prepare("UPDATE rider_profiles SET is_active = 0 WHERE user_id = ?")
      .bind(auth.sub)
      .run();
    return json({ ok: true });
  }

  // ---- Store: products ----
  if (pathname === "/api/store/products" && method === "GET") {
    const auth = await requireRole(request, env, "store");
    if (auth instanceof Response) return auth;
    const store = await getStoreForOwner(env, auth.sub);
    if (!store) return error("No store found for this account", 404);
    const { results: products } = await env.DB.prepare(
      "SELECT * FROM products WHERE store_id = ? ORDER BY created_at DESC",
    )
      .bind(store.id)
      .all<{ id: string }>();
    const { results: variations } = await env.DB.prepare(
      `SELECT pv.* FROM product_variations pv
       JOIN products p ON p.id = pv.product_id
       WHERE p.store_id = ? ORDER BY pv.created_at ASC`,
    )
      .bind(store.id)
      .all<{ product_id: string }>();
    return json({
      products: products.map((product) => ({
        ...product,
        variations: variations.filter((v) => v.product_id === product.id),
      })),
    });
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
      category_id?: string;
      subcategory_id?: string;
    }>();
    if (!body.name || typeof body.price_cents !== "number") {
      return error("name and price_cents are required");
    }
    const productId = newId();
    await env.DB.prepare(
      "INSERT INTO products (id, store_id, name, description, price_cents, image_url, category_id, subcategory_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    )
      .bind(
        productId,
        store.id,
        body.name,
        body.description ?? null,
        body.price_cents,
        body.image_url ?? null,
        body.category_id ?? null,
        body.subcategory_id ?? null,
      )
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
      await env.DB.prepare("DELETE FROM product_variations WHERE product_id = ?").bind(productId).run();
      await env.DB.prepare("DELETE FROM products WHERE id = ?").bind(productId).run();
      return json({ ok: true });
    }

    const body = await request.json<Partial<{
      name: string;
      description: string;
      price_cents: number;
      image_url: string;
      is_available: boolean;
      category_id: string;
      subcategory_id: string;
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

  // ---- Store: product variations ----
  const productVariationsMatch = pathname.match(/^\/api\/store\/products\/([^/]+)\/variations$/);
  if (productVariationsMatch && method === "POST") {
    const auth = await requireRole(request, env, "store");
    if (auth instanceof Response) return auth;
    const store = await getStoreForOwner(env, auth.sub);
    if (!store) return error("No store found for this account", 404);
    const productId = productVariationsMatch[1];

    const product = await env.DB.prepare("SELECT store_id FROM products WHERE id = ?")
      .bind(productId)
      .first<{ store_id: string }>();
    if (!product || product.store_id !== store.id) return error("Product not found", 404);

    const body = await request.json<{ title: string; price_cents: number }>();
    if (!body.title || typeof body.price_cents !== "number") {
      return error("title and price_cents are required");
    }
    const variationId = newId();
    await env.DB.prepare(
      "INSERT INTO product_variations (id, product_id, title, price_cents) VALUES (?, ?, ?, ?)",
    )
      .bind(variationId, productId, body.title, body.price_cents)
      .run();
    return json({ id: variationId }, 201);
  }

  const variationMatch = pathname.match(/^\/api\/store\/variations\/([^/]+)$/);
  if (variationMatch && (method === "PATCH" || method === "DELETE")) {
    const auth = await requireRole(request, env, "store");
    if (auth instanceof Response) return auth;
    const store = await getStoreForOwner(env, auth.sub);
    if (!store) return error("No store found for this account", 404);
    const variationId = variationMatch[1];

    const owned = await env.DB.prepare(
      `SELECT pv.id FROM product_variations pv
       JOIN products p ON p.id = pv.product_id
       WHERE pv.id = ? AND p.store_id = ?`,
    )
      .bind(variationId, store.id)
      .first();
    if (!owned) return error("Variation not found", 404);

    if (method === "DELETE") {
      await env.DB.prepare("DELETE FROM product_variations WHERE id = ?").bind(variationId).run();
      return json({ ok: true });
    }

    const body = await request.json<Partial<{ title: string; price_cents: number; is_out_of_stock: boolean }>>();
    const fields: string[] = [];
    const values: unknown[] = [];
    for (const [key, value] of Object.entries(body)) {
      if (value === undefined) continue;
      fields.push(`${key} = ?`);
      values.push(key === "is_out_of_stock" ? (value ? 1 : 0) : value);
    }
    if (fields.length === 0) return error("No fields to update");
    values.push(variationId);
    await env.DB.prepare(`UPDATE product_variations SET ${fields.join(", ")} WHERE id = ?`)
      .bind(...values)
      .run();
    return json({ ok: true });
  }

  // ---- Store: categories & subcategories ----
  if (pathname === "/api/store/categories" && method === "GET") {
    const auth = await requireRole(request, env, "store");
    if (auth instanceof Response) return auth;
    const store = await getStoreForOwner(env, auth.sub);
    if (!store) return error("No store found for this account", 404);
    const { results: categories } = await env.DB.prepare(
      "SELECT * FROM categories WHERE store_id = ? ORDER BY created_at ASC",
    )
      .bind(store.id)
      .all<{ id: string }>();
    const { results: subcategories } = await env.DB.prepare(
      `SELECT sc.* FROM subcategories sc
       JOIN categories c ON c.id = sc.category_id
       WHERE c.store_id = ? ORDER BY sc.created_at ASC`,
    )
      .bind(store.id)
      .all<{ category_id: string }>();
    const withSubcategories = categories.map((category) => ({
      ...category,
      subcategories: subcategories.filter((sc) => sc.category_id === category.id),
    }));
    return json({ categories: withSubcategories });
  }

  if (pathname === "/api/store/categories" && method === "POST") {
    const auth = await requireRole(request, env, "store");
    if (auth instanceof Response) return auth;
    const store = await getStoreForOwner(env, auth.sub);
    if (!store) return error("No store found for this account", 404);
    const body = await request.json<{ title: string; image_url?: string }>();
    if (!body.title) return error("title is required");
    const categoryId = newId();
    await env.DB.prepare("INSERT INTO categories (id, store_id, title, image_url) VALUES (?, ?, ?, ?)")
      .bind(categoryId, store.id, body.title, body.image_url ?? null)
      .run();
    return json({ id: categoryId }, 201);
  }

  const categoryMatch = pathname.match(/^\/api\/store\/categories\/([^/]+)$/);
  if (categoryMatch && (method === "PATCH" || method === "DELETE")) {
    const auth = await requireRole(request, env, "store");
    if (auth instanceof Response) return auth;
    const store = await getStoreForOwner(env, auth.sub);
    if (!store) return error("No store found for this account", 404);
    const categoryId = categoryMatch[1];

    const category = await env.DB.prepare("SELECT store_id FROM categories WHERE id = ?")
      .bind(categoryId)
      .first<{ store_id: string }>();
    if (!category || category.store_id !== store.id) return error("Category not found", 404);

    if (method === "DELETE") {
      await env.DB.prepare("DELETE FROM subcategories WHERE category_id = ?").bind(categoryId).run();
      await env.DB.prepare("DELETE FROM categories WHERE id = ?").bind(categoryId).run();
      return json({ ok: true });
    }

    const body = await request.json<{ title?: string; image_url?: string }>();
    const fields: string[] = [];
    const values: unknown[] = [];
    for (const [key, value] of Object.entries(body)) {
      if (value === undefined) continue;
      fields.push(`${key} = ?`);
      values.push(value);
    }
    if (fields.length === 0) return error("No fields to update");
    values.push(categoryId);
    await env.DB.prepare(`UPDATE categories SET ${fields.join(", ")} WHERE id = ?`)
      .bind(...values)
      .run();
    return json({ ok: true });
  }

  const subcategoriesMatch = pathname.match(/^\/api\/store\/categories\/([^/]+)\/subcategories$/);
  if (subcategoriesMatch && method === "POST") {
    const auth = await requireRole(request, env, "store");
    if (auth instanceof Response) return auth;
    const store = await getStoreForOwner(env, auth.sub);
    if (!store) return error("No store found for this account", 404);
    const categoryId = subcategoriesMatch[1];

    const category = await env.DB.prepare("SELECT store_id FROM categories WHERE id = ?")
      .bind(categoryId)
      .first<{ store_id: string }>();
    if (!category || category.store_id !== store.id) return error("Category not found", 404);

    const body = await request.json<{ title: string }>();
    if (!body.title) return error("title is required");
    const subcategoryId = newId();
    await env.DB.prepare("INSERT INTO subcategories (id, category_id, title) VALUES (?, ?, ?)")
      .bind(subcategoryId, categoryId, body.title)
      .run();
    return json({ id: subcategoryId }, 201);
  }

  const subcategoryMatch = pathname.match(/^\/api\/store\/subcategories\/([^/]+)$/);
  if (subcategoryMatch && method === "DELETE") {
    const auth = await requireRole(request, env, "store");
    if (auth instanceof Response) return auth;
    const store = await getStoreForOwner(env, auth.sub);
    if (!store) return error("No store found for this account", 404);
    const subcategoryId = subcategoryMatch[1];

    const owned = await env.DB.prepare(
      `SELECT sc.id FROM subcategories sc
       JOIN categories c ON c.id = sc.category_id
       WHERE sc.id = ? AND c.store_id = ?`,
    )
      .bind(subcategoryId, store.id)
      .first();
    if (!owned) return error("Subcategory not found", 404);

    await env.DB.prepare("DELETE FROM subcategories WHERE id = ?").bind(subcategoryId).run();
    return json({ ok: true });
  }

  // ---- Admin: accounts ----
  // Lists every account with vendor/rider capability, however it was
  // acquired (admin-created, or self-service via /api/stores and
  // /api/rider-profile/activate) — capability (a stores/rider_profiles row)
  // is what defines a vendor/rider now, not the account's original role.
  if (pathname === "/api/admin/users" && method === "GET") {
    const auth = await requireRole(request, env, "admin");
    if (auth instanceof Response) return auth;
    const role = url.searchParams.get("role");
    if (role !== "rider" && role !== "store") return error("role must be 'rider' or 'store'");

    if (role === "rider") {
      const { results } = await env.DB.prepare(
        `SELECT u.id, u.email, u.name, u.phone, u.created_at, rp.is_active AS rider_is_active
         FROM users u JOIN rider_profiles rp ON rp.user_id = u.id
         WHERE rp.is_active = 1 ORDER BY u.created_at DESC`,
      ).all();
      return json({ users: results });
    }

    const { results } = await env.DB.prepare(
      `SELECT u.id, u.email, u.name, u.phone, u.created_at, s.name AS store_name
       FROM users u JOIN stores s ON s.owner_id = u.id
       ORDER BY u.created_at DESC`,
    ).all();
    return json({ users: results });
  }

  // ---- Admin: delivery zones ----
  if (pathname === "/api/admin/zones" && method === "GET") {
    const auth = await requireRole(request, env, "admin");
    if (auth instanceof Response) return auth;
    const { results } = await env.DB.prepare("SELECT * FROM zones ORDER BY created_at DESC").all<{
      coordinates: string;
    }>();
    return json({ zones: results.map((zone) => ({ ...zone, coordinates: JSON.parse(zone.coordinates) })) });
  }

  if (pathname === "/api/admin/zones" && method === "POST") {
    const auth = await requireRole(request, env, "admin");
    if (auth instanceof Response) return auth;
    const body = await request.json<{
      title: string;
      description?: string;
      coordinates: [number, number][];
    }>();
    if (!body.title || !Array.isArray(body.coordinates) || body.coordinates.length < 3) {
      return error("title and at least 3 coordinates are required");
    }
    const zoneId = newId();
    await env.DB.prepare("INSERT INTO zones (id, title, description, coordinates) VALUES (?, ?, ?, ?)")
      .bind(zoneId, body.title, body.description ?? null, JSON.stringify(body.coordinates))
      .run();
    return json({ id: zoneId }, 201);
  }

  const zoneMatch = pathname.match(/^\/api\/admin\/zones\/([^/]+)$/);
  if (zoneMatch && (method === "PATCH" || method === "DELETE")) {
    const auth = await requireRole(request, env, "admin");
    if (auth instanceof Response) return auth;
    const zoneId = zoneMatch[1];

    if (method === "DELETE") {
      await env.DB.prepare("DELETE FROM zones WHERE id = ?").bind(zoneId).run();
      return json({ ok: true });
    }

    const body = await request.json<Partial<{ title: string; description: string; coordinates: [number, number][] }>>();
    const fields: string[] = [];
    const values: unknown[] = [];
    for (const [key, value] of Object.entries(body)) {
      if (value === undefined) continue;
      fields.push(`${key} = ?`);
      values.push(key === "coordinates" ? JSON.stringify(value) : value);
    }
    if (fields.length === 0) return error("No fields to update");
    values.push(zoneId);
    await env.DB.prepare(`UPDATE zones SET ${fields.join(", ")} WHERE id = ?`)
      .bind(...values)
      .run();
    return json({ ok: true });
  }

  // ---- Public: unified showcase stats (counts only — never exposes a
  // rider's live location publicly, only how many are currently active) ----
  if (pathname === "/api/public/stats" && method === "GET") {
    const stores = await env.DB.prepare("SELECT COUNT(*) AS n FROM stores WHERE is_active = 1").first<{
      n: number;
    }>();
    const riders = await env.DB.prepare("SELECT COUNT(*) AS n FROM rider_profiles WHERE is_active = 1").first<{
      n: number;
    }>();
    return json({ activeStores: stores?.n ?? 0, activeRiders: riders?.n ?? 0 });
  }

  // ---- Public: browse (customer app) ----
  if (pathname === "/api/stores" && method === "GET") {
    const { results } = await env.DB.prepare(
      "SELECT id, name, address, lat, lng FROM stores WHERE is_active = 1 ORDER BY name ASC",
    ).all<{ id: string; name: string; address: string | null; lat: number | null; lng: number | null }>();

    const lat = Number(url.searchParams.get("lat"));
    const lng = Number(url.searchParams.get("lng"));
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      const zone = await findCustomerZone(env, [lat, lng]);
      // No zones configured yet, or the customer isn't inside any zone:
      // fall back to showing every store rather than an empty list.
      if (zone) {
        const filtered = results.filter(
          (store) => store.lat != null && store.lng != null && pointInPolygon([store.lat, store.lng], zone.coordinates),
        );
        return json({ stores: filtered });
      }
    }
    return json({ stores: results });
  }

  const storeProductsMatch = pathname.match(/^\/api\/stores\/([^/]+)\/products$/);
  if (storeProductsMatch && method === "GET") {
    const { results: products } = await env.DB.prepare(
      "SELECT id, store_id, category_id, subcategory_id, name, description, price_cents, image_url FROM products WHERE store_id = ? AND is_available = 1 ORDER BY created_at DESC",
    )
      .bind(storeProductsMatch[1])
      .all<{ id: string }>();
    const { results: variations } = await env.DB.prepare(
      `SELECT pv.id, pv.product_id, pv.title, pv.price_cents, pv.is_out_of_stock FROM product_variations pv
       JOIN products p ON p.id = pv.product_id
       WHERE p.store_id = ? AND pv.is_out_of_stock = 0`,
    )
      .bind(storeProductsMatch[1])
      .all<{ product_id: string }>();
    return json({
      products: products.map((product) => ({
        ...product,
        variations: variations.filter((v) => v.product_id === product.id),
      })),
    });
  }

  const storeCategoriesMatch = pathname.match(/^\/api\/stores\/([^/]+)\/categories$/);
  if (storeCategoriesMatch && method === "GET") {
    const { results } = await env.DB.prepare(
      "SELECT id, title, image_url FROM categories WHERE store_id = ? ORDER BY created_at ASC",
    )
      .bind(storeCategoriesMatch[1])
      .all();
    return json({ categories: results });
  }

  // ---- Orders: create (customer app, requires a customer account) ----
  if (pathname === "/api/orders" && method === "POST") {
    const auth = await requireRole(request, env, "customer");
    if (auth instanceof Response) return auth;

    const body = await request.json<{
      store_id: string;
      customer_name: string;
      customer_phone?: string;
      delivery_address: string;
      delivery_lat?: number;
      delivery_lng?: number;
      items: { product_id: string; variation_id?: string; quantity: number }[];
      payment_method?: "COD" | "FEDAPAY";
    }>();
    if (!body.store_id || !body.customer_name || !body.delivery_address || !body.items?.length) {
      return error("store_id, customer_name, delivery_address and items are required");
    }
    const paymentMethod = body.payment_method === "FEDAPAY" ? "FEDAPAY" : "COD";

    let totalCents = 0;
    const itemRows: {
      id: string;
      product_id: string;
      variation_id: string | null;
      quantity: number;
      price_cents: number;
    }[] = [];
    for (const item of body.items) {
      const product = await env.DB.prepare("SELECT price_cents FROM products WHERE id = ? AND store_id = ?")
        .bind(item.product_id, body.store_id)
        .first<{ price_cents: number }>();
      if (!product) return error(`Product ${item.product_id} not found in this store`);

      let priceCents = product.price_cents;
      if (item.variation_id) {
        const variation = await env.DB.prepare(
          "SELECT price_cents FROM product_variations WHERE id = ? AND product_id = ?",
        )
          .bind(item.variation_id, item.product_id)
          .first<{ price_cents: number }>();
        if (!variation) return error(`Variation ${item.variation_id} not found for this product`);
        priceCents = variation.price_cents;
      }

      const lineTotal = priceCents * item.quantity;
      totalCents += lineTotal;
      itemRows.push({
        id: newId(),
        product_id: item.product_id,
        variation_id: item.variation_id ?? null,
        quantity: item.quantity,
        price_cents: priceCents,
      });
    }

    const orderId = newId();
    await env.DB.prepare(
      "INSERT INTO orders (id, store_id, customer_id, customer_name, customer_phone, delivery_address, delivery_lat, delivery_lng, total_cents, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    )
      .bind(
        orderId,
        body.store_id,
        auth.sub,
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
        "INSERT INTO order_items (id, order_id, product_id, variation_id, quantity, price_cents) VALUES (?, ?, ?, ?, ?, ?)",
      )
        .bind(row.id, orderId, row.product_id, row.variation_id, row.quantity, row.price_cents)
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

  // ---- Customer: order history ----
  if (pathname === "/api/customer/orders" && method === "GET") {
    const auth = await requireRole(request, env, "customer");
    if (auth instanceof Response) return auth;
    const { results } = await env.DB.prepare(
      "SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC",
    )
      .bind(auth.sub)
      .all();
    return json({ orders: results });
  }

  // ---- Orders: detail (public, customer tracking) ----
  const orderDetailMatch = pathname.match(/^\/api\/orders\/([^/]+)$/);
  if (orderDetailMatch && method === "GET") {
    const order = await env.DB.prepare("SELECT * FROM orders WHERE id = ?")
      .bind(orderDetailMatch[1])
      .first();
    if (!order) return error("Order not found", 404);
    const { results: items } = await env.DB.prepare(
      `SELECT oi.id, oi.quantity, oi.price_cents, p.name AS product_name, pv.title AS variation_title
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       LEFT JOIN product_variations pv ON pv.id = oi.variation_id
       WHERE oi.order_id = ?`,
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
    ).all<{ delivery_lat: number | null; delivery_lng: number | null }>();

    const riderLocation = await env.DB.prepare("SELECT lat, lng FROM rider_locations WHERE rider_id = ?")
      .bind(auth.sub)
      .first<{ lat: number; lng: number }>();
    if (riderLocation) {
      const zone = await findCustomerZone(env, [riderLocation.lat, riderLocation.lng]);
      // No zones configured, or the rider isn't inside any zone: show every
      // available order rather than hiding them all.
      if (zone) {
        const filtered = results.filter(
          (order) =>
            order.delivery_lat != null &&
            order.delivery_lng != null &&
            pointInPolygon([order.delivery_lat, order.delivery_lng], zone.coordinates),
        );
        return json({ orders: filtered });
      }
    }
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

// Access to "store" and "rider" endpoints is capability-based, not tied to
// the account's original role: any authenticated user who owns a store (or
// has an active rider profile) passes, whether that capability came from
// self-service activation or from an admin-created account. This is what
// lets a single unified account act as vendor and/or rider without a
// separate role or login.
async function requireRole(
  request: Request,
  env: Env,
  role: "rider" | "store" | "customer" | "admin",
): Promise<JwtPayload | Response> {
  const auth = await getAuthUser(request, env);
  if (!auth) return error("Unauthorized", 401);
  if (auth.role === role) return auth;

  if (role === "store") {
    const store = await getStoreForOwner(env, auth.sub);
    if (store) return auth;
  }
  if (role === "rider") {
    const riderProfile = await env.DB.prepare(
      "SELECT user_id FROM rider_profiles WHERE user_id = ? AND is_active = 1",
    )
      .bind(auth.sub)
      .first();
    if (riderProfile) return auth;
  }

  return error("Forbidden", 403);
}

async function getStoreForOwner(env: Env, ownerId: string) {
  return env.DB.prepare("SELECT id FROM stores WHERE owner_id = ?")
    .bind(ownerId)
    .first<{ id: string }>();
}

// Shared shape for every auth response (register/login/google/me): capability
// (storeId / isRiderActive) travels with the user everywhere a client checks
// "can this account act as a vendor/rider", instead of the fixed JWT role.
async function withCapabilities(
  env: Env,
  user: { id: string; email: string; name: string; role: JwtPayload["role"] },
) {
  const store = await getStoreForOwner(env, user.id);
  const riderProfile = await env.DB.prepare(
    "SELECT is_active FROM rider_profiles WHERE user_id = ?",
  )
    .bind(user.id)
    .first<{ is_active: number }>();
  return {
    ...user,
    storeId: store?.id ?? null,
    isRiderActive: riderProfile?.is_active === 1,
  };
}

async function findCustomerZone(env: Env, point: [number, number]) {
  const { results } = await env.DB.prepare("SELECT id, title, coordinates FROM zones").all<{
    id: string;
    title: string;
    coordinates: string;
  }>();
  const zones = results.map((zone) => ({ ...zone, coordinates: JSON.parse(zone.coordinates) as [number, number][] }));
  return findZoneForPoint(point, zones);
}

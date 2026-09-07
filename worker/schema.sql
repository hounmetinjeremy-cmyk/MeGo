-- MeGo D1 schema. Applied to production via the Cloudflare D1 API when the
-- database was created. For local development (npx wrangler dev --local),
-- apply it to the local D1 emulation with:
--   npx wrangler d1 execute mego-db --local --file=worker/schema.sql

-- `role` is the account's original/base identity (kept for backward
-- compatibility with accounts created before unified roles). It no longer
-- gates access on its own: whether an account can act as a vendor or rider
-- is decided by owning a row in `stores` / `rider_profiles` (see
-- `requireRole` in worker/index.ts) so any account can "become a vendor" or
-- "activate rider mode" without a separate role or a new login.
-- `google_id` is set for accounts created via Google Sign-In; `password_hash`
-- is still required for those (a random unusable value), since they never
-- log in with a password.
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('rider','store','admin','customer')),
  name TEXT NOT NULL,
  phone TEXT,
  google_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id) WHERE google_id IS NOT NULL;

-- A user "activates rider mode" by getting a row here (self-service or
-- admin-created); `is_active = 0` means they've paused delivering without
-- losing the profile.
CREATE TABLE IF NOT EXISTS rider_profiles (
  user_id TEXT PRIMARY KEY REFERENCES users(id),
  is_active INTEGER NOT NULL DEFAULT 1,
  vehicle_type TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS stores (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  address TEXT,
  lat REAL,
  lng REAL,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  store_id TEXT NOT NULL REFERENCES stores(id),
  title TEXT NOT NULL,
  image_url TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS subcategories (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES categories(id),
  title TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  store_id TEXT NOT NULL REFERENCES stores(id),
  category_id TEXT REFERENCES categories(id),
  subcategory_id TEXT REFERENCES subcategories(id),
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  image_url TEXT,
  is_available INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Optional per-product size/price options (e.g. "Petite" 500, "Grande" 900).
-- A product with zero rows here just uses products.price_cents directly —
-- variations are additive, not a replacement, so existing simple products
-- keep working unchanged.
CREATE TABLE IF NOT EXISTS product_variations (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id),
  title TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  is_out_of_stock INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  store_id TEXT NOT NULL REFERENCES stores(id),
  rider_id TEXT REFERENCES users(id),
  customer_id TEXT REFERENCES users(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  delivery_address TEXT NOT NULL,
  delivery_lat REAL,
  delivery_lng REAL,
  status TEXT NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING','ACCEPTED','PREPARING','READY_FOR_PICKUP','PICKED_UP','DELIVERED','CANCELLED')),
  total_cents INTEGER NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL DEFAULT 'COD' CHECK (payment_method IN ('COD','FEDAPAY')),
  payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING','APPROVED','DECLINED','CANCELED')),
  fedapay_transaction_id INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id),
  product_id TEXT NOT NULL REFERENCES products(id),
  variation_id TEXT REFERENCES product_variations(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  price_cents INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS rider_locations (
  rider_id TEXT PRIMARY KEY REFERENCES users(id),
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Delivery zones (platform-wide, managed by admin). `coordinates` is a JSON
-- array of [lat, lng] points forming a closed polygon, e.g.
-- [[6.36,2.42],[6.37,2.42],[6.37,2.43],[6.36,2.43]].
CREATE TABLE IF NOT EXISTS zones (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  coordinates TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_categories_store ON categories(store_id);
CREATE INDEX IF NOT EXISTS idx_subcategories_category ON subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_products_store ON products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_store ON orders(store_id);
CREATE INDEX IF NOT EXISTS idx_orders_rider ON orders(rider_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_product_variations_product ON product_variations(product_id);

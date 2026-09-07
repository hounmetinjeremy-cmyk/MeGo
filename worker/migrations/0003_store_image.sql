-- Store photo/logo, so the client storefront can show real store cards
-- instead of a placeholder. Additive only.
ALTER TABLE stores ADD COLUMN image_url TEXT;

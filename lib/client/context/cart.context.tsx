import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import type { MeGoProduct, MeGoProductVariation } from "@/lib/shared/api-client";

export interface CartItem {
  product: MeGoProduct;
  variation: MeGoProductVariation | null;
  quantity: number;
}

interface CartState {
  storeId: string | null;
  storeName: string | null;
  items: CartItem[];
}

interface CartValue extends CartState {
  totalCents: number;
  addItem: (storeId: string, storeName: string, product: MeGoProduct, variation?: MeGoProductVariation | null) => void;
  setQuantity: (productId: string, variationId: string | null, quantity: number) => void;
  clear: () => void;
}

const EMPTY_CART: CartState = { storeId: null, storeName: null, items: [] };

function sameLine(item: CartItem, productId: string, variationId: string | null): boolean {
  return item.product.id === productId && (item.variation?.id ?? null) === variationId;
}

const CartContext = createContext<CartValue | null>(null);

/**
 * MeGo orders are single-store (see worker/index.ts POST /api/orders), so
 * adding a product from a different store than the one already in the cart
 * replaces the cart instead of merging two stores into one order. Kept as a
 * single state object (rather than three separate useState calls) so that
 * decision can be made atomically inside one functional update.
 *
 * Two variations of the same product are separate cart lines (a "Petite" and
 * a "Grande" pizza aren't the same line item), matched by product id +
 * variation id.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>(EMPTY_CART);

  const addItem = useCallback(
    (storeId: string, storeName: string, product: MeGoProduct, variation: MeGoProductVariation | null = null) => {
      setCart((current) => {
        if (current.storeId && current.storeId !== storeId) {
          return { storeId, storeName, items: [{ product, variation, quantity: 1 }] };
        }
        const variationId = variation?.id ?? null;
        const existing = current.items.find((i) => sameLine(i, product.id, variationId));
        const items = existing
          ? current.items.map((i) => (sameLine(i, product.id, variationId) ? { ...i, quantity: i.quantity + 1 } : i))
          : [...current.items, { product, variation, quantity: 1 }];
        return { storeId, storeName, items };
      });
    },
    [],
  );

  const setQuantity = useCallback((productId: string, variationId: string | null, quantity: number) => {
    setCart((current) => ({
      ...current,
      items:
        quantity <= 0
          ? current.items.filter((i) => !sameLine(i, productId, variationId))
          : current.items.map((i) => (sameLine(i, productId, variationId) ? { ...i, quantity } : i)),
    }));
  }, []);

  const clear = useCallback(() => setCart(EMPTY_CART), []);

  const totalCents = useMemo(
    () =>
      cart.items.reduce((sum, i) => sum + (i.variation?.price_cents ?? i.product.price_cents) * i.quantity, 0),
    [cart.items],
  );

  const value = useMemo(
    () => ({ ...cart, totalCents, addItem, setQuantity, clear }),
    [cart, totalCents, addItem, setQuantity, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

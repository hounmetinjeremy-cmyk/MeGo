import { Stack } from "expo-router";

import { CartProvider } from "@/lib/client/context/cart.context";

/**
 * Client (customer) app entry: browsing is public (no auth gate here), unlike
 * rider/store which require a token before reaching their tabs. Checkout and
 * order history each check for a logged-in customer themselves.
 */
export default function ClientLayout() {
  return (
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </CartProvider>
  );
}

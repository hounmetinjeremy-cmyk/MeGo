import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

import { listStoreProducts, type MeGoProduct } from "@/lib/shared/api-client";
import { useCart } from "@/lib/client/context/cart.context";
import { clientStyles as styles } from "@/lib/client/ui/styles";
import { enatega } from "@/lib/client/ui/theme";

function formatPrice(cents: number): string {
  return `${(cents / 100).toFixed(2)} €`;
}

export default function ClientStoreMenuScreen() {
  const params = useLocalSearchParams<{ id: string; name?: string }>();
  const storeId = Array.isArray(params.id) ? params.id[0] : params.id;
  const storeName = (Array.isArray(params.name) ? params.name[0] : params.name) || "Boutique";

  const [products, setProducts] = useState<MeGoProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cart = useCart();

  const load = useCallback(async () => {
    if (!storeId) return;
    try {
      setError(null);
      const { products } = await listStoreProducts(storeId);
      setProducts(products);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    void load();
  }, [load]);

  const quantityFor = (productId: string) =>
    cart.storeId === storeId ? (cart.items.find((i) => i.product.id === productId)?.quantity ?? 0) : 0;

  const cartCount = cart.storeId === storeId ? cart.items.reduce((n, i) => n + i.quantity, 0) : 0;

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={enatega.main} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>{"< Boutiques"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{storeName}</Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>Aucun produit disponible.</Text>}
        renderItem={({ item }) => {
          const qty = quantityFor(item.id);
          return (
            <View style={styles.card}>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                {item.description ? <Text style={styles.cardSubtitle}>{item.description}</Text> : null}
                <Text style={styles.cardPrice}>{formatPrice(item.price_cents)}</Text>
              </View>
              {qty > 0 ? (
                <View style={styles.stepper}>
                  <TouchableOpacity
                    style={styles.stepperButton}
                    onPress={() => cart.setQuantity(item.id, qty - 1)}
                  >
                    <Text style={styles.stepperButtonText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.stepperValue}>{qty}</Text>
                  <TouchableOpacity
                    style={styles.stepperButton}
                    onPress={() => storeId && cart.addItem(storeId, storeName, item)}
                  >
                    <Text style={styles.stepperButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => storeId && cart.addItem(storeId, storeName, item)}
                >
                  <Text style={styles.addButtonText}>Ajouter</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
      />

      {cartCount > 0 ? (
        <TouchableOpacity style={styles.cartBar} onPress={() => router.push("/client/checkout")}>
          <Text style={styles.cartBarText}>
            Voir le panier ({cartCount}) — {formatPrice(cart.totalCents)}
          </Text>
        </TouchableOpacity>
      ) : null}
    </SafeAreaView>
  );
}

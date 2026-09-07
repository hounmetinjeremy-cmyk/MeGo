import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { listMyCustomerOrders, type MeGoOrder } from "@/lib/shared/api-client";
import { clientStyles as styles } from "@/lib/client/ui/styles";
import { enatega } from "@/lib/client/ui/theme";

const STATUS_LABEL: Record<MeGoOrder["status"], string> = {
  PENDING: "En attente",
  ACCEPTED: "Acceptée",
  PREPARING: "En préparation",
  READY_FOR_PICKUP: "Prête",
  PICKED_UP: "En route",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

function formatPrice(cents: number): string {
  return `${(cents / 100).toFixed(2)} €`;
}

export default function ClientOrdersHistoryScreen() {
  const [orders, setOrders] = useState<MeGoOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const { orders } = await listMyCustomerOrders();
      setOrders(orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>{"< Retour"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes commandes</Text>
      </View>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={enatega.main} />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>Aucune commande pour le moment.</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push({ pathname: "/client/order/[id]", params: { id: item.id } })}
            >
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{STATUS_LABEL[item.status]}</Text>
                <Text style={styles.cardSubtitle}>{formatPrice(item.total_cents)}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </SafeAreaView>
  );
}

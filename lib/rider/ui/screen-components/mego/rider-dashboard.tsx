import * as Location from "expo-location";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";

import {
  acceptOrder,
  listAvailableOrders,
  listMyRiderOrders,
  reportRiderLocation,
  updateRiderOrderStatus,
  type MeGoOrder,
} from "@/lib/shared/api-client";

function formatPrice(cents: number): string {
  return `${(cents / 100).toFixed(2)} €`;
}

const STATUS_LABEL: Record<MeGoOrder["status"], string> = {
  PENDING: "En attente du vendeur",
  ACCEPTED: "Acceptée par le vendeur",
  PREPARING: "En préparation",
  READY_FOR_PICKUP: "Prête à récupérer",
  PICKED_UP: "En livraison",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

const LOCATION_PING_INTERVAL_MS = 15000;

export default function RiderDashboard() {
  const [available, setAvailable] = useState<MeGoOrder[]>([]);
  const [mine, setMine] = useState<MeGoOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tracking, setTracking] = useState(false);
  const trackingRef = useRef(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      const [availableRes, mineRes] = await Promise.all([
        listAvailableOrders(),
        listMyRiderOrders(),
      ]);
      setAvailable(availableRes.orders);
      setMine(mineRes.orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const interval = setInterval(() => void load(), 10000);
    return () => clearInterval(interval);
  }, [load]);

  // Foreground GPS reporting while the rider has at least one active order.
  useEffect(() => {
    const shouldTrack = mine.some((o) => ["PICKED_UP"].includes(o.status) || mine.length > 0);
    if (!shouldTrack) {
      trackingRef.current = false;
      setTracking(false);
      return;
    }

    let cancelled = false;
    trackingRef.current = true;

    const pingLoop = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        if (!cancelled) setTracking(false);
        return;
      }
      if (!cancelled) setTracking(true);
      while (!cancelled && trackingRef.current) {
        try {
          const position = await Location.getCurrentPositionAsync({});
          await reportRiderLocation(position.coords.latitude, position.coords.longitude);
        } catch {
          // Best-effort — a missed ping isn't worth surfacing to the rider.
        }
        await new Promise((resolve) => setTimeout(resolve, LOCATION_PING_INTERVAL_MS));
      }
    };
    void pingLoop();

    return () => {
      cancelled = true;
      trackingRef.current = false;
    };
  }, [mine]);

  const onRefresh = () => {
    setRefreshing(true);
    void load();
  };

  const onAccept = async (order: MeGoOrder) => {
    try {
      await acceptOrder(order.id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cette commande n'est plus disponible");
    }
  };

  const onPickedUp = async (order: MeGoOrder) => {
    try {
      await updateRiderOrderStatus(order.id, "PICKED_UP");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de mise à jour");
    }
  };

  const onDelivered = async (order: MeGoOrder) => {
    try {
      await updateRiderOrderStatus(order.id, "DELIVERED");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de mise à jour");
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {tracking ? (
        <View style={styles.trackingBanner}>
          <Text style={styles.trackingText}>📍 Position partagée en direct</Text>
        </View>
      ) : null}

      <TouchableOpacity style={styles.browseButton} onPress={() => router.push("/client")}>
        <Text style={styles.browseButtonText}>🛍️ Parcourir les boutiques</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Mes courses en cours</Text>
      {mine.length === 0 ? (
        <Text style={styles.emptyText}>Aucune course en cours.</Text>
      ) : (
        mine.map((order) => (
          <View key={order.id} style={styles.card}>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{order.customer_name}</Text>
              <Text style={styles.cardSubtitle}>{order.delivery_address}</Text>
              <Text style={styles.cardStatus}>{STATUS_LABEL[order.status]}</Text>
              <Text style={styles.cardPrice}>{formatPrice(order.total_cents)}</Text>
            </View>
            <View style={styles.orderActions}>
              {order.status === "READY_FOR_PICKUP" ? (
                <TouchableOpacity style={styles.smallButton} onPress={() => onPickedUp(order)}>
                  <Text style={styles.smallButtonText}>Récupérée</Text>
                </TouchableOpacity>
              ) : null}
              {order.status === "PICKED_UP" ? (
                <TouchableOpacity style={styles.smallButton} onPress={() => onDelivered(order)}>
                  <Text style={styles.smallButtonText}>Livrée</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        ))
      )}

      <Text style={styles.sectionTitle}>Courses disponibles</Text>
      {available.length === 0 ? (
        <Text style={styles.emptyText}>Aucune course disponible pour le moment.</Text>
      ) : (
        available.map((order) => (
          <View key={order.id} style={styles.card}>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{order.customer_name}</Text>
              <Text style={styles.cardSubtitle}>{order.delivery_address}</Text>
              <Text style={styles.cardPrice}>{formatPrice(order.total_cents)}</Text>
            </View>
            <TouchableOpacity style={styles.smallButton} onPress={() => onAccept(order)}>
              <Text style={styles.smallButtonText}>Accepter</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#0F172A" },
  errorBanner: { backgroundColor: "#7F1D1D", padding: 12, margin: 16, borderRadius: 8 },
  errorText: { color: "#FECACA" },
  trackingBanner: {
    backgroundColor: "#1E3A8A",
    marginHorizontal: 16,
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
  },
  trackingText: { color: "#BFDBFE", fontSize: 13, fontWeight: "600" },
  browseButton: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: "#1E293B",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  browseButtonText: { color: "#FFFFFF", fontWeight: "600" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: { color: "#64748B", paddingHorizontal: 16, paddingVertical: 8 },
  card: {
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: "#1E293B",
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardBody: { flex: 1, gap: 2 },
  cardTitle: { color: "#FFFFFF", fontWeight: "700", fontSize: 15 },
  cardSubtitle: { color: "#94A3B8", fontSize: 13 },
  cardStatus: { color: "#FBBF24", fontSize: 13, fontWeight: "600" },
  cardPrice: { color: "#60A5FA", fontWeight: "700", marginTop: 4 },
  orderActions: { alignItems: "flex-end", gap: 8 },
  smallButton: {
    backgroundColor: "#2563EB",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  smallButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "600" },
});

import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

import {
  getOrder,
  getOrderRiderLocation,
  type MeGoOrder,
  type MeGoOrderItem,
} from "@/lib/shared/api-client";
import { clientStyles as styles } from "@/lib/client/ui/styles";
import { enatega } from "@/lib/client/ui/theme";

const STATUS_LABEL: Record<MeGoOrder["status"], string> = {
  PENDING: "En attente de confirmation",
  ACCEPTED: "Acceptée par la boutique",
  PREPARING: "En préparation",
  READY_FOR_PICKUP: "Prête, en attente d'un livreur",
  PICKED_UP: "En route",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

const PAYMENT_STATUS_LABEL: Record<MeGoOrder["payment_status"], string> = {
  PENDING: "en attente",
  APPROVED: "payé",
  DECLINED: "refusé",
  CANCELED: "annulé",
};

function formatPrice(cents: number): string {
  return `${(cents / 100).toFixed(2)} €`;
}

export default function ClientOrderTrackingScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const orderId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [order, setOrder] = useState<MeGoOrder | null>(null);
  const [items, setItems] = useState<MeGoOrderItem[]>([]);
  const [riderLocation, setRiderLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!orderId) return;
    try {
      const { order, items } = await getOrder(orderId);
      setOrder(order);
      setItems(items);
      setError(null);
      if (order.rider_id) {
        try {
          const { location } = await getOrderRiderLocation(orderId);
          setRiderLocation({ lat: location.lat, lng: location.lng });
        } catch {
          setRiderLocation(null);
        }
      } else {
        setRiderLocation(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de charger la commande.");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    void load();
    const interval = setInterval(() => void load(), 5000);
    return () => clearInterval(interval);
  }, [load]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={enatega.main} />
      </View>
    );
  }

  if (error || !order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.error}>{error ?? "Commande introuvable"}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Commande</Text>
        <Text style={styles.status}>{STATUS_LABEL[order.status]}</Text>
        <Text style={styles.subtitle}>
          Paiement : {order.payment_method === "FEDAPAY" ? "FedaPay" : "À la livraison"}
          {order.payment_method === "FEDAPAY" ? ` (${PAYMENT_STATUS_LABEL[order.payment_status]})` : ""}
        </Text>

        {items.map((item) => (
          <View key={item.id} style={styles.summaryRow}>
            <Text style={styles.summaryText}>
              {item.quantity} × {item.product_name}
              {item.variation_title ? ` (${item.variation_title})` : ""}
            </Text>
            <Text style={styles.summaryText}>{formatPrice(item.price_cents * item.quantity)}</Text>
          </View>
        ))}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryTotalText}>Total</Text>
          <Text style={styles.summaryTotalText}>{formatPrice(order.total_cents)}</Text>
        </View>

        <Text style={styles.subtitle}>Livraison : {order.delivery_address}</Text>

        {riderLocation ? (
          <Text style={styles.subtitle}>
            Position du livreur : {riderLocation.lat.toFixed(4)}, {riderLocation.lng.toFixed(4)}
          </Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

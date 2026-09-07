import { useState } from "react";
import { ActivityIndicator, Linking, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { placeOrder } from "@/lib/shared/api-client";
import { useCart } from "@/lib/client/context/cart.context";
import { useCurrentUser } from "@/lib/client/hooks/useCurrentUser";
import { clientStyles as styles } from "@/lib/client/ui/styles";
import { enatega } from "@/lib/client/ui/theme";

function formatPrice(cents: number): string {
  return `${(cents / 100).toFixed(2)} €`;
}

export default function ClientCheckoutScreen() {
  const cart = useCart();
  const { user, loading: userLoading } = useCurrentUser();
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "FEDAPAY">("COD");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (userLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={enatega.main} />
      </View>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.title}>Connecte-toi pour commander</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push("/client/login")}>
            <Text style={styles.buttonText}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!cart.storeId || cart.items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.title}>Ton panier est vide</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.replace("/client")}>
            <Text style={styles.buttonText}>Parcourir les boutiques</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const storeId = cart.storeId;

  const onSubmit = async () => {
    if (!address.trim()) {
      setError("L'adresse de livraison est requise.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const result = await placeOrder({
        store_id: storeId,
        customer_name: user.name,
        customer_phone: phone.trim() || undefined,
        delivery_address: address.trim(),
        items: cart.items.map((i) => ({
          product_id: i.product.id,
          variation_id: i.variation?.id,
          quantity: i.quantity,
        })),
        payment_method: paymentMethod,
      });
      const orderId = result.id;
      cart.clear();
      if (result.payment_method === "FEDAPAY" && result.payment_url) {
        if (Platform.OS === "web") {
          window.location.href = result.payment_url;
        } else {
          await Linking.openURL(result.payment_url);
        }
      }
      router.replace({ pathname: "/client/order/[id]", params: { id: orderId } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de valider la commande.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Récapitulatif</Text>
        {cart.items.map((i) => {
          const priceCents = i.variation?.price_cents ?? i.product.price_cents;
          return (
            <View key={`${i.product.id}:${i.variation?.id ?? ""}`} style={styles.summaryRow}>
              <Text style={styles.summaryText}>
                {i.quantity} × {i.product.name}
                {i.variation ? ` (${i.variation.title})` : ""}
              </Text>
              <Text style={styles.summaryText}>{formatPrice(priceCents * i.quantity)}</Text>
            </View>
          );
        })}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryTotalText}>Total</Text>
          <Text style={styles.summaryTotalText}>{formatPrice(cart.totalCents)}</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Adresse de livraison"
          placeholderTextColor={enatega.fontSecondColor}
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="Téléphone (optionnel)"
          placeholderTextColor={enatega.fontSecondColor}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <Text style={styles.sectionLabel}>Paiement</Text>
        <View style={styles.paymentRow}>
          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === "COD" && styles.paymentOptionSelected]}
            onPress={() => setPaymentMethod("COD")}
          >
            <Text style={styles.paymentOptionText}>À la livraison</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === "FEDAPAY" && styles.paymentOptionSelected]}
            onPress={() => setPaymentMethod("FEDAPAY")}
          >
            <Text style={styles.paymentOptionText}>Payer en ligne (FedaPay)</Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, submitting && styles.buttonDisabled]}
          onPress={onSubmit}
          disabled={submitting}
        >
          {submitting ? <ActivityIndicator color={enatega.black} /> : <Text style={styles.buttonText}>Commander</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

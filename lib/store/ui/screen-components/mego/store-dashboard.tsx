import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import {
  createProduct,
  deleteProduct,
  listMyProducts,
  listStoreOrders,
  updateStoreOrderStatus,
  uploadStoreImage,
  type MeGoOrder,
  type MeGoProduct,
} from "@/lib/shared/api-client";

function formatPrice(cents: number): string {
  return `${(cents / 100).toFixed(2)} €`;
}

type StoreAdvanceableStatus = "ACCEPTED" | "PREPARING" | "READY_FOR_PICKUP";

const NEXT_STATUS: Partial<Record<MeGoOrder["status"], StoreAdvanceableStatus>> = {
  PENDING: "ACCEPTED",
  ACCEPTED: "PREPARING",
  PREPARING: "READY_FOR_PICKUP",
};

const STATUS_LABEL: Record<MeGoOrder["status"], string> = {
  PENDING: "En attente",
  ACCEPTED: "Acceptée",
  PREPARING: "En préparation",
  READY_FOR_PICKUP: "Prête (attend un livreur)",
  PICKED_UP: "Récupérée par le livreur",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

export default function StoreDashboard() {
  const [products, setProducts] = useState<MeGoProduct[]>([]);
  const [orders, setOrders] = useState<MeGoOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      const [productsRes, ordersRes] = await Promise.all([
        listMyProducts(),
        listStoreOrders(),
      ]);
      setProducts(productsRes.products);
      setOrders(ordersRes.orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    void load();
  };

  const onPickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    setUploadingImage(true);
    setError(null);
    try {
      const filename = asset.fileName ?? `product-${Date.now()}.jpg`;
      const { url } = await uploadStoreImage(asset.uri, filename, asset.mimeType ?? "image/jpeg");
      setImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi de la photo");
    } finally {
      setUploadingImage(false);
    }
  };

  const onAddProduct = async () => {
    const priceCents = Math.round(parseFloat(price.replace(",", ".")) * 100);
    if (!name.trim() || !priceCents || Number.isNaN(priceCents)) return;
    setSaving(true);
    try {
      await createProduct({
        name: name.trim(),
        description: description.trim() || undefined,
        price_cents: priceCents,
        image_url: imageUrl ?? undefined,
      });
      setName("");
      setDescription("");
      setPrice("");
      setImageUrl(null);
      setShowAddProduct(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'ajout");
    } finally {
      setSaving(false);
    }
  };

  const onDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      setProducts((current) => current.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
    }
  };

  const onAdvanceOrder = async (order: MeGoOrder) => {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    try {
      await updateStoreOrderStatus(order.id, next);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de mise à jour");
    }
  };

  const onCancelOrder = async (order: MeGoOrder) => {
    try {
      await updateStoreOrderStatus(order.id, "CANCELLED");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de mise à jour");
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#16A34A" />
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

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Mes produits</Text>
        <TouchableOpacity onPress={() => setShowAddProduct((v) => !v)}>
          <Text style={styles.addLink}>{showAddProduct ? "Annuler" : "+ Ajouter"}</Text>
        </TouchableOpacity>
      </View>

      {showAddProduct ? (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Nom du produit"
            placeholderTextColor="#94A3B8"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Description (optionnel)"
            placeholderTextColor="#94A3B8"
            value={description}
            onChangeText={setDescription}
          />
          <TextInput
            style={styles.input}
            placeholder="Prix (€)"
            placeholderTextColor="#94A3B8"
            keyboardType="decimal-pad"
            value={price}
            onChangeText={setPrice}
          />
          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={onPickImage}
            disabled={uploadingImage}
          >
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.imagePreview} />
            ) : (
              <Text style={styles.imagePickerText}>
                {uploadingImage ? "Envoi de la photo…" : "📷 Ajouter une photo"}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, saving && styles.buttonDisabled]}
            onPress={onAddProduct}
            disabled={saving}
          >
            <Text style={styles.buttonText}>{saving ? "Enregistrement…" : "Enregistrer"}</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {products.length === 0 ? (
        <Text style={styles.emptyText}>Aucun produit pour le moment.</Text>
      ) : (
        products.map((product) => (
          <View key={product.id} style={styles.card}>
            {product.image_url ? (
              <Image source={{ uri: product.image_url }} style={styles.cardImage} />
            ) : null}
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{product.name}</Text>
              {product.description ? (
                <Text style={styles.cardSubtitle}>{product.description}</Text>
              ) : null}
              <Text style={styles.cardPrice}>{formatPrice(product.price_cents)}</Text>
            </View>
            <TouchableOpacity onPress={() => onDeleteProduct(product.id)}>
              <Text style={styles.deleteLink}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Commandes</Text>
      </View>

      {orders.length === 0 ? (
        <Text style={styles.emptyText}>Aucune commande pour le moment.</Text>
      ) : (
        orders.map((order) => (
          <View key={order.id} style={styles.card}>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{order.customer_name}</Text>
              <Text style={styles.cardSubtitle}>{order.delivery_address}</Text>
              <Text style={styles.cardStatus}>{STATUS_LABEL[order.status]}</Text>
              <Text style={styles.cardPrice}>{formatPrice(order.total_cents)}</Text>
            </View>
            <View style={styles.orderActions}>
              {NEXT_STATUS[order.status] ? (
                <TouchableOpacity
                  style={styles.smallButton}
                  onPress={() => onAdvanceOrder(order)}
                >
                  <Text style={styles.smallButtonText}>
                    {order.status === "PENDING" ? "Accepter" : "Étape suivante"}
                  </Text>
                </TouchableOpacity>
              ) : null}
              {["PENDING", "ACCEPTED", "PREPARING"].includes(order.status) ? (
                <TouchableOpacity onPress={() => onCancelOrder(order)}>
                  <Text style={styles.deleteLink}>Annuler</Text>
                </TouchableOpacity>
              ) : null}
            </View>
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#FFFFFF" },
  addLink: { color: "#4ADE80", fontWeight: "600" },
  form: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#1E293B",
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
  input: {
    backgroundColor: "#0F172A",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#FFFFFF",
  },
  button: {
    backgroundColor: "#16A34A",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 4,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#FFFFFF", fontWeight: "600" },
  imagePickerButton: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#334155",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    overflow: "hidden",
  },
  imagePickerText: { color: "#94A3B8", fontWeight: "600" },
  imagePreview: { width: "100%", height: 120, borderRadius: 8 },
  emptyText: { color: "#64748B", paddingHorizontal: 16, paddingVertical: 8 },
  cardImage: { width: 56, height: 56, borderRadius: 8, marginRight: 12 },
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
  cardPrice: { color: "#4ADE80", fontWeight: "700", marginTop: 4 },
  deleteLink: { color: "#F87171", fontSize: 13 },
  orderActions: { alignItems: "flex-end", gap: 8 },
  smallButton: {
    backgroundColor: "#16A34A",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  smallButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "600" },
});

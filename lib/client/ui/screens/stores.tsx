import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Location from "expo-location";

import { becomeVendor, activateRiderProfile, deactivateRiderProfile, listStores, type MeGoStore } from "@/lib/shared/api-client";
import { useCurrentUser } from "@/lib/client/hooks/useCurrentUser";
import { clientStyles as styles } from "@/lib/client/ui/styles";
import { enatega } from "@/lib/client/ui/theme";

export default function ClientStoresScreen() {
  const [stores, setStores] = useState<MeGoStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accountPanelOpen, setAccountPanelOpen] = useState(false);
  const { user, refresh: refreshUser, logout } = useCurrentUser();

  const load = useCallback(async () => {
    try {
      setError(null);
      // Best-effort: if the customer shares their location and it falls
      // inside a delivery zone, only stores in that same zone are returned
      // (see worker/index.ts GET /api/stores). No permission, no zones
      // configured, or a location outside every zone all fall back to
      // showing every store — never an empty screen because of this.
      let location: { lat: number; lng: number } | undefined;
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        const granted =
          status === Location.PermissionStatus.GRANTED ||
          (await Location.requestForegroundPermissionsAsync()).status === Location.PermissionStatus.GRANTED;
        if (granted) {
          const position = await Location.getCurrentPositionAsync({});
          location = { lat: position.coords.latitude, lng: position.coords.longitude };
        }
      } catch {
        // Ignore: browsing without a known location is a normal fallback.
      }

      const { stores } = await listStores(location);
      setStores(stores);
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Boutiques</Text>
        {user ? (
          <View style={{ flexDirection: "row", gap: 16 }}>
            <TouchableOpacity onPress={() => router.push("/client/orders")}>
              <Text style={styles.headerLink}>Mes commandes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setAccountPanelOpen(true)}>
              <Text style={styles.headerLink}>Mon compte</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.headerLink}>Se connecter</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={enatega.main} />
        </View>
      ) : (
        <FlatList
          data={stores}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>Aucune boutique disponible pour le moment.</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/client/store/[id]",
                  params: { id: item.id, name: item.name },
                })
              }
            >
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                {item.address ? <Text style={styles.cardSubtitle}>{item.address}</Text> : null}
              </View>
            </TouchableOpacity>
          )}
        />
      )}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Modal
        visible={accountPanelOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setAccountPanelOpen(false)}
      >
        <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "#0007" }}>
          <View style={{ backgroundColor: enatega.white, borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 24, gap: 12 }}>
            {user ? (
              <AccountPanel
                user={user}
                onClose={() => setAccountPanelOpen(false)}
                onChanged={refreshUser}
                onLogout={async () => {
                  await logout();
                  setAccountPanelOpen(false);
                  router.replace("/login");
                }}
              />
            ) : null}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function AccountPanel({
  user,
  onClose,
  onChanged,
  onLogout,
}: {
  user: NonNullable<ReturnType<typeof useCurrentUser>["user"]>;
  onClose: () => void;
  onChanged: () => void;
  onLogout: () => void;
}) {
  const [storeName, setStoreName] = useState("");
  const [busy, setBusy] = useState(false);
  const [panelError, setPanelError] = useState<string | null>(null);

  const onCreateStore = async () => {
    if (!storeName.trim()) {
      setPanelError("Donne un nom à ta boutique.");
      return;
    }
    try {
      setBusy(true);
      setPanelError(null);
      await becomeVendor({ name: storeName.trim() });
      onChanged();
      router.push("/store");
    } catch {
      setPanelError("Impossible de créer la boutique, réessaie.");
    } finally {
      setBusy(false);
    }
  };

  const onToggleRider = async () => {
    try {
      setBusy(true);
      setPanelError(null);
      if (user.isRiderActive) {
        await deactivateRiderProfile();
      } else {
        await activateRiderProfile();
      }
      onChanged();
    } catch {
      setPanelError("Action impossible, réessaie.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Text style={[styles.title, { textAlign: "left" }]}>{user.name}</Text>
      <Text style={styles.cardSubtitle}>{user.email}</Text>

      <View style={{ height: 1, backgroundColor: enatega.borderColor, marginVertical: 8 }} />

      <Text style={styles.sectionLabel}>Vendeur</Text>
      {user.storeId ? (
        <TouchableOpacity style={styles.button} onPress={() => router.push("/store")}>
          <Text style={styles.buttonText}>Gérer ma boutique</Text>
        </TouchableOpacity>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nom de ta boutique"
            value={storeName}
            onChangeText={setStoreName}
          />
          <TouchableOpacity
            style={[styles.button, busy && styles.buttonDisabled]}
            disabled={busy}
            onPress={onCreateStore}
          >
            <Text style={styles.buttonText}>Devenir vendeur</Text>
          </TouchableOpacity>
        </>
      )}

      <Text style={styles.sectionLabel}>Livreur</Text>
      <TouchableOpacity
        style={[styles.button, busy && styles.buttonDisabled]}
        disabled={busy}
        onPress={onToggleRider}
      >
        <Text style={styles.buttonText}>
          {user.isRiderActive ? "Désactiver le mode livreur" : "Activer le mode livreur"}
        </Text>
      </TouchableOpacity>
      {user.isRiderActive ? (
        <TouchableOpacity style={styles.button} onPress={() => router.push("/rider")}>
          <Text style={styles.buttonText}>Ouvrir l&apos;espace livreur</Text>
        </TouchableOpacity>
      ) : null}

      {panelError ? <Text style={styles.error}>{panelError}</Text> : null}

      <TouchableOpacity onPress={onLogout} style={{ marginTop: 12 }}>
        <Text style={styles.link}>Se déconnecter</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onClose}>
        <Text style={[styles.link, { color: enatega.fontSecondColor }]}>Fermer</Text>
      </TouchableOpacity>
    </>
  );
}

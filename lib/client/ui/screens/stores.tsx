import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Location from "expo-location";

import { listStores, type MeGoStore } from "@/lib/shared/api-client";
import { useCurrentUser } from "@/lib/client/hooks/useCurrentUser";
import { clientStyles as styles } from "@/lib/client/ui/styles";
import { enatega } from "@/lib/client/ui/theme";

export default function ClientStoresScreen() {
  const [stores, setStores] = useState<MeGoStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useCurrentUser();

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
          <TouchableOpacity onPress={() => router.push("/client/orders")}>
            <Text style={styles.headerLink}>Mes commandes</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => router.push("/client/login")}>
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
    </SafeAreaView>
  );
}

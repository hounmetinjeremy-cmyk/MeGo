import { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { googleSignIn, setApiToken, ApiError } from "@/lib/shared/api-client";
import { setActiveRole } from "@/lib/shared/active-role";
import { GoogleSignInButton } from "@/lib/shared/google-sign-in-button";
import { clientStyles as styles } from "@/lib/client/ui/styles";

/**
 * Single unified entry point: one Google login for everyone. There is no
 * more "I am a client / rider / vendor" choice here — every account lands
 * on the same public storefront (app/client), and can become a vendor
 * (create a store) or activate rider mode from its own account panel there.
 * Email/password login still exists per-section (app/client/login,
 * app/rider/login, app/store/login) for accounts created before this, or
 * for anyone who prefers it.
 */
export default function UnifiedLoginScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onGoogleToken = async (idToken: string) => {
    try {
      setLoading(true);
      setError(null);
      const { token } = await googleSignIn(idToken);
      await setApiToken(token);
      await setActiveRole("client");
      router.replace("/client");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? "Connexion Google indisponible pour le moment."
          : "Impossible de se connecter, réessaie.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, { justifyContent: "center", gap: 20 }]}>
        <Text style={[styles.title, { fontSize: 28 }]}>MeGo</Text>
        <Text style={styles.subtitle}>
          Une seule connexion pour commander, vendre ou livrer.
        </Text>

        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 12 }} />
        ) : (
          <View style={{ alignItems: "center", marginTop: 12 }}>
            <GoogleSignInButton onToken={onGoogleToken} />
          </View>
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.subtitle}>ou</Text>
        <Text style={styles.link} onPress={() => router.push("/client/login")}>
          Se connecter avec e-mail
        </Text>
      </View>
    </SafeAreaView>
  );
}

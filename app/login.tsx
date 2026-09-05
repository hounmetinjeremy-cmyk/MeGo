import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Role picker shown to a device with no remembered session. Each role keeps
 * its own login screen and auth flow (different GraphQL mutation, different
 * hardening) — this screen only routes to the right one.
 */
export default function RoleSelectScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Connexion</Text>
        <Text style={styles.subtitle}>Choisissez votre espace</Text>

        <Pressable
          style={[styles.button, styles.riderButton]}
          onPress={() => router.push("/rider/login")}
        >
          <Text style={styles.buttonText}>Je suis Livreur</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.storeButton]}
          onPress={() => router.push("/store/login")}
        >
          <Text style={styles.buttonText}>Je suis Vendeur</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#94A3B8",
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  riderButton: {
    backgroundColor: "#2563EB",
  },
  storeButton: {
    backgroundColor: "#16A34A",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

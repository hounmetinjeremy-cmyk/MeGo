import { Text, View } from "react-native";

/**
 * Native (iOS/Android) fallback. Real native Google Sign-In needs a native
 * build (its own client id + entitlements) which mego doesn't have yet — see
 * app.json's REPLACE_ME placeholders. The web build (google-sign-in-button.web.tsx)
 * is the one actually deployed today, so it gets the real implementation.
 */
export function GoogleSignInButton(_props: { onToken: (idToken: string) => void }) {
  return (
    <View style={{ padding: 12, alignItems: "center" }}>
      <Text style={{ color: "#888", textAlign: "center", fontSize: 13 }}>
        Connexion Google bientôt disponible sur mobile — utilise le web pour l&apos;instant.
      </Text>
    </View>
  );
}

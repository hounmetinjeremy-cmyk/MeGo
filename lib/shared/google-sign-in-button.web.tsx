import { useEffect, useRef } from "react";
import { Text, View } from "react-native";

// Google Identity Services (GIS) — loaded once, globally, on demand. Kept as
// `any` here: this is the browser-injected SDK, not a package we install.
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

const CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const SCRIPT_ID = "google-identity-services";
const SCRIPT_SRC = "https://accounts.google.com/gsi/client";

export function GoogleSignInButton({ onToken }: { onToken: (idToken: string) => void }) {
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!CLIENT_ID) return;

    const render = () => {
      if (!window.google || !divRef.current) return;
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: (response) => onToken(response.credential),
      });
      window.google.accounts.id.renderButton(divRef.current, {
        theme: "outline",
        size: "large",
        width: 280,
        text: "continue_with",
        locale: "fr",
      });
    };

    if (window.google) {
      render();
      return;
    }

    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
    script.addEventListener("load", render);
    return () => script?.removeEventListener("load", render);
  }, [onToken]);

  if (!CLIENT_ID) {
    return (
      <View style={{ padding: 12, alignItems: "center" }}>
        <Text style={{ color: "#888", textAlign: "center", fontSize: 13 }}>
          Connexion Google pas encore configurée sur ce serveur.
        </Text>
      </View>
    );
  }

  return <div ref={divRef} />;
}

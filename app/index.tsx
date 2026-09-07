import { router } from "expo-router";
import { useEffect } from "react";

import { getActiveRole } from "@/lib/shared/active-role";

/**
 * App-wide entry point. Sends a returning user straight back into whichever
 * app (rider or store) they last signed into; each role's own index.tsx then
 * does its own token check and lands on its home screen or its login screen.
 * A first-time user with no remembered role lands on the role picker.
 */
export default function Index() {
  useEffect(() => {
    void (async () => {
      const role = await getActiveRole();
      if (role === "rider") {
        router.replace("/rider");
      } else if (role === "store") {
        router.replace("/store");
      } else if (role === "client") {
        router.replace("/client");
      } else {
        router.replace("/login");
      }
    })();
  }, []);

  return null;
}

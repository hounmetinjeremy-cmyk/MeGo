import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import Constants from "expo-constants";

// Constant
import useNotification from "@/lib/store/hooks/useNotification";
import { ROUTES } from "@/lib/store/utils/constants";
import SpinnerComponent from "@/lib/store/ui/useable-components/spinner";
import { getApiToken } from "@/lib/shared/api-client";

function App() {
  const notificationRef = useRef(true);
  const router = useRouter();
  const {
    restaurantData,
    getPermission,
    getExpoPushToken,
    sendTokenToBackend,
    storeLookupComplete,
  } = useNotification();

  const init = useCallback(async () => {
    // Shared token (lib/shared/api-client): whether this account can act as
    // a store is enforced server-side (requireRole), not by a locally-stored
    // store id.
    const token = await getApiToken();

    if (token) {
      router.replace(ROUTES.home);
    } else {
      router.replace(ROUTES.login);
    }
  }, [router]);

  useEffect(() => {
    if (!storeLookupComplete) return;

    const checkToken = async () => {
      try {
        if (!restaurantData) {
          return;
        }

        if (
          restaurantData?.restaurant?.enableNotification &&
          notificationRef?.current
        ) {
          const permissionStatus = await getPermission();
          if (permissionStatus.granted) {
            const projectId = Constants.expoConfig?.extra?.eas?.projectId;
            if (projectId) {
              const token = (await getExpoPushToken({ projectId })).data;
              await sendTokenToBackend({
                variables: { token, isEnabled: true },
              });
            }
          }
        }
        notificationRef.current = false;
      } catch {
        // Navigation must continue even when notification registration fails.
      } finally {
        await init();
      }
    };
    void checkToken();
  }, [
    getExpoPushToken,
    getPermission,
    init,
    restaurantData,
    sendTokenToBackend,
    storeLookupComplete,
  ]);

  return <SpinnerComponent />;
}

export default App;

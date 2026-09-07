import * as Location from "expo-location";
import React, { useCallback, useEffect, useMemo, useState } from "react";

// Interfaces§
import { removeSecureItem } from "@/lib/rider/services/secure-storage";
import { IAuthContext, IAuthProviderProps } from "@/lib/rider/utils/interfaces";
import { useRouter } from "expo-router";
import { useRiderMode } from "@/lib/rider/context/global/rider-mode.context";
import { clearActiveRole } from "@/lib/shared/active-role";
import { getApiToken, setApiToken, clearApiToken } from "@/lib/shared/api-client";

export const AuthContext = React.createContext<IAuthContext>(
  {} as IAuthContext,
);

export const AuthProvider: React.FC<IAuthProviderProps> = ({
  client,
  children,
}) => {
  // Hooks
  const router = useRouter();
  const { riderIdKey } = useRiderMode();

  // State
  const [token, setToken] = useState<string>("");
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const hydrateAuth = async () => {
      try {
        // One shared token (lib/shared/api-client) for the whole app: set
        // once at the unified login, read here regardless of which section
        // (client/store/rider) the user is currently in.
        const storedToken = await getApiToken();

        if (isMounted && storedToken) {
          setToken(storedToken);
        }
      } finally {
        if (isMounted) {
          setIsAuthReady(true);
        }
      }
    };

    hydrateAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const setTokenAsync = useCallback(
    async (token: string) => {
      await setApiToken(token);
      await client.clearStore();
      setToken(token);
    },
    [client],
  );

  const logout = useCallback(async () => {
    setToken("");

    try {
      await Promise.all([
        clearApiToken(),
        removeSecureItem(riderIdKey),
        clearActiveRole(),
      ]);

      try {
        await client.clearStore();
      } catch (cacheError) {
        if (__DEV__) {
          console.log("Error clearing Apollo cache during logout:", cacheError);
        }
      }

      try {
        const hasLocationUpdates =
          await Location.hasStartedLocationUpdatesAsync("RIDER_LOCATION");
        if (hasLocationUpdates) {
          await Location.stopLocationUpdatesAsync("RIDER_LOCATION");
        }
      } catch (locationError) {
        if (__DEV__) {
          console.log("Error stopping location updates:", locationError);
        }
      }
    } catch (e) {
      if (__DEV__) {
        console.log("Logout Error: ", e);
      }
    } finally {
      router.replace("/rider/login");
    }
  }, [client, riderIdKey, router]);

  const values: IAuthContext = useMemo(
    () => ({
      token: token ?? "",
      isAuthReady,
      logout,
      setTokenAsync,
    }),
    [token, isAuthReady, logout, setTokenAsync],
  );

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

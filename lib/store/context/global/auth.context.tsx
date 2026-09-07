// Apollo
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";

// Core
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useMemo, useState } from "react";

// Constants
import { removeItem } from "@/lib/store/services";
import { useStoreMode } from "@/lib/store/context/global/store-mode.context";
import { clearActiveRole } from "@/lib/shared/active-role";
import { getApiToken, setApiToken, clearApiToken } from "@/lib/shared/api-client";

// Interfaces
import { IAuthContext, IAuthProviderProps } from "@/lib/store/utils/interfaces";

// Expo
import * as Localization from "expo-localization";
import { router } from "expo-router";

// I18n
import { setAppLanguage } from "@/i18next";

export const AuthContext = React.createContext<IAuthContext>(
  {} as IAuthContext,
);

export const AuthProvider: React.FC<IAuthProviderProps> = ({
  client,
  children,
}) => {
  // States
  const [isSelected, setIsSelected] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [token, setToken] = useState<string>("");
  const { storeIdKey } = useStoreMode();

  const setTokenAsync = useCallback(
    async (token: string) => {
      await setApiToken(token);
      await client.clearStore();
      setToken(token);
    },
    [client],
  );

  // Handlers
  const handleSetCurrentLanguage = async () => {
    try {
      const lng = await AsyncStorage.getItem("lang");

      // Safe handling of Localization
      let systemLanguage = "en"; // default fallback

      const locales = Localization.getLocales();
      if (locales && locales.length > 0 && locales[0].languageCode) {
        systemLanguage = locales[0].languageCode;
      }

      // Use stored language preference or fall back to system language
      const selectedLanguage = lng || systemLanguage;

      const appliedLanguage = await setAppLanguage(selectedLanguage);
      setIsSelected(appliedLanguage);
    } catch {
      // Ultimate fallback
      try {
        const appliedLanguage = await setAppLanguage("en");
        setIsSelected(appliedLanguage);
      } catch {
        setIsSelected("en");
      }
    }
  };

  const logout = useCallback(async () => {
    try {
      await Promise.all([
        client.clearStore(),
        clearApiToken(),
        removeItem(storeIdKey),
        clearActiveRole(),
      ]);

      setToken("");
      router.replace("/store/login");
    } catch {
      return;
    }
  }, [client, storeIdKey]);

  const checkAuth = useCallback(async () => {
    try {
      // One shared token (lib/shared/api-client) for the whole app: set once
      // at the unified login, read here regardless of which section
      // (client/store/rider) the user is currently in. Whether this account
      // can actually act as a store is enforced server-side (requireRole),
      // not by a locally-stored store id.
      const token = await getApiToken();

      if (!token) {
        return await logout();
      }
      setToken(token);
    } catch {
      await logout();
    } finally {
      setIsInitialized(true);
    }
  }, [logout]);

  // UseEffects
  useEffect(() => {
    handleSetCurrentLanguage();
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (__DEV__) {
      loadDevMessages();
      loadErrorMessages();
    }
  }, []);

  const values = useMemo<IAuthContext>(
    () => ({
      isInitialized,
      token: token ?? "",
      logout,
      setTokenAsync,
      isSelected,
      setIsSelected,
    }),
    [isInitialized, isSelected, logout, setTokenAsync, token],
  );

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

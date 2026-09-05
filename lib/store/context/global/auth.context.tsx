// Apollo
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";

// Core
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useMemo, useState } from "react";

// Constants
import { getItem, getStoreId, removeItem, setItem } from "@/lib/store/services";
import { useStoreMode } from "@/lib/store/context/global/store-mode.context";
import { clearActiveRole } from "@/lib/shared/active-role";

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
  const { storeIdKey, tokenKey } = useStoreMode();

  const setTokenAsync = useCallback(
    async (token: string) => {
      await setItem(tokenKey, token);
      await client.clearStore();
      setToken(token);
    },
    [client, tokenKey],
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
        removeItem(tokenKey),
        removeItem(storeIdKey),
        clearActiveRole(),
      ]);

      setToken("");
      router.replace("/store/login");
    } catch {
      return;
    }
  }, [client, storeIdKey, tokenKey]);

  const checkAuth = useCallback(async () => {
    try {
      const token = await getItem(tokenKey);
      const storeId = await getStoreId(storeIdKey);

      if (!storeId || !token) {
        return await logout();
      }
      setToken(token);
    } catch {
      await logout();
    } finally {
      setIsInitialized(true);
    }
  }, [logout, storeIdKey, tokenKey]);

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

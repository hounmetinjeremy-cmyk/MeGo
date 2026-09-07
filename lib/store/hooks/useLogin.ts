import { useContext, useState } from "react";

import { Href, router } from "expo-router";
import { AuthContext } from "../context/global/auth.context";
import { setItem } from "../services";
import { FlashMessageComponent } from "../ui/useable-components";
import { ROUTES } from "../utils/constants";
import { setActiveRole } from "@/lib/shared/active-role";
import { useStoreMode } from "@/lib/store/context/global/store-mode.context";
import { login as apiLogin, setApiToken, ApiError } from "@/lib/shared/api-client";

const useLogin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Context
  const { setTokenAsync } = useContext(AuthContext);
  const { storeIdKey } = useStoreMode();

  const onLogin = async (username: string, password: string) => {
    if (!username || !password) {
      FlashMessageComponent({ message: "Username and password are required" });
      return;
    }
    try {
      setIsLoading(true);
      const { token, user } = await apiLogin(username, password);
      if (!user.storeId) {
        FlashMessageComponent({ message: "This account is not a store account" });
        return;
      }
      await setApiToken(token);
      // (protected)/_layout.tsx no longer requires a locally-stored store id
      // (capability is checked server-side), but other store-scoped local
      // prefs are still keyed by it, so keep it populated.
      await setItem(storeIdKey, user.id);
      await setTokenAsync(token);
      await setActiveRole("store");
      router.replace(ROUTES.home as Href);
    } catch (err) {
      const message =
        err instanceof ApiError && err.status === 401
          ? "Invalid credentials"
          : "Unable to connect. Please try again.";
      FlashMessageComponent({ message });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    onLogin,
    isLogging: isLoading,
  };
};

export default useLogin;

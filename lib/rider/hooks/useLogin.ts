import { Href, router } from "expo-router";

// Contexts
import { AuthContext } from "../context/global/auth.context";

// Components
import { FlashMessageComponent } from "../ui/useable-components";

// Constants
import { ROUTES } from "../utils/constants";
import { setActiveRole } from "@/lib/shared/active-role";
import { login as apiLogin, setApiToken, ApiError } from "@/lib/shared/api-client";

// Hooks
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { setSecureItem } from "../services/secure-storage";
import { useUserContext } from "../context/global/user.context";
import { useRiderMode } from "../context/global/rider-mode.context";

const useLogin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Hooks
  const { t } = useTranslation();

  // Context
  const { setTokenAsync } = useContext(AuthContext);
  const { setUserId } = useUserContext();
  const { riderIdKey } = useRiderMode();

  const onLogin = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const { token, user } = await apiLogin(username.toLowerCase(), password);
      if (user.role !== "rider") {
        FlashMessageComponent({ message: t("This account is not a rider account") });
        return;
      }
      await setApiToken(token);
      // Also satisfies the existing auth gate (checked by (tabs)/_layout.tsx),
      // which only cares that a token is present.
      await setTokenAsync(token);
      setUserId(user.id);
      await setSecureItem(riderIdKey, user.id);
      await setActiveRole("rider");
      router.replace(ROUTES.home as Href);
    } catch (err) {
      const message =
        err instanceof ApiError && err.status === 401
          ? t("Invalid username or password")
          : t("Unable to connect. Please try again.");
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

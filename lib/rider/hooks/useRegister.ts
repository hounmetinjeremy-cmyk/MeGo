import { Href, router } from "expo-router";

// Contexts
import { AuthContext } from "../context/global/auth.context";

// Components
import { FlashMessageComponent } from "../ui/useable-components";

// Constants
import { ROUTES } from "../utils/constants";
import { setActiveRole } from "@/lib/shared/active-role";
import { register as apiRegister, setApiToken, ApiError } from "@/lib/shared/api-client";

// Hooks
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { setSecureItem } from "../services/secure-storage";
import { useUserContext } from "../context/global/user.context";
import { useRiderMode } from "../context/global/rider-mode.context";
import { ISignUpInitialValues } from "../utils/interfaces";

const useRegister = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { t } = useTranslation();
  const { setTokenAsync } = useContext(AuthContext);
  const { setUserId } = useUserContext();
  const { riderIdKey } = useRiderMode();

  const onRegister = async (values: ISignUpInitialValues) => {
    try {
      setIsLoading(true);
      const { token, user } = await apiRegister({
        email: values.email.trim().toLowerCase(),
        password: values.password,
        name: values.name.trim(),
        role: "rider",
        phone: values.phone.trim() || undefined,
      });
      await setApiToken(token);
      await setTokenAsync(token);
      setUserId(user.id);
      await setSecureItem(riderIdKey, user.id);
      await setActiveRole("rider");
      router.replace(ROUTES.home as Href);
    } catch (err) {
      const message =
        err instanceof ApiError && err.status === 409
          ? t("Un compte existe déjà avec cet e-mail")
          : t("Impossible de créer le compte, réessayez.");
      FlashMessageComponent({ message });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    onRegister,
    isRegistering: isLoading,
  };
};
export default useRegister;

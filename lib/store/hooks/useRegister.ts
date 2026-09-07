import { useContext, useState } from "react";

import { Href, router } from "expo-router";
import { AuthContext } from "../context/global/auth.context";
import { setItem } from "../services";
import { FlashMessageComponent } from "../ui/useable-components";
import { ROUTES } from "../utils/constants";
import { setActiveRole } from "@/lib/shared/active-role";
import { useStoreMode } from "@/lib/store/context/global/store-mode.context";
import { register as apiRegister, setApiToken, ApiError } from "@/lib/shared/api-client";
import { ISignUpInitialValues } from "../utils/interfaces";

const useRegister = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { setTokenAsync } = useContext(AuthContext);
  const { storeIdKey } = useStoreMode();

  const onRegister = async (values: ISignUpInitialValues) => {
    try {
      setIsLoading(true);
      const { token, user } = await apiRegister({
        email: values.email.trim().toLowerCase(),
        password: values.password,
        name: values.name.trim(),
        role: "store",
        phone: values.phone.trim() || undefined,
        storeName: values.storeName.trim(),
      });
      await setApiToken(token);
      await setItem(storeIdKey, user.id);
      await setTokenAsync(token);
      await setActiveRole("store");
      router.replace(ROUTES.home as Href);
    } catch (err) {
      const message =
        err instanceof ApiError && err.status === 409
          ? "Un compte existe déjà avec cet e-mail"
          : "Impossible de créer le compte, réessayez.";
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

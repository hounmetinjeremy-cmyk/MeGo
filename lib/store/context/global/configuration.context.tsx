// Core
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// Interfaces§
import {
  IConfiguration,
  IConfigurationProviderProps,
  ILazyQueryResult,
} from "@/lib/store/utils/interfaces";

// API
import { GET_CONFIGURATION } from "@/lib/store/apollo/queries";

// Hooks
import { useLazyQueryQL } from "@/lib/store/hooks/useLazyQueryQL";
import { AuthContext } from "@/lib/store/context/global/auth.context";
import { useStoreMode } from "@/lib/store/context/global/store-mode.context";

export const ConfigurationContext = createContext<IConfiguration | undefined>({
  _id: "",
  currency: "",
  currencySymbol: "",
  restaurantAppSentryUrl: "",
});

export const ConfigurationProvider: React.FC<IConfigurationProviderProps> = ({
  children,
}) => {
  const [configuration, setConfiguration] = useState<
    IConfiguration | undefined
  >();
  const { isInitialized, token } = useContext(AuthContext);
  const { isSingleVendor } = useStoreMode();

  // API
  const { fetch, loading, error, data } = useLazyQueryQL(GET_CONFIGURATION, {
    debounceMs: 300,
  }) as ILazyQueryResult<
    { configuration: IConfiguration } | undefined,
    undefined
  >;

  // Handlers
  const onFetchConfiguration = () => {
    const configuration: IConfiguration | undefined =
      loading || error || !data
        ? {
            _id: "",
            restaurantAppSentryUrl: "",
            currency: "",
            currencySymbol: "",
          }
        : data?.configuration;

    setConfiguration(configuration);
  };

  const fetchConfiguration = useCallback(() => {
    if (!isInitialized || (isSingleVendor && !token)) return;
    fetch();
  }, [fetch, isInitialized, isSingleVendor, token]);

  // Use Effect
  useEffect(() => {
    fetchConfiguration();
  }, [fetchConfiguration]);

  useEffect(() => {
    onFetchConfiguration();
  }, [data, error, loading]);

  return (
    <ConfigurationContext.Provider value={configuration}>
      {children}
    </ConfigurationContext.Provider>
  );
};

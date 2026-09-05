// Components
import EarningsOrderDetailsMain from "@/lib/store/ui/screen-components/earning-order-details/view";

// Core
import { SafeAreaView } from "react-native";

// Hooks
import { useApptheme } from "@/lib/store/context/theme.context";

export default function EarningsOrderDetailsScreen() {
  // Hooks
  const { appTheme } = useApptheme();
  return (
    <SafeAreaView
      style={{ backgroundColor: appTheme.themeBackground }}
      className="h-full w-full"
    >
      <EarningsOrderDetailsMain />
    </SafeAreaView>
  );
}

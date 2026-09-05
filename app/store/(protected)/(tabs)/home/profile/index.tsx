import { useApptheme } from "@/lib/store/context/theme.context";
import { ProfileScreen } from "@/lib/store/ui/screens";
import { SafeAreaView } from "react-native";

export default function Profile() {
  const { appTheme } = useApptheme();

  return (
    <SafeAreaView
      className="w-full h-full"
      style={{
        backgroundColor: appTheme.themeBackground,
      }}
    >
      <ProfileScreen />
    </SafeAreaView>
  );
}

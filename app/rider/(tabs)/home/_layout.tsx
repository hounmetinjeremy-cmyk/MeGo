import { useApptheme } from "@/lib/rider/context/global/theme.context";
import { DrawerLayout } from "@/lib/rider/ui/layouts/home-drawer";

export default function HomeLayout() {
  const { currentTheme, appTheme } = useApptheme();
  return (
    <DrawerLayout
      key={currentTheme?.concat("_DRAWER")}
      currentTheme={currentTheme}
      appTheme={appTheme}
    />
  );
}

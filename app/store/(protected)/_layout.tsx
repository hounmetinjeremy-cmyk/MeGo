// Providers
import RestaurantProvider from "@/lib/store/context/global/restaurant";
import { AuthContext } from "@/lib/store/context/global/auth.context";
import { SoundProvider } from "@/lib/store/context/global/sound.context";
import { useApptheme } from "@/lib/store/context/theme.context";

// Expo
import { Redirect, Stack } from "expo-router";
import { StatusBar, StatusBarStyle } from "expo-status-bar";
import { useContext } from "react";

// React Native Flash Message
import FlashMessage from "react-native-flash-message";

export default function ProtectedLayout() {
  const { appTheme, currentTheme } = useApptheme();
  const { isInitialized, token } = useContext(AuthContext);

  if (!isInitialized) {
    return null;
  }

  if (!token) {
    return <Redirect href="/store/login" />;
  }

  return (
    <RestaurantProvider.Provider>
      <SoundProvider>
        <>
          <Stack
            screenOptions={{
              headerShown: false,
              headerStyle: {
                backgroundColor: appTheme.screenBackground,
              },
              headerTitleAlign: "center",
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style={currentTheme as StatusBarStyle} />
          <FlashMessage position="bottom" />
        </>
      </SoundProvider>
    </RestaurantProvider.Provider>
  );
}

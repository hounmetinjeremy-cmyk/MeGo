import { Stack } from "expo-router";

import { SoundProvider } from "@/lib/store/context/global/sound.context";

export default function LoginLayour() {
  return (
    <SoundProvider>
      <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </SoundProvider>
  );
}

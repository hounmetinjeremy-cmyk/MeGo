import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Persists which role (rider or store) the device last signed into, so the
 * app's root splash (app/index.tsx) can send a returning user straight back
 * into their app instead of the role picker. Not security-sensitive (just a
 * "rider" | "store" tag), so AsyncStorage is used directly — it works on
 * every platform including web, unlike expo-secure-store which has no web
 * implementation.
 */
export const ACTIVE_ROLE_KEY = "@enatega/active-app-role";

export type AppRole = "rider" | "store" | "client";

export async function setActiveRole(role: AppRole): Promise<void> {
  await AsyncStorage.setItem(ACTIVE_ROLE_KEY, role);
}

export async function getActiveRole(): Promise<AppRole | null> {
  const value = await AsyncStorage.getItem(ACTIVE_ROLE_KEY);
  return value === "rider" || value === "store" || value === "client" ? value : null;
}

export async function clearActiveRole(): Promise<void> {
  await AsyncStorage.removeItem(ACTIVE_ROLE_KEY);
}

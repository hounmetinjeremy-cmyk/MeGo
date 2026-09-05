import * as SecureStore from "expo-secure-store";

/**
 * Persists which role (rider or store) the device last signed into, so the
 * app's root splash (app/index.tsx) can send a returning user straight back
 * into their app instead of the role picker.
 */
export const ACTIVE_ROLE_KEY = "@enatega/active-app-role";

export type AppRole = "rider" | "store";

export async function setActiveRole(role: AppRole): Promise<void> {
  await SecureStore.setItemAsync(ACTIVE_ROLE_KEY, role);
}

export async function getActiveRole(): Promise<AppRole | null> {
  const value = await SecureStore.getItemAsync(ACTIVE_ROLE_KEY);
  return value === "rider" || value === "store" ? value : null;
}

export async function clearActiveRole(): Promise<void> {
  await SecureStore.deleteItemAsync(ACTIVE_ROLE_KEY);
}

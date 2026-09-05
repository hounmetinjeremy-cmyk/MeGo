import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { STORE_ID } from "@/lib/store/utils/constants";

interface StorageEvent {
  key: string;
  value: string | null;
}

type StorageListener = (data: StorageEvent) => void;

class SimpleEventEmitter {
  private listeners: Record<string, StorageListener[]> = {};

  emit(event: string, data: StorageEvent) {
    this.listeners[event]?.forEach((listener) => listener(data));
  }

  addListener(event: string, listener: StorageListener) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);

    return {
      removeListener: () => {
        const index = this.listeners[event].indexOf(listener);
        if (index > -1) {
          this.listeners[event].splice(index, 1);
        }
      },
    };
  }
}

export const storageEmitter = new SimpleEventEmitter();

// expo-secure-store has no web implementation (isAvailableAsync() reports
// this itself, safely, without throwing) — fall back to AsyncStorage there.
let secureStoreAvailability: Promise<boolean> | null = null;
const isSecureStoreAvailable = async () => {
  if (!secureStoreAvailability) {
    secureStoreAvailability = SecureStore.isAvailableAsync().catch(
      () => false,
    );
  }
  return secureStoreAvailability;
};

export const getItem = async (key: string): Promise<string | null> => {
  if (await isSecureStoreAvailable()) {
    return SecureStore.getItemAsync(key);
  }
  return AsyncStorage.getItem(key);
};

export const setItem = async (key: string, value: string) => {
  if (await isSecureStoreAvailable()) {
    await SecureStore.setItemAsync(key, value);
  } else {
    await AsyncStorage.setItem(key, value);
  }
  storageEmitter.emit(key, { key, value });
};

export const removeItem = async (key: string) => {
  if (await isSecureStoreAvailable()) {
    await SecureStore.deleteItemAsync(key);
  } else {
    await AsyncStorage.removeItem(key);
  }
  storageEmitter.emit(key, { key, value: null });
};

export const getStoreId = async (storeIdKey: string = STORE_ID) => {
  const secureStoreId = await getItem(storeIdKey);
  if (secureStoreId) return secureStoreId;

  if (storeIdKey !== STORE_ID) return null;

  const legacyStoreId = await AsyncStorage.getItem(STORE_ID);
  if (!legacyStoreId) return null;

  await setItem(STORE_ID, legacyStoreId);
  await AsyncStorage.removeItem(STORE_ID);
  return legacyStoreId;
};

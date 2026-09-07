import { useCallback, useEffect, useState } from "react";

import { clearApiToken, getApiToken, me, type MeGoUser } from "@/lib/shared/api-client";

export function useCurrentUser() {
  const [user, setUser] = useState<MeGoUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getApiToken();
      if (!token) {
        setUser(null);
        return;
      }
      const { user } = await me();
      setUser(user.role === "customer" ? user : null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const logout = useCallback(async () => {
    await clearApiToken();
    setUser(null);
  }, []);

  return { user, loading, refresh, logout };
}

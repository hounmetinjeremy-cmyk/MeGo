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
      // Any authenticated account browses the same public storefront —
      // a vendor or rider account is not "logged out" here just because
      // their base role isn't "customer".
      const { user } = await me();
      setUser(user);
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

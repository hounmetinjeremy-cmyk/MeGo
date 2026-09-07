"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { getApiToken, me } from "@/lib/api-client";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (!getApiToken()) {
      router.replace("/login");
      return;
    }
    me()
      .then(({ user }) => router.replace(user.role === "admin" ? "/zones" : "/products"))
      .catch(() => router.replace("/login"));
  }, [router]);

  return null;
}

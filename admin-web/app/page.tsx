"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { getApiToken } from "@/lib/api-client";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace(getApiToken() ? "/products" : "/login");
  }, [router]);

  return null;
}

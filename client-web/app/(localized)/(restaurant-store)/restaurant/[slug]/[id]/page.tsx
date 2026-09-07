
import RestaurantDetailsScreen from "@/lib/ui/screens/protected/resturant-store/restaurant";
import React from "react";

export default function RestaurantDetailPage() {
  return <RestaurantDetailsScreen />;
}

export async function generateStaticParams() {
  return [{ slug: "placeholder", id: "placeholder" }];
}

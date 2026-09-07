import StoreDetailScreen from "@/lib/ui/screens/protected/resturant-store/store";

export default function StoreDetailPage() {
  return <StoreDetailScreen />;
}

export async function generateStaticParams() {
  return [{ slug: "placeholder", id: "placeholder" }];
}

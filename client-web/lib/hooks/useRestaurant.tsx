import { useEffect, useState } from "react";
import {
  listStoreCategories,
  listStoreProducts,
  listStores,
  type MegoProduct,
} from "@/lib/api/mego-client";
import type { IRestaurant } from "../utils/interfaces/restaurants.interface";

// mego stores don't track ratings, delivery fees/time, opening hours,
// addons/options the way Enatega restaurants do — see
// useNearByRestaurantsPreview.tsx for the same tradeoff on the list view.
const ALWAYS_OPEN_TIMES = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => ({
  day,
  times: [{ startTime: ["00", "00"], endTime: ["23", "59"] }],
}));

function toFood(product: MegoProduct) {
  const variations =
    product.variations.length > 0
      ? product.variations.map((v) => ({
          id: v.id,
          _id: v.id,
          title: v.title,
          price: v.price_cents / 100,
          discounted: false,
          addons: [] as string[],
          isOutOfStock: v.is_out_of_stock === 1,
        }))
      : [
          {
            id: product.id,
            _id: product.id,
            title: "Standard",
            price: product.price_cents / 100,
            discounted: false,
            addons: [] as string[],
            isOutOfStock: false,
          },
        ];

  return {
    _id: product.id,
    title: product.name,
    image: product.image_url ?? "",
    description: product.description ?? "",
    subCategory: product.subcategory_id ?? "",
    restaurant: product.store_id,
    variations,
    isOutOfStock: false,
  };
}

export default function useRestaurant(id: string, _slug?: string) {
  // The original Apollo useQuery(...) here had no generic type argument, so
  // `data.restaurant` was implicitly `any` — callers already read extra
  // fields (username, phone, deliveryCharges...) beyond IRestaurant that
  // Enatega's real GraphQL schema has but this interface doesn't declare.
  // Keeping the same looseness here avoids re-litigating that interface.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<{ restaurant: any } | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    setError(undefined);
    try {
      const [{ stores }, { products }, { categories }] = await Promise.all([
        listStores(),
        listStoreProducts(id),
        listStoreCategories(id),
      ]);
      const store = stores.find((s) => s.id === id);

      const categoriesWithFoods = categories.map((category) => ({
        _id: category.id,
        title: category.title,
        foods: products.filter((p) => p.category_id === category.id).map(toFood),
      }));
      const uncategorized = products.filter((p) => !p.category_id);
      if (uncategorized.length > 0) {
        categoriesWithFoods.push({
          _id: "uncategorized",
          title: "Produits",
          foods: uncategorized.map(toFood),
        });
      }

      const restaurant = {
        _id: id,
        name: store?.name ?? "",
        image: store?.image_url ?? "",
        logo: store?.image_url ?? "",
        address: store?.address ?? "",
        // Fields Enatega's real GraphQL schema has but IRestaurant doesn't
        // declare — see the `any` note on the state type above.
        username: "",
        phone: "",
        description: "",
        deliveryCharges: 0,
        deliveryTax: 0,
        MinimumOrder: 0,
        deliveryTime: 0,
        minimumOrder: 0,
        rating: 0,
        isActive: true,
        isAvailable: true,
        commissionRate: 0,
        tax: 0,
        shopType: "restaurant",
        cuisines: [],
        reviewCount: 0,
        reviewAverage: 0,
        location: { coordinates: [store?.lng ?? 0, store?.lat ?? 0] },
        orderId: "",
        orderPrefix: "",
        slug: id,
        reviewData: { total: 0, ratings: 0, reviews: [] },
        categories: categoriesWithFoods,
        options: [],
        addons: [],
        zone: undefined as unknown as IRestaurant["zone"],
        openingTimes: ALWAYS_OPEN_TIMES,
        deliveryInfo: { deliveryFee: 0, deliveryTime: 0, minimumOrder: 0 },
      };
      setData({ restaurant });
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load store"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return { data, refetch: load, networkStatus: loading ? 1 : 7, loading, error };
}

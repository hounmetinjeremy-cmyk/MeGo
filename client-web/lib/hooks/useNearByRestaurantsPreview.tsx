import { useEffect, useState } from "react";
import type { ApolloError } from "@apollo/client";
import { IRestaurant } from "../utils/interfaces/restaurants.interface";
import { useUserAddress } from "../context/address/address.context";
import { listStores, type MegoStore } from "@/lib/api/mego-client";

const EMPTY_RESTAURANTS: IRestaurant[] = [];

// mego stores have no "closing hours" concept yet (see worker/schema.sql) —
// they're open whenever is_active is set, so give the original open/closed
// check (isRestaurantOpen) a full week of 00:00-23:59 slots rather than
// leaving it empty, which it reads as "closed all week".
const ALWAYS_OPEN_TIMES = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => ({
  day,
  times: [{ startTime: ["00", "00"], endTime: ["23", "59"] }],
}));

// mego stores don't (yet) track ratings, delivery time/fee or cuisines the
// way Enatega restaurants do — those fields default to "no data" values
// (0 / empty) so the original card component still renders correctly
// instead of crashing on a missing field, rather than inventing numbers
// mego doesn't actually have.
function toRestaurant(store: MegoStore): IRestaurant {
  return {
    _id: store.id,
    name: store.name,
    image: store.image_url ?? "",
    logo: store.image_url ?? "",
    address: store.address ?? "",
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
    location: { coordinates: [store.lng ?? 0, store.lat ?? 0] },
    orderId: "",
    orderPrefix: "",
    slug: store.id,
    reviewData: { total: 0, ratings: 0, reviews: [] },
    categories: [],
    options: [],
    addons: [],
    zone: undefined as unknown as IRestaurant["zone"],
    openingTimes: ALWAYS_OPEN_TIMES,
    deliveryInfo: { deliveryFee: 0, deliveryTime: 0, minimumOrder: 0 },
  };
}

const useNearByRestaurantsPreview = (
  enabled = true,
  _page = 1,
  _limit = 10,
  _shopType?: string | null,
) => {
  const { userAddress } = useUserAddress();
  const userLongitude = Number(userAddress?.location?.coordinates[0]) || 0;
  const userLatitude = Number(userAddress?.location?.coordinates[1]) || 0;

  const [queryData, setQueryData] = useState<IRestaurant[]>(EMPTY_RESTAURANTS);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    const location =
      userLatitude && userLongitude ? { lat: userLatitude, lng: userLongitude } : undefined;
    listStores(location)
      .then(({ stores }) => {
        if (cancelled) return;
        setQueryData(stores.map(toRestaurant));
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err : new Error("Failed to load stores"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled, userLatitude, userLongitude]);

  return {
    queryData,
    loading,
    // Callers only check truthiness (this hook no longer talks to Apollo,
    // so there's no real ApolloError to give — the shared interface some
    // of them share just wants "is there an error" out of this field).
    error: (error ?? undefined) as ApolloError | undefined,
    networkStatus: loading ? 1 : 7,
    groceriesData: EMPTY_RESTAURANTS,
    restaurantsData: queryData,
    // No pagination against mego's REST endpoint yet — every store is
    // already returned by the first request.
    fetchMore: async (_vars?: unknown) => ({
      data: { nearByRestaurantsPreview: { restaurants: EMPTY_RESTAURANTS } },
    }),
  };
};

export default useNearByRestaurantsPreview;

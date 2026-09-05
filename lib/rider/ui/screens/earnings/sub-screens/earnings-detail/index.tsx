import EarningDetailsMain from "@/lib/rider/ui/screen-components/earning-details/view";
import { IDateFilter } from "@/lib/rider/utils/interfaces/rider-earnings.interface";
import { useState } from "react";
import { SafeAreaView } from "react-native";

export default function EarningsDetailScreen() {
  const [dateFilter, setDateFilter] = useState<IDateFilter>({
    startDate: "",
    endDate: "",
  });
  return (
    <SafeAreaView className="bg-white">
      <EarningDetailsMain
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
      />
    </SafeAreaView>
  );
}

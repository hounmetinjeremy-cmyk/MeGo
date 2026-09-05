import { ActivityIndicator } from "react-native";
// Constants
import { Colors } from "@/lib/store/utils/constants";
//Interface
import { ISpinnerComponentProps } from "@/lib/store/utils/interfaces";
function SpinnerComponent(props: ISpinnerComponentProps) {
  return (
    <ActivityIndicator
      size="small"
      color={props.color ?? Colors.light.primary}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    />
  );
}

export default SpinnerComponent;

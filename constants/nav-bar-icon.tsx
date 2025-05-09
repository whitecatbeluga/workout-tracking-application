import { Ionicons } from "@expo/vector-icons";

export const icon = {
  index: (isFocused: boolean, props: any) => (
    <Ionicons
      name={isFocused ? "earth" : "earth-outline"}
      size={28}
      {...props}
    />
  ),
  workout: (isFocused: boolean, props: any) => (
    <Ionicons
      name={isFocused ? "barbell" : "barbell-outline"}
      size={28}
      {...props}
    />
  ),
  profile: (isFocused: boolean, props: any) => (
    <Ionicons
      name={isFocused ? "person-circle" : "person-circle-outline"}
      size={28}
      {...props}
    />
  ),
};

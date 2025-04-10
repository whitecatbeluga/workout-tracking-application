import { Ionicons } from "@expo/vector-icons";

export const icon = {
  index: (isFocused: boolean, props: any) => (
    <Ionicons name={isFocused ? "home" : "home-outline"} size={24} {...props} />
  ),
  workout: (isFocused: boolean, props: any) => (
    <Ionicons name={isFocused ? "barbell" : "barbell-outline"} size={28} {...props} />
  ),
  profile: (isFocused: boolean, props: any) => (
    <Ionicons name={isFocused ? "person" : "person-outline"} size={24} {...props} />
  ),
};

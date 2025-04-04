import { Feather, FontAwesome5 } from "@expo/vector-icons";

export const icon = {
  index: (props: any) => <Feather name="home" size={24} {...props} />,
  workout: (props: any) => (
    <FontAwesome5 name="dumbbell" size={24} {...props} />
  ),
  profile: (props: any) => <Feather name="user" size={24} {...props} />,
};

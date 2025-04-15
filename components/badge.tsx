import { Text, View } from "react-native";

const Badge = ({
  label,
  backgroundColor,
}: {
  label: string;
  backgroundColor: string;
}) => {
  return (
    <View
      style={{
        backgroundColor: backgroundColor,
        padding: 2,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignSelf: "flex-start",
      }}
    >
      <Text style={{ color: "white", fontSize: 12 }}>{label}</Text>
    </View>
  );
};

export default Badge;

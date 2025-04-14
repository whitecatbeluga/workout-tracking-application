import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";

const WorkoutCard = ({ card }: any) => {
  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 6,
        alignItems: "flex-start",
        backgroundColor: "white",
        borderRadius: 8,
        width: card.length > 2 ? "31.5%" : "48.5%",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 1,
      }}
    >
      <Text style={{ fontSize: 14, fontWeight: "600", color: "#626262" }}>
        {card.label}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "baseline",
          gap: 5,
        }}
      >
        <Text
          style={{
            fontSize: 32,
            fontWeight: "700",
            color: "#323232",
          }}
        >
          {card.count}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "500",
            color: "#626262",
          }}
        >
          {card.unit}
        </Text>
      </View>
      {card.recentCount > 0 && (
        <View style={{ flexDirection: "row", gap: 5 }}>
          <Ionicons
            name="chevron-up-circle-outline"
            size={20}
            color="#006A71"
          />
          <Text style={{ color: "#006A71" }}>{card.recentCount}</Text>
        </View>
      )}
    </View>
  );
};

export default WorkoutCard;

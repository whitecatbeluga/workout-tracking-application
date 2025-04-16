import { Text, View } from "react-native";
import Badge from "./badge";

const ExerciseCard = ({ card }: { card: any }) => {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 14,
        elevation: 1,
      }}
    >
      <View style={{ gap: 8 }}>
        <View style={{ gap: 4 }}>
          <Text style={{ color: "#323232", fontWeight: "bold", fontSize: 24 }}>
            {card.exercise.name}
          </Text>
          <Badge
            backgroundColor="#48A6A7"
            label={
              card.exercise.with_out_equipment
                ? "Without Equipment"
                : "With Equipment"
            }
          />
        </View>
        <View style={{ flexDirection: "row", gap: 4 }}>
          <Text style={{ color: "#323232", fontWeight: "bold", fontSize: 14 }}>
            Exercise Category:
          </Text>
          <Text style={{ fontSize: 14 }}>{card.exercise.category}</Text>
        </View>
        <Text style={{ fontWeight: "medium", fontSize: 14 }}>
          {card.exercise.description}
        </Text>
      </View>
      <View style={{ flexDirection: "column", gap: 8 }}></View>
    </View>
  );
};

export default ExerciseCard;

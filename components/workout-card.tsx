import { Workout } from "@/custom-types/workout-type";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Collapsible from "react-native-collapsible";

export const CardWorkoutInfo = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => {
  return (
    <View>
      <Text style={{ fontSize: 24, fontWeight: "bold", color: "#323232" }}>
        {value} {label === "Duration" ? "mins" : ""}
      </Text>
      <Text style={{ fontSize: 12, color: "#626262", fontWeight: "medium" }}>
        {label}
      </Text>
    </View>
  );
};

const OpenEditWorkout = ({
  handleOpenEditWorkout,
}: {
  handleOpenEditWorkout: () => void;
}) => {
  return (
    <TouchableOpacity onPress={handleOpenEditWorkout}>
      <View
        style={{
          backgroundColor: "#48A6A7",
          padding: 10,
          paddingHorizontal: 24,
          borderRadius: 6,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Edit Workout</Text>
      </View>
    </TouchableOpacity>
  );
};

export const WorkoutCard = ({
  card,
  handleOpenWorkoutMenu,
  handleOpenEditWorkout,
  isEditable,
}: {
  card: Workout;
  handleOpenEditWorkout?: () => void;
  handleOpenWorkoutMenu?: (id: number) => void;
  isEditable: boolean;
}) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 14,
        borderColor: "#CBD5E1",
        borderWidth: 1,
        width: "100%",
      }}
    >
      <View style={{ gap: 4 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#323232", fontWeight: "bold", fontSize: 22 }}>
            {card.name}
          </Text>
          <TouchableOpacity
            style={{
              paddingVertical: 5,
              paddingLeft: 10,
            }}
            onPress={() => handleOpenWorkoutMenu?.(card.id as number)}
          >
            <Ionicons name="ellipsis-horizontal" size={22} color="#323232" />
          </TouchableOpacity>
        </View>
        <Text style={{ fontWeight: "medium", fontSize: 14, paddingBottom: 10 }}>
          {card.description}
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {/* duration */}
          <CardWorkoutInfo label={"Duration"} value={card.duration} />

          {/* intensity */}
          <CardWorkoutInfo label={"Intensity"} value={card.intensity} />

          {/* volume */}
          <CardWorkoutInfo label={"Volume"} value={card.volume} />

          {/* sets */}
          <CardWorkoutInfo label={"Sets"} value={card.set} />
        </View>
      </View>
      <Collapsible
        collapsed={collapsed}
        style={{ flexDirection: "column", gap: 8, paddingTop: 10 }}
      >
        {card.exercise_ids.map((exercise, index) => (
          <Text
            key={index}
            style={{ fontSize: 12, color: "#626262", fontWeight: "medium" }}
          >
            {exercise}
            {/* {e.exercise.name} ({e.exercise.category}) */}
          </Text>
        ))}
      </Collapsible>
      <TouchableOpacity
        style={{
          paddingTop: 20,
          flexDirection: "row",
          gap: 3,
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
        onPress={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <Ionicons name="chevron-down" size={16} color="#323232" />
        ) : (
          <Ionicons name="chevron-up" size={16} color="#323232" />
        )}

        <Text
          style={{
            fontSize: 12,
            color: "#626262",
            fontWeight: "medium",
          }}
        >
          {collapsed ? "View Exercises" : "Hide Exercises"}
        </Text>
      </TouchableOpacity>
      {isEditable && handleOpenEditWorkout && (
        <OpenEditWorkout handleOpenEditWorkout={handleOpenEditWorkout} />
      )}
    </View>
  );
};

export default WorkoutCard;

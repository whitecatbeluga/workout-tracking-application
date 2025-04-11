import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

const workoutCardDetails = [
  {
    name: "Full Body Workout",
    description: "A comprehensive workout targeting all major muscle groups.",
    duration: 60,
    intensity: "High",
    volume: 5,
    sets: 3,
    exercises: ["1 Set Air Bike", "2 Set Burpees", "3 Set Jumping Jacks"],
  },
  {
    name: "Cardio Blast",
    description: "A high-intensity cardio workout to improve endurance.",
    duration: 45,
    intensity: "Medium",
    volume: 3,
    sets: 4,
    exercises: ["1 Set Air Bike", "2 Set Burpees", "3 Set Jumping Jacks"],
  },
  {
    name: "Strength Training",
    description: "Focus on building muscle strength with compound movements.",
    duration: 75,
    intensity: "High",
    volume: 4,
    sets: 5,
    exercises: ["1 Set Air Bike", "2 Set Burpees", "3 Set Jumping Jacks"],
  },
  {
    name: "Yoga Flow",
    description:
      "A relaxing yoga session to improve flexibility and mindfulness.",
    duration: 30,
    intensity: "Low",
    volume: 6,
    sets: 2,
    exercises: ["1 Set Air Bike", "2 Set Burpees", "3 Set Jumping Jacks"],
  },
  {
    name: "HIIT Challenge",
    description: "A short but intense workout to maximize calorie burn.",
    duration: 20,
    intensity: "Very High",
    volume: 8,
    sets: 3,
    exercises: ["1 Set Air Bike", "2 Set Burpees", "3 Set Jumping Jacks"],
  },
];

type CardWorkoutInfoProps = {
  label: string;
  value: string | number;
};

const CardWorkoutInfo = ({ label, value }: CardWorkoutInfoProps) => {
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

const Card = ({ card }: any) => {
  return (
    <View
      style={{
        marginHorizontal: 20,
        marginTop: 20,
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 14,
        gap: 16,
        elevation: 1,
      }}
    >
      <View style={{ gap: 8 }}>
        <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 14 }}>
          {card.name}
        </Text>
        <Text style={{ fontWeight: "medium", fontSize: 12 }}>
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
          <CardWorkoutInfo label={"Sets"} value={card.sets} />
        </View>
      </View>
      <View style={{ flexDirection: "column", gap: 8 }}>
        {card.exercises.map((exercise: string, index: any) => (
          <Text
            key={index}
            style={{ fontSize: 12, color: "#626262", fontWeight: "medium" }}
          >
            {exercise}
          </Text>
        ))}
      </View>
      <EditButton />
    </View>
  );
};

const EditButton = () => {
  return (
    <TouchableOpacity>
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

const WorkoutsCard = () => {
  const [text, setText] = useState("");
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* search input */}
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            marginHorizontal: 20,
            marginTop: 20,
          }}
        >
          <Ionicons
            style={{ position: "absolute", left: 11, top: 11, zIndex: 1 }}
            name="search"
            size={24}
            color="#6F7A88"
          />
          <TextInput
            style={{
              backgroundColor: "white",
              borderColor: "#CBD5E1",
              borderWidth: 1,
              paddingHorizontal: 8,
              paddingLeft: 40,
              borderRadius: 10,
              fontSize: 16,
            }}
            placeholder="Search exercises..."
            placeholderTextColor="#94A3B8"
            value={text}
            onChangeText={setText}
          />
        </View>

        {/* workout cards */}
        {workoutCardDetails.map((card, index) => (
          <Card key={index} card={card} />
        ))}
      </ScrollView>
    </View>
  );
};
export default WorkoutsCard;

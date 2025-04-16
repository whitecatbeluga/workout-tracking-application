import React from "react";
import { FlatList, StyleSheet, Text, View, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";

const routines = {
  "Push (Chest, Shoulders, Triceps)": [
    "Bench Press – 4x8",
    "Shoulder Press – 4x10",
    "Tricep Dips – 3x12",
    "Lateral Raises – 3x15",
  ],
  "Pull (Back, Biceps)": [
    "Deadlifts – 4x6",
    "Pull-Ups – 4x10",
    "Barbell Rows – 4x8",
    "Hammer Curls – 3x12",
  ],
  "Legs (Quads, Hamstrings, Glutes)": [
    "Squats – 4x8",
    "Romanian Deadlifts – 4x10",
    "Lunges – 3x12 (each leg)",
    "Hip Thrusts – 3x15",
  ],
  "Core Focus": [
    "Plank – 3x1 min",
    "Russian Twists – 3x20",
    "Leg Raises – 3x15",
    "Superman Hold – 3x30 sec",
  ],
  "HIIT Session": [
    "Jump Squats – 40s",
    "Push-Ups – 40s",
    "High Knees – 40s",
    "Burpees – 40s",
  ],
  "Stretch & Recovery": [
    "Child’s Pose – 1 min",
    "Pigeon Pose – 1 min",
    "Butterfly Stretch – 1 min",
    "Figure Four Stretch – 1 min",
  ],
} as const;

const imageMap = {
  push: require("../../../assets/images/push-day.jpg"),
  pull: require("../../../assets/images/Pull day.png"),
  legs: require("../../../assets/images/leg-day.jpg"),
  core: require("../../../assets/images/core-focus.jpg"),
  hiit: require("../../../assets/images/hiit-session.webp"),
  stretch: require("../../../assets/images/stretch-recovery.webp"),
} as const;

type RoutineName = keyof typeof routines;

const RoutineScreen = () => {
  const { name, imageKey } = useLocalSearchParams();
  const routineName = name as RoutineName;
  const imageSource = imageMap[imageKey as keyof typeof imageMap];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{routineName}</Text>
      {imageSource && <Image style={styles.img} source={imageSource} />}
      <FlatList
        data={routines[routineName]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.exercise}>{item}</Text>}
      />
    </View>
  );
};

export default RoutineScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontFamily: "Inter_700Bold",
  },
  img: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 20,
  },
  exercise: {
    fontSize: 16,
    marginVertical: 8,
    fontFamily: "Inter_400Regular",
  },
});

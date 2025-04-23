import React from "react";
import { Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useExerciseContext } from "../../workout/context/exercise-content";

const PrimaryMuscle: React.FC = () => {
  const router = useRouter();
  const { setPrimaryMuscleGroup } = useExerciseContext(); // Access context

  const muscleGroups = [
    "Abdominals",
    "Abductors",
    "Adductors",
    "Biceps",
    "Calves",
    "Cardio",
    "Chest",
    "Forearms",
    "Full Body",
    "Glutes",
    "Hamstrings",
    "Lats",
    "Lower Back",
    "Neck",
    "Quadriceps",
    "Shoulders",
    "Traps",
    "Triceps",
    "Upper Back",
    "Other",
  ];

  const handleSelectMuscle = (muscle: string) => {
    setPrimaryMuscleGroup(muscle); // Save selected muscle in context
    router.push("/screens/workout/create-exercise"); // Navigate back to CreateExercise
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      overScrollMode="never"
    >
      {muscleGroups.map((muscle, index) => (
        <TouchableOpacity
          key={index}
          style={styles.muscleContainer}
          onPress={() => handleSelectMuscle(muscle)} // Handle muscle selection
        >
          <Text style={styles.text}>{muscle}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default PrimaryMuscle;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    gap: 10,
  },
  muscleContainer: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#D7D7D7",
  },
  text: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
  },
});

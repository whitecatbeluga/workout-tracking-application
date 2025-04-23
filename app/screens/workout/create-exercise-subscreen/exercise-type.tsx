import React from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useExerciseContext } from "../../workout/context/exercise-content";

const ExerciseType: React.FC = () => {
  const router = useRouter();
  const { setExerciseType } = useExerciseContext(); // Access context to set exercise type

  const exerciseTypes = [
    {
      title: "Weight & Reps",
      example: "Example: Bench Press, Dumbbell Curls",
      attributes: ["REPS", "KG"],
    },
    {
      title: "Bodyweight Reps",
      example: "Example: Pullups, Sit ups, Burpees",
      attributes: ["REPS"],
    },
    {
      title: "Weighted Bodyweight",
      example: "Example: Weighted Pull Ups, Weighted Dips",
      attributes: ["REPS", "+KG"],
    },
    {
      title: "Assisted Bodyweight",
      example: "Example: Assisted Pullups, Assisted Dips",
      attributes: ["REPS", "-KG"],
    },
    {
      title: "Duration",
      example: "Example: Planks, Yoga, Stretching",
      attributes: ["TIME"],
    },
    {
      title: "Duration & Weight",
      example: "Example: Weighted Plank, Wall Sit",
      attributes: ["KG", "TIME"],
    },
    {
      title: "Distance & Duration",
      example: "Example: Running, Cycling, Rowing",
      attributes: ["TIME", "KM"],
    },
    {
      title: "Weight & Distance",
      example: "Example: Farmers Walk, Suitcase Carry",
      attributes: ["KG", "KM"],
    },
  ];

  const handleSelectExerciseType = (type: string) => {
    setExerciseType(type); // Update context with selected exercise type
    router.push("/screens/workout/create-exercise"); // Navigate back to CreateExercise screen
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {exerciseTypes.map((exercise, index) => (
        <TouchableOpacity
          key={index}
          style={styles.exerciseContainer}
          onPress={() => handleSelectExerciseType(exercise.title)} // Handle selection
        >
          <Text style={styles.exerciseTitle}>{exercise.title}</Text>
          <Text style={styles.exerciseExample}>{exercise.example}</Text>
          <View style={{ flexDirection: "row", gap: 5, marginTop: 5 }}>
            {exercise.attributes.map((attr, attrIndex) => (
              <Text key={attrIndex} style={styles.type}>
                {attr}
              </Text>
            ))}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default ExerciseType;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  exerciseContainer: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#D7D7D7",
  },
  exerciseTitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
  },
  exerciseExample: {
    fontFamily: "Inter_400Regular",
    color: "#6A6A6A",
  },
  type: {
    fontFamily: "Inter_600SemiBold",
    backgroundColor: "#D7D7D7",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
});

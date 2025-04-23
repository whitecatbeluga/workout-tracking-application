import React, { useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from "react-native";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import { useExerciseContext } from "../../workout/context/exercise-content"; // Import context

const SecondaryMuscle: React.FC = () => {
  const router = useRouter();
  const { secondaryMuscleGroups, setSecondaryMuscleGroups } =
    useExerciseContext(); // Use context

  const muscleGroups: string[] = [
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

  const [checkedStates, setCheckedStates] = useState(
    muscleGroups.reduce((acc, group) => {
      acc[group] = secondaryMuscleGroups.includes(group) || false; // Reflect already selected muscles
      return acc;
    }, {} as { [group: string]: boolean })
  );

  const handlePress = (group: string) => {
    setCheckedStates((prevState) => {
      const newState = {
        ...prevState,
        [group]: !prevState[group],
      };
      return newState; // Do not update context here
    });
  };

  const handleSubmit = () => {
    const selectedMuscleGroups = Object.keys(checkedStates).filter(
      (group) => checkedStates[group]
    );

    setSecondaryMuscleGroups(selectedMuscleGroups); // Update context only on submit
    router.push("/screens/workout/create-exercise"); // Navigate back
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container}>
        {muscleGroups.map((group) => (
          <TouchableOpacity
            key={group}
            style={styles.muscleContainer}
            onPress={() => handlePress(group)}
          >
            <Text style={styles.text}>{group}</Text>
            <Checkbox
              style={styles.checkbox}
              value={checkedStates[group]}
              onValueChange={() => handlePress(group)}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Update Muscle Group(s)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SecondaryMuscle;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  muscleContainer: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#D7D7D7",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
  },
  checkbox: {
    margin: 8,
    color: "#48A6A7",
  },
  buttonContainer: {
    padding: 10,
  },
  button: {
    width: "100%",
    backgroundColor: "#48A6A7",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontFamily: "Inter_500Medium",
    color: "#FFFFFF",
  },
});

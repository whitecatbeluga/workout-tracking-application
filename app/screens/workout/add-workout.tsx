import React, { useState } from "react";
import { Text, TextInput, StyleSheet, ScrollView } from "react-native";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { CustomBtn, BtnTitle } from "@/components/custom-btn";
import { createWorkout } from "@/redux/slices/workout-slice";
import { WorkoutFormData } from "@/custom-types/workout-type";
import { useRouter } from "expo-router";

const AddWorkout = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [workoutData, setWorkoutData] = useState<WorkoutFormData>({
    name: "",
    description: "",
    duration: 0,
    intensity: 0,
    volume: 0,
    set: 0,
    exerciseIds: [],
  });

  const [exerciseInput, setExerciseInput] = useState<string>("");

  const handleInputChange = (field: keyof WorkoutFormData, value: string) => {
    setWorkoutData((prev) => ({
      ...prev,
      [field]:
        field === "name" || field === "description" ? value : Number(value),
    }));
  };

  const handleSubmit = async () => {
    const parsedExercises = exerciseInput
      .split(",")
      .map((id) => Number(id.trim()))
      .filter((id) => !isNaN(id));

    const dataToSubmit: WorkoutFormData = {
      ...workoutData,
      exerciseIds: parsedExercises,
    };

    try {
      const result = await dispatch(createWorkout(dataToSubmit));
      if (result.type === "workout/createWorkout/fulfilled") {
        setWorkoutData({
          name: "",
          description: "",
          duration: 0,
          intensity: 0,
          volume: 0,
          set: 0,
          exerciseIds: [],
        });
        setExerciseInput("");
        router.push("/screens/workout");
      }
    } catch (error: any) {
      const message =
        typeof error === "string"
          ? error
          : typeof error?.message === "string"
          ? error.message
          : "Something went wrong";
      console.error("Workout creation error:", message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Workout</Text>

      <TextInput
        style={styles.input}
        placeholder="Workout Name"
        value={workoutData.name}
        onChangeText={(value) => handleInputChange("name", value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={workoutData.description}
        onChangeText={(value) => handleInputChange("description", value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Duration (min)"
        value={workoutData.duration.toString()}
        keyboardType="numeric"
        onChangeText={(value) => handleInputChange("duration", value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Intensity"
        value={workoutData.intensity.toString()}
        keyboardType="numeric"
        onChangeText={(value) => handleInputChange("intensity", value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Volume"
        value={workoutData.volume.toString()}
        keyboardType="numeric"
        onChangeText={(value) => handleInputChange("volume", value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Sets"
        value={workoutData.set.toString()}
        keyboardType="numeric"
        onChangeText={(value) => handleInputChange("set", value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Exercise IDs (e.g. 1,3,5)"
        value={exerciseInput}
        onChangeText={setExerciseInput}
      />

      <CustomBtn onPress={handleSubmit}>
        <BtnTitle title="Create Workout" />
      </CustomBtn>
    </ScrollView>
  );
};

export default AddWorkout;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
});

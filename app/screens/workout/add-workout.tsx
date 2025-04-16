import React, { useState } from "react";
import { Text, TextInput, StyleSheet, ScrollView, View } from "react-native";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { CustomBtn, BtnTitle } from "@/components/custom-btn";
import { createWorkout } from "@/redux/slices/workout-slice";
import { WorkoutFormData } from "@/custom-types/workout-type";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import Input from "@/components/input-text";
import { Ionicons } from "@expo/vector-icons";

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
        Toast.show({
          type: "success",
          text1: "Successfully Created!",
          text2: "Happy Workout!",
        });
        router.replace("/(tabs)/workout");
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
      <View style={{ marginBottom: 16 }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            letterSpacing: -0.6,
            color: "#323232",
          }}
        >
          What's your workout?
        </Text>
      </View>

      <Input
        value={workoutData.name}
        icon="bicycle"
        placeholder="Workout name"
        onChangeText={(value) => {
          handleInputChange("name", value);
        }}
      />
      <Input
        value={workoutData.description}
        icon="document-text"
        placeholder="Workout description"
        onChangeText={(value) => {
          handleInputChange("description", value);
        }}
        multiline={true}
        numberOfLines={4}
      />
      <Input
        value={workoutData.duration}
        icon="alarm"
        placeholder="Workout duration"
        onChangeText={(value) => {
          handleInputChange("duration", value);
        }}
        keyboardType="numeric"
      />
      <Input
        value={workoutData.intensity}
        icon="heart-circle"
        placeholder="Workout intensity"
        onChangeText={(value) => {
          handleInputChange("intensity", value);
        }}
        keyboardType="numeric"
      />
      <Input
        value={workoutData.volume}
        icon="book"
        placeholder="Workout volume"
        onChangeText={(value) => {
          handleInputChange("volume", value);
        }}
        keyboardType="numeric"
      />
      <Input
        value={workoutData.set}
        icon="list"
        placeholder="Workout sets"
        onChangeText={(value) => {
          handleInputChange("set", value);
        }}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Exercise IDs (e.g. 1,3,5)"
        value={exerciseInput}
        onChangeText={setExerciseInput}
      />

      <CustomBtn
        onPress={handleSubmit}
        buttonStyle={{ marginTop: 18, borderRadius: 8 }}
      >
        <Ionicons name="add-circle" size={26} color="white" />
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
    fontFamily: "Inter_700Bold",
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

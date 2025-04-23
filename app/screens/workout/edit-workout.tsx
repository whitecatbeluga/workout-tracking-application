import { useLocalSearchParams, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { BtnTitle, CustomBtn } from "@/components/custom-btn";
import Input from "@/components/input-text";
import { WorkoutFormData } from "@/custom-types/workout-type";
import { supabase } from "@/utils/supabase";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { useEffect, useState } from "react";
import { User } from "@/custom-types/user-type";
import { useAppSelector } from "@/hooks/use-app-selector";

const EditWorkout = () => {
  const router = useRouter();
  const navigation = useNavigation();

  const dispatch = useAppDispatch();
  const { workoutId } = useLocalSearchParams<{ workoutId: string }>();

  const user = useAppSelector(
    (state: { auth: { user: User | null } }) => state.auth.user
  );

  const [workoutData, setWorkoutData] = useState<WorkoutFormData>({
    name: "",
    description: "",
    duration: 0,
    intensity: 0,
    volume: 0,
    set: 0,
    exercise_ids: [],
  });

  const [exerciseInput, setExerciseInput] = useState<string>("");

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{
            backgroundColor: "#48A6A7",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
          }}
          onPress={handleSubmit}
        >
          <Text style={{ fontFamily: "Inter_400Regular", color: "#FFFFFF" }}>
            Save
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, workoutData]);

  useEffect(() => {
    const fetchWorkout = async () => {
      const { data, error } = await supabase
        .from("Workout")
        .select("*")
        .eq("id", workoutId)
        .single();
      if (error) {
        console.log("Error fetching workout:", error.message);
        return;
      }
      console.log("data", data);
      if (data) {
        setWorkoutData({
          name: data.name,
          description: data.description,
          duration: data.duration,
          intensity: data.intensity,
          volume: data.volume,
          set: data.set,
          exercise_ids: data.exercise_ids,
        });
        setExerciseInput(data.exercise_ids?.join(",") || "");
      }
    };
    fetchWorkout();
  }, [workoutId]);

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
      exercise_ids: parsedExercises,
      user_id: user?.id,
    };

    try {
      const user = supabase.auth.getUser();
      console.log("(await user).data.user?.id", (await user).data.user?.id);
      const { data: userProfile } = await supabase
        .from("User")
        .select("*")
        .eq("auth_user_id", (await user).data.user?.id)
        .single();
      console.log("userProfile.id", userProfile.id);
      const { data, error } = await supabase
        .from("Workout")
        .update(dataToSubmit) // Pass the data to be updated
        .eq("id", workoutId) // Ensure you're updating the correct workoutId
        .eq("user_id", userProfile.id) // Ensure that the user_id matches the authenticated user
        .select();
      console.log("Updated workout:", data);
      console.log("Workout updated:", dataToSubmit);

      if (error) {
        throw new Error(error.message);
      }
      setWorkoutData({
        name: "",
        description: "",
        duration: 0,
        intensity: 0,
        volume: 0,
        set: 0,
        exercise_ids: [],
      });
      setExerciseInput("");
      router.replace("/(tabs)/workout");
    } catch (error: any) {
      console.error("Workout creation error:", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} overScrollMode="never">
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
        value={String(workoutData.duration)}
        icon="alarm"
        placeholder="Workout duration"
        onChangeText={(value) => {
          handleInputChange("duration", value);
        }}
        keyboardType="numeric"
      />

      <Input
        value={String(workoutData.intensity)}
        icon="heart-circle"
        placeholder="Workout intensity"
        onChangeText={(value) => {
          handleInputChange("intensity", value);
        }}
        keyboardType="numeric"
      />
      <Input
        value={String(workoutData.volume)}
        icon="book"
        placeholder="Workout volume"
        onChangeText={(value) => {
          handleInputChange("volume", value);
        }}
        keyboardType="numeric"
      />
      <Input
        value={String(workoutData.set)}
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

      {/* <CustomBtn
        onPress={handleSubmit}
        buttonStyle={{ marginTop: 18, borderRadius: 8 }}
      >
        <Ionicons name="add-circle" size={26} color="white" />
        <BtnTitle title="Create Workout" />
      </CustomBtn> */}

      {/* <TextInput placeholder="Routine Title" style={styles.routineTitleInput} /> */}
      {/* <View style={styles.addExerciseContainer}>
        <Ionicons name="barbell-outline" size={36} />
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 15,
            textAlign: "center",
            marginTop: 16,
          }}
        >
          Get started by adding an exercise to your routine.
        </Text>
        <TouchableOpacity
          style={styles.addExerciseButton}
          onPress={() => router.push("/screens/workout/add-exercise")}
        >
          <Ionicons name="add-outline" size={20} color="#FFFFFF" />
          <Text
            style={{
              fontFamily: "Inter_500Medium",
              fontSize: 15,
              color: "#FFFFFF",
            }}
          >
            Add exercise
          </Text>
        </TouchableOpacity>
      </View> */}
    </ScrollView>
  );
};

export default EditWorkout;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  routineTitleInput: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
  },
  addExerciseContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  addExerciseButton: {
    backgroundColor: "#48A6A7",
    paddingHorizontal: 100,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 36,
    borderRadius: 8,
    width: "100%",
    justifyContent: "center",
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

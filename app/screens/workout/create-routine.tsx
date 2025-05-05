import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { ScrollView } from "react-native";
import { useAppSelector } from "@/hooks/use-app-selector";
import ExerciseDetailCard from "@/components/exercise-card-detail";
import { useLayoutEffect, useState } from "react";
import { createRoutineWithoutProgram } from "@/redux/slices/routine-slice";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { auth } from "@/utils/firebase-config";
import { clearWorkoutSets } from "@/redux/slices/workout-slice";
import { clearSelectedExercises } from "@/redux/slices/exercise-slice";

const CreateRoutine = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const navigation = useNavigation();

  const userId = auth.currentUser?.uid;
  const selectedExercises = useAppSelector(
    (state) => state.exercise.selectedExercise
  );
  const workoutSets = useAppSelector((state) => state.workout.workoutSets);

  const [routineName, setRoutineName] = useState<string>("");
  const [errors, setErrors] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  const { programId } = useLocalSearchParams();

  const handleSaveRoutine = async () => {
    try {
      const validationErrors = [];

      if (routineName.trim() === "") {
        validationErrors.push("Please enter a routine name.");
      }

      if (!workoutSets || Object.keys(workoutSets).length === 0) {
        validationErrors.push("Please select at least one exercise.");
      }

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }

      setLoading(true);

      await dispatch(
        createRoutineWithoutProgram({
          userId: userId as string,
          routineName,
          sets: workoutSets,
          programId: (programId as string) || "",
        })
      );

      dispatch(clearWorkoutSets());
      dispatch(clearSelectedExercises());
      setRoutineName("");
      setErrors([]);
      setLoading(false);

      router.replace("/(tabs)/workout");
    } catch (error) {
      console.error("Routine creation error:", error);
      setErrors(["Something went wrong while creating the routine."]);
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleSaveRoutine}
          style={{
            backgroundColor: "#48A6A7",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
            width: 65,
          }}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={{ fontFamily: "Inter_400Regular", color: "#FFFFFF" }}>
              Save
            </Text>
          )}
        </TouchableOpacity>
      ),
    });
  }, [selectedExercises, navigation, workoutSets, routineName, loading]);

  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={(value) => setRoutineName(value)}
        value={routineName}
        placeholder="Routine Title"
        style={styles.routineTitleInput}
      />

      {errors?.map((error) => (
        <Text
          key={error}
          style={{ color: "#991B1B", fontFamily: "Inter_400Regular" }}
        >
          {error}
        </Text>
      ))}

      <View style={styles.addExerciseContainer}>
        <ScrollView overScrollMode="never">
          {selectedExercises.length === 0 ? (
            <View style={styles.getStartedContainer}>
              <Ionicons name="barbell-outline" size={50} color="#6A6A6A" />
              <Text style={styles.getStartedText}>Get started</Text>
              <Text style={styles.getStartedDescription}>
                Get started by adding an exercise to your routine.
              </Text>
            </View>
          ) : (
            selectedExercises.map((selectedExercise) => (
              <ExerciseDetailCard
                key={selectedExercise.id}
                exercise={selectedExercise}
              />
            ))
          )}
        </ScrollView>

        <TouchableOpacity
          style={styles.addExerciseButton}
          onPress={() =>
            router.push({
              pathname: "/screens/workout/add-exercise",
              params: { previousRoute: "/screens/workout/create-routine" },
            })
          }
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
      </View>
    </View>
  );
};

export default CreateRoutine;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  routineTitleInput: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
  },
  addExerciseContainer: {},
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
  getStartedContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
    gap: 10,
  },
  getStartedText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
  },
  getStartedDescription: {
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    fontSize: 16,
  },
});

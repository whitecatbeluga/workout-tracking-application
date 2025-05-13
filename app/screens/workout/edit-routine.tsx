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
import {
  clearRoutineParams,
  clearSelectedRoutineExercises,
  clearSingleRoutine,
  clearWorkoutRoutineSets,
  createRoutineWithoutProgram,
  setSelectedRoutineExercises,
  updateRoutine,
} from "@/redux/slices/routine-slice";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { auth } from "@/utils/firebase-config";
import { clearWorkoutSets } from "@/redux/slices/workout-slice";
import { clearSelectedExercises } from "@/redux/slices/exercise-slice";

const CreateRoutine = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const navigation = useNavigation();

  const userId = auth.currentUser?.uid;
  const selectedRoutineExercises = useAppSelector(
    (state) => state.routine.selectedRoutineExercises
  );
  const workoutRoutineSets = useAppSelector(
    (state) => state.routine.workoutRoutineSets
  );

  const routine = useAppSelector((state) => state.routine.singleRoutine);

  const [routineName, setRoutineName] = useState<string>(
    routine?.routine_name || ""
  );
  const [errors, setErrors] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  const routineParams = useAppSelector((state) => state.routine.params);

  const { type } = useLocalSearchParams();

  const handleUpdateRoutine = async () => {
    try {
      const validationErrors = [];

      if (routineName.trim() === "") {
        validationErrors.push("Please enter a routine name.");
      }

      if (!workoutRoutineSets || Object.keys(workoutRoutineSets).length === 0) {
        validationErrors.push("Please set a workout routine set.");
      }

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }

      setLoading(true);

      await dispatch(
        updateRoutine({
          userId: userId as string,
          routineId: routineParams.routineId as string,
          updatedRoutineName: routineName,
          updatedSets: workoutRoutineSets,
        })
      );

      dispatch(clearWorkoutSets());
      dispatch(clearWorkoutRoutineSets());
      dispatch(clearSelectedRoutineExercises());
      dispatch(clearRoutineParams());
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

  const discardWorkout = () => {
    // clear workouts
    dispatch(clearWorkoutSets());
    dispatch(clearWorkoutRoutineSets());

    // clear exercises
    dispatch(clearSelectedRoutineExercises());
    dispatch(clearSelectedExercises());

    // clear single routine
    dispatch(clearSingleRoutine());
    router.replace("/(tabs)/workout");
  };

  const handleAddExercise = () => {
    router.push({
      pathname: "/screens/workout/add-exercise",
      params: { previousRoute: "edit-routine" },
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Edit Routine",
      headerLeft: () => (
        <TouchableOpacity onPress={discardWorkout}>
          <Text style={{ fontFamily: "Inter_400Regular", color: "#48A6A7" }}>
            Cancel
          </Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={handleUpdateRoutine}
          style={{
            backgroundColor: "#48A6A7",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
            width: 81,
          }}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={{ fontFamily: "Inter_400Regular", color: "#FFFFFF" }}>
              Update
            </Text>
          )}
        </TouchableOpacity>
      ),
    });
  }, [
    selectedRoutineExercises,
    navigation,
    workoutRoutineSets,
    routineName,
    loading,
  ]);

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

      <ScrollView
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {selectedRoutineExercises.length === 0 ? (
          <View style={styles.getStartedContainer}>
            <Ionicons name="barbell-outline" size={50} color="#6A6A6A" />
            <Text style={styles.getStartedText}>Get started</Text>
            <Text style={styles.getStartedDescription}>
              Get started by adding an exercise to your routine.
            </Text>
          </View>
        ) : (
          selectedRoutineExercises.map((selectedExercise) => (
            <ExerciseDetailCard
              key={selectedExercise.id}
              exercise={selectedExercise}
            />
          ))
        )}
      </ScrollView>

      <View style={{ flexDirection: "column", gap: 12, paddingVertical: 20 }}>
        <TouchableOpacity
          style={styles.addExerciseButton}
          onPress={handleAddExercise}
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

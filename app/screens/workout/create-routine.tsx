import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useNavigation, useRouter } from "expo-router";
import { ScrollView } from "react-native";
import { useAppSelector } from "@/hooks/use-app-selector";
import ExerciseDetailCard from "@/components/exercise-card-detail";
import { useLayoutEffect } from "react";
import { createRoutineWithoutProgram } from "@/redux/slices/routine-slice";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { auth } from "@/utils/firebase-config";

const CreateRoutine = () => {
  const userId = auth.currentUser?.uid;
  const selectedExercises = useAppSelector(
    (state) => state.exercise.selectedExercise
  );
  const workoutSets = useAppSelector((state) => state.workout.workoutSets);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const navigation = useNavigation();

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
          }}
        >
          <Text style={{ fontFamily: "Inter_400Regular", color: "#FFFFFF" }}>
            Save
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [selectedExercises, navigation]);

  const handleSaveRoutine = () => {
    // console.log(selectedExercises);
    console.log(workoutSets);
    // console.log(
    //   dispatch(
    //     createRoutineWithoutProgram({
    //       userId: userId as string,
    //       routineData: selectedExercises,
    //     })
    //   )
    // );
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Routine Title" style={styles.routineTitleInput} />
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

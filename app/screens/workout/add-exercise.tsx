import ExerciseCard from "@/components/exercises-card";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { db } from "../../../utils/firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { Exercise } from "@/custom-types/exercise-type";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { setSelectExercises } from "@/redux/slices/exercise-slice";
import { useRouter } from "expo-router";
import { useAppSelector } from "@/hooks/use-app-selector";

const AddExercise = () => {
  const [searchExercise, setSearchExercise] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const selectedExercise = useAppSelector(
    (state) => state.exercise.selectedExercise
  );

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "exercises"));
      const fetchedExercises: Exercise[] = querySnapshot.docs.map((doc) => {
        const data = doc.data() as Omit<Exercise, "id">;
        return {
          id: doc.id,
          ...data,
        };
      });
      setExercises(fetchedExercises);
    } catch (error) {
      console.log("Error fetching exercises:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchExercises();
    setRefreshing(false);
  };

  const toggleExercise = (exercise: Exercise) => {
    const exists = selectedExercise.find((e) => e.id === exercise.id);
    let newSelectedExercises: Exercise[];
    if (exists) {
      newSelectedExercises = selectedExercise.filter(
        (e) => e.id !== exercise.id
      );
    } else {
      newSelectedExercises = [...selectedExercise, exercise];
    }
    dispatch(setSelectExercises(newSelectedExercises));
  };

  const handleAddExercise = () => {
    router.replace("/screens/workout/add-workout");
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons style={styles.searchIcon} name="search-outline" size={20} />
        <TextInput
          placeholder="Search exercise"
          value={searchExercise}
          onChangeText={setSearchExercise}
          style={styles.searchInput}
          autoFocus
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.buttonAllEquipment}>
          <Text style={styles.buttonText}>All Equipment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonAllMuscle}>
          <Text style={styles.buttonText}>All Muscles</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.allExercisesTitle}>All Exercises</Text>

      {loading ? (
        <View style={styles.loadingExercises}>
          <Text>Loading Exercises...</Text>
        </View>
      ) : (
        <ScrollView
          showsHorizontalScrollIndicator={false}
          overScrollMode="never"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onToggleSelect={() => toggleExercise(exercise)}
              isSelected={selectedExercise.some((e) => e.id === exercise.id)}
            />
          ))}
        </ScrollView>
      )}

      {selectedExercise.length > 0 && (
        <View style={styles.floatingButtonContainer}>
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={handleAddExercise}
          >
            <Text style={styles.floatingButtonText}>
              Add {selectedExercise.length} Exercise
              {selectedExercise.length > 1 ? "s" : ""}
            </Text>
          </TouchableOpacity>
          
        </View>
      )}
    </View>
  );
};

export default AddExercise;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    backgroundColor: "#f0f0f0",
    paddingLeft: 32,
    paddingRight: 12,
    paddingVertical: 8,
    borderRadius: 8,
    width: "100%",
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  searchIcon: {
    color: "#AAAAAA",
    position: "absolute",
    zIndex: 1,
    left: 10,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },
  buttonAllEquipment: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 36,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonAllMuscle: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 46,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontFamily: "Inter_500Medium",
    fontSize: 16,
  },
  allExercisesTitle: {
    marginTop: 16,
    color: "#555555",
    fontFamily: "Inter_500Medium",
    fontSize: 16,
  },
  loadingExercises: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    width: "100%",
  },
  floatingButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  floatingButton: {
    backgroundColor: "#48A6A7",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: "100%",
  },
  floatingButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

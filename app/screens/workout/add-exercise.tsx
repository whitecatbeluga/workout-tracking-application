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

const AddExercise = () => {
  const [searchExercise, setSearchExercise] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

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
    return true;
  };
  useEffect(() => {
    if (exercises.length === 0) {
      setLoading(true);
    }
    fetchExercises();
  }, []);
  const handleRefresh = async () => {
    setRefreshing(true);
    const success = await fetchExercises();
    if (success) {
      setRefreshing(false);
    }
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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 16,
        }}
      >
        <TouchableOpacity style={styles.buttonAllEquipment}>
          <Text style={styles.buttonText}>All Equipment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonAllMuscle}>
          <Text style={styles.buttonText}>All Muscles</Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 16 }}>
        <Text
          style={{
            color: "#555555",
            fontFamily: "Inter_500Medium",
            fontSize: 16,
          }}
        >
          All Exercises
        </Text>
      </View>
      {loading ? (
        <View style={styles.loadingExercises}>
          <Text>Loading Exercises...</Text>
        </View>
      ) : (
        <ScrollView
          // style={styles.scrollView}
          // contentContainerStyle={styles.scrollViewContainer}
          showsHorizontalScrollIndicator={false}
          overScrollMode="never"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {exercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </ScrollView>
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
  buttonAllEquipment: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 36,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonAllMuscle: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 46,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: "Inter_500Medium",
    fontSize: 16,
  },
  loadingExercises: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    width: "100%",
  },
});

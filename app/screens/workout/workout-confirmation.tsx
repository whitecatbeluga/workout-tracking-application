import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useEffect, useLayoutEffect, useState } from "react";
import { auth, db } from "../../../utils/firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter, useNavigation } from "expo-router";
import ConfettiCannon from "react-native-confetti-cannon";

const WorkoutConfirmation = () => {
  const [workoutCount, setWorkoutCount] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    const fetchWorkoutCount = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      try {
        setLoading(true);
        const workoutsRef = collection(db, "workouts");
        const q = query(workoutsRef, where("user_id", "==", userId));
        const querySnapshot = await getDocs(q);
        setWorkoutCount(querySnapshot.size);
        setShowConfetti(true);
      } catch (error) {
        console.error("Error fetching workouts: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkoutCount();
  }, []);

  const getOrdinalSuffix = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
        }}
      >
        <ActivityIndicator size="large" color="#48A6A7" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={styles.goodJobText}>Good job!</Text>
        <Text>This is your {getOrdinalSuffix(workoutCount)} workout</Text>
      </View>
      {showConfetti && (
        <ConfettiCannon
          count={100}
          origin={{ x: -10, y: 0 }}
          fadeOut
          explosionSpeed={400}
        />
      )}
      <View style={{ flex: 1, justifyContent: "flex-end" }}></View>
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/workout")}
        style={{
          width: "100%",
          backgroundColor: "#48A6A7",
          padding: 10,
          alignItems: "center",
          borderRadius: 8,
        }}
      >
        <Text
          style={{
            fontFamily: "Inter_500Medium",
            fontSize: 16,
            color: "#FFFFFF",
          }}
        >
          Done
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default WorkoutConfirmation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
    alignItems: "center",
  },
  goodJobText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 20,
  },
});

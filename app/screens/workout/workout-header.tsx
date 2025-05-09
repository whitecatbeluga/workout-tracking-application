import React from "react";
import { BtnTitle, CustomBtn } from "@/components/custom-btn";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, Text } from "react-native";
import { useAppSelector } from "@/hooks/use-app-selector";

const WorkoutHeader = () => {
  const router = useRouter();
  const draftWorkout = useAppSelector((state) => state.workout.draftWorkout);

  const startEmptyWorkout = () => {
    router.push({
      pathname: "/screens/workout/add-workout",
      params: { type: "add-workout" },
    });
  };

  return (
    <>
      <Text style={styles.routineTxt}>Quick Start</Text>

      <CustomBtn onPress={startEmptyWorkout} buttonStyle={{ borderRadius: 6 }}>
        <View style={styles.inlineRow}>
          <Ionicons
            name={draftWorkout ? "play" : "add"}
            size={26}
            color="white"
            style={{ marginRight: 8 }}
          />
          <BtnTitle
            title={draftWorkout ? "Resume Workout" : "Start Empty Workout"}
          />
        </View>
      </CustomBtn>
    </>
  );
};

export default WorkoutHeader;

const styles = StyleSheet.create({
  routineTxt: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
  },
  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});

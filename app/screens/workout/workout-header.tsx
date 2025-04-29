import React from "react";
import { BtnTitle, CustomBtn, Icon } from "@/components/custom-btn";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "lucide-react-native";
import { StyleSheet, Text } from "react-native";

const WorkoutHeader = () => {
  const router = useRouter();

  const startEmptyWorkout = () => {
    router.push("/screens/workout/add-workout");
  };

  return (
    <>
      <Text style={styles.routineTxt}>Quick Start</Text>

      <CustomBtn
        onPress={() => startEmptyWorkout()}
        buttonStyle={{ borderRadius: 6 }}
      >
        <Ionicons name="add" size={26} color="white" />

        <BtnTitle title="Start Empty Workout" />
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
});

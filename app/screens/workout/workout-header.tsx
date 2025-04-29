import React from "react";
import { BtnTitle, CustomBtn, Icon } from "@/components/custom-btn";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const WorkoutHeader = () => {
  const router = useRouter();

  const startEmptyWorkout = () => {
    router.push("/screens/workout/add-workout");
  };

  return (
    <CustomBtn
      onPress={() => startEmptyWorkout()}
      buttonStyle={{ borderRadius: 8 }}
    >
      <Ionicons name="add-circle" size={26} color="white" />

      <BtnTitle title="Start Empty Workout" />
    </CustomBtn>
  );
};

export default WorkoutHeader;

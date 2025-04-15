import React from "react";
import { BtnTitle, CustomBtn, Icon } from "@/components/custom-btn";
import { useRouter } from "expo-router";

const WorkoutHeader = () => {
  const router = useRouter();

  const startEmptyWorkout = () => {
    router.push("/screens/workout/add-workout");
    console.log("Workout Started");
  };

  return (
    <CustomBtn
      onPress={() => startEmptyWorkout()}
      buttonStyle={{ width: "90%", borderRadius: 50 }}
    >
      <Icon name="add" iconLibrary="Ionicons" />
      <BtnTitle title="Start Empty Workout" />
    </CustomBtn>
  );
};

export default WorkoutHeader;

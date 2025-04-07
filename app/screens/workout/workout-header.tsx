import React from "react";
import { BtnTitle, CustomBtn, Icon } from "@/components/custom-btn";

const WorkoutHeader = () => {
  const handlePress = () => {
    console.log("Workout Started");
  };

  return (
    <CustomBtn
      onPress={() => console.log("Button Pressed")}
      buttonStyle={{ width: "90%", borderRadius: 50 }}
    >
      <Icon name="add" iconLibrary="Ionicons" />
      <BtnTitle title="Start Empty Workout" />
    </CustomBtn>
  );
};

export default WorkoutHeader;

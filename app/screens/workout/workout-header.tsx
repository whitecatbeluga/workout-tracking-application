import { View, StyleSheet, SafeAreaView, Button } from "react-native";
import React from "react";
import AddExercise from "@/components/add-exercise-button";

const WorkoutHeader = () => {
  return <AddExercise/>;
};

export default WorkoutHeader;

const styles = StyleSheet.create({
  addExerciseBtn: {
    marginTop: 10,
  },
});
